import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 10%, rgba(34,211,238,0.20), transparent 60%), radial-gradient(900px 500px at 85% 15%, rgba(168,85,247,0.18), transparent 60%), radial-gradient(900px 600px at 50% 90%, rgba(59,130,246,0.12), transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] opacity-[0.22]" />
      <div className="pointer-events-none absolute inset-0 mask-[radial-gradient(60%_60%_at_50%_30%,black,transparent)] bg-black/40" />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(34,211,238,0.18)]" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Dual Drift</div>
            <div className="text-xs text-zinc-400">
              Dual-control neon runner
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/game"
            className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Play now
          </Link>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl px-6 pb-16">
        <section className="pt-10 lg:pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
            Fast-paced 3D endless racing • Free browser game
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            A 3D dual-control racing game{" "}
            <span className="bg-linear-to-r from-cyan-300 via-sky-200 to-fuchsia-300 bg-clip-text text-transparent">
              that melts your focus.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Dual Drift is a browser-based 3D endless runner where you steer two
            cars at once through four lanes of hazards. Collect blue orbs to
            build your score and combo, dodge red obstacles or lose instantly.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/game"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Play Dual Drift now
            </Link>
            <span className="text-sm text-zinc-300">
              No download • Keyboard controls • Desktop browser
            </span>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
              How to play
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Survive as long as you can while chasing high scores and combos.
              The game gets faster and more crowded the longer you stay alive.
            </p>
            <ul className="mt-5 space-y-2 text-sm leading-6 text-zinc-200">
              <li>
                <span className="font-semibold text-white">1.</span>{" "}
                <span className="font-semibold text-white">Left car</span> uses{" "}
                <span className="font-semibold text-cyan-300">A</span> and{" "}
                <span className="font-semibold text-cyan-300">D</span> to move
                between the two left lanes.
              </li>
              <li>
                <span className="font-semibold text-white">2.</span>{" "}
                <span className="font-semibold text-white">Right car</span>{" "}
                uses <span className="font-semibold text-cyan-300">J</span> and{" "}
                <span className="font-semibold text-cyan-300">L</span> to move
                between the two right lanes.
              </li>
              <li>
                <span className="font-semibold text-white">3.</span> Hit{" "}
                <span className="font-semibold text-sky-300">blue obstacles</span>{" "}
                to earn points and build your combo.
              </li>
              <li>
                <span className="font-semibold text-white">4.</span> Avoid{" "}
                <span className="font-semibold text-red-400">
                  red obstacles
                </span>{" "}
                completely — one hit ends the run.
              </li>
              <li>
                <span className="font-semibold text-white">5.</span> If both
                cars collect blue within{" "}
                <span className="font-semibold text-zinc-100">500ms</span>, your
                points for that hit are doubled.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
              Why players like it
            </h2>
            <ul className="mt-4 space-y-2 leading-6">
              <li>• Short, intense runs that reward fast reactions.</li>
              <li>• Simple controls, high difficulty ceiling.</li>
              <li>• No menus or grind — jump in and chase a new high score.</li>
            </ul>
            <p className="mt-4 text-xs text-zinc-400">
              Ideal search terms: 3D endless runner, browser racing game, dual
              control game, keyboard racing game.
            </p>
          </div>
        </section>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row">
          <div>© {new Date().getFullYear()} Dual Drift</div>
          <div className="flex items-center gap-3">
            <Link href="/game" className="text-zinc-300 hover:text-white">
              Play
            </Link>
            <span className="text-zinc-700">•</span>
            <span>Built with Three.js + Next.js</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
