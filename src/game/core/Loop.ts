export type FrameCallback = (deltaSeconds: number, nowMs: number) => void;

export class Loop {
  private rafId: number | null = null;
  private lastNowMs = 0;
  private running = false;

  constructor(
    private readonly onFrame: FrameCallback,
    private readonly opts?: {
      maxDeltaSeconds?: number;
    },
  ) {}

  start() {
    if (this.running) return;
    this.running = true;
    this.lastNowMs = performance.now();

    const tick = (nowMs: number) => {
      if (!this.running) return;

      const rawDeltaSeconds = (nowMs - this.lastNowMs) / 1000;
      const maxDeltaSeconds = this.opts?.maxDeltaSeconds ?? 1 / 20;
      const deltaSeconds = Math.min(rawDeltaSeconds, maxDeltaSeconds);

      this.lastNowMs = nowMs;
      this.onFrame(deltaSeconds, nowMs);

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

