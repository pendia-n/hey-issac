import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

type Activity = "idle" | "working" | "responding";
export const MODEL_ROLES = [
  { value: "commercial", label: "Office & commercial", room: "Executive strategy office" },
  { value: "painter", label: "Painter & art", room: "Working artist's studio" },
  { value: "musician", label: "Musician & music", room: "Piano rehearsal room" },
  { value: "chef", label: "Chef & food", room: "Working restaurant kitchen" },
  { value: "farmer", label: "Farmer & agriculture", room: "Open ranch and working farm" },
  { value: "tailor", label: "Tailor & clothing", room: "Fashion atelier and fitting room" },
  { value: "gamer", label: "Crypto trader & markets", room: "Digital asset trading floor" },
  { value: "guide", label: "Guide & travel", room: "Outdoor visitor trailhead" },
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
  const outdoors = role === "farmer" || role === "guide";
  scene.background = new THREE.Color(outdoors ? dark ? 0x344a58 : 0x9fc6d2 : wallColor);
  if (!outdoors) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.92 }));
    wall.position.set(0, 2.6, -3.25); scene.add(wall);
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), new THREE.MeshStandardMaterial({ color: dark ? new THREE.Color(floorHex).multiplyScalar(0.42) : floorHex, roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.04, 0); floor.receiveShadow = true; scene.add(floor);
  const addBox = (x: number, y: number, z: number, w: number, h: number, d: number, color: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.76, metalness: 0.04 }));
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh); return mesh;
  };
  const addCylinder = (x: number, y: number, z: number, top: number, bottom: number, height: number, color: number) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, 14), new THREE.MeshStandardMaterial({ color, roughness: 0.82 }));
    mesh.position.set(x, y, z); mesh.castShadow = true; scene.add(mesh); return mesh;
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
  if (role !== "farmer" && role !== "guide") addRoomTrim(role === "commercial" ? 0x8a795f : 0x273f39, role === "commercial" ? 0x4a514d : 0x304b43);
  if (role === "commercial") {
    // Executive strategy room: presentation wall, conference furniture, shelving and task lighting.
    addBox(0, 3.05, -3.0, 3.05, 2.0, 0.12, 0x374440); addBox(0, 3.05, -2.9, 2.78, 1.73, 0.045, 0x263c39);
    addBox(-0.84, 3.15, -2.86, 0.76, 0.72, 0.035, 0x4a8579); addBox(0, 2.83, -2.86, 0.68, 0.68, 0.035, 0xd0a650); addBox(0.84, 3.19, -2.86, 0.76, 0.8, 0.035, 0x597b91);
    for (let i = 0; i < 4; i++) addBox(-0.92 + i * 0.61, 2.34, -2.84, 0.42, 0.055, 0.025, i % 2 ? 0x8bb8a8 : 0xc2d0bd);
    addWallFrame(-3.35, 2.55, 2.2, 2.25, 0x263d38, 0x91bac0);
    for (let i = 0; i < 5; i++) addBox(-4.14 + i * 0.39, 2.55, -2.72, 0.035, 2.12, 0.035, i % 2 ? 0xd6b261 : 0xf0e2bc);
    for (let i = 0; i < 3; i++) addBox(-3.35, 1.8 + i * 0.68, -2.71, 2.12, 0.035, 0.035, 0xe9d5a0);
    addWallFrame(-3.55, 4.05, 1.2, 0.45, 0x4c5049, 0xc9c2af);
    addBox(-3.55, 4.05, -2.73, 0.9, 0.08, 0.045, 0x65766c);
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
    // Meeting chairs and a long shared table reinforce that this is a working office, not a home.
    addBox(-1.75, 0.72, -1.78, 1.25, 0.14, 0.62, 0x7d6850); addBox(-1.75, 0.48, -2.05, 1.08, 0.42, 0.12, 0x454a45);
    addBox(-1.75, 0.72, -0.82, 1.25, 0.14, 0.62, 0x7d6850); addBox(-1.75, 0.48, -0.55, 1.08, 0.42, 0.12, 0x454a45);
    addWallFrame(0, 4.25, 1.22, 0.25, 0x334f49, 0xd8e5d6);
    addBox(0, 4.25, -2.72, 1.02, 0.055, 0.04, 0xc98f36);
  } else if (role === "chef") {
    addBox(0, 1.8, -3.2, 9.5, 3.6, 0.12, 0xd6d8cc);
    for (let col = 0; col < 12; col++) addBox(-4.25 + col * 0.77, 0.46, -3.1, 0.73, 0.82, 0.06, col % 2 ? 0xb8cbc2 : 0xe5e3d6);
    // A stainless range, hood and hanging pans make this read as a working kitchen.
    addBox(-3.25, 1.0, -2.25, 2.35, 1.55, 0.8, 0x687a76);
    addBox(-3.25, 1.68, -2.25, 2.45, 0.18, 0.91, 0x313c3a);
    for (const x of [-3.9, -3.2, -2.5]) for (const z of [-2.5, -2.0]) addCylinder(x, 1.79, z, 0.16, 0.16, 0.05, 0x303735);
    addBox(-3.25, 2.71, -2.55, 2.0, 0.12, 0.48, 0x707f7b);
    addBox(-3.25, 2.41, -2.48, 1.1, 0.48, 0.22, 0x87928b);
    for (let i = 0; i < 4; i++) { addCylinder(-4.05 + i * 0.55, 2.02, -2.8, 0.26, 0.26, 0.08, 0x9baba3); addCylinder(-4.05 + i * 0.55, 1.84, -2.8, 0.025, 0.025, 0.28, 0x59645f); }
    // Refrigerator and prep island are on opposite sides of the clear character lane.
    addBox(3.85, 1.62, -2.55, 1.18, 3.0, 0.72, 0xcbd3ce); addBox(3.85, 2.05, -2.14, 1.04, 0.055, 0.025, 0x77847e); addBox(4.28, 1.68, -2.1, 0.045, 0.48, 0.04, 0x65716d);
    addBox(2.55, 0.94, -1.65, 2.3, 0.18, 0.9, 0x67513e); addBox(1.72, 0.48, -1.68, 0.13, 0.82, 0.7, 0x574634); addBox(3.38, 0.48, -1.68, 0.13, 0.82, 0.7, 0x574634);
    addBox(2.48, 1.12, -1.55, 0.85, 0.055, 0.5, 0xb88a4c); addCylinder(3.12, 1.22, -1.62, 0.18, 0.18, 0.16, 0xa5b5ae);
  } else if (role === "farmer") {
    // This is an open-air ranch: sky, distant hills, pasture, fence and a barn, not a greenhouse.
    scene.background = new THREE.Color(dark ? 0x334b4a : 0x9fc7cb);
    addBox(0, 2.2, -3.35, 13.8, 5.2, 0.05, dark ? 0x496767 : 0xb6d8d5);
    addSphere(-3.4, 1.75, -3.05, 2.9, 0.85, 0.16, dark ? 0x526d57 : 0x7c9d70);
    addSphere(2.6, 1.72, -3.12, 3.2, 0.9, 0.16, dark ? 0x466557 : 0x75956d);
    addBox(0, 0.03, -1.5, 13.5, 0.12, 8.5, dark ? 0x486754 : 0x78966c);
    addBox(-3.45, 1.18, -2.8, 2.25, 1.78, 0.42, 0x9a4f3b);
    const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(1.72, 1.15, 4), new THREE.MeshStandardMaterial({ color: 0x493c35, roughness: 1 })); barnRoof.position.set(-3.45, 2.65, -2.8); barnRoof.rotation.y = Math.PI / 4; scene.add(barnRoof);
    addBox(-3.45, 0.85, -2.55, 0.78, 1.25, 0.08, 0x493a32);
    // Fence rails and crop rows extend laterally, so neither blocks the character.
    for (let x = -1; x <= 4.1; x += 1.25) { addBox(x, 0.62, -2.45, 0.11, 1.05, 0.12, 0x745a3d); addBox(x, 0.39, -2.42, 0.11, 0.1, 0.12, 0x745a3d); }
    addBox(1.55, 0.77, -2.44, 5.45, 0.12, 0.12, 0xc3a675); addBox(1.55, 0.42, -2.44, 5.45, 0.12, 0.12, 0xc3a675);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 7; col++) { const x = 2.1 + col * 0.36; const z = -0.35 - row * 0.48; addCylinder(x, 0.28, z, 0.035, 0.12, 0.46, row % 2 ? 0x568146 : 0x668d48); addSphere(x, 0.5, z, 0.1, 0.18, 0.1, 0x8ba750); }
    // Trough and hay bales provide close, immediately legible farm cues.
    addBox(-4.2, 0.35, -1.35, 1.0, 0.45, 0.55, 0x777f75); addBox(-4.2, 0.59, -1.35, 0.94, 0.05, 0.48, 0x75a4a1);
    for (let i = 0; i < 3; i++) addCylinder(-2.0 + i * 0.42, 0.38, -1.55, 0.26, 0.26, 0.52, 0xc6a352);
  } else if (role === "tailor") {
    addBox(-3.45, 2.5, -2.9, 1.8, 2.45, 0.14, 0x4b3f4d); addBox(-3.45, 2.5, -2.8, 1.56, 2.2, 0.04, 0xd8c9b8);
    const swatches = [0x5d7684, 0x9b5f70, 0xd2ad62, 0x546c5f, 0xa26d4e, 0x8a7da0];
    swatches.forEach((color, index) => { const x = -4.0 + (index % 3) * 0.53; const y = 3.05 - Math.floor(index / 3) * 0.88; addBox(x, y, -2.72, 0.42, 0.68, 0.055, color); });
    // A freestanding garment rail and mannequin communicate retail/fitting work.
    addBox(3.4, 3.42, -2.65, 2.55, 0.1, 0.12, 0x52473f); addBox(2.16, 2.58, -2.65, 0.1, 1.75, 0.12, 0x52473f); addBox(4.64, 2.58, -2.65, 0.1, 1.75, 0.12, 0x52473f);
    for (let i = 0; i < 5; i++) {
      const x = 2.48 + i * 0.46;
      addBox(x, 2.75, -2.63, 0.055, 0.88, 0.04, 0xb9aa95);
      addBox(x, 2.77, -2.59, 0.3, 0.43, 0.075, swatches[i]);
      addBox(x - 0.2, 2.9, -2.59, 0.13, 0.25, 0.075, swatches[i]); addBox(x + 0.2, 2.9, -2.59, 0.13, 0.25, 0.075, swatches[i]);
      addBox(x, 2.43, -2.58, 0.38, 0.3, 0.08, swatches[i]);
      addBox(x, 3.01, -2.59, 0.13, 0.08, 0.06, 0xb9aa95);
    }
    addCylinder(-2.0, 1.65, -2.4, 0.22, 0.17, 0.78, 0xc9a889); addSphere(-2.0, 2.18, -2.4, 0.19, 0.24, 0.18, 0xc9a889); addCylinder(-2.0, 0.85, -2.4, 0.04, 0.04, 0.92, 0x554a41); addBox(-2.0, 0.35, -2.4, 0.72, 0.08, 0.48, 0x554a41);
    // Cutting table with a visible sewing machine and fabric roll.
    addBox(2.85, 0.91, -1.72, 2.5, 0.17, 1.0, 0x745941); addBox(2.0, 0.48, -1.75, 0.14, 0.85, 0.78, 0x55463b); addBox(3.7, 0.48, -1.75, 0.14, 0.85, 0.78, 0x55463b);
    addBox(2.72, 1.1, -1.48, 0.85, 0.32, 0.36, 0xd7c9b6); addBox(2.98, 1.32, -1.48, 0.44, 0.16, 0.34, 0x404a4a); addCylinder(3.02, 1.51, -1.47, 0.09, 0.09, 0.06, 0xc8b48d);
    addCylinder(3.95, 1.12, -1.55, 0.18, 0.18, 0.35, 0xb26c69);
  } else if (role === "painter") {
    // The main read is an easel and canvas, not a gallery wall of abstract rectangles.
    addBox(-3.45, 2.56, -2.65, 1.45, 1.86, 0.08, 0x76543a); addBox(-3.45, 2.56, -2.54, 1.22, 1.62, 0.04, 0xe5d7b7);
    addBox(-3.45, 2.56, -2.49, 1.1, 1.48, 0.025, 0x91b9bd);
    const paintedShape = (points: Array<[number, number]>, color: number) => {
      const shape = new THREE.Shape(); shape.moveTo(points[0][0], points[0][1]);
      for (const [x, y] of points.slice(1)) shape.lineTo(x, y);
      shape.closePath();
      const paint = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshStandardMaterial({ color, roughness: 1, side: THREE.DoubleSide }));
      paint.position.set(-3.45, 2.56, -2.465); scene.add(paint);
    };
    paintedShape([[-0.55, -0.52], [-0.15, 0.08], [0.12, -0.23], [0.38, 0.24], [0.55, -0.52]], 0x527d70);
    paintedShape([[-0.55, -0.55], [-0.25, -0.12], [-0.04, -0.4], [0.27, 0.02], [0.55, -0.28], [0.55, -0.62]], 0x718d65);
    paintedShape([[-0.52, -0.58], [0.52, -0.58], [0.52, -0.72], [-0.52, -0.72]], 0x4e8b89);
    const paintedSun = addSphere(-3.77, 2.99, -2.46, 0.15, 0.15, 0.035, 0xd79c4c);
    paintedSun.castShadow = false;
    addCylinder(-3.45, 1.3, -2.67, 0.055, 0.055, 1.5, 0x76543a); addCylinder(-3.85, 0.78, -2.58, 0.035, 0.035, 1.55, 0x76543a); addCylinder(-3.05, 0.78, -2.58, 0.035, 0.035, 1.55, 0x76543a);
    // A paint-splattered workbench, palette, brush cup and upright brushes.
    addBox(3.35, 0.92, -1.78, 2.65, 0.18, 0.98, 0x76543a); addBox(2.4, 0.48, -1.8, 0.15, 0.86, 0.78, 0x5b4739); addBox(4.25, 0.48, -1.8, 0.15, 0.86, 0.78, 0x5b4739);
    addSphere(2.92, 1.07, -1.38, 0.43, 0.08, 0.27, 0xe3d0a8); for (const [i, color] of [0x397d78, 0xd59a49, 0xb85e51, 0x755c87].entries()) addSphere(2.65 + i * 0.17, 1.17, -1.38, 0.07, 0.045, 0.06, color);
    addCylinder(3.92, 1.21, -1.59, 0.16, 0.18, 0.38, 0xb9a27d);
    for (let i = 0; i < 5; i++) { const brush = addCylinder(3.56 + i * 0.16, 1.47, -1.58, 0.018, 0.018, 0.58 + (i % 2) * 0.18, [0x8c6748, 0xc39a57, 0x535451, 0x9c6f4f, 0xb28b62][i]); brush.rotation.z = (i - 2) * 0.09; }
    for (let i = 0; i < 4; i++) addCylinder(2.8 + i * 0.35, 1.08, -2.05, 0.09, 0.11, 0.27, [0xc95e4d, 0xe2bf4e, 0x428778, 0x4e6e9d][i]);
  } else if (role === "musician") {
    addBox(0, 2.5, -3.2, 9.5, 2.6, 0.12, 0x574b5b);
    for (let i = 0; i < 9; i++) addBox(-4.1 + i * 1.02, 2.55, -3.08, 0.52, 2.2, 0.08, i % 2 ? 0x786878 : 0x64566b);
    // Grand piano in the left corner: body, raised lid, legs and a clearly visible keyboard.
    addBox(-3.05, 1.12, -1.98, 2.38, 0.72, 1.12, 0x171b23); addBox(-3.04, 1.5, -2.02, 2.38, 0.1, 1.08, 0x252630);
    addBox(-3.02, 1.55, -1.6, 2.05, 0.12, 0.58, 0x333440);
    for (const x of [-3.95, -3.05, -2.15]) addBox(x, 0.48, -1.98, 0.11, 0.95, 0.12, 0x181a20);
    addBox(-3.03, 1.2, -1.34, 1.54, 0.22, 0.08, 0xf0e7d5); for (let i = 0; i < 12; i++) addBox(-3.76 + i * 0.13, 1.31, -1.28, 0.055, 0.12, 0.035, 0x1e2027);
    addBox(-3.05, 0.58, -0.93, 1.2, 0.14, 0.55, 0x27242c); addBox(-3.05, 0.3, -0.93, 0.09, 0.5, 0.09, 0x24222a);
    // Music stand, microphone and small mixing desk anchor the opposite side.
    addCylinder(3.65, 1.05, -2.0, 0.04, 0.04, 1.95, 0x353440); addBox(3.65, 1.88, -2.05, 0.82, 0.62, 0.08, 0x262a36); addBox(3.65, 1.9, -1.99, 0.68, 0.44, 0.03, 0xe1d9c5);
    addBox(2.7, 0.88, -1.78, 1.4, 0.16, 0.62, 0x423846); addBox(2.7, 1.16, -1.78, 0.95, 0.12, 0.42, 0x282d38); for (let i = 0; i < 4; i++) addCylinder(2.38 + i * 0.2, 1.25, -1.55, 0.035, 0.035, 0.04, 0xd1b76e);
    addCylinder(4.25, 1.45, -1.9, 0.025, 0.025, 1.3, 0x353440); addSphere(4.25, 2.12, -1.9, 0.09, 0.16, 0.09, 0x252a32); addCylinder(4.25, 0.76, -1.9, 0.2, 0.2, 0.08, 0x353440);
  } else if (role === "gamer") {
    // Finance/trading floor instead of esports: market displays use illustrative lines only, no live-looking numbers.
    addBox(0, 2.52, -3.1, 9.5, 2.3, 0.12, 0x1d2c31);
    const panel = (x: number, y: number, w: number, h: number, bezel: number, screen: number) => { addBox(x, y, -2.82, w + 0.14, h + 0.14, 0.13, bezel); addBox(x, y, -2.72, w, h, 0.04, screen); };
    panel(-3.28, 2.82, 2.2, 1.4, 0x131e21, 0x213d3a); panel(0, 2.82, 2.2, 1.4, 0x131e21, 0x233c4b); panel(3.28, 2.82, 2.2, 1.4, 0x131e21, 0x293c36);
    // Repeated bar-and-line marks suggest candlesticks without inventing values or labels.
    for (let i = 0; i < 7; i++) { const x = -4.0 + i * 0.23; const height = 0.25 + (i % 3) * 0.17; addBox(x, 2.42 + height / 2, -2.67, 0.09, height, 0.025, i % 2 ? 0x55b99a : 0xd36e67); addBox(x, 2.36 + (i % 4) * 0.12, -2.64, 0.16, 0.025, 0.02, 0x83bba9); }
    for (let i = 0; i < 7; i++) { const x = -0.78 + i * 0.23; addBox(x, 2.4 + (i % 4) * 0.13, -2.66, 0.08, 0.32 + (i % 3) * 0.14, 0.025, i % 2 ? 0x55b99a : 0xd36e67); }
    for (let i = 0; i < 7; i++) { const x = 2.5 + i * 0.23; addBox(x, 2.41 + (i % 3) * 0.15, -2.66, 0.08, 0.28 + (i % 4) * 0.1, 0.025, i % 2 ? 0x55b99a : 0xd36e67); }
    addBox(0, 0.91, -1.82, 5.8, 0.18, 1.08, 0x4b4944); addBox(-1.95, 0.48, -1.84, 0.16, 0.84, 0.84, 0x353a38); addBox(1.95, 0.48, -1.84, 0.16, 0.84, 0.84, 0x353a38);
    for (let i = 0; i < 3; i++) { const x = -2.65 + i * 2.65; addBox(x, 1.72, -2.42, 1.12, 0.72, 0.12, 0x172226); addBox(x, 1.72, -2.32, 0.96, 0.55, 0.04, [0x31594e, 0x34546a, 0x3e5b4c][i]); addBox(x, 1.28, -2.42, 0.12, 0.14, 0.3, 0x172226); }
    addBox(0, 1.03, -1.35, 0.58, 0.04, 0.26, 0x879a8d); addBox(0, 1.1, -1.33, 0.43, 0.08, 0.2, 0xc5c4ae);
    for (const x of [-4.15, 4.15]) { addBox(x, 3.85, -2.75, 0.32, 0.12, 0.05, 0xd1ad56); addBox(x, 1.18, -1.8, 0.42, 0.12, 0.26, 0x283936); }
  } else if (role === "guide") {
    // Open-air trailhead with distant landscape, route sign and pack; no interior walls or office furniture.
    scene.background = new THREE.Color(dark ? 0x344a58 : 0x9fc6d2);
    addSphere(-2.8, 1.15, -3.05, 3.2, 1.08, 0.18, dark ? 0x4e675c : 0x779984); addSphere(2.7, 1.28, -3.18, 3.6, 1.3, 0.18, dark ? 0x465f59 : 0x698b78);
    addSphere(-3.8, 3.85, -3.0, 0.52, 0.52, 0.08, dark ? 0xd4b776 : 0xf0d27d);
    addBox(0, 0.03, -1.5, 13.5, 0.12, 8.5, dark ? 0x657c5e : 0x9a9a70);
    // Trail signpost and two arrow boards, offset from the character.
    addCylinder(-3.75, 1.55, -2.05, 0.065, 0.065, 3.0, 0x70553a);
    addBox(-3.28, 2.35, -2.03, 1.25, 0.38, 0.14, 0xd2a65e); addBox(-3.28, 1.88, -2.03, 1.25, 0.38, 0.14, 0x547d73);
    addBox(-3.28, 2.35, -1.94, 0.8, 0.045, 0.035, 0xf3e7ca); addBox(-3.28, 1.88, -1.94, 0.78, 0.045, 0.035, 0xe1e7cf);
    // Trail bollards and a large wayfinding map panel.
    for (let i = 0; i < 5; i++) { const x = 1.9 + i * 0.62; addCylinder(x, 0.36, -1.9, 0.09, 0.1, 0.72, 0x72563e); addSphere(x, 0.76, -1.9, 0.14, 0.12, 0.13, 0xe0b961); }
    addBox(3.8, 2.2, -2.88, 1.35, 2.2, 0.14, 0x584c3c); addBox(3.8, 2.2, -2.76, 1.12, 1.96, 0.04, 0xe5ddc5);
    addBox(3.62, 2.37, -2.72, 0.48, 0.09, 0.03, 0x4d8873); addBox(3.87, 2.06, -2.72, 0.62, 0.08, 0.03, 0xd2a65e); addBox(3.75, 1.76, -2.72, 0.4, 0.08, 0.03, 0x67889a);
    addBox(-4.18, 0.72, -1.38, 0.72, 1.3, 0.45, 0x6c513c); addBox(-4.18, 1.41, -1.38, 0.72, 0.08, 0.45, 0x9a7850);
    addBox(4.4, 0.5, -1.25, 0.76, 0.8, 0.54, 0x586c6b); addBox(4.4, 0.91, -1.25, 0.78, 0.08, 0.56, 0xa9b6a6);
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
