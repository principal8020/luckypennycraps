import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "American Roulette Bets and Payouts Explained",
  description:
    "Compare American roulette bets, payouts, winning chances, house edge, and real dollar examples for straight-up, split, street, corner, dozen, column, red, and black bets.",
  alternates: { canonical: "/roulette/bets-and-payouts" },
  openGraph: {
    type: "article",
    title: "American Roulette Bets and Payouts Explained",
    description:
      "A practical guide to American roulette payouts, probabilities, house edge, and what a winning chip actually returns.",
    url: "/roulette/bets-and-payouts",
    publishedTime: "2026-09-11",
    modifiedTime: "2026-09-11",
  },
};

const payoutRows = [
  {
    bet: "Straight up",
    covers: "1 number",
    payout: "35 to 1",
    chance: "2.63%",
    example: "$1 wins $35",
    edge: "5.26%",
  },
  {
    bet: "Split",
    covers: "2 numbers",
    payout: "17 to 1",
    chance: "5.26%",
    example: "$1 wins $17",
    edge: "5.26%",
  },
  {
    bet: "Street",
    covers: "3 numbers",
    payout: "11 to 1",
    chance: "7.89%",
    example: "$1 wins $11",
    edge: "5.26%",
  },
  {
    bet: "Corner",
    covers: "4 numbers",
    payout: "8 to 1",
    chance: "10.53%",
    example: "$1 wins $8",
    edge: "5.26%",
  },
  {
    bet: "Dozen or column",
    covers: "12 numbers",
    payout: "2 to 1",
    chance: "31.58%",
    example: "$5 wins $10",
    edge: "5.26%",
  },
  {
    bet: "Even money",
    covers: "18 numbers",
    payout: "1 to 1",
    chance: "47.37%",
    example: "$5 wins $5",
    edge: "5.26%",
  },
];

const workedExamples = [
  {
    title: "$1 straight up on 17",
    result: "$36 returned",
    detail: "$35 profit plus your original $1 wager if 17 wins.",
  },
  {
    title: "$1 split on 17 and 20",
    result: "$18 returned",
    detail: "$17 profit plus your original $1 wager if either number wins.",
  },
  {
    title: "$1 corner on 16, 17, 19, and 20",
    result: "$9 returned",
    detail: "$8 profit plus your original $1 wager if any covered number wins.",
  },
  {
    title: "$5 on Red",
    result: "$10 returned",
    detail: "$5 profit plus your original $5 wager if a red number wins.",
  },
];

export default function RouletteBetsAndPayoutsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "American Roulette Bets and Payouts Explained",
    description:
      "A practical guide to American roulette payouts, probabilities, examples, and house edge.",
    datePublished: "2026-09-11",
    dateModified: "2026-09-11",
    mainEntityOfPage:
      "https://luckypennygaming.com/roulette/bets-and-payouts",
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
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader active="learn" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        <header className="border-b border-[#d8d2c2] bg-[radial-gradient(circle_at_16%_10%,rgba(185,28,28,.12),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(217,148,20,.14),transparent_28%)]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
            <Link
              href="/guides"
              className="text-xs font-black text-emerald-800 hover:text-emerald-950"
            >
              ← All guides
            </Link>
            <div className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
              American Roulette • Bets and Payouts • 9 minute read
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] text-[#0d3525] sm:text-6xl">
              American roulette bets and payouts, minus the tiny-print math
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
              Every roulette bet is a trade: cover fewer numbers and receive a larger payout, or cover more numbers and win more often for less profit. The wheel is happy either way. It has excellent job security.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/roulette"
                className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300"
              >
                Practice on the Roulette Table
              </Link>
              <Link
                href="/roulette/how-to-play"
                className="rounded-xl border border-emerald-700 bg-white px-6 py-3.5 font-black text-emerald-900 hover:bg-emerald-50"
              >
                Review the Beginner Guide
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-emerald-900/60">
              <span>Published September 11, 2026</span>
              <span>•</span>
              <span>38 pockets • American wheel • Practice credits only</span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <section className="rounded-2xl border border-amber-300 bg-[#fff8df] p-5 shadow-[0_12px_30px_rgba(21,62,43,.06)] sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                The 30-second version
              </div>
              <p className="mt-3 text-base font-bold leading-7 text-amber-950/80">
                A payout such as 35 to 1 means $35 in profit for every $1 wagered, plus the return of your original winning chip. Most standard bets on an American roulette wheel have the same 5.26% house edge. The main difference is how often they win and how dramatic the payout feels.
              </p>
            </section>

            <section className="mt-9">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                First, one useful distinction
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#123b2a]">
                Payout is not the same as total return
              </h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Roulette odds describe your profit. If a $1 straight-up wager wins at 35 to 1, you receive $35 in profit and your original $1 wager back. Your total return is $36.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                This distinction prevents the classic post-spin conversation in which someone believes the casino has misplaced a dollar. The dollar was not misplaced. It was simply wearing two accounting labels.
              </p>
            </section>

            <section id="payout-chart" className="mt-9 scroll-mt-6">
              <h2 className="text-3xl font-black text-[#123b2a]">
                American roulette payout chart
              </h2>
              <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                Winning chances use all 38 pockets: numbers 1 through 36, plus 0 and 00. Example amounts show profit only, before the original winning wager is returned.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-[#b9cbbf] bg-white shadow-[0_12px_30px_rgba(21,62,43,.07)]">
                <table className="w-full min-w-[820px] border-collapse bg-[#04140f] text-left text-sm text-white">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      {[
                        "Bet",
                        "Covers",
                        "Pays",
                        "Chance",
                        "Example profit",
                        "House edge",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-300"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRows.map((row) => (
                      <tr
                        key={row.bet}
                        className="border-b border-emerald-950 last:border-b-0"
                      >
                        <th className="whitespace-nowrap px-4 py-4 font-black text-white">
                          {row.bet}
                        </th>
                        <td className="px-4 py-4 font-bold text-emerald-50/65">
                          {row.covers}
                        </td>
                        <td className="px-4 py-4 font-black text-amber-200">
                          {row.payout}
                        </td>
                        <td className="px-4 py-4 font-black text-emerald-200">
                          {row.chance}
                        </td>
                        <td className="px-4 py-4 font-bold text-emerald-50/65">
                          {row.example}
                        </td>
                        <td className="px-4 py-4 font-black text-emerald-200">
                          {row.edge}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">
                Four payouts in actual dollars
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {workedExamples.map((example) => (
                  <div
                    key={example.title}
                    className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)]"
                  >
                    <h3 className="text-lg font-black text-[#123b2a]">
                      {example.title}
                    </h3>
                    <div className="mt-2 text-2xl font-black text-amber-700">
                      {example.result}
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                      {example.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-9 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-800">
                Why the house edge stays the same
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#123b2a]">
                Different bets, same underlying cost
              </h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Consider a $1 bet on Red. Eighteen red pockets win $1. Eighteen black pockets lose $1, and both green pockets also lose. Across all 38 possible results, the two green pockets create an average casino advantage of 2 divided by 38, or about 5.26%.
              </p>
              <div className="mt-5 rounded-xl border border-sky-200 bg-white px-5 py-4 text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-sky-800">
                  American roulette house edge
                </div>
                <div className="mt-2 text-4xl font-black text-[#123b2a]">
                  2 ÷ 38 = 5.26%
                </div>
              </div>
              <p className="mt-4 text-sm font-bold leading-6 text-slate-600">
                The percentage is a long-run mathematical average, not a prediction for your next five spins. Roulette remains stubbornly uninterested in short-term budgeting.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-700">
                The notable exception
              </div>
              <h2 className="mt-2 text-3xl font-black text-red-950">
                The five-number basket costs more
              </h2>
              <p className="mt-4 text-base font-medium leading-7 text-red-950/75">
                Some American roulette layouts offer a single bet covering 0, 00, 1, 2, and 3. It usually pays 6 to 1 and carries a house edge of about 7.89%, which is worse than the standard 5.26% bets.
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-red-900/70">
                Five covered pockets sound friendly. The payout schedule did not receive the memo. Lucky Penny currently supports zero-area straight and split bets rather than this five-number basket.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">
                Inside or outside: which should you choose?
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-700">
                    Inside bets
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-amber-950">
                    Less frequent, larger wins
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-amber-950/70">
                    Straight-up, split, street, and corner bets cover fewer numbers. They create more losing spins and larger individual payouts when they connect.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700">
                    Outside bets
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-emerald-950">
                    More frequent, smaller wins
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-emerald-950/70">
                    Dozens, columns, red, black, odd, even, low, and high cover more numbers. They win more often, but the payout is smaller.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Most of these bets carry the same house edge, so the choice is mainly about volatility. Pick the experience you prefer, not the one that a nearby spreadsheet enthusiast claims is due.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)] sm:p-6">
              <h2 className="text-2xl font-black text-[#123b2a]">
                Three payout mistakes to leave at the door
              </h2>
              <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-slate-700">
                <li>
                  <strong className="text-[#123b2a]">Counting the original chip as profit:</strong> A $1 straight-up winner returns $36, but only $35 is profit.
                </li>
                <li>
                  <strong className="text-[#123b2a]">Treating Red as a coin flip:</strong> Red covers 18 pockets, while 20 pockets make it lose because 0 and 00 are green.
                </li>
                <li>
                  <strong className="text-[#123b2a]">Assuming a bigger payout means better odds:</strong> The larger prize compensates for a smaller chance of winning.
                </li>
              </ul>
            </section>

            <section className="mt-9 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                Lucky Penny table minimums
              </div>
              <h2 className="mt-2 text-2xl font-black text-[#123b2a]">
                Practice the casino-style minimum without risking lunch
              </h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Lucky Penny uses a $5 total table minimum. Inside positions can start at $1, so five separate $1 number bets qualify. Each outside position, such as Red or a dozen, requires at least $5.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                The table settles every position separately and keeps the complete result in Recent Spins, making it easy to compare the payout chart with what actually happened.
              </p>
            </section>

            <section className="mt-10 rounded-2xl border border-emerald-900 bg-gradient-to-br from-[#0d3b29] to-[#06271b] p-6 text-center text-white shadow-[0_16px_34px_rgba(7,45,31,.18)] sm:p-8">
              <h2 className="text-3xl font-black">
                Give the payout chart something to do
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-emerald-50/75">
                Place a few inside and outside bets with free practice credits, spin the wheel, and open the result details. The arithmetic is more memorable when it arrives with a bouncing ball.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/roulette"
                  className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300"
                >
                  Practice These Bets
                </Link>
                <Link
                  href="/roulette/how-to-play"
                  className="rounded-xl border border-emerald-600/70 bg-emerald-950/25 px-6 py-3.5 font-black text-emerald-100 hover:border-emerald-400"
                >
                  Review Roulette Basics
                </Link>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_12px_30px_rgba(21,62,43,.07)] lg:sticky lg:top-5">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Quick payout rules
            </div>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-700">
              <li>35 to 1 covers one number</li>
              <li>17 to 1 covers two numbers</li>
              <li>11 to 1 covers three numbers</li>
              <li>8 to 1 covers four numbers</li>
              <li>2 to 1 covers a dozen or column</li>
              <li>1 to 1 covers an even-money group</li>
            </ul>
            <div className="mt-6 border-t border-[#d8e0da] pt-5">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">
                Keep learning
              </div>
              <Link
                href="/roulette/how-to-play"
                className="mt-3 block text-sm font-black leading-6 text-emerald-800 hover:text-emerald-950"
              >
                How to Play American Roulette →
              </Link>
              <Link
                href="/roulette"
                className="mt-3 block text-sm font-black leading-6 text-amber-700 hover:text-amber-900"
              >
                Open the Practice Table →
              </Link>
            </div>
            <div className="mt-6 border-t border-[#d8e0da] pt-5">
              <p className="text-xs font-medium leading-5 text-slate-500">
                Probabilities assume a standard 38-pocket American wheel. Casino rules and minimums vary. Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
