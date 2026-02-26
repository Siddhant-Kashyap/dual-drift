import type { Car } from "../entities/Car";
import type { Obstacle } from "../entities/Obstacle";

type CollisionCallbacks = {
  onRedHit: () => void;
  onBlueHit: (car: Car, obstacle: Obstacle, nowMs: number) => void;
};

export class CollisionSystem {
  // Tuned for our default box meshes.
  private readonly thresholdX = 0.75;
  private readonly thresholdZ = 0.9;

  constructor(private readonly callbacks: CollisionCallbacks) {}

  check(cars: Car[], obstacles: Obstacle[], nowMs: number) {
    for (const obstacle of obstacles) {
      if (!obstacle.active) continue;

      const ox = obstacle.mesh.position.x;
      const oz = obstacle.mesh.position.z;

      for (const car of cars) {
        const cx = car.mesh.position.x;
        const cz = car.mesh.position.z;

        if (
          Math.abs(cx - ox) < this.thresholdX &&
          Math.abs(cz - oz) < this.thresholdZ
        ) {
          if (obstacle.type === "red") {
            this.callbacks.onRedHit();
            return;
          }

          this.callbacks.onBlueHit(car, obstacle, nowMs);
          // Blue obstacles disappear on hit; prevent double-hit in same frame.
          break;
        }
      }
    }
  }
}

