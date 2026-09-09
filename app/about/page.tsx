import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <SiteHeader active="about" />
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <div className="rounded-3xl border border-emerald-900/80 bg-black/25 p-6 sm:p-9">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
            About
          </div>
          <h1 className="mt-2 text-4xl font-black">Why Lucky Penny Gaming exists</h1>

          <div className="mt-6 space-y-5 text-base font-medium leading-7 text-emerald-50/70">
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
                className="rounded-xl border border-emerald-900/70 bg-emerald-950/20 p-4"
              >
                <div className="font-black text-amber-300">{title}</div>
                <p className="mt-2 text-sm leading-6 text-emerald-50/60">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-900/50 bg-amber-950/15 p-4 text-sm leading-6 text-amber-100/70">
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
