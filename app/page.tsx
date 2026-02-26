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

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-16">
        <section className="grid gap-10 pt-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pt-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
              Endless. Fast. Two cars at once.
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Split your focus.
              <br />
              <span className="bg-linear-to-r from-cyan-300 via-sky-200 to-fuchsia-300 bg-clip-text text-transparent">
                Chase the combo.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              Dual Drift is a 3D endless runner where you control two cars
              simultaneously. Collect blue obstacles to score, avoid red
              obstacles to survive.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/game"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-black hover:bg-zinc-200"
              >
                Start drifting
              </Link>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  Left: <span className="font-semibold text-white">A</span> /{" "}
                  <span className="font-semibold text-white">D</span>
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  Right: <span className="font-semibold text-white">J</span> /{" "}
                  <span className="font-semibold text-white">L</span>
                </span>
              </div>
            </div>

            <div className="mt-6 text-xs text-zinc-400">
              Combo tip: if both cars hit blue within{" "}
              <span className="font-semibold text-zinc-200">500ms</span>, score{" "}
              <span className="font-semibold text-zinc-200">x2</span>.
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[32px] bg-linear-to-r from-cyan-500/10 via-sky-500/10 to-fuchsia-500/10 blur-2xl" />
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_0_60px_rgba(168,85,247,0.10)]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-zinc-300">
                  Gameplay preview
                </div>
                <div className="text-xs text-zinc-400">4 lanes • 2 cars</div>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
                <div className="relative aspect-16/10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.16),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.55))]" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid w-[82%] grid-cols-4 gap-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          // eslint-disable-next-line react/no-array-index-key
                          key={i}
                          className="h-40 rounded-2xl border border-white/10 bg-white/5"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-1/2 flex w-[82%] -translate-x-1/2 items-end justify-between">
                    <div className="h-10 w-14 rounded-xl bg-white shadow-[0_0_30px_rgba(255,255,255,0.18)]" />
                    <div className="h-10 w-14 rounded-xl bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.14)]" />
                  </div>

                  <div className="absolute top-6 left-1/2 flex w-[82%] -translate-x-1/2 items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.45)]" />
                    <div className="h-9 w-9 rounded-xl bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.45)]" />
                    <div className="h-9 w-9 rounded-xl bg-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.45)]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-zinc-400">Blue</div>
                  <div className="mt-1 font-semibold text-white">+10 score</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-zinc-400">Red</div>
                  <div className="mt-1 font-semibold text-white">
                    Instant death
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-zinc-400">Speed</div>
                  <div className="mt-1 font-semibold text-white">
                    Ramps over time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">Dual-control mastery</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">
              Independent lane control for both cars. Winning is rhythm,
              coordination, and keeping calm at higher speeds.
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">Combo window</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">
              Chain blue hits with both cars within 500ms to trigger a x2
              multiplier.
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">Endless difficulty</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">
              Speed increases and spawn rate accelerates as you survive longer.
              How far can you drift?
            </div>
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
