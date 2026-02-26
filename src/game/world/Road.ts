import * as THREE from "three";

export class Road {
  readonly group = new THREE.Group();

  private readonly segments: THREE.Mesh[] = [];
  private readonly segmentLength = 40;
  private readonly segmentCount = 5;

  constructor() {
    const geometry = new THREE.PlaneGeometry(10, this.segmentLength);
    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 1,
      metalness: 0,
    });

    for (let i = 0; i < this.segmentCount; i++) {
      const seg = new THREE.Mesh(geometry, material);
      seg.rotation.x = -Math.PI / 2;
      seg.position.y = 0;
      seg.position.z = -i * this.segmentLength;
      this.segments.push(seg);
      this.group.add(seg);
    }
  }

  update(speed: number) {
    for (const seg of this.segments) {
      seg.position.z += speed;
      if (seg.position.z > this.segmentLength) {
        seg.position.z -= this.segmentLength * this.segmentCount;
      }
    }
  }
}

