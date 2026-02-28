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
      this.spawnWave();
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

  private spawnWave() {
    // As time goes on, increase the chance of red obstacles and
    // increase how often we spawn tight clusters in one wave.
    const t = this.elapsedSeconds;

    const baseRedChance = 0.3;
    const extraRed = Math.min(0.25, t * 0.004); // up to +25% red over time
    const redChance = baseRedChance + extraRed;

    const baseClusterChance = 0.25;
    const extraCluster = Math.min(0.45, t * 0.004); // up to +45% cluster chance
    const clusterChance = baseClusterChance + extraCluster;

    // Start with tighter pairs, and occasionally grow to triples as time goes on.
    const maxClusterSize = t < 15 ? 2 : 3;
    const clusterSize =
      Math.random() < clusterChance ? maxClusterSize : 2;
    const usedLanes = new Set<number>();
    const baseZ = -46;
    const zSpacing = 1.0;

    for (let i = 0; i < clusterSize; i++) {
      // Choose a lane that is not already used in this wave.
      let laneIndex = (Math.random() * 4) | 0;
      let guard = 0;
      while (usedLanes.has(laneIndex) && guard++ < 6) {
        laneIndex = (Math.random() * 4) | 0;
      }
      usedLanes.add(laneIndex);

      let type: ObstacleType = Math.random() < redChance ? "red" : "blue";

      // Ensure at least one blue in the early game so players can score.
      if (t < 10 && i === 0 && type === "red") {
        type = "blue";
      }

      const obs = this.pool.pop() ?? new Obstacle();
      if (!this.params.scene.children.includes(obs.mesh)) {
        this.params.scene.add(obs.mesh);
      }

      // Very small z offset within the wave so obstacles are packed
      // closely together and demand fast reactions.
      const z = baseZ - i * zSpacing;
      obs.spawn({ laneIndex, type, z });
      this.active.push(obs);
    }
  }
}

