import * as THREE from "three";
import { LANES } from "../utils/Constants";

export type CarId = "left" | "right";

export class Car {
  private _mesh: THREE.Object3D;
  laneIndex: number;
  targetLaneX: number;

  constructor(
    readonly id: CarId,
    initialLaneIndex: number,
  ) {
    this.laneIndex = initialLaneIndex;
    this.targetLaneX = LANES[this.laneIndex] ?? 0;

    const geom = new THREE.BoxGeometry(0.85, 0.5, 1.3);
    const mat = new THREE.MeshStandardMaterial({
      color: id === "left" ? 0xffffff : 0xaaaaaa,
      roughness: 0.6,
      metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = 0.25;
    mesh.castShadow = false;
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
  }

  setLane(index: number) {
    this.laneIndex = index;
    this.targetLaneX = LANES[this.laneIndex] ?? this.targetLaneX;
  }

  update() {
    this._mesh.position.x = THREE.MathUtils.lerp(
      this._mesh.position.x,
      this.targetLaneX,
      0.2,
    );
  }
}

