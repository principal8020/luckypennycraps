import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { OddsCalculator } from "./OddsCalculator";

export const metadata: Metadata = {
  title: "Craps Maximum Odds Calculator and 3-4-5x Guide",
  description:
    "Calculate maximum Pass Line odds, payouts, and total money at risk under 3-4-5x craps rules, then learn why odds have no house edge.",
  alternates: { canonical: "/craps/max-odds" },
  openGraph: {
    type: "article",
    title: "Craps Maximum Odds Calculator and 3-4-5x Guide",
    description:
      "Choose a point and Pass Line bet to calculate maximum odds, true-odds profit, and total return.",
    url: "/craps/max-odds",
    publishedTime: "2026-09-10",
    modifiedTime: "2026-09-10",
  },
};

const oddsRows = [
  ["4 or 10", "3x", "2:1", "$30", "$60"],
  ["5 or 9", "4x", "3:2", "$40", "$60"],
  ["6 or 8", "5x", "6:5", "$50", "$60"],
];

const properOddsRows = [
  ["4 or 10", "2:1", "Any whole-dollar amount"],
  ["5 or 9", "3:2", "Multiples of $2"],
  ["6 or 8", "6:5", "Multiples of $5"],
];

export default function MaxOddsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Craps Maximum Odds Calculator and 3-4-5x Guide",
    description:
      "A practical guide and calculator for maximum Pass Line odds under 3-4-5x craps rules.",
    datePublished: "2026-09-10",
    dateModified: "2026-09-10",
    mainEntityOfPage: "https://luckypennygaming.com/craps/max-odds",
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
        <header className="border-b border-emerald-900/70 bg-[radial-gradient(circle_at_16%_10%,rgba(245,158,11,.13),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(56,189,248,.1),transparent_28%)]">
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
            <Link href="/guides" className="text-xs font-black text-emerald-300 hover:text-white">
              ← All guides
            </Link>
            <div className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
              Craps • Maximum odds • Interactive calculator
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] sm:text-6xl">
              Maximum craps odds without the math headache
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-emerald-50/70">
              Odds are the rare casino wager that pays at the true mathematical odds. The casino still has electricity, so naturally there are a few details worth understanding before you push the whole stack forward.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-emerald-200/55">
              <span>Published September 10, 2026</span>
              <span>•</span>
              <span>Pass Line • 3-4-5x odds • True-odds payouts</span>
            </div>
          </div>
        </header>

        <div className="border-b border-emerald-900/60 bg-black/15 py-8 sm:py-10">
          <OddsCalculator />
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <section className="rounded-2xl border border-amber-800/60 bg-amber-950/15 p-5 sm:p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                The useful truth
              </div>
              <p className="mt-3 text-base font-bold leading-7 text-amber-50/80">
                The odds portion has a 0% house edge because it pays at true odds. The required wager changes with the point, but maximum 3-4-5x odds always win six times your original Pass Line bet.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">What is an odds bet in craps?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/70">
                Start with a Pass Line bet before the come-out roll. If a point is established, you may place an additional odds wager behind the Pass Line. The flat bet and the odds bet then want the same result: the point must repeat before a 7.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/70">
                The Pass Line bet pays even money. The odds bet pays according to the actual probability of making the point. That is why points 4 and 10 pay more than 6 and 8. Four and 10 are simply harder to repeat before 7.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">How 3-4-5x odds work</h2>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/65">
                The maximum multiple depends on the point. Here is what happens behind a $10 Pass Line bet.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-900/80">
                <table className="w-full min-w-[650px] border-collapse bg-[#04140f] text-left text-sm">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      {['Point', 'Maximum', 'Odds pay', 'Maximum odds bet', 'Odds profit'].map((heading) => (
                        <th key={heading} className="px-4 py-3 font-black uppercase tracking-[0.08em] text-emerald-300">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {oddsRows.map(([point, maximum, payout, bet, win]) => (
                      <tr key={point} className="border-b border-emerald-950 last:border-b-0">
                        <th className="whitespace-nowrap px-4 py-4 text-base font-black text-white">{point}</th>
                        <td className="px-4 py-4 font-black text-amber-200">{maximum}</td>
                        <td className="px-4 py-4 font-black text-emerald-200">{payout}</td>
                        <td className="px-4 py-4 font-bold text-emerald-50/70">{bet}</td>
                        <td className="px-4 py-4 font-black text-emerald-200">{win}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-base font-bold leading-7 text-emerald-100/70">
                That matching $60 profit is the small miracle hiding inside the name. Add the $10 Pass Line win, and making any point produces $70 in total profit when maximum odds are behind it.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-cyan-900/70 bg-cyan-950/10 p-5 sm:p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                Important distinction
              </div>
              <h2 className="mt-2 text-3xl font-black">Zero house edge does not mean zero risk</h2>
              <p className="mt-4 text-base font-medium leading-7 text-cyan-50/70">
                An odds bet can still lose. It has no house edge because the payout fairly matches the probability, not because the point suddenly becomes eager to cooperate. If 7 appears first, both the flat bet and the odds bet lose.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-cyan-50/70">
                The original Pass Line wager still carries a house edge of about 1.41%. Adding odds lowers the casino advantage as a percentage of your total action, but it does not erase the expected loss attached to the flat wager.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">Should you always take maximum odds?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/70">
                Maximum odds are mathematically efficient, but they also increase the amount exposed on a single decision. With $10 on the Pass Line, you may have $40, $50, or $60 total at risk depending on the point.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/70">
                If that amount does not fit the session bankroll, taking fewer odds is reasonable. A smaller wager paid fairly is still paid fairly. The goal is understanding the tradeoff, not earning a commemorative plaque for bravery.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">Keep smaller odds bets proper</h2>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/65">
                Maximum 3-4-5x wagers automatically produce whole-dollar payouts. If you take less than maximum, use these increments to avoid rounding.
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-900/80">
                {properOddsRows.map(([point, payout, increment]) => (
                  <div key={point} className="grid gap-2 border-b border-emerald-900/50 bg-black/20 px-5 py-4 last:border-b-0 sm:grid-cols-[120px_90px_1fr] sm:items-center">
                    <div className="text-base font-black text-white">Point {point}</div>
                    <div className="font-black text-amber-200">Pays {payout}</div>
                    <div className="text-base font-medium text-emerald-50/65">{increment}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-emerald-50/45">
                Individual casinos may apply different maximums and rounding procedures. Check the table sign or ask the dealer before wagering.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-emerald-700/60 bg-emerald-950/20 p-5 sm:p-6">
              <h2 className="text-2xl font-black">One more useful comparison</h2>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/70">
                Place bets and Pass Line odds can both involve the box numbers, but their payouts and house edges are different. Review the proper-bets guide before assuming two chips sitting near the 6 are doing the same job.
              </p>
              <Link href="/craps/proper-bets" className="mt-4 inline-flex text-sm font-black text-amber-300 hover:text-white">
                Read the Proper Craps Bets guide →
              </Link>
            </section>

            <section className="mt-10 rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-300/15 to-emerald-900/20 p-6 text-center sm:p-8">
              <h2 className="text-3xl font-black">Practice the entire Pass Line and odds cycle</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-emerald-50/70">
                The guided lesson walks through the come-out roll, establishes a point, adds odds, and forces a point winner so you can see the payout happen on the table.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/table?lesson=pass-line" className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                  Practice Pass Line and Odds
                </Link>
                <Link href="/how-to-play" className="rounded-xl border border-emerald-600/70 bg-emerald-950/25 px-6 py-3.5 font-black text-emerald-100 hover:border-emerald-400">
                  Review Craps Basics
                </Link>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-emerald-900/80 bg-black/25 p-5 lg:sticky lg:top-5">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400">
              Remember this
            </div>
            <ul className="mt-4 space-y-3 text-base font-bold leading-6 text-emerald-50/65">
              <li>Point 4 or 10: up to 3x</li>
              <li>Point 5 or 9: up to 4x</li>
              <li>Point 6 or 8: up to 5x</li>
              <li>Odds pay at true odds</li>
              <li>Odds still increase money at risk</li>
            </ul>
            <div className="mt-6 border-t border-emerald-900/70 pt-5">
              <p className="text-sm font-medium leading-6 text-emerald-50/45">
                Casino rules and odds limits can vary. Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
