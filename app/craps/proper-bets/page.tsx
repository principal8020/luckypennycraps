import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Proper Craps Bets: Correct Amounts and Payouts",
  description:
    "Learn the proper bet amounts for Place 4, 5, 6, 8, 9, and 10, including payout examples for common craps table minimums.",
  alternates: { canonical: "/craps/proper-bets" },
  openGraph: {
    type: "article",
    title: "Proper Craps Bets: Correct Amounts and Payouts",
    description:
      "A practical guide to sizing craps Place bets so the payout divides cleanly and unnecessary rounding stays out of your rack.",
    url: "/craps/proper-bets",
    publishedTime: "2026-09-10",
    modifiedTime: "2026-09-10",
  },
};

const placeBetRows = [
  {
    numbers: "4 or 10",
    payout: "9:5",
    unit: "$5",
    example: "$25 wins $45",
    edge: "6.67%",
  },
  {
    numbers: "5 or 9",
    payout: "7:5",
    unit: "$5",
    example: "$25 wins $35",
    edge: "4.00%",
  },
  {
    numbers: "6 or 8",
    payout: "7:6",
    unit: "$6",
    example: "$30 wins $35",
    edge: "1.52%",
  },
];

const minimumRows = [
  ["$5 table", "$5", "$6", "$6", "$5", "$5"],
  ["$10 table", "$10", "$12", "$12", "$10", "$10"],
  ["$15 table", "$15", "$18", "$18", "$15", "$15"],
  ["$25 table", "$25", "$30", "$30", "$25", "$25"],
];

export default function ProperCrapsBetsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Proper Craps Bets: Correct Amounts and Payouts",
    description:
      "A practical guide to proper Place bet increments and payouts in craps.",
    datePublished: "2026-09-10",
    dateModified: "2026-09-10",
    mainEntityOfPage: "https://luckypennygaming.com/craps/proper-bets",
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
        <header className="border-b border-emerald-900/70 bg-[radial-gradient(circle_at_18%_10%,rgba(245,158,11,.12),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(16,185,129,.1),transparent_28%)]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
            <Link href="/guides" className="text-xs font-black text-emerald-300 hover:text-white">
              ← All guides
            </Link>
            <div className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
              Craps • Proper bets • 7 minute read
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] sm:text-6xl">
              Why you should make your craps bets proper
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-emerald-50/70">
              A proper bet is not a compliment from the dealer. It is a wager sized so the posted odds produce a clean payout. Get the amount right and the math behaves. Get it wrong and the rounding starts nibbling at your chips.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-emerald-200/55">
              <span>Published September 10, 2026</span>
              <span>•</span>
              <span>Place bets • Payouts • Table minimums</span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <section className="rounded-2xl border border-amber-800/60 bg-amber-950/15 p-5 sm:p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                The 20-second version
              </div>
              <p className="mt-3 text-base font-bold leading-7 text-amber-50/80">
                Make Place 6 and Place 8 in multiples of $6. Make Place 4, 5, 9, and 10 in multiples of $5. At a $25 table, that means $30 each on 6 and 8, not $25.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">What does “proper” mean in craps?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/70">
                Craps payouts are ratios. Place 6 pays 7:6, so every $6 wagered wins $7 in profit. Place 5 pays 7:5, so every $5 wins $7. A proper bet is simply an amount that fits the ratio without producing a fraction of a dollar.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/70">
                The table minimum does not mean every betting box should receive that exact amount. On a $5 table, the proper starting wager on 6 or 8 is $6. That extra dollar is not the casino upselling you. For once, it is just division.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">Proper Place bet amounts</h2>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/65">
                These are standard Place bet payouts. “Wins” means profit; your original Place bet normally remains working on the table after a win unless you take it down.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-900/80">
                <table className="w-full min-w-[680px] border-collapse bg-[#04140f] text-left text-sm">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      <th className="px-4 py-3 font-black uppercase tracking-[0.1em] text-emerald-300">Place number</th>
                      <th className="px-4 py-3 font-black uppercase tracking-[0.1em] text-emerald-300">Payout</th>
                      <th className="px-4 py-3 font-black uppercase tracking-[0.1em] text-emerald-300">Proper unit</th>
                      <th className="px-4 py-3 font-black uppercase tracking-[0.1em] text-emerald-300">Example</th>
                      <th className="px-4 py-3 font-black uppercase tracking-[0.1em] text-emerald-300">House edge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placeBetRows.map((row) => (
                      <tr key={row.numbers} className="border-b border-emerald-950 last:border-b-0">
                        <th className="whitespace-nowrap px-4 py-4 text-base font-black text-white">{row.numbers}</th>
                        <td className="px-4 py-4 font-black text-amber-200">{row.payout}</td>
                        <td className="px-4 py-4 font-black text-emerald-200">{row.unit}</td>
                        <td className="px-4 py-4 font-bold text-emerald-50/70">{row.example}</td>
                        <td className="px-4 py-4 font-bold text-emerald-50/55">{row.edge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/45">
                This table covers Place bets. Buy bets, lay bets, and odds use different payout and commission rules.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-red-900/60 bg-red-950/10 p-5 sm:p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-red-300">
                The classic mistake
              </div>
              <h2 className="mt-2 text-3xl font-black">Why $5 on the 6 is not the same as $6</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-red-900/60 bg-black/20 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.1em] text-red-300">Improper: $5</div>
                  <div className="mt-2 text-3xl font-black">$5.83 exact</div>
                  <p className="mt-3 text-base font-medium leading-7 text-red-50/65">
                    The 7:6 calculation produces $5.83 in profit. Craps tables do not keep a jar of nickels and pennies beside the stickman, so house procedures determine how an improper amount is handled.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-700/60 bg-emerald-950/25 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.1em] text-emerald-300">Proper: $6</div>
                  <div className="mt-2 text-3xl font-black">$7 profit</div>
                  <p className="mt-3 text-base font-medium leading-7 text-emerald-50/65">
                    Six divides cleanly into the posted odds. If 6 rolls before 7, the wager wins $7 and the original $6 remains on the number.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-base font-bold leading-7 text-red-100/65">
                Lucky Penny rounds fractional payouts down, matching the lesson built into the simulator. A $5 Place 6 therefore wins $5, while the proper $6 wager wins $7.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">Proper bets at common table minimums</h2>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/65">
                Start with the table minimum on 4, 5, 9, and 10. For 6 and 8, move up to the next standard multiple of $6.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-900/80">
                <table className="w-full min-w-[650px] border-collapse bg-[#04140f] text-center text-sm">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      {['Minimum', 'Place 5', 'Place 6', 'Place 8', 'Place 9', 'Place 4/10'].map((heading) => (
                        <th key={heading} className="px-4 py-3 font-black uppercase tracking-[0.08em] text-emerald-300">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {minimumRows.map(([minimum, ...amounts]) => (
                      <tr key={minimum} className="border-b border-emerald-950 last:border-b-0">
                        <th className="whitespace-nowrap px-4 py-4 text-left text-base font-black text-white">{minimum}</th>
                        {amounts.map((amount, index) => (
                          <td key={`${minimum}-${index}`} className={`px-4 py-4 font-black ${index === 1 || index === 2 ? 'text-amber-200' : 'text-emerald-100/70'}`}>
                            {amount}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">What happens if your bet is improper?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/70">
                At a live table, the dealer may suggest the correct amount, pay only the portion that divides cleanly, or follow another house procedure. Policies can vary, so ask before the roll if you are unsure. Dealers would rather fix the amount now than conduct a fractions seminar while the dice are in the air.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/70">
                On Lucky Penny, payouts round down to whole practice credits. The easiest solution is the same online and at the casino: build the proper amount before rolling.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-cyan-900/70 bg-cyan-950/10 p-5 sm:p-6">
              <h2 className="text-2xl font-black">Proper does not automatically mean smart</h2>
              <p className="mt-4 text-base font-medium leading-7 text-cyan-50/70">
                Proper sizing prevents avoidable payout rounding. It does not change how often the number rolls, erase the house edge, or transform every wager into a bargain. A perfectly sized bet can still be expensive. It is simply expensive with cleaner bookkeeping.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-cyan-50/70">
                Among Place bets, 6 and 8 carry the lowest house edge at about 1.52%. That is why they are common starting points for players learning the table.
              </p>
            </section>

            <section className="mt-10 rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-300/15 to-emerald-900/20 p-6 text-center sm:p-8">
              <h2 className="text-3xl font-black">Build a proper Place 6 and Place 8 yourself</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-emerald-50/70">
                The guided lesson starts at a $5 table, helps you build $6 on both numbers, and shows the $7 payouts before demonstrating what a seven-out does to the bets.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/table?lesson=place-68" className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                  Practice Place 6 and 8
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
              <li>4 and 10: multiples of $5</li>
              <li>5 and 9: multiples of $5</li>
              <li>6 and 8: multiples of $6</li>
              <li>$5 table: bet $6 on 6 or 8</li>
              <li>$25 table: bet $30 on 6 or 8</li>
            </ul>
            <div className="mt-6 border-t border-emerald-900/70 pt-5">
              <p className="text-sm font-medium leading-6 text-emerald-50/45">
                Casino procedures and table rules can vary. Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
