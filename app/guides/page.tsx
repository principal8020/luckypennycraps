import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Casino Game Guides",
  description:
    "Plain-English blackjack and craps guides with practical examples, strategy explanations, and free tables where you can practice.",
  alternates: { canonical: "/guides" },
};

const guides = [
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
    <main className="min-h-screen bg-[#03130e] text-white">
      <SiteHeader active="learn" />

      <section className="border-b border-emerald-900/70 bg-[radial-gradient(circle_at_18%_8%,rgba(16,185,129,.12),transparent_34%),radial-gradient(circle_at_84%_22%,rgba(245,158,11,.09),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="max-w-4xl">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Lucky Penny Guides
            </div>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Casino games, explained like a human is in the room.
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-emerald-50/70 sm:text-lg">
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
              className="flex flex-col rounded-2xl border border-emerald-900/80 bg-black/25 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400">
                  {guide.game}
                </span>
                <span className="rounded-full border border-amber-700/60 bg-amber-950/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-amber-300">
                  {guide.label}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-black">{guide.title}</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
                {guide.description}
              </p>
              <Link
                href={guide.href}
                className="mt-auto pt-6 text-sm font-black text-amber-300 hover:text-white"
              >
                Read the guide →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-cyan-900/70 bg-cyan-950/10 p-5 sm:p-6">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
            Coming next
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {comingNext.map((title) => (
              <div
                key={title}
                className="rounded-xl border border-cyan-900/60 bg-black/20 px-4 py-3 text-sm font-bold text-cyan-50/70"
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
