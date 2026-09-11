import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Baccarat Scoreboards and the Bead Road Explained",
  description:
    "Learn how Baccarat scoreboards and the Bead Road record Player, Banker, and Tie results, how to read the grid, and why past patterns do not predict the next hand.",
  alternates: { canonical: "/baccarat/scoreboards" },
  openGraph: {
    type: "article",
    title: "Baccarat Scoreboards and the Bead Road Explained",
    description:
      "A practical guide to reading Baccarat scoreboards without mistaking recorded history for a prediction.",
    url: "/baccarat/scoreboards",
    publishedTime: "2026-09-11",
    modifiedTime: "2026-09-11",
  },
};

const sampleResults = [
  "player",
  "banker",
  "banker",
  "tie",
  "player",
  "banker",
  "player",
  "player",
  "banker",
  "banker",
  "banker",
  "player",
] as const;

const resultStyle = {
  player: "border-blue-600 text-blue-700",
  banker: "border-red-600 text-red-700",
  tie: "border-emerald-600 text-emerald-700",
};

const resultLetter = {
  player: "P",
  banker: "B",
  tie: "T",
};

const quickRows = [
  ["Session scoreboard", "Counts Player wins, Banker wins, Ties, and the current streak"],
  ["Bead Road", "Records every completed result in chronological order"],
  ["Recent Hands", "Shows the cards, totals, wagers, and payout for each hand"],
];

const patternTraps = [
  {
    title: "The result is due",
    body: "Six Banker wins do not place Player at the front of an invisible line. The next hand still comes from the cards remaining in the shoe and the fixed drawing rules.",
  },
  {
    title: "The streak must continue",
    body: "A run can continue, but the chart did not cause it. Following a streak and betting against one are both choices about a historical pattern, not changes to the game math.",
  },
  {
    title: "A betting system fixes the odds",
    body: "Changing wager size can change how quickly money moves. It does not turn a sequence of past circles into information about the next cards.",
  },
];

export default function BaccaratScoreboardsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Baccarat Scoreboards and the Bead Road Explained",
    description:
      "A practical guide to Baccarat scoreboards, the Bead Road, streaks, and the limits of pattern reading.",
    datePublished: "2026-09-11",
    dateModified: "2026-09-11",
    mainEntityOfPage: "https://luckypennygaming.com/baccarat/scoreboards",
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
              Baccarat • Scoreboard Guide • 8 minute read
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] text-[#0d3525] sm:text-6xl">
              Baccarat scoreboards without the fortune telling
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
              The scoreboard remembers every hand with impressive confidence. It just has no idea what happens next. Here is how to read the Bead Road, track a session, and avoid asking a grid of colored circles to predict the future.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/baccarat" className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                Watch the Bead Road Update
              </Link>
              <Link href="/baccarat/how-to-play" className="rounded-xl border border-emerald-700 bg-white px-6 py-3.5 font-black text-emerald-900 hover:bg-emerald-50">
                Review the Baccarat Rules
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-emerald-900/60">
              <span>Published September 11, 2026</span>
              <span>•</span>
              <span>Bead Road • Session scoreboard • Practice credits only</span>
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
                A Baccarat scoreboard records completed Player, Banker, and Tie results. Lucky Penny&apos;s Bead Road begins in the upper-left corner, fills downward, then moves to the top of the next column. It is a useful session record. It is not a prediction engine wearing a casino tuxedo.
              </p>
            </section>

            <section className="mt-9">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                Start with the purpose
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#123b2a]">What does the scoreboard actually do?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Baccarat moves quickly, and the same two hand names appear every round. A scoreboard saves you from keeping the entire shoe in your head. It shows how many times each side has won, the order of those results, and whether the latest result is part of a streak.
              </p>
              <div className="mt-5 grid gap-3">
                {quickRows.map(([name, purpose]) => (
                  <div key={name} className="grid gap-1 rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_20px_rgba(21,62,43,.05)] sm:grid-cols-[180px_1fr] sm:gap-5">
                    <h3 className="font-black text-[#123b2a]">{name}</h3>
                    <p className="text-base font-medium leading-7 text-slate-600">{purpose}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-9 rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)] sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                The Bead Road
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#123b2a]">Read down, then move right</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Begin with the circle in the upper-left corner. Read down the first column from top to bottom. After the sixth result, return to the top and move one column to the right. Every completed hand gets one position, including a Tie.
              </p>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-[#b8aa8c] bg-[#e8dfca] p-4">
                <div className="mb-3 flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.08em]">
                  <span className="text-blue-700">● Player</span>
                  <span className="text-red-700">● Banker</span>
                  <span className="text-emerald-700">● Tie</span>
                </div>
                <div className="grid w-max grid-flow-col grid-rows-6 gap-2" role="img" aria-label="Example Bead Road read from top to bottom and then left to right">
                  {sampleResults.map((result, index) => (
                    <div key={`${result}-${index}`} className="flex h-11 w-11 items-center justify-center rounded-md border border-[#b8aa8c]/70 bg-[#f7f0df]">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black ${resultStyle[result]}`}>
                        {resultLetter[result]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-bold leading-6 text-[#5b513f]">
                  This sample contains 12 hands. The first six fill the left column. Hand seven starts at the top of the next column.
                </p>
              </div>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">What does “current streak” mean?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                It counts consecutive wins by the same side at the end of the recorded session. If the latest three hands were Banker, Banker, Banker, the current streak is Banker times three. A Tie ends that run on the Lucky Penny scoreboard because it is recorded as its own result.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                That label is descriptive, not strategic. It tells you what just happened. It does not make a fourth Banker win more likely, less likely, nervous, or late for an appointment.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-800">
                The important part
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#123b2a]">Why the road cannot predict the next hand</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                The next result comes from the cards remaining in the shoe and Baccarat&apos;s fixed drawing rules. The Bead Road knows only the labels attached to completed hands. It does not know which cards produced them, which cards remain, or what the dealer is about to draw.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                The exact probabilities can shift slightly as cards leave the shoe, but a visible pattern of Player and Banker results is not the same thing as tracking card composition. A zigzag is still a drawing of the past, even when it looks unusually pleased with itself.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">Three pattern traps to leave at the door</h2>
              <div className="mt-5 grid gap-3">
                {patternTraps.map((trap, index) => (
                  <div key={trap.title} className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-red-700">Trap {index + 1}</div>
                    <h3 className="mt-2 text-xl font-black text-red-950">“{trap.title}”</h3>
                    <p className="mt-3 text-base font-medium leading-7 text-red-950/75">{trap.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-9 rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_10px_24px_rgba(21,62,43,.06)] sm:p-6">
              <h2 className="text-3xl font-black text-[#123b2a]">What about the other Baccarat roads?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-slate-700">
                Casino displays may also show the Big Road, Big Eye Boy, Small Road, and Cockroach Pig. The Big Road groups Banker and Player runs. The three derived roads compare parts of the Big Road&apos;s shape.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                Here is the detail beginners most often miss: red and blue on the derived roads do not directly mean Banker and Player. They describe chart structure. Lucky Penny starts with the Bead Road because chronological results are easier to read and harder to mistake for a committee of tiny prediction robots.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black text-[#123b2a]">A useful way to practice</h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Deal six hands and identify the first complete Bead Road column.",
                  "Say each result aloud before checking the newest circle.",
                  "Open Recent Hands and connect the circle to its cards and final totals.",
                  "Notice a streak without increasing the next wager because of it.",
                ].map((step, index) => (
                  <li key={step} className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_20px_rgba(21,62,43,.05)]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-sm font-black text-white">{index + 1}</span>
                    <p className="mt-3 text-base font-bold leading-7 text-slate-700">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-10 rounded-2xl border border-emerald-900 bg-gradient-to-br from-[#0d3b29] to-[#06271b] p-6 text-center text-white shadow-[0_16px_34px_rgba(7,45,31,.18)] sm:p-8">
              <h2 className="text-3xl font-black">Let the scoreboard keep score</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-emerald-50/75">
                Deal a practice shoe, watch the circles fill from top to bottom, and use Recent Hands whenever you want the story behind a result.
              </p>
              <Link href="/baccarat" className="mt-6 inline-flex rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                Practice This on the Baccarat Table
              </Link>
            </section>

            <section className="mt-9 border-t border-[#d8d2c2] pt-6 text-xs font-medium leading-5 text-slate-500">
              <p>
                References: <a href="https://wizardofodds.com/games/baccarat/history/" target="_blank" rel="noreferrer" className="font-bold text-emerald-800 hover:text-emerald-950">Wizard of Odds Baccarat Score Boards</a> for Bead Road notation and roadmap structure, plus the <a href="https://massgaming.com/wp-content/uploads/RULES-Baccarat-4-11-2024.pdf" target="_blank" rel="noreferrer" className="font-bold text-emerald-800 hover:text-emerald-950">Massachusetts Gaming Commission Baccarat rules</a> for the underlying game and drawing procedures.
              </p>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_12px_30px_rgba(21,62,43,.07)] lg:sticky lg:top-5">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Remember this</div>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-700">
              <li>Start in the upper-left</li>
              <li>Read down each column</li>
              <li>Blue is Player</li>
              <li>Red is Banker</li>
              <li>Green is Tie</li>
              <li>The road records; it does not predict</li>
            </ul>
            <div className="mt-6 border-t border-[#d8e0da] pt-5">
              <Link href="/baccarat/how-to-play" className="text-sm font-black text-amber-700 hover:text-amber-900">
                Read How to Play Baccarat →
              </Link>
              <p className="mt-4 text-xs font-medium leading-5 text-slate-500">
                Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
