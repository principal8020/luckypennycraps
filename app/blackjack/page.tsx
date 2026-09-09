import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { BlackjackTable } from "./BlackjackTable";

export const metadata: Metadata = {
  title: "Blackjack | Lucky Penny Gaming",
  description:
    "Practice blackjack with a casino-style table, guided learning, and strategy coaching from Lucky Penny Gaming.",
};

export default function BlackjackPage() {
  return (
    <main className="min-h-screen bg-[#020b08] text-white">
      <SiteHeader active="blackjack" wide compact />

      <section className="mx-auto max-w-[1500px] px-3 py-4 sm:px-5 sm:py-6">
        <BlackjackTable />

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
