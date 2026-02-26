import * as THREE from "three";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export class Environment {
  readonly group = new THREE.Group();

  private readonly chunks: THREE.Group[] = [];
  private readonly chunkLength = 40;
  private readonly chunkCount = 5;

  constructor() {
    const rng = mulberry32(1337);

    const buildingGeom = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 1,
      metalness: 0,
    });

    const trunkGeom = new THREE.CylinderGeometry(0.15, 0.2, 1.2, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1f });
    const leavesGeom = new THREE.SphereGeometry(0.55, 10, 10);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20 });

    for (let i = 0; i < this.chunkCount; i++) {
      const chunk = new THREE.Group();
      chunk.position.z = -i * this.chunkLength;

      const buildingCount = 10;
      for (let b = 0; b < buildingCount; b++) {
        const mesh = new THREE.Mesh(buildingGeom, buildingMat);
        const side = rng() < 0.5 ? -1 : 1;
        const x = side * (6 + rng() * 8);
        const h = 2 + rng() * 10;
        const w = 1 + rng() * 2.5;
        const d = 1 + rng() * 2.5;
        mesh.scale.set(w, h, d);
        mesh.position.set(x, h / 2, -rng() * this.chunkLength);
        chunk.add(mesh);
      }

      const treeCount = 8;
      for (let t = 0; t < treeCount; t++) {
        const tree = new THREE.Group();
        const side = rng() < 0.5 ? -1 : 1;
        const x = side * (5.5 + rng() * 6);
        const z = -rng() * this.chunkLength;

        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.set(0, 0.6, 0);
        tree.add(trunk);

        const leaves = new THREE.Mesh(leavesGeom, leavesMat);
        leaves.position.set(0, 1.5, 0);
        tree.add(leaves);

        tree.position.set(x, 0, z);
        chunk.add(tree);
      }

      this.chunks.push(chunk);
      this.group.add(chunk);
    }
  }

  update(speed: number) {
    for (const chunk of this.chunks) {
      chunk.position.z += speed;
      if (chunk.position.z > this.chunkLength) {
        chunk.position.z -= this.chunkLength * this.chunkCount;
      }
    }
  }
}

