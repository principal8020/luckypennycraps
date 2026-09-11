import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { BlackjackTable } from "./BlackjackTable";

export const metadata: Metadata = {
  title: "Free Blackjack Practice Table",
  description:
    "Play free blackjack with a six-deck shoe, 3:2 payouts, splitting, doubling, hand history, and an optional basic-strategy coach.",
  alternates: { canonical: "/blackjack" },
  openGraph: {
    title: "Free Blackjack Practice Table",
    description:
      "Practice complete blackjack hands with realistic rules and an optional basic-strategy coach.",
    url: "/blackjack",
  },
};

export default function BlackjackPage() {
  return (
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader active="blackjack" wide compact />

      <section className="mx-auto max-w-[1500px] px-3 py-4 sm:px-5 sm:py-6">
        <BlackjackTable />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#c6d4ca] bg-white px-4 py-3 shadow-[0_8px_22px_rgba(20,60,43,.05)]">
          <div className="text-xs font-medium text-slate-600">
            Practice credits only. No real-money wagering or cash prizes.
          </div>
          <div className="flex gap-2">
            <Link
              href="/blackjack/basic-strategy"
              className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-2 text-xs font-black text-amber-800 hover:bg-amber-100"
            >
              Basic Strategy Guide
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-emerald-700 px-4 py-2 text-xs font-black text-emerald-900 hover:bg-emerald-50"
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
