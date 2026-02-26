import * as THREE from "three";

export class SceneManager {
  readonly scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.Fog(0x000000, 20, 60);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(6, 10, 8);
    dir.castShadow = false;
    this.scene.add(dir);
  }
}

