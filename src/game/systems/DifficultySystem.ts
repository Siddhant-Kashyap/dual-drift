import { GAME_CONFIG } from "../utils/Constants";

export class DifficultySystem {
  getSpeed(elapsedSeconds: number) {
    return Math.min(
      GAME_CONFIG.maxSpeed,
      GAME_CONFIG.baseSpeed + elapsedSeconds * GAME_CONFIG.speedIncrement,
    );
  }

  getSpawnInterval(elapsedSeconds: number) {
    return Math.max(
      GAME_CONFIG.minSpawnRate,
      GAME_CONFIG.baseSpawnRate - elapsedSeconds * GAME_CONFIG.spawnAcceleration,
    );
  }
}

