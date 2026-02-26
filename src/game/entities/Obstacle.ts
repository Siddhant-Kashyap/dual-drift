import * as THREE from "three";
import { LANES } from "../utils/Constants";

export type ObstacleType = "blue" | "red";

const SHARED_GEOMETRY = new THREE.BoxGeometry(0.9, 0.9, 0.9);
const BLUE_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  roughness: 0.4,
  metalness: 0.1,
});
const RED_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  roughness: 0.4,
  metalness: 0.1,
});

export class Obstacle {
  private _mesh: THREE.Object3D;
  laneIndex = 0;
  type: ObstacleType = "blue";
  active = false;

  constructor() {
    const mesh = new THREE.Mesh(SHARED_GEOMETRY, BLUE_MATERIAL);
    mesh.position.y = 0.45;
    this._mesh = mesh;
  }

  get mesh() {
    return this._mesh;
  }

  setMesh(mesh: THREE.Object3D) {
    const prev = this._mesh;
    mesh.position.copy(prev.position);
    mesh.rotation.copy(prev.rotation);
    mesh.scale.copy(prev.scale);
    this._mesh = mesh;
    this.applyVisuals();
  }

  spawn(params: { laneIndex: number; type: ObstacleType; z?: number }) {
    this.active = true;
    this.laneIndex = params.laneIndex;
    this.type = params.type;

    this._mesh.position.x = LANES[this.laneIndex] ?? 0;
    this._mesh.position.z = params.z ?? -60;
    this._mesh.position.y = 0.45;

    this.applyVisuals();
  }

  update(speed: number) {
    if (!this.active) return;
    this._mesh.position.z += speed;
  }

  despawn() {
    this.active = false;
    // Park it far away to avoid accidental collisions.
    this._mesh.position.set(0, -1000, 0);
  }

  private applyVisuals() {
    if (this._mesh instanceof THREE.Mesh) {
      const mat = this.type === "red" ? RED_MATERIAL : BLUE_MATERIAL;
      this._mesh.material = mat;
    }
  }
}

