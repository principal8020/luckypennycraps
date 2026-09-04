import Link from "next/link";

const flow = [
  { step: "01", title: "Come-out roll", body: "A new round starts with the puck OFF. Pass Line and Don't Pass are the two classic starting contract bets." },
  { step: "02", title: "A point is established", body: "If 4, 5, 6, 8, 9, or 10 rolls, that number becomes the point and the puck turns ON." },
  { step: "03", title: "The point cycle", body: "The shooter keeps rolling until the point repeats or a 7 appears. Then the round resets to a new come-out roll." },
];

const bets = [
  ["Pass Line","START HERE","Wins on 7 or 11 on the come-out. Loses on 2, 3, or 12. If a point is established, the bet wins if that point repeats before a 7.","Practice Pass Line","/table?lesson=pass-line"],
  ["Pass Line Odds","LOW HOUSE EDGE","After a point is established, you can place odds behind your Pass Line bet. Odds pay true odds and add no additional house edge.","Practice Pass + Odds","/table?lesson=pass-line"],
  ["Don't Pass","DARK SIDE","Generally works opposite the Pass Line. It wins on 2 or 3 on the come-out, pushes on 12, and then wants a 7 before the point repeats.","Practice Don't Pass","/table"],
  ["Place 6 & 8","BEGINNER FRIENDLY","Place bets win when their number rolls before a 7. Six and eight are common starting place bets because of how often they roll.","Practice Place 6 & 8","/table?lesson=place-68"],
  ["Come","CONTRACT BET","A Come bet acts like a new Pass Line bet after a point is already ON. If it travels to a number, that flat bet remains working on later come-out rolls.","Practice Come Bets","/table?lesson=come"],
  ["Don't Come","CONTRACT BET","The dark-side counterpart to Come. Once it travels to a number, the flat bet remains working until it wins or loses.","Practice Don't Come","/table"],
  ["Field","ONE ROLL","A one-roll wager on 2, 3, 4, 9, 10, 11, or 12. It resolves immediately on the next roll.","Practice Field Bets","/table"],
  ["Hardways","CENTER ACTION","Hard 4, 6, 8, or 10 wins when the number is rolled as a pair before an easy version of that number or a 7.","Practice Hardways","/table"],
];

const terms = [
  ["Puck OFF","The table is on a come-out roll and no point is established."],
  ["Puck ON","A point has been established and the shooter is trying to make it before a 7."],
  ["Seven-out","A 7 rolled while the puck is ON. The current shooter/hand ends."],
  ["Working","A wager is active on the next roll."],
  ["Off","A wager stays on the table but does not win or lose on that roll."],
  ["Proper bet","A wager sized in an increment that allows the payout to be calculated cleanly without unnecessary rounding."],
];

export default function HowToPlayPage() {
  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <header className="border-b border-emerald-900/80 bg-black/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="text-sm font-black text-emerald-300 hover:text-white">← Lucky Penny Craps</Link>
          <div className="hidden items-center gap-5 text-sm font-bold text-emerald-100/70 sm:flex">
            <Link href="/strategies" className="hover:text-white">Strategies</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
          <Link href="/table" className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-black text-black shadow-lg hover:bg-amber-300">Open the Table</Link>
        </div>
      </header>

      <section className="border-b border-emerald-900/70 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.11),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(245,158,11,.08),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-emerald-700/70 bg-emerald-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">Craps basics</div>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Learn the table in the same order you play it.</h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-emerald-50/65 sm:text-lg">You do not need to memorize every bet before you start. Learn the puck, the point cycle, and a few core wagers first. Then use Lucky Penny to practice the exact situation until it feels natural.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/table?lesson=pass-line" className="rounded-xl bg-amber-400 px-5 py-3 font-black text-black">Start Guided Lesson</Link>
              <Link href="#bets" className="rounded-xl border border-emerald-700/70 bg-emerald-950/30 px-5 py-3 font-black text-emerald-100">Learn the Bets</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-5">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">The round</div>
          <h2 className="mt-2 text-3xl font-black">Three steps explain most of the game.</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {flow.map((item) => (
            <article key={item.step} className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5">
              <div className="text-3xl font-black text-emerald-800">{item.step}</div>
              <h3 className="mt-3 text-xl font-black text-emerald-100">{item.title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/60">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="bets" className="border-y border-emerald-900/70 bg-black/20">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="mb-6 max-w-3xl">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">Core bets</div>
            <h2 className="mt-2 text-3xl font-black">Learn one wager at a time.</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/60">Guided lessons open directly on the live table where available. Other wagers still open the full table for free practice.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {bets.map(([name, level, description, practice, href]) => (
              <article key={name} className="rounded-2xl border border-emerald-900/80 bg-emerald-950/15 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black">{name}</h3>
                  <span className="shrink-0 rounded border border-amber-800/70 bg-amber-950/20 px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em] text-amber-300">{level}</span>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/60">{description}</p>
                <Link href={href} className="mt-4 inline-flex items-center gap-1 text-sm font-black text-emerald-300 hover:text-white">{practice} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_.9fr]">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">Table language</div>
          <h2 className="mt-2 text-3xl font-black">Six terms worth knowing.</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-900/80">
            {terms.map(([term, definition]) => (
              <div key={term} className="grid gap-1 border-b border-emerald-900/50 bg-black/20 px-5 py-4 last:border-b-0 sm:grid-cols-[150px_1fr]">
                <div className="font-black text-amber-300">{term}</div>
                <div className="text-sm font-medium leading-6 text-emerald-50/60">{definition}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-900/70 bg-cyan-950/15 p-5 sm:p-6">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">First practice session</div>
          <h2 className="mt-2 text-2xl font-black">Try this six-step progression.</h2>
          <ol className="mt-5 space-y-3">
            {[
              "Place a $5 Pass Line bet.",
              "Roll until a point is established.",
              "Add the recommended odds.",
              "Add a Place 6 or Place 8 bet.",
              "Try a Come bet and watch it travel.",
              "Open Practice Mode and force the outcome you want to study.",
            ].map((item, index) => (
              <li key={item} className="flex gap-3 rounded-xl border border-cyan-900/50 bg-black/20 px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-[10px] font-black">{index + 1}</span>
                <span className="pt-1 text-sm font-semibold leading-5 text-cyan-50/75">{item}</span>
              </li>
            ))}
          </ol>
          <Link href="/table?lesson=pass-line" className="mt-5 inline-block rounded-xl bg-amber-400 px-5 py-3 font-black text-black">Practice This Flow</Link>
        </div>
      </section>

      <section className="border-t border-emerald-900/70 bg-black/25">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Ready for a full betting system?</h2>
            <p className="mt-1 text-sm font-medium text-emerald-50/55">Strategy Mode coaches each next move and highlights the matching table location.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/strategies" className="rounded-lg border border-cyan-700/70 bg-cyan-950/25 px-4 py-2.5 text-sm font-black text-cyan-200">Explore Strategies</Link>
            <Link href="/table" className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-black text-black">Open Strategy Mode</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
