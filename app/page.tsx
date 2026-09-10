import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const games = [
  {
    eyebrow: "LIVE NOW",
    title: "Craps",
    body: "Play on a full casino-style table, practice bets, take odds, control scenarios, and learn strategies step by step.",
    href: "/table",
    cta: "Play Craps",
    live: true,
  },
  {
    eyebrow: "LIVE NOW",
    title: "Blackjack",
    body: "Play complete hands, practice hit, stand, double, and split decisions, and turn on the Strategy Coach whenever you want guidance.",
    href: "/blackjack",
    cta: "Play Blackjack",
    live: true,
  },
  {
    eyebrow: "PLANNED",
    title: "Roulette",
    body: "Learn inside and outside bets, payouts, table coverage, and how each spin resolves.",
    href: "#",
    cta: "Coming Soon",
    live: false,
  },
  {
    eyebrow: "PLANNED",
    title: "Baccarat",
    body: "Practice Player, Banker, and Tie betting while learning drawing rules and table flow.",
    href: "#",
    cta: "Coming Soon",
    live: false,
  },
];

const highlights = [
  "Interactive casino-style simulators",
  "Guided Learn Mode",
  "Practice and scenario controls",
  "Strategy coaching",
  "Session and result analytics",
  "Practice credits only. No real-money wagering",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <SiteHeader active="home" />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-emerald-700/70 bg-emerald-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">Casino games built for practice and learning</div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">Learn casino games by <span className="text-amber-300">actually playing them.</span></h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-emerald-50/70 sm:text-lg">Lucky Penny Gaming combines playable casino-style simulators with guided lessons, practice controls, strategy coaching, and analytics. Craps and blackjack are live now, with roulette, baccarat, and more planned next.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/blackjack" className="rounded-xl bg-amber-400 px-6 py-3.5 text-base font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300">Play Blackjack</Link>
            <Link href="/table" className="rounded-xl bg-amber-400 px-6 py-3.5 text-base font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300">Play Craps</Link>
            <a href="#games" className="rounded-xl border border-emerald-600/70 bg-emerald-950/30 px-6 py-3.5 text-base font-black text-emerald-100 transition hover:border-emerald-400">Explore Games</a>
          </div>
          <p className="mt-4 text-[10px] font-bold text-emerald-700">Practice credits only. No real-money wagering or cash prizes.</p>
        </div>

        <div className="rounded-[32px] border border-amber-300/35 bg-[radial-gradient(circle_at_top,rgba(52,211,153,.16),transparent_42%),#082a20] p-3 shadow-[0_24px_70px_rgba(0,0,0,.45)] sm:p-4">
          <div className="overflow-hidden rounded-2xl border border-emerald-300/20 bg-black/25 px-5 py-4">
            <Image
              src="/lucky-penny-dogs-logo.png"
              width={1374}
              height={1145}
              alt="Lucky and Penny, the Lucky Penny Gaming mascots"
              className="mx-auto h-auto max-h-[160px] w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,.35)]"
              sizes="(max-width: 1024px) 90vw, 440px"
              priority
            />
            <div className="mt-1 text-center text-xs font-black uppercase tracking-[0.16em] text-emerald-200/70">
              Choose your game
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link
              href="/table"
              className="group flex min-h-[190px] flex-col rounded-2xl border border-amber-300/55 bg-[#061b14]/90 p-5 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-emerald-950/90"
            >
              <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400">
                Live table
              </div>
              <div className="mt-2 text-3xl font-black text-white">Craps</div>
              <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
                Full betting layout, guided lessons, practice controls, and strategy modes.
              </p>
              <div className="mt-auto pt-4 text-sm font-black text-amber-300 group-hover:text-white">
                Play Craps →
              </div>
            </Link>

            <Link
              href="/blackjack"
              className="group flex min-h-[190px] flex-col rounded-2xl border border-amber-300/55 bg-[#061b14]/90 p-5 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-emerald-950/90"
            >
              <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400">
                Live table
              </div>
              <div className="mt-2 text-3xl font-black text-white">Blackjack</div>
              <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
                Complete hand play, splitting and doubling, plus an optional Strategy Coach.
              </p>
              <div className="mt-auto pt-4 text-sm font-black text-amber-300 group-hover:text-white">
                Play Blackjack →
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="games" className="border-y border-emerald-900/70 bg-black/20"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><div className="mb-7"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Lucky Penny Games</div><h2 className="mt-2 text-3xl font-black">One brand. More games over time.</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{games.map((game)=><article key={game.title} className={`rounded-2xl border p-5 ${game.live?"border-amber-400/70 bg-amber-950/10":"border-emerald-900/80 bg-emerald-950/20"}`}><div className={`text-[9px] font-black uppercase tracking-[0.18em] ${game.live?"text-amber-300":"text-emerald-500"}`}>{game.eyebrow}</div><h3 className="mt-2 text-2xl font-black">{game.title}</h3><p className="mt-3 min-h-[96px] text-sm font-medium leading-6 text-emerald-50/60">{game.body}</p>{game.live?<Link href={game.href} className="mt-4 inline-block text-sm font-black text-amber-300 hover:text-white">{game.cta} →</Link>:<span className="mt-4 inline-block text-sm font-black text-emerald-700">{game.cta}</span>}</article>)}</div></div></section>

      <section className="border-b border-emerald-900/70 bg-[radial-gradient(circle_at_85%_20%,rgba(56,189,248,.08),transparent_30%)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              New guide • Craps
            </div>
            <h2 className="mt-2 text-3xl font-black">
              Maximum craps odds, calculated without casino-floor arithmetic.
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-emerald-50/65">
              Choose the point and your Pass Line wager to see the 3-4-5x maximum, payout, and total money at risk.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/craps/max-odds" className="rounded-xl bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300">
              Try the Odds Calculator
            </Link>
            <Link href="/guides" className="rounded-xl border border-emerald-700/70 bg-emerald-950/25 px-5 py-3 font-black text-emerald-100 hover:border-emerald-400">
              All Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="grid gap-8 lg:grid-cols-2 lg:items-center"><div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Built for repetition</div><h2 className="mt-2 text-3xl font-black">More than a game demo.</h2><p className="mt-4 max-w-xl text-sm font-medium leading-6 text-emerald-50/65">Lucky Penny Gaming is designed around the questions new and improving players actually have: Where does this bet go? What does it pay? What should I do next? What happens if this result occurs? Practice those answers interactively instead of memorizing them from a diagram.</p></div><div className="grid gap-2 sm:grid-cols-2">{highlights.map((highlight)=><div key={highlight} className="flex items-center gap-3 rounded-xl border border-emerald-900/70 bg-black/20 px-4 py-3 text-sm font-bold text-emerald-100/80"><span className="text-amber-300">◆</span>{highlight}</div>)}</div></div></section>

      <section className="border-t border-emerald-900/70 bg-emerald-950/10"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between"><div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Help us build it</div><h2 className="mt-2 text-2xl font-black">Have an idea for Lucky Penny Gaming?</h2><p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-emerald-50/60">Report a bug, request a game, or tell us what would make the practice experience better.</p></div><Link href="/feedback" className="shrink-0 rounded-xl bg-amber-400 px-5 py-3 font-black text-black">Send Feedback</Link></div></section>

      <footer className="border-t border-emerald-900/70 bg-black/30"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-emerald-100/45 sm:px-8 md:flex-row md:items-center md:justify-between"><div><div className="font-black text-emerald-100/75">Lucky Penny Gaming</div><div className="mt-1">Educational practice experience. Practice credits have no cash value.</div></div><div className="flex flex-wrap gap-4 font-bold"><Link href="/blackjack" className="hover:text-white">Play Blackjack</Link><Link href="/guides" className="hover:text-white">Guides</Link><Link href="/how-to-play" className="hover:text-white">Learn Craps</Link><Link href="/strategies" className="hover:text-white">Craps Strategies</Link><Link href="/feedback" className="hover:text-white">Feedback</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/about" className="hover:text-white">About</Link></div></div></footer>
    </main>
  );
}
