import type * as THREE from "three";
import { Obstacle, type ObstacleType } from "../entities/Obstacle";

type SpawnParams = {
  scene: THREE.Scene;
  getSpawnIntervalSeconds: () => number;
  getSpeed: () => number;
};

export class SpawnSystem {
  private enabled = false;

  private elapsedSeconds = 0;
  private spawnTimerSeconds = 0;

  private readonly pool: Obstacle[] = [];
  private readonly active: Obstacle[] = [];

  constructor(private readonly params: SpawnParams) {
    this.warmPool(28);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  reset() {
    this.elapsedSeconds = 0;
    this.spawnTimerSeconds = 0;
    for (const obs of this.active.splice(0, this.active.length)) {
      obs.despawn();
      this.pool.push(obs);
    }
  }

  update(deltaSeconds: number) {
    if (!this.enabled) return;

    this.elapsedSeconds += deltaSeconds;
    this.spawnTimerSeconds += deltaSeconds;

    const spawnInterval = this.params.getSpawnIntervalSeconds();
    while (this.spawnTimerSeconds >= spawnInterval) {
      this.spawnTimerSeconds -= spawnInterval;
      this.spawnOne();
    }
  }

  updateObstacles() {
    const speed = this.params.getSpeed();
    for (const obs of this.active) obs.update(speed);

    for (let i = this.active.length - 1; i >= 0; i--) {
      const obs = this.active[i];
      if (obs.mesh.position.z > 10) {
        this.recycleAt(i);
      }
    }
  }

  getActiveObstacles() {
    return this.active;
  }

  recycleObstacle(obstacle: Obstacle) {
    const idx = this.active.indexOf(obstacle);
    if (idx !== -1) this.recycleAt(idx);
  }

  private recycleAt(index: number) {
    const [obs] = this.active.splice(index, 1);
    obs.despawn();
    this.pool.push(obs);
  }

  private warmPool(count: number) {
    for (let i = 0; i < count; i++) {
      const obs = new Obstacle();
      obs.despawn();
      this.pool.push(obs);
      this.params.scene.add(obs.mesh);
    }
  }

  private spawnOne() {
    const laneIndex = (Math.random() * 4) | 0;
    const type: ObstacleType = Math.random() < 0.3 ? "red" : "blue";

    const obs = this.pool.pop() ?? new Obstacle();
    if (!this.params.scene.children.includes(obs.mesh)) {
      this.params.scene.add(obs.mesh);
    }

    obs.spawn({ laneIndex, type, z: -60 });
    this.active.push(obs);
  }
}

