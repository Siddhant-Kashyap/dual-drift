"use client";

import { useEffect, useRef, useState } from "react";
import { Game, GameState } from "@/src/game/core/Game";

export default function GameView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load high score from localStorage if available.
    try {
      const stored = window.localStorage.getItem("dual-drift:highScore");
      if (stored) {
        const parsed = Number.parseInt(stored, 10);
        if (!Number.isNaN(parsed)) {
          setHighScore(parsed);
        }
      }
    } catch {
      // Ignore storage errors (e.g. private mode).
    }

    const game = new Game({
      container: containerRef.current,
      onStateChange: setGameState,
      onScoreChange: (nextScore: number) => {
        setScore(nextScore);
        setHighScore((prev) => {
          const updated = nextScore > prev ? nextScore : prev;
          if (updated !== prev) {
            try {
              window.localStorage.setItem(
                "dual-drift:highScore",
                String(updated),
              );
            } catch {
              // Ignore storage errors.
            }
          }
          return updated;
        });
      },
    });

    game.init();
    game.resize();
    gameRef.current = game;

    const onResize = () => game.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gameRef.current?.dispose();
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-6">
        <div className="flex w-full max-w-5xl items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              Dual Drift
            </div>
            <div className="mt-1 text-sm text-zinc-300">
              Left car: A/D • Right car: J/L
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="rounded-2xl bg-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Score
              <span className="ml-3 align-middle text-2xl font-bold text-white">
                {score}
              </span>
            </div>
            <div className="rounded-2xl border border-amber-300/70 bg-black/60 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
              High score
              <span className="ml-3 align-middle text-xl font-bold text-amber-300">
                {highScore}
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-center gap-3">
          {gameState === GameState.MENU && (
            <button
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
              onClick={() => gameRef.current?.start()}
            >
              Start
            </button>
          )}

          {gameState === GameState.GAME_OVER && (
            <button
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
              onClick={() => gameRef.current?.restart()}
            >
              Restart
            </button>
          )}

          {gameState !== GameState.PLAYING && (
            <div className="text-center text-xs text-zinc-300">
              Avoid red obstacles. Hit blue obstacles to score.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

