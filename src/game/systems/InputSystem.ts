import type { Car } from "../entities/Car";
import { LaneSystem } from "./LaneSystem";

type InputParams = {
  leftCar: Car;
  rightCar: Car;
  laneSystem: LaneSystem;
  cooldownMs?: number;
};

export class InputSystem {
  private enabled = false;
  private readonly cooldownMs: number;
  private lastLeftActionAt = 0;
  private lastRightActionAt = 0;

  constructor(private readonly params: InputParams) {
    this.cooldownMs = params.cooldownMs ?? 100;
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  attach() {
    window.addEventListener("keydown", this.onKeyDown, { passive: true });
  }

  detach() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private onKeyDown(e: KeyboardEvent) {
    if (!this.enabled) return;

    const key = e.key.toLowerCase();
    const now = performance.now();

    if (key === "a" || key === "d") {
      if (now - this.lastLeftActionAt < this.cooldownMs) return;
      this.lastLeftActionAt = now;

      const delta = key === "a" ? -1 : 1;
      this.params.laneSystem.applyLane(
        this.params.leftCar,
        this.params.leftCar.laneIndex + delta,
      );
      return;
    }

    if (key === "j" || key === "l") {
      if (now - this.lastRightActionAt < this.cooldownMs) return;
      this.lastRightActionAt = now;

      const delta = key === "j" ? -1 : 1;
      this.params.laneSystem.applyLane(
        this.params.rightCar,
        this.params.rightCar.laneIndex + delta,
      );
    }
  }
}

