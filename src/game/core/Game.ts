import { Camera } from "./Camera";
import { Loop } from "./Loop";
import { Renderer } from "./Renderer";
import { SceneManager } from "./SceneManager";
import { Car } from "../entities/Car";
import { Environment } from "../world/Environment";
import { Road } from "../world/Road";
import { CollisionSystem } from "../systems/CollisionSystem";
import { DifficultySystem } from "../systems/DifficultySystem";
import { InputSystem } from "../systems/InputSystem";
import { LaneSystem } from "../systems/LaneSystem";
import { SpawnSystem } from "../systems/SpawnSystem";
import { AudioManager } from "../audio/AudioManager";

export enum GameState {
  MENU = "MENU",
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
}

type GameParams = {
  container: HTMLElement;
  onStateChange?: (state: GameState) => void;
  onScoreChange?: (score: number) => void;
};

export class Game {
  private state: GameState = GameState.MENU;
  private score = 0;
  private elapsedSeconds = 0;

  private readonly renderer = new Renderer();
  private readonly sceneManager = new SceneManager();
  private camera: Camera;
  private readonly loop: Loop;

  private readonly road: Road;
  private readonly environment: Environment;

  private readonly leftCar: Car;
  private readonly rightCar: Car;

  private readonly laneSystem = new LaneSystem();
  private readonly difficultySystem = new DifficultySystem();
  private readonly inputSystem: InputSystem;
  private readonly spawnSystem: SpawnSystem;
  private readonly collisionSystem: CollisionSystem;

  private readonly audio = new AudioManager();

  private lastBlueHitAtMsLeft = -Infinity;
  private lastBlueHitAtMsRight = -Infinity;

  constructor(private readonly params: GameParams) {
    const rect = this.params.container.getBoundingClientRect();
    const aspect = rect.height > 0 ? rect.width / rect.height : 1;
    this.camera = new Camera(aspect);

    this.loop = new Loop((dt) => this.update(dt), { maxDeltaSeconds: 1 / 20 });

    this.road = new Road();
    this.environment = new Environment();
    this.sceneManager.scene.add(this.road.group);
    this.sceneManager.scene.add(this.environment.group);

    this.leftCar = new Car("left", 0);
    this.rightCar = new Car("right", 3);

    this.sceneManager.scene.add(this.leftCar.mesh);
    this.sceneManager.scene.add(this.rightCar.mesh);

    this.laneSystem.applyLane(this.leftCar, this.leftCar.laneIndex);
    this.laneSystem.applyLane(this.rightCar, this.rightCar.laneIndex);

    // Cars sit near the camera; world/obstacles move toward them.
    this.leftCar.mesh.position.z = 6;
    this.rightCar.mesh.position.z = 6;
    this.leftCar.mesh.position.x = this.leftCar.targetLaneX;
    this.rightCar.mesh.position.x = this.rightCar.targetLaneX;

    this.inputSystem = new InputSystem({
      leftCar: this.leftCar,
      rightCar: this.rightCar,
      laneSystem: this.laneSystem,
      cooldownMs: 100,
    });

    this.spawnSystem = new SpawnSystem({
      scene: this.sceneManager.scene,
      getSpawnIntervalSeconds: () =>
        this.difficultySystem.getSpawnInterval(this.elapsedSeconds),
      getSpeed: () => this.difficultySystem.getSpeed(this.elapsedSeconds),
    });

    this.collisionSystem = new CollisionSystem({
      onRedHit: () => this.endGame(),
      onBlueHit: (car, obstacle, nowMs) => {
        const otherLast =
          car.id === "left" ? this.lastBlueHitAtMsRight : this.lastBlueHitAtMsLeft;
        const multiplier = nowMs - otherLast <= 500 ? 2 : 1;
        this.setScore(this.score + 10 * multiplier);

        if (car.id === "left") this.lastBlueHitAtMsLeft = nowMs;
        else this.lastBlueHitAtMsRight = nowMs;

        this.audio.playCollect();

        this.spawnSystem.recycleObstacle(obstacle);
      },
    });
  }

  init() {
    this.params.container.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
    this.resize();
    this.setState(GameState.MENU);
    this.setScore(0);

    this.inputSystem.attach();
    this.inputSystem.setEnabled(false);
    this.spawnSystem.setEnabled(false);
  }

  start() {
    this.elapsedSeconds = 0;
    this.setScore(0);
    this.lastBlueHitAtMsLeft = -Infinity;
    this.lastBlueHitAtMsRight = -Infinity;

    this.spawnSystem.reset();

    this.setState(GameState.PLAYING);
    this.inputSystem.setEnabled(true);
    this.spawnSystem.setEnabled(true);
    this.trackEvent("game_start", { event_category: "engagement" });
    this.audio.playMusic();
    this.loop.start();
  }

  restart() {
    this.start();
  }

  endGame() {
    if (this.state === GameState.GAME_OVER) return;
    this.setState(GameState.GAME_OVER);
    this.inputSystem.setEnabled(false);
    this.spawnSystem.setEnabled(false);
    this.trackEvent("game_over", {
      event_category: "engagement",
      value: this.score,
    });
    this.audio.playDeath();
    this.audio.stopMusic();
    this.loop.stop();
  }

  resize() {
    const rect = this.params.container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    this.renderer.setSize(width, height);
    this.camera.setAspect(width / height);
  }

  dispose() {
    this.loop.stop();

    this.inputSystem.detach();
    this.audio.dispose();

    this.renderer.domElement.remove();
    this.renderer.dispose();
  }

  toggleLeftCarLane() {
    if (this.state !== GameState.PLAYING) return;
    const next = this.leftCar.laneIndex === 0 ? 1 : 0;
    this.laneSystem.applyLane(this.leftCar, next);
  }

  toggleRightCarLane() {
    if (this.state !== GameState.PLAYING) return;
    const next = this.rightCar.laneIndex === 2 ? 3 : 2;
    this.laneSystem.applyLane(this.rightCar, next);
  }

  private update(deltaSeconds: number) {
    if (this.state !== GameState.PLAYING) return;

    this.elapsedSeconds += deltaSeconds;

    const speed = this.difficultySystem.getSpeed(this.elapsedSeconds);

    this.road.update(speed);
    this.environment.update(speed);

    this.spawnSystem.update(deltaSeconds);
    this.spawnSystem.updateObstacles();

    this.leftCar.update();
    this.rightCar.update();

    this.collisionSystem.check(
      [this.leftCar, this.rightCar],
      this.spawnSystem.getActiveObstacles(),
      performance.now(),
    );

    this.renderer.render(this.sceneManager.scene, this.camera.camera);
  }

  private setState(next: GameState) {
    this.state = next;
    this.params.onStateChange?.(next);
  }

  private setScore(next: number) {
    this.score = next;
    this.params.onScoreChange?.(next);
  }

  private trackEvent(
    name: string,
    params?: Record<string, string | number | boolean>,
  ) {
    if (typeof window === "undefined") return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
      .gtag;
    if (!gtag) return;
    gtag("event", name, params ?? {});
  }
}

