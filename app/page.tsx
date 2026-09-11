import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const games = [
  {
    eyebrow: "PLAY NOW",
    title: "Craps",
    body: "Play on a full casino-style table, practice bets, take odds, control scenarios, and learn strategies step by step.",
    href: "/table",
    cta: "Play Craps",
    live: true,
  },
  {
    eyebrow: "PLAY NOW",
    title: "Blackjack",
    body: "Play complete hands, practice hit, stand, double, and split decisions, and turn on the Strategy Coach whenever you want guidance.",
    href: "/blackjack",
    cta: "Play Blackjack",
    live: true,
  },
  {
    eyebrow: "PLAY NOW",
    title: "Roulette",
    body: "Practice straight-up, split, street, corner, and outside bets on a 38-pocket American wheel with realistic payouts and detailed spin history.",
    href: "/roulette",
    cta: "Play Roulette",
    live: true,
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

const featuredGames = [
  {
    title: "Craps",
    body: "Full betting layout, guided lessons, practice controls, and strategy modes.",
    href: "/table",
  },
  {
    title: "Blackjack",
    body: "Complete hand play, splitting and doubling, plus an optional Strategy Coach.",
    href: "/blackjack",
  },
  {
    title: "Roulette",
    body: "American wheel, inside and outside bets, Learn Mode, and detailed spin history.",
    href: "/roulette",
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
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader active="home" />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-800">Casino games built for practice and learning</div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-[#0d3525] sm:text-6xl">Learn casino games by <span className="text-amber-600">actually playing them.</span></h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-slate-700 sm:text-lg">Lucky Penny Gaming combines playable casino-style simulators with guided lessons, practice controls, strategy coaching, and analytics. Craps, blackjack, and American roulette are ready to play now, with baccarat and more planned next.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/roulette" className="rounded-xl bg-amber-400 px-6 py-3.5 text-base font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300">Play Roulette</Link>
            <Link href="/blackjack" className="rounded-xl bg-amber-400 px-6 py-3.5 text-base font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300">Play Blackjack</Link>
            <Link href="/table" className="rounded-xl bg-amber-400 px-6 py-3.5 text-base font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300">Play Craps</Link>
            <a href="#games" className="rounded-xl border border-emerald-700 bg-white px-6 py-3.5 text-base font-black text-emerald-900 transition hover:bg-emerald-50">Explore Games</a>
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

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {featuredGames.map((game) => (
              <Link
                key={game.title}
                href={game.href}
                className="group flex min-h-[205px] flex-col rounded-2xl border border-amber-300/55 bg-[#061b14]/90 p-4 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-emerald-950/90"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
                  Play now
                </div>
                <div className="mt-2 text-2xl font-black text-white">{game.title}</div>
                <p className="mt-3 text-xs font-medium leading-5 text-emerald-50/65">
                  {game.body}
                </p>
                <div className="mt-auto pt-4 text-xs font-black text-amber-300 group-hover:text-white">
                  Play {game.title} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="games" className="border-y border-[#d8d2c2] bg-[#eee8db]"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><div className="mb-7"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Lucky Penny Games</div><h2 className="mt-2 text-3xl font-black text-[#123b2a]">One brand. More games over time.</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{games.map((game)=><article key={game.title} className={`rounded-2xl border bg-white p-5 shadow-[0_8px_22px_rgba(20,60,43,.05)] ${game.live?"border-amber-400":"border-[#c6d4ca]"}`}><div className={`text-[9px] font-black uppercase tracking-[0.18em] ${game.live?"text-amber-700":"text-emerald-600"}`}>{game.eyebrow}</div><h3 className="mt-2 text-2xl font-black text-[#123b2a]">{game.title}</h3><p className="mt-3 min-h-[96px] text-sm font-medium leading-6 text-slate-600">{game.body}</p>{game.live?<Link href={game.href} className="mt-4 inline-block text-sm font-black text-amber-700 hover:text-amber-900">{game.cta} →</Link>:<span className="mt-4 inline-block text-sm font-black text-emerald-700">{game.cta}</span>}</article>)}</div></div></section>

      <section className="border-b border-[#d8d2c2] bg-[radial-gradient(circle_at_85%_20%,rgba(56,189,248,.12),transparent_30%)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
              New guide • American Roulette
            </div>
            <h2 className="mt-2 text-3xl font-black text-[#123b2a]">
              What does every Roulette bet actually pay?
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Compare inside and outside bets, winning chances, real dollar returns, and what those two green zeros are doing to the house edge.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/roulette/bets-and-payouts" className="rounded-xl bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300">
              Read Bets and Payouts
            </Link>
            <Link href="/guides" className="rounded-xl border border-emerald-700 bg-white px-5 py-3 font-black text-emerald-900 hover:bg-emerald-50">
              All Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="grid gap-8 lg:grid-cols-2 lg:items-center"><div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Built for repetition</div><h2 className="mt-2 text-3xl font-black text-[#123b2a]">More than a game demo.</h2><p className="mt-4 max-w-xl text-sm font-medium leading-6 text-slate-600">Lucky Penny Gaming is designed around the questions new and improving players actually have: Where does this bet go? What does it pay? What should I do next? What happens if this result occurs? Practice those answers interactively instead of memorizing them from a diagram.</p></div><div className="grid gap-2 sm:grid-cols-2">{highlights.map((highlight)=><div key={highlight} className="flex items-center gap-3 rounded-xl border border-[#c6d4ca] bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-[0_6px_18px_rgba(20,60,43,.04)]"><span className="text-amber-600">◆</span>{highlight}</div>)}</div></div></section>

      <section className="border-t border-[#d8d2c2] bg-[#eee8db]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between"><div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Help us build it</div><h2 className="mt-2 text-2xl font-black text-[#123b2a]">Have an idea for Lucky Penny Gaming?</h2><p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">Report a bug, request a game, or tell us what would make the practice experience better.</p></div><Link href="/feedback" className="shrink-0 rounded-xl bg-amber-400 px-5 py-3 font-black text-black">Send Feedback</Link></div></section>

      <footer className="border-t border-emerald-900/70 bg-black/30"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-emerald-100/45 sm:px-8 md:flex-row md:items-center md:justify-between"><div><div className="font-black text-emerald-100/75">Lucky Penny Gaming</div><div className="mt-1">Educational practice experience. Practice credits have no cash value.</div></div><div className="flex flex-wrap gap-4 font-bold"><Link href="/roulette" className="hover:text-white">Play Roulette</Link><Link href="/blackjack" className="hover:text-white">Play Blackjack</Link><Link href="/guides" className="hover:text-white">Guides</Link><Link href="/how-to-play" className="hover:text-white">Learn Craps</Link><Link href="/strategies" className="hover:text-white">Craps Strategies</Link><Link href="/feedback" className="hover:text-white">Feedback</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/about" className="hover:text-white">About</Link></div></div></footer>
    </main>
  );
}
