export const SESSION_COOKIE = 'hey_issac_session';
export const SESSION_SECONDS = 60 * 60 * 24 * 28;
const PBKDF2_ITERATIONS = 100_000;

type Claims = { sub: string; username: string; role: string; exp: number; iat: number; purpose?: 'session' | 'password_reset' };
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{7,18}$/;
export const PASSCODE_RULE = /^[a-z0-9]{8}$/;
export const EMAIL_RULE = /^[^\s@]+@(gmail|hotmail)\.com$/i;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const bytesToBase64Url = (bytes: Uint8Array) => {
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};
const base64UrlToBytes = (value: string) => {
	const normalized = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
	const binary = atob(normalized);
	return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};
const textBytes = (value: string) => new TextEncoder().encode(value);
const bytesBuffer = (value: Uint8Array) => value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
export const randomId = () => bytesToBase64Url(crypto.getRandomValues(new Uint8Array(16)));
export const normalizeSecurityAnswer = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
export const validPassword = (password: string) => PASSWORD_RULE.test(password);
export const validPasscode = (passcode: string) => PASSCODE_RULE.test(passcode);
export const validRecoveryEmail = (email: string) => EMAIL_RULE.test(email.trim());

export async function hashPassword(password: string) {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const key = await crypto.subtle.importKey('raw', bytesBuffer(textBytes(password)), 'PBKDF2', false, ['deriveBits']);
	const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: bytesBuffer(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, key, 256);
	return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${bytesToBase64Url(salt)}$${bytesToBase64Url(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, encoded: string) {
	const [scheme, iterationsText, saltText, digestText] = encoded.split('$');
	if (scheme !== 'pbkdf2_sha256' || !iterationsText || !saltText || !digestText) return false;
	const key = await crypto.subtle.importKey('raw', bytesBuffer(textBytes(password)), 'PBKDF2', false, ['deriveBits']);
	const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: bytesBuffer(base64UrlToBytes(saltText)), iterations: Number(iterationsText), hash: 'SHA-256' }, key, 256);
	const actual = new Uint8Array(bits);
	const expected = base64UrlToBytes(digestText);
	if (actual.length !== expected.length) return false;
	let difference = 0;
	for (let index = 0; index < actual.length; index++) difference |= actual[index] ^ expected[index];
	return difference === 0;
}

function base32Encode(bytes: Uint8Array) {
	let bits = 0;
	let value = 0;
	let output = '';
	for (const byte of bytes) {
		value = (value << 8) | byte;
		bits += 8;
		while (bits >= 5) {
			output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}
	if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
	return output;
}

function base32Decode(value: string) {
	const clean = value.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase();
	let bits = 0;
	let buffer = 0;
	const bytes: number[] = [];
	for (const character of clean) {
		const index = BASE32_ALPHABET.indexOf(character);
		if (index < 0) return null;
		buffer = (buffer << 5) | index;
		bits += 5;
		if (bits >= 8) {
			bytes.push((buffer >>> (bits - 8)) & 255);
			bits -= 8;
		}
	}
	return new Uint8Array(bytes);
}

async function totpCode(secret: string, step: number) {
	const secretBytes = base32Decode(secret);
	if (!secretBytes) return null;
	const counter = new ArrayBuffer(8);
	const view = new DataView(counter);
	view.setUint32(4, step);
	const key = await crypto.subtle.importKey('raw', bytesBuffer(secretBytes), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
	const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, counter));
	const offset = signature[signature.length - 1] & 15;
	const binary = ((signature[offset] & 127) << 24) | ((signature[offset + 1] & 255) << 16) | ((signature[offset + 2] & 255) << 8) | (signature[offset + 3] & 255);
	return String(binary % 1_000_000).padStart(6, '0');
}

export function generateTotpSecret() {
	return base32Encode(crypto.getRandomValues(new Uint8Array(20)));
}

export async function verifyTotp(secret: string, code: string) {
	if (!/^\d{6}$/.test(code.trim())) return false;
	const current = Math.floor(Date.now() / 30_000);
	for (const drift of [-1, 0, 1]) if (await totpCode(secret, current + drift) === code.trim()) return true;
	return false;
}

export async function signJwt(claims: Claims, secret: string) {
	const header = bytesToBase64Url(textBytes(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
	const payload = bytesToBase64Url(textBytes(JSON.stringify(claims)));
	const key = await crypto.subtle.importKey('raw', bytesBuffer(textBytes(secret)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const signature = await crypto.subtle.sign('HMAC', key, bytesBuffer(textBytes(`${header}.${payload}`)));
	return `${header}.${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function readSession(request: Request, secret: string): Promise<Claims | null> {
	const value = request.headers.get('Cookie')?.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))?.[1];
	if (!value) return null;
	const [header, payload, signature] = value.split('.');
	if (!header || !payload || !signature) return null;
	const key = await crypto.subtle.importKey('raw', bytesBuffer(textBytes(secret)), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
	if (!(await crypto.subtle.verify('HMAC', key, bytesBuffer(base64UrlToBytes(signature)), bytesBuffer(textBytes(`${header}.${payload}`))))) return null;
	try {
		const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as Claims;
		return claims.exp > Math.floor(Date.now() / 1000) && (!claims.purpose || claims.purpose === 'session') ? claims : null;
	} catch { return null; }
}

export async function readSignedToken(token: string, secret: string, purpose: 'password_reset') {
	const [header, payload, signature] = token.split('.');
	if (!header || !payload || !signature) return null;
	const key = await crypto.subtle.importKey('raw', bytesBuffer(textBytes(secret)), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
	if (!(await crypto.subtle.verify('HMAC', key, bytesBuffer(base64UrlToBytes(signature)), bytesBuffer(textBytes(`${header}.${payload}`))))) return null;
	try {
		const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as Claims;
		return claims.exp > Math.floor(Date.now() / 1000) && claims.purpose === purpose ? claims : null;
	} catch { return null; }
}

export const sessionCookie = (token: string) => `${SESSION_COOKIE}=${token}; Max-Age=${SESSION_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`;
export const expiredCookie = `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
