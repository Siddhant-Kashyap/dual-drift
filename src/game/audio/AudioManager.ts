export class AudioManager {
  private music?: HTMLAudioElement;
  private collect?: HTMLAudioElement;
  private death?: HTMLAudioElement;

  constructor() {
    if (typeof window === "undefined") return;

    this.music = this.safeCreateAudio("/audio/background.mp3", true);
    if (this.music) {
      this.music.volume = 0.2;
    }
    this.collect = this.safeCreateAudio("/audio/collect-blue.mp3");
    this.death = this.safeCreateAudio("/audio/death.mp3");
  }

  playMusic() {
    if (!this.music) return;
    void this.music.play().catch(() => {
      // Ignore autoplay/gesture restrictions; music can be retried after input.
    });
  }

  stopMusic() {
    if (!this.music) return;
    this.music.pause();
    this.music.currentTime = 0;
  }

  playCollect() {
    if (!this.collect) return;
    this.collect.currentTime = 0;
    void this.collect.play().catch(() => {});
  }

  playDeath() {
    if (!this.death) return;
    this.death.currentTime = 0;
    void this.death.play().catch(() => {});
  }

  dispose() {
    this.music = undefined;
    this.collect = undefined;
    this.death = undefined;
  }

  private safeCreateAudio(src: string, loop = false) {
    try {
      const el = new Audio(src);
      el.loop = loop;
      el.preload = "auto";
      return el;
    } catch {
      return undefined;
    }
  }
}

