import assert from "node:assert/strict";
import { pbkdf2Sync, webcrypto } from "node:crypto";
import { test } from "node:test";
import { build } from "../node_modules/.pnpm/node_modules/esbuild/lib/main.js";

const { outputFiles } = await build({
  entryPoints: [new URL("../workers/auth.ts", import.meta.url).pathname],
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
});
const { passwordHash } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString("base64")}`);

test("password hashing respects the production PBKDF2 cap and verifies consistently", async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  const iterations = [];
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      subtle: {
        importKey: webcrypto.subtle.importKey.bind(webcrypto.subtle),
        deriveBits(algorithm, key, length) {
          if (algorithm.iterations > 100_000) throw new DOMException("Production PBKDF2 limit exceeded", "NotSupportedError");
          iterations.push(algorithm.iterations);
          return webcrypto.subtle.deriveBits(algorithm, key, length);
        },
      },
    },
  });
  try {
    const salt = new Uint8Array(16).fill(17);
    const password = "CryptoProbe123";
    const result = await passwordHash(password, salt);
    assert.deepEqual(iterations, [100_000, 100_000, 100_000]);
    let expected = Buffer.from(password);
    for (let pass = 0; pass < 3; pass++) expected = pbkdf2Sync(expected, salt, 100_000, 32, "sha256");
    assert.equal(result, expected.toString("hex"));
    assert.equal(await passwordHash(password, salt), result);
    assert.notEqual(await passwordHash("WrongPassword123", salt), result);
    assert.notEqual(await passwordHash(password, new Uint8Array(16).fill(18)), result);
  } finally {
    Object.defineProperty(globalThis, "crypto", original);
  }
});
