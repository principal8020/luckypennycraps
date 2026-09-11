import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Casino Game Guides",
  description:
    "Plain-English craps, blackjack, roulette, and baccarat guides with practical examples, strategy explanations, and free tables where you can practice.",
  alternates: { canonical: "/guides" },
};

const guideGroups = [
  {
    id: "craps",
    game: "Craps",
    eyebrow: "Dice table",
    description:
      "Start with the table flow, then learn clean bet sizing, odds, and common strategies.",
    playHref: "/table",
    guides: [
      {
        title: "How to Play Craps",
        description:
          "Learn the come-out roll, the point cycle, and the core bets without trying to memorize the entire felt at once.",
        href: "/how-to-play",
        label: "Beginner guide",
      },
      {
        title: "Why Proper Craps Bets Matter",
        description:
          "Learn the correct Place bet amounts, why 6 and 8 use multiples of $6, and how clean payouts keep rounding out of your rack.",
        href: "/craps/proper-bets",
        label: "Payout guide",
      },
      {
        title: "Maximum Odds Calculator",
        description:
          "Calculate 3-4-5x Pass Line odds, true-odds payouts, total money at risk, and the return when the point repeats.",
        href: "/craps/max-odds",
        label: "Calculator",
      },
      {
        title: "Craps Strategies Explained",
        description:
          "See how common betting approaches are assembled and practice each sequence on the table.",
        href: "/strategies",
        label: "Strategy guide",
      },
    ],
  },
  {
    id: "blackjack",
    game: "Blackjack",
    eyebrow: "Card table",
    description:
      "Build the decisions that matter most, from first-card fundamentals to basic strategy.",
    playHref: "/blackjack",
    guides: [
      {
        title: "Blackjack Basic Strategy",
        description:
          "A practical chart for hitting, standing, doubling, and splitting, plus the handful of rules actually worth remembering.",
        href: "/blackjack/basic-strategy",
        label: "Strategy chart",
      },
      {
        title: "When to Hit or Stand",
        description:
          "Simple rules for hard hands, soft hands, and the moments when standing still is the brave decision.",
        href: "/blackjack/hit-or-stand",
        label: "Decision guide",
      },
    ],
  },
  {
    id: "roulette",
    game: "Roulette",
    eyebrow: "Wheel game",
    description:
      "Learn where the bets go, what they pay, and why more coverage always comes with a price.",
    playHref: "/roulette",
    guides: [
      {
        title: "How to Play American Roulette",
        description:
          "Learn the 38-pocket wheel, inside and outside bets, payouts, table minimums, and exactly where each chip belongs.",
        href: "/roulette/how-to-play",
        label: "Beginner guide",
      },
      {
        title: "American Roulette Bets and Payouts Explained",
        description:
          "Compare every core payout, winning chance, house edge, and real dollar return before putting a chip on the layout.",
        href: "/roulette/bets-and-payouts",
        label: "Payout guide",
      },
    ],
  },
  {
    id: "baccarat",
    game: "Baccarat",
    eyebrow: "Card table",
    description:
      "Understand automatic dealing, the main wagers, Dragon Bonus, and the scoreboard without the mystique.",
    playHref: "/baccarat",
    guides: [
      {
        title: "How to Play Baccarat",
        description:
          "Learn hand totals, automatic third-card rules, Player and Banker bets, Tie, Dragon Bonus, and what the scoreboard actually means.",
        href: "/baccarat/how-to-play",
        label: "Beginner guide",
      },
      {
        title: "Baccarat Scoreboards Without the Fortune Telling",
        description:
          "Read the session scoreboard and Bead Road, understand streaks, and learn why recorded patterns cannot predict the next hand.",
        href: "/baccarat/scoreboards",
        label: "Scoreboard guide",
      },
    ],
  },
];

const comingNext = [
  {
    game: "Blackjack",
    title: "Soft Blackjack Hands Without the Soft Thinking",
  },
  {
    game: "Baccarat",
    title: "Dragon Bonus Bets Without Breathing Fire",
  },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader active="learn" />

      <section className="border-b border-[#d8d2c2] bg-[radial-gradient(circle_at_18%_8%,rgba(16,116,78,.12),transparent_34%),radial-gradient(circle_at_84%_22%,rgba(217,148,20,.13),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
          <div className="max-w-4xl">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Lucky Penny Guides
            </div>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#0d3525] sm:text-5xl">
              Pick a game. Learn what matters.
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-700 sm:text-lg">
              Practical rules, strategy charts, and occasional reminders that the casino did not build the chandelier with optimism alone.
            </p>

            <nav className="mt-7 flex flex-wrap gap-2" aria-label="Browse guides by game">
              {guideGroups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="rounded-full border border-emerald-700/25 bg-white/75 px-4 py-2 text-sm font-black text-emerald-900 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  {group.game}
                  <span className="ml-2 text-xs text-emerald-700/60">{group.guides.length}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8 sm:py-12">
        {guideGroups.map((group) => (
          <section
            id={group.id}
            key={group.id}
            className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#c6d4ca] bg-white shadow-[0_12px_34px_rgba(20,60,43,.07)]"
          >
            <div className="grid bg-[#dbe4dd] lg:grid-cols-[280px_1fr]">
              <header className="border-b border-[#dbe4dd] bg-[#eef4ef] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                  {group.eyebrow}
                </div>
                <h2 className="mt-2 text-3xl font-black text-[#0d3525]">{group.game}</h2>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {group.description}
                </p>
                <Link
                  href={group.playHref}
                  className="mt-5 inline-flex rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-black text-black shadow-sm transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                >
                  Play {group.game}
                </Link>
              </header>

              <div
                className={`grid gap-px ${
                  group.guides.length > 1 ? "md:grid-cols-2" : ""
                }`}
              >
                {group.guides.map((guide) => (
                  <article key={guide.href} className="flex min-h-56 flex-col bg-white p-5 sm:p-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
                      {guide.label}
                    </div>
                    <h3 className="mt-3 text-xl font-black leading-tight text-[#123b2a] sm:text-2xl">
                      {guide.title}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                      {guide.description}
                    </p>
                    <Link
                      href={guide.href}
                      className="mt-auto pt-5 text-sm font-black text-amber-700 transition hover:text-amber-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                    >
                      Read the guide →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="rounded-3xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-800">
            Coming next
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {comingNext.map((item) => (
              <div key={item.title} className="rounded-2xl border border-sky-200 bg-white px-4 py-4">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                  {item.game}
                </div>
                <div className="mt-1 text-sm font-bold leading-6 text-slate-700">{item.title}</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
