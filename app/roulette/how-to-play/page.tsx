import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "How to Play American Roulette",
  description:
    "Learn how American roulette works, where to place inside and outside bets, what each wager pays, and how 0 and 00 affect your odds.",
  alternates: { canonical: "/roulette/how-to-play" },
  openGraph: {
    type: "article",
    title: "How to Play American Roulette",
    description:
      "A plain-English beginner guide to the American roulette wheel, betting layout, payouts, and first spin.",
    url: "/roulette/how-to-play",
    publishedTime: "2026-09-11",
    modifiedTime: "2026-09-11",
  },
};

const betRows = [
  ["Straight up", "1 number", "35 to 1", "A chip directly on one number"],
  ["Split", "2 numbers", "17 to 1", "A chip on the line between two numbers"],
  ["Street", "3 numbers", "11 to 1", "A chip on the edge of one three-number row"],
  ["Corner", "4 numbers", "8 to 1", "A chip where four numbers meet"],
  ["Dozen or column", "12 numbers", "2 to 1", "A labeled dozen or column area"],
  ["Even money", "18 numbers", "1 to 1", "Red, black, odd, even, 1-18, or 19-36"],
];

const firstSpinSteps = [
  {
    number: "1",
    title: "Choose a chip",
    body: "Use a $1 chip for an inside position or at least $5 for an outside position on the Lucky Penny table.",
  },
  {
    number: "2",
    title: "Place one or more bets",
    body: "Tap a number, a shared line, a shared corner, or one of the labeled outside betting areas.",
  },
  {
    number: "3",
    title: "Reach the table minimum",
    body: "Lucky Penny uses a $5 table minimum. Five separate $1 number bets satisfy it, as does one $5 outside bet.",
  },
  {
    number: "4",
    title: "Spin and review",
    body: "The wheel chooses one pocket. Every wager is settled against that result, and Recent Spins keeps the full detail.",
  },
];

export default function HowToPlayAmericanRoulettePage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Play American Roulette",
    description:
      "A beginner guide to American roulette rules, bet placement, payouts, and the effect of 0 and 00.",
    datePublished: "2026-09-11",
    dateModified: "2026-09-11",
    mainEntityOfPage: "https://luckypennygaming.com/roulette/how-to-play",
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
        <header className="border-b border-[#d8d2c2] bg-[radial-gradient(circle_at_18%_10%,rgba(185,28,28,.11),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(16,116,78,.14),transparent_28%)]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
            <Link href="/guides" className="text-xs font-black text-emerald-800 hover:text-emerald-950">
              ← All guides
            </Link>
            <div className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
              American Roulette • Beginner Guide • 8 minute read
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] text-[#0d3525] sm:text-6xl">
              How to play American roulette without arguing with the tiny ball
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
              Roulette is simple at heart: place a bet, spin the wheel, and see where the ball lands. The betting layout only looks complicated because casinos discovered that rectangles are cheaper than individual tutors.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/roulette" className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                Practice This on the Roulette Table
              </Link>
              <a href="#bet-types" className="rounded-xl border border-emerald-700 bg-white px-6 py-3.5 font-black text-emerald-900 hover:bg-emerald-50">
                See Bet Types and Payouts
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-emerald-900/60">
              <span>Published September 11, 2026</span>
              <span>•</span>
              <span>38 pockets • 0 and 00 • Practice credits only</span>
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
                American roulette has 38 possible results: 1 through 36, plus 0 and 00. You win when the ball lands on a pocket covered by your bet. Bets covering fewer numbers pay more. Bets covering more numbers win more often but pay less.
              </p>
            </section>

            <section className="mt-9">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                Start here
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#123b2a]">What happens during one spin?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Players place chips on the betting layout before the wheel spins. The dealer spins the wheel in one direction and the ball in the other. When the ball settles into a pocket, losing bets are removed and winning bets are paid according to their posted odds.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                You do not need to predict how the wheel will behave, detect a pattern, or establish eye contact with number 17. You only need to choose which outcomes your wager covers.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <h2 className="text-2xl font-black text-[#123b2a]">American versus European roulette</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                American roulette has both 0 and 00, creating 38 pockets. European roulette normally has only one zero and 37 pockets. That extra 00 gives the American game a higher house edge on standard bets.
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-emerald-900/75">
                Lucky Penny uses the American version, so both green pockets are always part of the lesson.
              </p>
            </section>

            <section id="bet-types" className="mt-9 scroll-mt-6">
              <h2 className="text-3xl font-black text-[#123b2a]">Roulette bet types and payouts</h2>
              <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                Inside bets use the numbered grid. Outside bets use the labeled areas around it. The payout is profit, and your original winning wager is also returned.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-[#b9cbbf] bg-white shadow-[0_12px_30px_rgba(21,62,43,.07)]">
                <table className="w-full min-w-[760px] border-collapse bg-[#04140f] text-left text-sm text-white">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      {['Bet', 'Covers', 'Pays', 'Where the chip goes'].map((heading) => (
                        <th key={heading} className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {betRows.map(([bet, covers, payout, placement]) => (
                      <tr key={bet} className="border-b border-emerald-950 last:border-b-0">
                        <th className="whitespace-nowrap px-4 py-4 font-black text-white">{bet}</th>
                        <td className="px-4 py-4 font-black text-emerald-200">{covers}</td>
                        <td className="px-4 py-4 font-black text-amber-200">{payout}</td>
                        <td className="px-4 py-4 font-medium leading-6 text-emerald-50/65">{placement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">Your first spin in four steps</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {firstSpinSteps.map((step) => (
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

            <section className="mt-9 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-800">
                Lucky Penny table rules
              </div>
              <h2 className="mt-2 text-2xl font-black text-[#123b2a]">One $5 minimum, two ways to reach it</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Inside positions may start at $1, but you need at least $5 in total action before spinning. For example, you can place $1 on five different numbers. Outside positions such as Red, Black, Odd, Even, a dozen, or a column each require at least $5.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                Learn Mode demonstrates both ideas by building five $1 straight-up bets and then adding one $5 bet on Red.
              </p>
              <Link href="/roulette" className="mt-5 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300">
                Open Roulette Learn Mode
              </Link>
            </section>

            <section className="mt-9 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <h2 className="text-2xl font-black text-red-950">What do 0 and 00 do?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-red-950/75">
                Both are green pockets. If the ball lands on either one, standard outside bets such as Red, Black, Odd, Even, 1-18, 19-36, dozens, and columns lose. A straight-up or supported split wager covering the winning zero pocket can still win.
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-red-900/70">
                This is why Red does not have a 50% chance of winning, even though the wheel has 18 red numbers. Zero brought a friend.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">Does one bet have better odds than another?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Standard American roulette bets are generally balanced around the same 5.26% house edge. A straight-up bet wins less often and pays more. An even-money bet wins more often and pays less. Changing the number of covered pockets changes the ride, not the underlying casino advantage.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                That makes bet selection mostly a question of volatility and preference. If you want frequent smaller outcomes, use broader outside bets. If you enjoy long waits followed by louder arithmetic, inside bets are available.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)] sm:p-6">
              <h2 className="text-2xl font-black text-[#123b2a]">Three beginner mistakes worth skipping</h2>
              <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-slate-700">
                <li><strong className="text-[#123b2a]">Forgetting the zeros:</strong> Red and black each cover 18 numbers, but the wheel has 38 pockets.</li>
                <li><strong className="text-[#123b2a]">Confusing payout with total return:</strong> A 2-to-1 win returns the original wager plus two units of profit.</li>
                <li><strong className="text-[#123b2a]">Chasing a pattern:</strong> Previous results do not make a pocket due. The wheel does not maintain a customer-service queue.</li>
              </ul>
            </section>

            <section className="mt-10 rounded-2xl border border-emerald-900 bg-gradient-to-br from-[#0d3b29] to-[#06271b] p-6 text-center text-white shadow-[0_16px_34px_rgba(7,45,31,.18)] sm:p-8">
              <h2 className="text-3xl font-black">Put the guide to work</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-emerald-50/75">
                Use free practice credits, turn on Learn Mode, and watch every wager settle. It is much easier to understand a split bet after placing one than after staring at a diagram until it develops opinions.
              </p>
              <Link href="/roulette" className="mt-6 inline-flex rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                Practice This on the Roulette Table
              </Link>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_12px_30px_rgba(21,62,43,.07)] lg:sticky lg:top-5">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Remember this
            </div>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-700">
              <li>American roulette has 38 pockets</li>
              <li>0 and 00 are both green</li>
              <li>Fewer covered numbers pay more</li>
              <li>Outside bets lose on both zeros</li>
              <li>Lucky Penny uses a $5 table minimum</li>
            </ul>
            <div className="mt-6 border-t border-[#d8e0da] pt-5">
              <p className="text-xs font-medium leading-5 text-slate-500">
                Casino procedures and table minimums vary. Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
