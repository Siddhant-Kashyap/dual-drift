import * as THREE from "three";

export class Camera {
  readonly camera: THREE.PerspectiveCamera;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 200);
    this.camera.position.set(0, 8, 14);
    this.camera.lookAt(0, 0, 0);
  }

  setAspect(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}

