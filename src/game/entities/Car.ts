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

    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: id === "left" ? 0x3b82f6 : 0xf97316,
      roughness: 0.4,
      metalness: 0.2,
    });
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.2,
      metalness: 0.4,
    });
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.8,
      metalness: 0.1,
    });

    // Main body (low-poly rectangle).
    const bodyGeom = new THREE.BoxGeometry(0.9, 0.3, 1.4);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 0.25, 0);
    group.add(body);

    // Cabin / windshield.
    const cabinGeom = new THREE.BoxGeometry(0.6, 0.25, 0.6);
    const cabin = new THREE.Mesh(cabinGeom, cabinMat);
    cabin.position.set(0, 0.5, -0.1);
    group.add(cabin);

    // Simple wheels (cylinders on the sides).
    const wheelGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 10);
    const makeWheel = (x: number, z: number) => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.12, z);
      return wheel;
    };

    const wheelOffsetX = 0.4;
    const wheelOffsetZ = 0.5;
    group.add(makeWheel(-wheelOffsetX, -wheelOffsetZ));
    group.add(makeWheel(wheelOffsetX, -wheelOffsetZ));
    group.add(makeWheel(-wheelOffsetX, wheelOffsetZ));
    group.add(makeWheel(wheelOffsetX, wheelOffsetZ));

    group.position.y = 0;
    this._mesh = group;
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

