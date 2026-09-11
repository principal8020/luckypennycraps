import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why Lucky Penny Gaming was created and how its free practice tables help players understand casino games.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader active="about" />
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <div className="rounded-3xl border border-[#c6d4ca] bg-white p-6 shadow-[0_12px_32px_rgba(20,60,43,.07)] sm:p-9">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
            About
          </div>
          <h1 className="mt-2 text-4xl font-black text-[#0d3525]">Why Lucky Penny Gaming exists</h1>

          <div className="mt-6 space-y-5 text-base font-medium leading-7 text-slate-700">
            <p>
              Casino games can be intimidating to learn in a live setting. The
              rules, terminology, table layouts, and betting decisions can move
              quickly, especially for a new player.
            </p>

            <p>
              Lucky Penny Gaming is being built as a practice-first way to learn
              by actually playing. Craps is the first full simulator, with
              blackjack, roulette, baccarat, and other casino games planned over
              time.
            </p>

            <p>
              The goal is not to promise winning systems. Casino games retain a
              house advantage. The goal is to help players understand the rules,
              make informed decisions, and feel comfortable with how each game
              works before they play for real money.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Practice", "Recreate common game situations and decisions."],
              ["Play", "Use interactive simulators with practice credits."],
              ["Learn", "Follow guided lessons and understand what happens next."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-[#c6d4ca] bg-[#f8faf8] p-4"
              >
                <div className="font-black text-amber-700">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950/75">
            Lucky Penny Gaming uses practice credits only. It does not accept
            real-money wagers or award cash prizes.
          </div>

          <Link
            href="/table"
            className="mt-7 inline-block rounded-xl bg-amber-400 px-5 py-3 font-black text-black"
          >
            Play Craps
          </Link>
        </div>
      </div>
    </main>
  );
}
