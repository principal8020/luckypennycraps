import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Blackjack Basic Strategy Chart",
  description:
    "Use this simple blackjack basic strategy chart to learn when to hit, stand, double, or split on a six-deck S17 table.",
  alternates: { canonical: "/blackjack/basic-strategy" },
  openGraph: {
    type: "article",
    title: "Blackjack Basic Strategy Chart",
    description:
      "A practical, plain-English chart for hitting, standing, doubling, and splitting in blackjack.",
    url: "/blackjack/basic-strategy",
    publishedTime: "2026-09-09",
    modifiedTime: "2026-09-10",
  },
};

const dealerCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];

const hardTotals = [
  ["17+", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  ["13–16", "S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
  ["12", "H", "H", "S", "S", "S", "H", "H", "H", "H", "H"],
  ["11", "D", "D", "D", "D", "D", "D", "D", "D", "D", "H"],
  ["10", "D", "D", "D", "D", "D", "D", "D", "D", "H", "H"],
  ["9", "H", "D", "D", "D", "D", "H", "H", "H", "H", "H"],
  ["8 or less", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
];

const softTotals = [
  ["A,8 or more", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  ["A,7", "S", "D", "D", "D", "D", "S", "S", "H", "H", "H"],
  ["A,6", "H", "D", "D", "D", "D", "H", "H", "H", "H", "H"],
  ["A,4–5", "H", "H", "D", "D", "D", "H", "H", "H", "H", "H"],
  ["A,2–3", "H", "H", "H", "D", "D", "H", "H", "H", "H", "H"],
];

const pairs = [
  ["A,A", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
  ["10,10", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  ["9,9", "P", "P", "P", "P", "P", "S", "P", "P", "S", "S"],
  ["8,8", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
  ["7,7", "P", "P", "P", "P", "P", "P", "H", "H", "H", "H"],
  ["6,6", "P", "P", "P", "P", "P", "H", "H", "H", "H", "H"],
  ["5,5", "D", "D", "D", "D", "D", "D", "D", "D", "H", "H"],
  ["4,4", "H", "H", "H", "P", "P", "H", "H", "H", "H", "H"],
  ["2,2 or 3,3", "P", "P", "P", "P", "P", "P", "H", "H", "H", "H"],
];

const actionStyles: Record<string, string> = {
  H: "bg-sky-400/15 text-sky-200",
  S: "bg-emerald-400/15 text-emerald-200",
  D: "bg-amber-300/15 text-amber-200",
  P: "bg-violet-400/15 text-violet-200",
};

function StrategyTable({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: string[][];
}) {
  return (
    <section className="mt-9 scroll-mt-24">
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm font-medium leading-6 text-emerald-50/60">
        {subtitle}
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-emerald-900/80">
        <table className="w-full min-w-[680px] border-collapse bg-[#04140f] text-center text-sm">
          <thead>
            <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
              <th className="sticky left-0 z-10 bg-[#08261c] px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                Your hand
              </th>
              {dealerCards.map((card) => (
                <th key={card} className="px-3 py-3 font-black text-amber-200">
                  {card}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([hand, ...actions]) => (
              <tr key={hand} className="border-b border-emerald-950 last:border-b-0">
                <th className="sticky left-0 z-10 whitespace-nowrap bg-[#061b14] px-4 py-3 text-left font-black text-white">
                  {hand}
                </th>
                {actions.map((action, index) => (
                  <td key={`${hand}-${dealerCards[index]}`} className="p-1.5">
                    <span
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg font-black ${actionStyles[action]}`}
                      aria-label={
                        action === "H"
                          ? "Hit"
                          : action === "S"
                            ? "Stand"
                            : action === "D"
                              ? "Double"
                              : "Split"
                      }
                    >
                      {action}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function BlackjackBasicStrategyPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Blackjack Basic Strategy Chart",
    description:
      "A practical blackjack basic strategy chart for a six-deck game where the dealer stands on soft 17 and doubling after a split is allowed.",
    datePublished: "2026-09-09",
    dateModified: "2026-09-10",
    mainEntityOfPage: "https://luckypennygaming.com/blackjack/basic-strategy",
    author: {
      "@type": "Organization",
      name: "Lucky Penny Gaming",
      url: "https://luckypennygaming.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Lucky Penny Gaming",
      url: "https://luckypennygaming.com",
    },
  };

  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <SiteHeader active="learn" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        <header className="border-b border-emerald-900/70 bg-[radial-gradient(circle_at_16%_8%,rgba(16,185,129,.13),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(245,158,11,.09),transparent_27%)]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
            <Link href="/guides" className="text-xs font-black text-emerald-300 hover:text-white">
              ← All guides
            </Link>
            <div className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              Blackjack • Basic Strategy • 8 minute read
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] sm:text-6xl">
              Blackjack basic strategy: the boring cheat code that isn&apos;t cheating
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-emerald-50/70">
              Your gut is charming. It is also terrible at blackjack. Here is the chart that tells you when to hit, stand, double, or split without requiring a math degree or a tiny green visor.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-emerald-200/55">
              <span>Updated September 9, 2026</span>
              <span>•</span>
              <span>6 decks • Dealer stands on soft 17 • Double after split</span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <section className="rounded-2xl border border-amber-800/60 bg-amber-950/15 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">
                The 30-second version
              </div>
              <p className="mt-3 text-base font-bold leading-7 text-amber-50/80">
                Basic strategy is the mathematically preferred decision for your hand against the dealer&apos;s visible card. It does not predict the next card, summon good luck, or make the gentleman yelling “monkey!” at the table any less confusing.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-2xl font-black">First, identify the hand you actually have</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Hard hand", "No ace counted as 11. A hard 16 is simply 16, wearing no protective equipment."],
                  ["Soft hand", "An ace is currently counted as 11. You can often draw once without busting."],
                  ["Pair", "Your first two cards have the same value and may be eligible to split."],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-xl border border-emerald-900/80 bg-black/25 p-4">
                    <h3 className="font-black text-emerald-200">{title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-emerald-50/60">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-8 flex flex-wrap gap-2 text-xs font-black">
              {[
                ["H", "Hit", actionStyles.H],
                ["S", "Stand", actionStyles.S],
                ["D", "Double", actionStyles.D],
                ["P", "Split", actionStyles.P],
              ].map(([letter, label, color]) => (
                <div key={letter} className={`rounded-lg px-3 py-2 ${color}`}>
                  {letter} = {label}
                </div>
              ))}
            </div>

            <StrategyTable
              title="Hard totals"
              subtitle="Find your total on the left, then match it with the dealer's up-card across the top. The square where they meet is your move. Romance is officially dead."
              rows={hardTotals}
            />

            <StrategyTable
              title="Soft totals"
              subtitle="These hands contain an ace counted as 11. The ace gives you flexibility, not diplomatic immunity."
              rows={softTotals}
            />

            <StrategyTable
              title="Pairs"
              subtitle="Check this chart before treating the cards as a hard or soft total. Yes, you split aces and eights. No, you do not split tens just because two hands sound twice as fun."
              rows={pairs}
            />

            <section className="mt-9 rounded-2xl border border-cyan-900/70 bg-cyan-950/10 p-5 sm:p-6">
              <h2 className="text-2xl font-black">Three footnotes that prevent table-side panic</h2>
              <ol className="mt-4 space-y-3 text-sm font-medium leading-6 text-cyan-50/70">
                <li><strong className="text-white">1. Double:</strong> On hard 9–11 and soft 13–17, hit if doubling is unavailable. On soft 18, stand instead.</li>
                <li><strong className="text-white">2. Split:</strong> If splitting is unavailable, play the cards using their combined hard or soft total.</li>
                <li><strong className="text-white">3. Table rules matter:</strong> This chart matches Lucky Penny Blackjack: six decks, dealer stands on soft 17, double after split, and no surrender.</li>
              </ol>
            </section>

            <section className="mt-9">
              <h2 className="text-2xl font-black">The four decisions worth memorizing first</h2>
              <div className="mt-4 space-y-3">
                {[
                  ["Split aces and eights", "Aces create two chances at a strong starting hand. Two eights turn an unpleasant 16 into two fresh starts."],
                  ["Never split tens", "Twenty is excellent. Do not dismantle excellent because you became ambitious during the walk from the elevator."],
                  ["Stand on 12–16 against a dealer 4–6", "Let the dealer take the bust risk. Sometimes the bold move is sitting very still."],
                  ["Hit 12–16 against a dealer 7–A", "The dealer is showing strength, so waiting politely usually does not improve the situation."],
                ].map(([title, body], index) => (
                  <div key={title} className="flex gap-4 rounded-xl border border-emerald-900/75 bg-black/20 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-black">{index + 1}</span>
                    <div>
                      <h3 className="font-black">{title}</h3>
                      <p className="mt-1 text-sm font-medium leading-6 text-emerald-50/60">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-300/15 to-emerald-900/20 p-6 text-center sm:p-8">
              <h2 className="text-3xl font-black">Now make the decisions yourself</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-emerald-50/70">
                Open the free table, turn on Strategy Coach, and play complete hands. The chart is useful. Using it until the decisions feel obvious is better.
              </p>
              <Link
                href="/blackjack"
                className="mt-6 inline-block rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300"
              >
                Practice Blackjack Free
              </Link>
              <div className="mt-4">
                <Link href="/blackjack/hit-or-stand" className="text-sm font-black text-emerald-200 hover:text-white">
                  Read the Hit or Stand deep dive →
                </Link>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-emerald-900/80 bg-black/25 p-5 lg:sticky lg:top-5">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
              In this guide
            </div>
            <ul className="mt-4 space-y-3 text-sm font-bold text-emerald-50/65">
              <li>Hard totals</li>
              <li>Soft totals</li>
              <li>Pair splitting</li>
              <li>Doubling fallbacks</li>
              <li>Four rules to memorize</li>
            </ul>
            <div className="mt-6 border-t border-emerald-900/70 pt-5">
              <p className="text-xs font-medium leading-5 text-emerald-50/45">
                Basic strategy improves decisions; it does not guarantee a win. Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
