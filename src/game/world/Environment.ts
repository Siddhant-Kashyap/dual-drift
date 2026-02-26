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
      color: 0x2b313d,
      roughness: 1,
      metalness: 0,
    });

    const windowGeom = new THREE.PlaneGeometry(0.22, 0.50);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f14,
      roughness: 0.6,
      metalness: 0,
      emissive: 0xffd28a,
      emissiveIntensity: 0.35,
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

        // Add a few emissive window quads on the face toward the road.
        const faceX = side === 1 ? -0.5 : 0.5;
        const facePush = side === 1 ? -0.012 : 0.012;
        const windowRotY = side === 1 ? -Math.PI / 2 : Math.PI / 2;

        const rows = Math.max(3, Math.min(10, Math.round(h / 1.4)));
        const cols = Math.max(2, Math.min(4, Math.round(d / 1.1)));
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (rng() < 0.35) continue; // some windows dark
            const win = new THREE.Mesh(windowGeom, windowMat);
            win.rotation.y = windowRotY;

            // Local unit-cube coords; parent scaling turns this into world size.
            const y = -0.45 + ((r + 1) / (rows + 1)) * 0.9;
            const z = -0.42 + ((c + 1) / (cols + 1)) * 0.84;
            win.position.set(faceX + facePush, y, z);
            mesh.add(win);
          }
        }

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
      // Recycle only once the chunk is well behind the camera,
      // and move it far enough forward that it re-enters from deep in the fog.
      const wrapBehindCameraZ = 60; // camera is around z=14, so this is safely behind
      const recycleDistance =
        this.chunkLength * this.chunkCount + this.chunkLength * 2;

      if (chunk.position.z > wrapBehindCameraZ) {
        chunk.position.z -= recycleDistance;
      }
    }
  }
}

