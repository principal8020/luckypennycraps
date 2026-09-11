import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "How to Play Baccarat: Rules, Bets and Payouts",
  description:
    "Learn Baccarat hand values, automatic third-card rules, Player and Banker bets, Tie, Dragon Bonus, payouts, house edge, and scoreboards.",
  alternates: { canonical: "/baccarat/how-to-play" },
  openGraph: {
    type: "article",
    title: "How to Play Baccarat: Rules, Bets and Payouts",
    description:
      "A plain-English beginner guide to Baccarat scoring, bets, automatic drawing rules, Dragon Bonus, and the bead road.",
    url: "/baccarat/how-to-play",
    publishedTime: "2026-09-11",
    modifiedTime: "2026-09-11",
  },
};

const cardValues = [
  ["A", "1 point"],
  ["2 through 9", "Face value"],
  ["10, J, Q, K", "0 points"],
  ["Any total over 9", "Keep only the final digit"],
];

const betRows = [
  ["Banker", "0.95 to 1", "About 1.06%", "Lowest standard house edge after the 5% commission"],
  ["Player", "1 to 1", "About 1.24%", "Simple even-money payout with no commission"],
  ["Tie", "8 to 1", "About 14.36%", "Player and Banker bets push when the hands tie"],
  ["Player Dragon Bonus", "1 to 1 up to 30 to 1", "About 2.65%", "Pays for a natural win or a non-natural win by at least 4"],
  ["Banker Dragon Bonus", "1 to 1 up to 30 to 1", "About 9.37%", "Same payout ladder, but a substantially higher house edge"],
];

const bankerDrawRows = [
  ["0, 1, or 2", "Always draws"],
  ["3", "Draws unless Player's third card is 8"],
  ["4", "Draws when Player's third card is 2 through 7"],
  ["5", "Draws when Player's third card is 4 through 7"],
  ["6", "Draws when Player's third card is 6 or 7"],
  ["7", "Stands"],
];

const dragonRows = [
  ["Natural winner", "1 to 1"],
  ["Win by 4", "1 to 1"],
  ["Win by 5", "2 to 1"],
  ["Win by 6", "4 to 1"],
  ["Win by 7", "6 to 1"],
  ["Win by 8", "10 to 1"],
  ["Win by 9", "30 to 1"],
  ["Equal naturals", "Push"],
];

const firstHandSteps = [
  {
    number: "1",
    title: "Choose a chip",
    body: "Lucky Penny uses a $5 minimum per position, so the $5 chip is a comfortable place to start.",
  },
  {
    number: "2",
    title: "Pick Player or Banker",
    body: "You are betting on a hand name, not choosing a seat or volunteering to run the bank.",
  },
  {
    number: "3",
    title: "Deal the hand",
    body: "The first four cards appear Player, Banker, Player, Banker. Any required third cards are handled automatically.",
  },
  {
    number: "4",
    title: "Watch the draw",
    body: "When another card is required, the table highlights its recipient before the card arrives.",
  },
  {
    number: "5",
    title: "Review the result",
    body: "Open Recent Hands to see every wager, payout, Banker commission, and final total.",
  },
];

export default function HowToPlayBaccaratPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Play Baccarat: Rules, Bets and Payouts",
    description:
      "A beginner guide to Baccarat scoring, automatic third-card rules, wagers, payouts, house edge, and scoreboards.",
    datePublished: "2026-09-11",
    dateModified: "2026-09-11",
    mainEntityOfPage: "https://luckypennygaming.com/baccarat/how-to-play",
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
        <header className="border-b border-[#d8d2c2] bg-[radial-gradient(circle_at_16%_10%,rgba(37,99,235,.10),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(185,28,28,.10),transparent_28%),radial-gradient(circle_at_54%_90%,rgba(217,148,20,.10),transparent_30%)]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
            <Link href="/guides" className="text-xs font-black text-emerald-800 hover:text-emerald-950">
              ← All guides
            </Link>
            <div className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
              Baccarat • Beginner Guide • 9 minute read
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] text-[#0d3525] sm:text-6xl">
              How to play Baccarat without pretending the third-card rule is your job
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
              Baccarat looks formal because the table has two hands, several drawing rules, and enough French history to make everyone sit up straighter. Your actual job is much easier: choose a wager and let the dealer handle the cards.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/baccarat" className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                Practice This on the Baccarat Table
              </Link>
              <a href="#bets" className="rounded-xl border border-emerald-700 bg-white px-6 py-3.5 font-black text-emerald-900 hover:bg-emerald-50">
                Compare Bets and Payouts
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-emerald-900/60">
              <span>Published September 11, 2026</span>
              <span>•</span>
              <span>8 decks • Standard Punto Banco • Practice credits only</span>
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
                Two hands called Player and Banker are dealt. The hand closest to 9 wins. You bet on Player, Banker, or Tie before the cards appear. Card drawing is automatic, so there are no hit, stand, or strategy decisions after you place the wager.
              </p>
            </section>

            <section className="mt-9">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                Start here
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#123b2a]">What are Player and Banker?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                They are simply the names of the two hands. Betting on Player does not mean the cards belong to you, and betting on Banker does not require a vest, a vault, or a suspiciously large key ring.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                Your wager predicts which hand will finish closer to 9. If both hands finish with the same total, the result is a Tie. Player and Banker wagers are returned on a Tie.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)] sm:p-6">
              <h2 className="text-2xl font-black text-[#123b2a]">How Baccarat cards are scored</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {cardValues.map(([card, value]) => (
                  <div key={card} className="rounded-xl border border-[#d6ddd8] bg-[#fbfaf6] p-4">
                    <div className="text-lg font-black text-[#123b2a]">{card}</div>
                    <div className="mt-1 text-sm font-medium text-slate-600">{value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-base font-medium leading-7 text-slate-700">
                Only the final digit matters. A 7 and an 8 total 15, so the hand is worth 5. A king and a 9 total 9 because the king is worth zero. The highest possible Baccarat total is 9.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <h2 className="text-2xl font-black text-[#123b2a]">What is a natural?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                A natural is an 8 or 9 made with the first two cards. If either hand has a natural, both hands stand and the round ends. A natural 9 beats a natural 8. Matching naturals produce a Tie.
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-emerald-900/75">
                In other words, a natural is Baccarat politely saying, “We have seen enough.”
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">How the third-card rule works</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                First, the Player hand draws on 0 through 5 and stands on 6 or 7. If Player stands, Banker draws on 0 through 5 and stands on 6 or 7. If Player draws, the Banker rule also considers the value of Player’s third card.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                You do not choose whether either hand draws. The dealer or software applies the rule every time. The chart below is useful for understanding the deal, but memorizing it is optional unless you are planning to become the dealer.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-[#b9cbbf] bg-white shadow-[0_12px_30px_rgba(21,62,43,.07)]">
                <table className="w-full min-w-[620px] border-collapse bg-[#04140f] text-left text-sm text-white">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">Banker’s first two cards</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">When Player drew a third card</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankerDrawRows.map(([total, action]) => (
                      <tr key={total} className="border-b border-emerald-950 last:border-b-0">
                        <th className="px-4 py-4 font-black text-amber-200">{total}</th>
                        <td className="px-4 py-4 font-medium leading-6 text-emerald-50/70">{action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="bets" className="mt-9 scroll-mt-6">
              <h2 className="text-3xl font-black text-[#123b2a]">Baccarat bets, payouts, and house edge</h2>
              <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                The payout is profit, and your original winning wager is also returned. These house-edge figures use the standard eight-deck rules and payouts found on the Lucky Penny table.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-[#b9cbbf] bg-white shadow-[0_12px_30px_rgba(21,62,43,.07)]">
                <table className="w-full min-w-[820px] border-collapse bg-[#04140f] text-left text-sm text-white">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      {['Bet', 'Pays', 'House edge', 'What to know'].map((heading) => (
                        <th key={heading} className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {betRows.map(([bet, payout, edge, note]) => (
                      <tr key={bet} className="border-b border-emerald-950 last:border-b-0">
                        <th className="whitespace-nowrap px-4 py-4 font-black text-white">{bet}</th>
                        <td className="whitespace-nowrap px-4 py-4 font-black text-amber-200">{payout}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-black text-emerald-200">{edge}</td>
                        <td className="px-4 py-4 font-medium leading-6 text-emerald-50/65">{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-9 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-800">
                The practical takeaway
              </div>
              <h2 className="mt-2 text-2xl font-black text-[#123b2a]">Banker is usually the strongest standard bet</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Banker has the lowest standard house edge even after the 5% commission. Player is close behind and avoids commission arithmetic. Tie offers the largest standard payout, but its much higher house edge is the price of that excitement.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                No betting pattern changes those percentages. A scoreboard can record a streak, but it cannot negotiate with the next card.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">How Dragon Bonus works</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Dragon Bonus is a separate wager on either the Player hand or the Banker hand. It wins when your selected hand wins with a natural, or when it wins without a natural by at least 4 points. A larger winning margin earns a larger payout.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {dragonRows.map(([result, payout]) => (
                  <div key={result} className="flex items-center justify-between gap-4 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
                    <span className="font-bold text-violet-950/75">{result}</span>
                    <span className="font-black text-violet-950">{payout}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-bold leading-6 text-violet-950/70">
                Dragon Bonus is not the same wager as Dragon 7. Casinos do enjoy giving different side bets nearly identical fantasy-novel names.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)] sm:p-6">
              <h2 className="text-2xl font-black text-[#123b2a]">What does the Baccarat scoreboard mean?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                The Session Results panel counts Player wins, Banker wins, and Ties. The Bead Road records each completed hand in order, filling a column from top to bottom before moving right.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                These displays describe the past. They do not predict the next hand or make a result “due.” Use them to review the session, not to ask the shoe for a weather forecast.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">Your first hand in five steps</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {firstHandSteps.map((step) => (
                  <div key={step.number} className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-black text-white">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-black text-[#123b2a]">{step.title}</h3>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{step.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-9 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <h2 className="text-2xl font-black text-red-950">Four beginner mistakes worth skipping</h2>
              <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-red-950/75">
                <li><strong className="text-red-950">Trying to hit or stand:</strong> Baccarat drawing decisions are automatic.</li>
                <li><strong className="text-red-950">Treating Banker like a person:</strong> Banker and Player are hand names.</li>
                <li><strong className="text-red-950">Ignoring commission:</strong> A $5 Banker win earns $4.75 in profit on this table.</li>
                <li><strong className="text-red-950">Chasing the road:</strong> Recent results document a streak; they do not create the next result.</li>
              </ul>
            </section>

            <section className="mt-10 rounded-2xl border border-emerald-900 bg-gradient-to-br from-[#0d3b29] to-[#06271b] p-6 text-center text-white shadow-[0_16px_34px_rgba(7,45,31,.18)] sm:p-8">
              <h2 className="text-3xl font-black">Let the table deal the lesson</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-emerald-50/75">
                Start Learn Mode, place one practice wager, and watch the table explain every draw. Baccarat becomes much friendlier once you stop trying to personally supervise the Banker.
              </p>
              <Link href="/baccarat" className="mt-6 inline-flex rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                Practice This on the Baccarat Table
              </Link>
            </section>

            <section className="mt-9 border-t border-[#d8d2c2] pt-6 text-xs font-medium leading-5 text-slate-500">
              <p>
                Rules and payout references: <a href="https://massgaming.com/wp-content/uploads/RULES-Baccarat-4-11-2024.pdf" target="_blank" rel="noreferrer" className="font-bold text-emerald-800 hover:text-emerald-950">Massachusetts Gaming Commission Baccarat rules</a>. House-edge calculations for the standard game and eight-deck Dragon Bonus use published combinatorial analysis from <a href="https://wizardofodds.com/games/baccarat/appendix/5/" target="_blank" rel="noreferrer" className="font-bold text-emerald-800 hover:text-emerald-950">Wizard of Odds</a>.
              </p>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_12px_30px_rgba(21,62,43,.07)] lg:sticky lg:top-5">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Remember this
            </div>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-700">
              <li>Closest to 9 wins</li>
              <li>Only the final digit counts</li>
              <li>Drawing is automatic</li>
              <li>Banker has the lowest standard house edge</li>
              <li>Tie and side bets carry more house edge</li>
              <li>The bead road records; it does not predict</li>
            </ul>
            <div className="mt-6 border-t border-[#d8e0da] pt-5">
              <p className="text-xs font-medium leading-5 text-slate-500">
                Casino rules, payouts, and table minimums can vary. Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
