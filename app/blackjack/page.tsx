import type { Metadata } from "next";
import Link from "next/link";
import { BlackjackTable } from "./BlackjackTable";

export const metadata: Metadata = {
  title: "Blackjack | Lucky Penny Gaming",
  description:
    "Practice blackjack with a casino-style table, guided learning, and strategy coaching from Lucky Penny Gaming.",
};

export default function BlackjackPage() {
  return (
    <main className="min-h-screen bg-[#020b08] text-white">
      <header className="border-b border-emerald-900/80 bg-[#020e0a]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-amber-300/70 bg-amber-300/10 shadow-[inset_0_0_0_3px_rgba(251,191,36,.07)]">
              <span className="font-serif text-[14px] font-black tracking-[-0.08em] text-amber-200">
                LP
              </span>
              <span className="absolute bottom-[4px] text-[5px] font-black uppercase tracking-[0.16em] text-emerald-400">
                gaming
              </span>
            </div>
            <div>
              <div className="text-lg font-black sm:text-xl">Lucky Penny Gaming</div>
              <div className="text-[8px] font-black uppercase tracking-[0.24em] text-emerald-400">
                Blackjack • Practice • Play • Learn
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-sm font-bold text-emerald-100/75 md:flex">
            <Link href="/" className="hover:text-white">
              Games
            </Link>
            <Link href="/table" className="hover:text-white">
              Craps
            </Link>
            <Link href="/feedback" className="hover:text-white">
              Feedback
            </Link>
          </div>

          <div className="rounded-lg border border-amber-300/50 bg-amber-300/10 px-3 py-2 text-right">
            <div className="text-[7px] font-black uppercase tracking-[0.18em] text-amber-200/70">
              Development Preview
            </div>
            <div className="text-xs font-black text-amber-100">Blackjack Engine v1.1</div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-3 py-4 sm:px-5 sm:py-6">
        <BlackjackTable />

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/30 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
              Phase 1 • In progress
            </div>
            <div className="mt-1 text-lg font-black">Core game engine</div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/60">
              Bet, deal, hit, stand, double, split, dealer play, 3:2 blackjack payouts, bankroll, and split-hand results are now playable.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-900/80 bg-emerald-950/20 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Phase 2
            </div>
            <div className="mt-1 text-lg font-black">Learn Mode</div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/60">
              Guided lessons for hand values, dealer rules, hitting, standing, doubling, splitting, blackjack, and busts.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/40 bg-amber-950/10 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
              Phase 3
            </div>
            <div className="mt-1 text-lg font-black">Basic Strategy Coach</div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/60">
              Recommend the mathematically standard play, explain why, track decisions, and turn mistakes into practice scenarios.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-900/70 bg-black/25 px-4 py-3">
          <div className="text-xs font-medium text-emerald-100/55">
            Practice credits only. No real-money wagering or cash prizes.
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg border border-emerald-700/70 px-4 py-2 text-xs font-black text-emerald-100 hover:border-emerald-400"
            >
              Back to Games
            </Link>
            <Link
              href="/table"
              className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-black text-black hover:bg-amber-300"
            >
              Play Craps
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
