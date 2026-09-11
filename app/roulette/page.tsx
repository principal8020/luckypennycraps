import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { RouletteTable } from "./RouletteTable";

export const metadata: Metadata = {
  title: "Free American Roulette Practice Table",
  description:
    "Play free American roulette with a 0 and 00 wheel, straight-up, split, street, corner, and outside bets, realistic payouts, bankroll controls, and detailed spin history.",
  alternates: { canonical: "/roulette" },
  openGraph: {
    title: "Free American Roulette Practice Table",
    description:
      "Practice American roulette on a realistic 38-pocket wheel with straight-up, split, street, corner, and outside bets.",
    url: "/roulette",
  },
};

export default function RoulettePage() {
  return (
    <main className="min-h-screen bg-[#020b08] text-white">
      <SiteHeader active="roulette" wide compact />

      <section className="mx-auto max-w-[1500px] px-3 py-4 pb-28 sm:px-5 sm:py-6 sm:pb-28">
        <RouletteTable />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-900/70 bg-black/25 px-4 py-3">
          <div className="text-xs font-medium text-emerald-100/55">
            Practice credits only. No real-money wagering or cash prizes.
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/roulette/how-to-play" className="rounded-lg border border-amber-700/70 px-4 py-2 text-xs font-black text-amber-200 hover:border-amber-400">How to Play Roulette</Link>
            <Link href="/" className="rounded-lg border border-emerald-700/70 px-4 py-2 text-xs font-black text-emerald-100 hover:border-emerald-400">Back to Games</Link>
            <Link href="/blackjack" className="rounded-lg border border-amber-700/70 px-4 py-2 text-xs font-black text-amber-200 hover:border-amber-400">Play Blackjack</Link>
            <Link href="/table" className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-black text-black hover:bg-amber-300">Play Craps</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
