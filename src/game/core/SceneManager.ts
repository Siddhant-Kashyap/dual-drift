import * as THREE from "three";

export class SceneManager {
  readonly scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();

    // Daylight: sky background + light atmospheric haze.
    const sky = new THREE.Color(0x96c9ff);
    this.scene.background = sky;
    this.scene.fog = new THREE.Fog(sky, 18, 85);

    // Soft skylight fill + warm sunlight key.
    const hemi = new THREE.HemisphereLight(0xcfe8ff, 0xb9d2b1, 0.9);
    hemi.position.set(0, 50, 0);
    this.scene.add(hemi);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff1d6, 1.35);
    sun.position.set(12, 22, 10);
    sun.castShadow = false;
    this.scene.add(sun);
  }
}

