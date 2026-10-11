import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

type Activity = "idle" | "working" | "responding";
export const MODEL_ROLES = [
  { value: "commercial", label: "Office & commercial", room: "Brand strategy studio" },
  { value: "painter", label: "Painter & art", room: "Working art studio" },
  { value: "musician", label: "Musician & music", room: "Recording room" },
  { value: "chef", label: "Chef & food", room: "Professional kitchen" },
  { value: "farmer", label: "Farmer & agriculture", room: "Working greenhouse" },
  { value: "tailor", label: "Tailor & clothing", room: "Fashion workroom" },
  { value: "gamer", label: "Gamer & esports", room: "Broadcast gaming studio" },
  { value: "guide", label: "Guide & travel", room: "Travel planning studio" },
] as const;
const roles = new Set<string>(MODEL_ROLES.map(role => role.value));
function roleName(value: string): string { return roles.has(value) ? value : "commercial"; }
function poseName(activity: Activity): string { return activity === "working" ? "pose1" : activity === "responding" ? "pose2" : "base"; }
function pngName(role: string, pose: string): string { return role === "musician" && pose === "base" ? "musician_base1.png" : role + "_" + pose + ".png"; }

function backdrop(scene: THREE.Scene, role: string, dark: boolean) {
  const palette: Record<string, [number, number]> = {
    chef: [0xa9c5bd, 0x657e75], farmer: [0x8fb29a, 0x486e60], tailor: [0xb9a9a0, 0x625b68],
    painter: [0xc4b99f, 0x6f6752], musician: [0x786e89, 0x393b58], gamer: [0x394d61, 0x222f40],
    guide: [0x7eabb0, 0x385a63], commercial: [0x617f75, 0x344d47],
  };
  const [wallHex, floorHex] = palette[role] || palette.commercial;
  const wallColor = dark ? new THREE.Color(wallHex).multiplyScalar(0.42) : wallHex;
  scene.background = new THREE.Color(wallColor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.92 }));
  wall.position.set(0, 2.6, -3.25); scene.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), new THREE.MeshStandardMaterial({ color: dark ? new THREE.Color(floorHex).multiplyScalar(0.42) : floorHex, roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.04, 0); floor.receiveShadow = true; scene.add(floor);
  const addBox = (x: number, y: number, z: number, w: number, h: number, d: number, color: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.76, metalness: 0.04 }));
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh); return mesh;
  };
  const addCylinder = (x: number, y: number, z: number, top: number, bottom: number, height: number, color: number) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, 14), new THREE.MeshStandardMaterial({ color, roughness: 0.82 }));
    mesh.position.set(x, y, z); mesh.castShadow = true; scene.add(mesh);
  };
  const addSphere = (x: number, y: number, z: number, sx: number, sy: number, sz: number, color: number) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.castShadow = true; scene.add(mesh); return mesh;
  };
  const addRoomTrim = (accent: number, second: number) => {
    addBox(0, 0.08, -3.12, 13.6, 0.16, 0.12, accent);
    addBox(-4.8, 2.55, -3.12, 0.12, 5.1, 0.14, second);
    addBox(4.8, 2.55, -3.12, 0.12, 5.1, 0.14, second);
    addBox(0, 4.9, -3.12, 9.6, 0.1, 0.14, second);
  };
  const addWallFrame = (x: number, y: number, w: number, h: number, frame: number, art: number, back = -2.92) => {
    addBox(x, y, back, w + 0.12, h + 0.12, 0.12, frame);
    addBox(x, y, back + 0.075, w, h, 0.04, art);
  };
  const addBooks = (x: number, y: number, z: number, colors: number[]) => {
    colors.forEach((color, index) => addBox(x + index * 0.17, y + 0.12, z, 0.14, 0.24 + (index % 2) * 0.1, 0.24, color));
  };
  const addPlant = (x: number, z: number) => {
    addCylinder(x, 0.27, z, 0.19, 0.25, 0.5, 0xc37b52);
    for (let i = 0; i < 5; i++) {
      const leaf = addSphere(x + Math.sin(i * 1.3) * 0.13, 0.64 + (i % 2) * 0.1, z + Math.cos(i * 1.3) * 0.13, 0.09, 0.26, 0.075, i % 2 ? 0x588765 : 0x769d68);
      leaf.rotation.z = (i - 2) * 0.27;
    }
  };
  addRoomTrim(role === "commercial" ? 0xd49b43 : 0x273f39, role === "commercial" ? 0x294d47 : 0x304b43);
  if (role === "commercial") {
    // The open center is reserved for every character pose; the work zones live at the edges.
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.035, 8, 64), new THREE.MeshStandardMaterial({ color: 0xe6bc59, roughness: 0.55, metalness: 0.3 }));
    halo.position.set(0, 2.62, -2.88); halo.scale.set(1, 1.22, 1); scene.add(halo);
    addBox(-1.68, 3.85, -2.86, 0.34, 0.1, 0.035, 0x91c7b6);
    addBox(1.65, 3.45, -2.86, 0.42, 0.1, 0.035, 0xe2b850);
    addBox(-1.66, 1.27, -2.86, 0.48, 0.1, 0.035, 0x87adb3);
    addWallFrame(-3.35, 2.55, 2.2, 2.25, 0x263d38, 0x91bac0);
    for (let i = 0; i < 5; i++) addBox(-4.14 + i * 0.39, 2.55, -2.72, 0.035, 2.12, 0.035, i % 2 ? 0xd6b261 : 0xf0e2bc);
    for (let i = 0; i < 3; i++) addBox(-3.35, 1.8 + i * 0.68, -2.71, 2.12, 0.035, 0.035, 0xe9d5a0);
    addWallFrame(-3.55, 4.05, 1.2, 0.45, 0x294d47, 0xf0c34a);
    addBox(-3.55, 4.05, -2.73, 0.9, 0.08, 0.045, 0x27766e);
    addWallFrame(3.42, 2.55, 2.05, 1.55, 0x253b37, 0xd6d3c2);
    addBox(3.42, 2.6, -2.7, 1.83, 0.09, 0.06, 0x3f8177);
    addBox(3.42, 2.12, -2.7, 0.12, 0.72, 0.06, 0xd2a14b);
    addBox(2.92, 2.82, -2.7, 0.68, 0.08, 0.06, 0x427d74);
    addBox(3.92, 2.35, -2.7, 0.62, 0.08, 0.06, 0x547eb0);
    addBox(3.22, 0.92, -1.9, 2.75, 0.16, 0.94, 0x5a493c);
    addBox(2.05, 0.52, -1.94, 0.14, 0.62, 0.76, 0x384640);
    addBox(4.32, 0.52, -1.94, 0.14, 0.62, 0.76, 0x384640);
    addBox(3.2, 1.54, -2.22, 1.12, 0.67, 0.11, 0x263d3b);
    addBox(3.2, 1.54, -2.14, 0.98, 0.52, 0.035, 0x5eabb0);
    addBox(3.2, 1.13, -2.23, 0.12, 0.12, 0.32, 0x263d3b);
    addBooks(2.18, 1.03, -1.92, [0xc97955, 0xe1ba61, 0x5e8991]);
    addCylinder(4.1, 1.38, -1.92, 0.045, 0.045, 0.68, 0xd6b261);
    addCylinder(4.1, 1.74, -1.92, 0.27, 0.08, 0.24, 0xd6b261);
    addBox(-2.95, 0.69, -1.85, 1.28, 0.12, 0.63, 0x435951);
    addBox(-3.4, 0.39, -1.86, 0.12, 0.52, 0.55, 0x34453f);
    addBox(-2.5, 0.39, -1.86, 0.12, 0.52, 0.55, 0x34453f);
    addPlant(-4.15, -0.82);
    addWallFrame(0, 4.25, 1.22, 0.25, 0x334f49, 0xd8e5d6);
    addBox(0, 4.25, -2.72, 1.02, 0.055, 0.04, 0xc98f36);
  } else if (role === "chef") {
    addBox(0, 1.07, -3.1, 9.5, 2.5, 0.12, 0xbfd5cc);
    for (let row = 0; row < 3; row++) for (let col = 0; col < 13; col++) addBox(-4.25 + col * 0.71, 0.36 + row * 0.68, -3.01, 0.68, 0.64, 0.055, (row + col) % 2 ? 0x9fbfb4 : 0xd6e1d9);
    addBox(-3.25, 0.86, -2.0, 2.5, 0.16, 0.92, 0x594b3d); addBox(-3.3, 1.27, -2.12, 2.22, 0.62, 0.12, 0x30433e);
    addBox(-3.3, 1.27, -2.03, 2.03, 0.46, 0.04, 0x397d73);
    addCylinder(-3.92, 1.04, -1.94, 0.27, 0.27, 0.12, 0x56635e); addCylinder(-3.92, 1.13, -1.94, 0.2, 0.2, 0.09, 0xd2a14b);
    addBox(3.15, 0.77, -1.92, 2.72, 0.18, 0.92, 0x62503d); addBox(3.16, 0.4, -1.98, 0.14, 0.7, 0.78, 0x3f5249);
    addBox(4.12, 1.25, -2.04, 0.62, 0.76, 0.12, 0x536c60); addCylinder(3.3, 1.05, -1.9, 0.22, 0.22, 0.14, 0xaaa99d);
    addPlant(4.3, -0.86);
  } else if (role === "farmer") {
    addBox(0, 1.2, -3.2, 9.5, 2.65, 0.1, 0x9ac3b4);
    for (let i = 0; i < 8; i++) addBox(-4.35 + i * 1.24, 2.45, -3.0, 0.055, 2.1, 0.06, 0xd7e3cc);
    addBox(0, 3.48, -3.0, 9.3, 0.06, 0.08, 0xd7e3cc);
    addBox(-3.35, 1.14, -2.28, 2.0, 1.22, 0.28, 0x8a503c);
    const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(1.55, 1.04, 4), new THREE.MeshStandardMaterial({ color: 0x55443c, roughness: 1 })); barnRoof.position.set(-3.35, 2.32, -2.28); barnRoof.rotation.y = Math.PI / 4; scene.add(barnRoof);
    addBox(-3.35, 0.79, -2.08, 0.64, 0.78, 0.06, 0x56483e);
    for (const x of [-4.3, -2.4]) for (let j = 0; j < 3; j++) addSphere(x, 0.35 + j * 0.17, -1.8 - j * 0.12, 0.22, 0.14, 0.18, j % 2 ? 0x6a9d5f : 0x82a952);
    for (let i = 0; i < 5; i++) { addBox(2.35 + i * 0.42, 0.18, -2.0, 0.12, 0.32, 2.1, i % 2 ? 0x496f4f : 0x597d51); addCylinder(2.35 + i * 0.42, 0.47, -2.25, 0.07, 0.19, 0.64, 0x6a9653); }
    addBox(3.15, 1.23, -2.72, 1.82, 1.48, 0.12, 0x547a68); addBox(3.15, 1.23, -2.63, 1.57, 1.23, 0.04, 0x9ac3b4);
    addBox(3.15, 1.23, -2.58, 0.055, 1.23, 0.04, 0xe0e4cc); addBox(3.15, 1.23, -2.58, 1.57, 0.055, 0.04, 0xe0e4cc);
  } else if (role === "tailor") {
    addBox(-2.1, 2.5, -2.8, 1.62, 2.35, 0.15, 0x50455b); addBox(-2.1, 2.5, -2.69, 1.4, 2.12, 0.06, 0xc7b5a8);
    const swatches = [0x5d7684, 0x9b5f70, 0xd2ad62, 0x546c5f, 0xa26d4e, 0x8a7da0];
    swatches.forEach((color, index) => { const x = -2.69 + (index % 3) * 0.43; const y = 3.1 - Math.floor(index / 3) * 0.84; addBox(x, y, -2.59, 0.34, 0.66, 0.06, color); addBox(x, y, -2.54, 0.2, 0.46, 0.025, index % 2 ? 0xc6aa91 : 0xdee1cf); });
    addBox(2.56, 0.83, -1.98, 2.08, 0.15, 0.88, 0x684f42); addBox(1.78, 0.42, -2.0, 0.13, 0.7, 0.7, 0x51483f); addBox(3.34, 0.42, -2.0, 0.13, 0.7, 0.7, 0x51483f);
    addCylinder(2.37, 1.05, -2.0, 0.22, 0.22, 0.13, 0xb5a58f); addBooks(2.75, 1.0, -1.96, [0x9b5f70, 0x597c79, 0xd2ad62]);
    addBox(2.1, 2.53, -2.74, 1.65, 1.72, 0.14, 0x51485b); addBox(2.1, 2.53, -2.64, 1.4, 1.48, 0.05, 0x77687e);
    [0x5d7684, 0x9b5f70, 0xd2ad62, 0x546c5f].forEach((color, index) => addBox(1.65 + index * 0.3, 2.53, -2.57, 0.23, 1.25, 0.035, color));
    addPlant(-4.3, -0.75);
  } else if (role === "painter") {
    addWallFrame(-2.05, 2.9, 1.92, 2.0, 0x634e3c, 0xd9c8a8);
    addBox(-2.35, 3.15, -2.69, 0.6, 0.7, 0.045, 0xe0a35e); addBox(-1.77, 2.88, -2.69, 0.52, 0.42, 0.045, 0x507f7b); addBox(-2.25, 2.45, -2.69, 0.5, 0.4, 0.045, 0x725a84);
    addWallFrame(2.05, 3.0, 1.55, 2.25, 0x604b3e, 0xeadbc4);
    addBox(1.78, 3.3, -2.69, 0.52, 0.96, 0.04, 0x257c7b); addBox(2.35, 2.78, -2.69, 0.42, 0.42, 0.04, 0xdfa24d); addBox(2.18, 3.72, -2.69, 0.36, 0.28, 0.04, 0xb96558);
    addBox(2.08, 0.86, -2.02, 2.05, 0.14, 0.9, 0x634b37); addBox(1.32, 0.43, -2.04, 0.14, 0.74, 0.7, 0x4a4038); addBox(2.85, 0.43, -2.04, 0.14, 0.74, 0.7, 0x4a4038);
    for (let i = 0; i < 4; i++) { addCylinder(1.55 + i * 0.19, 1.13, -1.91, 0.035, 0.045, 0.48 + (i % 2) * 0.12, [0x497f73, 0xd09c47, 0x9d5f52, 0x6485a0][i]); }
    addBox(0, 4.35, -3.0, 3.2, 0.16, 0.12, 0x614c3e);
    addBox(0, 4.24, -2.9, 2.96, 0.07, 0.05, 0xe1b368);
    addPlant(-4.3, -0.8);
  } else if (role === "musician") {
    addBox(0, 2.48, -3.1, 9.5, 2.1, 0.12, 0x514960);
    for (let i = 0; i < 11; i++) addBox(-4.1 + i * 0.82, 2.55, -2.99, 0.48, 2.15, 0.08, i % 2 ? 0x72637c : 0x5f506a);
    addBox(-3.15, 2.55, -2.83, 1.68, 1.65, 0.12, 0x252d3b); addBox(-3.15, 2.55, -2.73, 1.34, 1.3, 0.05, 0x57697c);
    addBox(-3.15, 1.91, -2.68, 1.18, 0.05, 0.04, 0xd5bc7b);
    addBox(3.4, 2.65, -2.82, 1.8, 1.72, 0.13, 0x302c40); addBox(3.4, 2.65, -2.72, 1.53, 1.45, 0.05, 0x88778e);
    addBox(2.72, 0.9, -1.97, 1.95, 0.14, 0.86, 0x322d3c); addBox(2.72, 0.56, -1.99, 0.13, 0.62, 0.65, 0x292936);
    addBox(2.48, 1.17, -1.96, 0.08, 0.32, 0.23, 0xf0e5c8); addBox(2.58, 1.17, -1.96, 0.08, 0.32, 0.23, 0xeee3c7);
    addCylinder(-4.0, 1.48, -1.96, 0.06, 0.06, 1.18, 0xc6a861); addSphere(-4.0, 2.13, -1.96, 0.27, 0.38, 0.1, 0xc6a861); addCylinder(-4.0, 0.78, -1.96, 0.23, 0.23, 0.08, 0x393440);
  } else if (role === "gamer") {
    addBox(0, 2.52, -3.1, 9.5, 2.2, 0.12, 0x202a3d);
    for (let i = 0; i < 8; i++) addBox(-4.0 + i * 1.14, 2.5, -2.96, 0.78, 1.8, 0.045, i % 2 ? 0x273c51 : 0x304353);
    addWallFrame(-3.35, 2.75, 1.92, 1.35, 0x202b39, 0x4e8493);
    addBox(-3.35, 2.75, -2.68, 1.62, 0.08, 0.04, 0x65d0c5);
    addBox(3.35, 2.75, -2.8, 1.9, 1.42, 0.12, 0x222c3d); addBox(3.35, 2.75, -2.7, 1.62, 1.14, 0.05, 0x7455a5);
    addBox(3.35, 0.86, -1.98, 2.88, 0.16, 0.96, 0x302b42); addBox(2.25, 0.48, -1.98, 0.14, 0.68, 0.72, 0x242a3b); addBox(4.45, 0.48, -1.98, 0.14, 0.68, 0.72, 0x242a3b);
    addBox(3.35, 1.53, -2.3, 1.1, 0.68, 0.12, 0x202838); addBox(3.35, 1.53, -2.21, 0.94, 0.53, 0.04, 0x4a97ad); addBox(3.35, 1.12, -2.3, 0.12, 0.13, 0.35, 0x202838);
    addBox(2.35, 0.99, -1.87, 0.35, 0.035, 0.19, 0x6be1d0);
    addBox(-4.05, 3.78, -2.76, 0.48, 0.16, 0.06, 0xe74e89); addBox(4.02, 3.78, -2.76, 0.48, 0.16, 0.06, 0x65d0c5);
  } else if (role === "guide") {
    addBox(0, 1.8, -3.2, 9.5, 3.25, 0.12, 0x94c5c5);
    addBox(-3.4, 2.65, -2.96, 2.02, 1.7, 0.1, 0x3d6870); addBox(-3.4, 2.65, -2.86, 1.76, 1.45, 0.045, 0xd5e0ce);
    addBox(-3.4, 2.65, -2.81, 0.05, 1.44, 0.03, 0x3d6870); addBox(-3.4, 2.65, -2.81, 1.75, 0.05, 0.03, 0x3d6870);
    addBox(-3.82, 2.6, -2.77, 0.47, 0.42, 0.03, 0x4a977f); addBox(-3.03, 2.87, -2.77, 0.6, 0.37, 0.03, 0xe3a84e); addBox(-3.1, 2.15, -2.77, 0.76, 0.4, 0.03, 0x6688a2);
    addBox(3.37, 2.75, -2.95, 1.96, 1.48, 0.1, 0x45696c); addBox(3.37, 2.75, -2.85, 1.72, 1.24, 0.04, 0xe8ddbd);
    addCylinder(3.37, 2.72, -2.77, 0.54, 0.54, 0.12, 0x507f76); addBox(3.37, 2.72, -2.69, 0.07, 1.16, 0.025, 0x507f76); addBox(3.37, 2.72, -2.69, 1.1, 0.055, 0.025, 0x507f76);
    addBox(3.3, 0.76, -1.98, 2.25, 0.16, 0.82, 0x624a3f); addBox(2.42, 0.36, -2.0, 0.14, 0.75, 0.68, 0x493f3a); addBox(4.17, 0.36, -2.0, 0.14, 0.75, 0.68, 0x493f3a);
    addBox(3.32, 1.24, -2.08, 0.8, 0.77, 0.08, 0x54747b); addBox(3.32, 1.24, -2.01, 0.62, 0.59, 0.035, 0xa2c6bc); addPlant(-4.25, -0.84);
  }
}

export function ModelStage({ category, activity, preview = false }: { category: string; activity: Activity; preview?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);
  const role = roleName(category);
  const pose = poseName(activity);
  const poseRef = useRef(pose);
  poseRef.current = pose;
  useEffect(() => setFailed(false), [pose]);
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!host.current) return;
    let disposed = false;
    setFailed(false);
    setLoading(true);
    const mount = host.current;
    const scene = new THREE.Scene();
    const targetY = preview ? 1.4 : 1.15;
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 80);
    camera.position.set(0, preview ? 1.8 : 1.65, preview ? 6.7 : 7.8); camera.lookAt(0, targetY, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.replaceChildren(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xf2fff8, dark ? 0x28322e : 0x7a7a66, 2.25));
    const keyLight = new THREE.DirectionalLight(0xfff2db, 3); keyLight.position.set(-3, 7, 5); keyLight.castShadow = true; scene.add(keyLight);
    const fill = new THREE.DirectionalLight(dark ? 0xa0c8c2 : 0xb4d5cb, 1.25); fill.position.set(4, 3, -2); scene.add(fill);
    backdrop(scene, role, dark);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, targetY, 0); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 4.5; controls.maxDistance = 11; controls.maxPolarAngle = Math.PI * 0.49;
    const loader = new GLTFLoader();
    let activeModel: THREE.Object3D | null = null;
    let previousModel: THREE.Object3D | null = null;
    const disposeModel = (model: THREE.Object3D | null) => {
      if (!model) return;
      model.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => { for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose(); material.dispose(); }); } });
      scene.remove(model);
    };
    const resize = () => { const { width, height } = mount.getBoundingClientRect(); if (!width || !height) return; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
    const observer = new ResizeObserver(resize); observer.observe(mount); resize();
    let loadedPose = "";
    let loadingPose = "";
    let failedPose = "";
    const loadPose = (nextPose: string) => {
      loadingPose = nextPose;
      loader.load("/assets/" + role + "_" + nextPose + ".glb", gltf => {
      if (disposed) return;
      if (poseRef.current !== nextPose) { disposeModel(gltf.scene); loadingPose = ""; return; }
      failedPose = "";
      setFailed(false);
      setLoading(false);
      loadingPose = "";
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const viewportScale = mount.clientWidth < 600 ? 0.82 : 1;
      const scale = (preview ? 3.15 : 2.7) * viewportScale / Math.max(size.y, 0.01);
      model.scale.setScalar(scale);
      model.position.set(-(bounds.min.x + bounds.max.x) * scale / 2, -bounds.min.y * scale, 0.12);
      model.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        object.castShadow = true; object.receiveShadow = true;
        const sources = Array.isArray(object.material) ? object.material : [object.material];
        const materials = sources.map(source => { const material = source.clone(); material.transparent = true; material.opacity = 0; material.needsUpdate = true; return material; });
        object.material = Array.isArray(object.material) ? materials : materials[0];
      });
      if (previousModel) disposeModel(previousModel);
      previousModel = activeModel; activeModel = model; model.userData.fade = 0;
      if (previousModel) previousModel.userData.fadeOut = 0;
      loadedPose = nextPose;
      scene.add(model);
      }, undefined, () => { if (!disposed) { failedPose = nextPose; if (poseRef.current === nextPose) { setFailed(true); setLoading(false); } } loadingPose = ""; });
    };
    loadPose(poseRef.current);
    let frame = 0;
    let last = 0;
    const animate = (time: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(animate); controls.update();
      if (poseRef.current !== loadedPose && !loadingPose && poseRef.current !== failedPose) loadPose(poseRef.current);
      if (activeModel && activeModel.userData.fade < 1) {
        activeModel.userData.fade = Math.min(1, activeModel.userData.fade + Math.max((time - last) / 350, 0.025));
        activeModel.traverse(object => { if (object instanceof THREE.Mesh) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => { material.opacity = activeModel?.userData.fade ?? 1; }); });
      }
      if (previousModel) {
        previousModel.userData.fadeOut = Math.min(1, (previousModel.userData.fadeOut || 0) + Math.max((time - last) / 350, 0.025));
        previousModel.traverse(object => { if (object instanceof THREE.Mesh) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => { material.opacity = 1 - (previousModel?.userData.fadeOut ?? 1); }); });
        if (previousModel.userData.fadeOut >= 1) { disposeModel(previousModel); previousModel = null; }
      }
      last = time; renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); disposeModel(activeModel); disposeModel(previousModel); renderer.dispose(); mount.replaceChildren(); };
  }, [role, dark]);
  const selectedRole = MODEL_ROLES.find(item => item.value === role) || MODEL_ROLES[0];
  const previewPose = pose === "base" ? "Base character" : pose === "pose1" ? "Working pose" : "Response pose";
  return <div className="room-stage">
    <div className="model-canvas" ref={host} aria-label="Interactive 3D character scene" />
    {loading && !failed && <div className="scene-loading" role="status" aria-live="polite"><span>Loading this room…</span></div>}
    {failed && <img className="model-fallback" src={"/assets/" + pngName(role, pose)} alt={role + " character"} />}
    <div className="room-stage-info"><b>{preview ? selectedRole.room + " · " + previewPose : activity === "working" ? "Checking the web" : activity === "responding" ? "A new update is ready" : role === "commercial" ? "Your market room" : "Your " + role + " room"}</b><span>{preview ? "Actual character GLB. No market data is shown." : activity === "working" ? "Your character is looking for useful sources." : activity === "responding" ? "Review the sourced update beside the scene." : "The room changes when its data changes."}</span></div>
  </div>;
}
