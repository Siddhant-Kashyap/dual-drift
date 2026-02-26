import * as THREE from "three";

export class Renderer {
  readonly renderer: THREE.WebGLRenderer;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    this.renderer.setClearColor(0x000000, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  get domElement() {
    return this.renderer.domElement;
  }

  setSize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
  }

  setPixelRatio(pixelRatio: number) {
    this.renderer.setPixelRatio(pixelRatio);
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
  }

  dispose() {
    this.renderer.dispose();
  }
}

