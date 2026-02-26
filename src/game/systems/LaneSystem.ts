import { LANES } from "../utils/Constants";
import type { Car, CarId } from "../entities/Car";

export class LaneSystem {
  clampLaneIndex(id: CarId, desiredLaneIndex: number) {
    if (id === "left") return Math.max(0, Math.min(1, desiredLaneIndex));
    return Math.max(2, Math.min(3, desiredLaneIndex));
  }

  applyLane(car: Car, desiredLaneIndex: number) {
    const clamped = this.clampLaneIndex(car.id, desiredLaneIndex);
    car.laneIndex = clamped;
    car.targetLaneX = LANES[clamped] ?? car.targetLaneX;
    return clamped;
  }
}

