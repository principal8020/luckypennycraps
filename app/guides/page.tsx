import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Casino Game Guides",
  description:
    "Plain-English roulette, blackjack, and craps guides with practical examples, strategy explanations, and free tables where you can practice.",
  alternates: { canonical: "/guides" },
};

const guides = [
  {
    game: "Roulette",
    title: "How to Play American Roulette",
    description:
      "Learn the 38-pocket wheel, inside and outside bets, payouts, table minimums, and exactly where each chip belongs.",
    href: "/roulette/how-to-play",
    label: "New beginner guide",
  },
  {
    game: "Craps",
    title: "Maximum Odds Calculator",
    description:
      "Calculate 3-4-5x Pass Line odds, true-odds payouts, total money at risk, and the return when the point repeats.",
    href: "/craps/max-odds",
    label: "New tool",
  },
  {
    game: "Craps",
    title: "Why Proper Craps Bets Matter",
    description:
      "Learn the correct Place bet amounts, why 6 and 8 use multiples of $6, and how clean payouts keep rounding out of your rack.",
    href: "/craps/proper-bets",
    label: "Payout guide",
  },
  {
    game: "Blackjack",
    title: "When to Hit or Stand",
    description:
      "Simple rules for hard hands, soft hands, and the moments when standing still is the brave decision.",
    href: "/blackjack/hit-or-stand",
    label: "Decision guide",
  },
  {
    game: "Blackjack",
    title: "Blackjack Basic Strategy",
    description:
      "A practical chart for hitting, standing, doubling, and splitting, plus the handful of rules actually worth remembering.",
    href: "/blackjack/basic-strategy",
    label: "Strategy chart",
  },
  {
    game: "Craps",
    title: "How to Play Craps",
    description:
      "Learn the come-out roll, the point cycle, and the core bets without trying to memorize the entire felt at once.",
    href: "/how-to-play",
    label: "Beginner guide",
  },
  {
    game: "Craps",
    title: "Craps Strategies Explained",
    description:
      "See how common betting approaches are assembled and practice each sequence on the live table.",
    href: "/strategies",
    label: "Strategy guide",
  },
];

const comingNext = [
  "Soft Blackjack Hands Without the Soft Thinking",
  "The House Edge, Minus the Casino Brochure",
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader active="learn" />

      <section className="border-b border-[#d8d2c2] bg-[radial-gradient(circle_at_18%_8%,rgba(16,116,78,.12),transparent_34%),radial-gradient(circle_at_84%_22%,rgba(217,148,20,.13),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="max-w-4xl">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Lucky Penny Guides
            </div>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#0d3525] sm:text-5xl">
              Casino games, explained like a human is in the room.
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-slate-700 sm:text-lg">
              Practical rules, strategy charts, and occasional reminders that the casino did not build the chandelier with optimism alone.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.href}
              className="flex flex-col rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.06)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700">
                  {guide.game}
                </span>
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-amber-700">
                  {guide.label}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-black text-[#123b2a]">{guide.title}</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                {guide.description}
              </p>
              <Link
                href={guide.href}
                className="mt-auto pt-6 text-sm font-black text-amber-700 hover:text-amber-900"
              >
                Read the guide →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-800">
            Coming next
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {comingNext.map((title) => (
              <div
                key={title}
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
