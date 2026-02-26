"use client";

import { useEffect, useRef, useState } from "react";
import { Game, GameState } from "@/src/game/core/Game";

export default function GameView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Game({
      container: containerRef.current,
      onStateChange: setGameState,
      onScoreChange: setScore,
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

          <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            Score: {score}
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

