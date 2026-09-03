import Link from "next/link";

const steps = [
  {
    title: "1. Start with the puck OFF",
    body: "A new round begins with a come-out roll. Pass Line and Don't Pass are the two classic starting contract bets.",
  },
  {
    title: "2. Establish a point",
    body: "If the come-out roll is 4, 5, 6, 8, 9, or 10, that number becomes the point and the puck turns ON.",
  },
  {
    title: "3. Resolve the contract",
    body: "For a Pass Line bet, rolling the point again before a 7 wins. A 7 before the point is a seven-out. Don't Pass generally works in the opposite direction.",
  },
  {
    title: "4. Add other bets",
    body: "Place bets, Come/Don't Come, Field, Hardways, proposition bets and odds can all be practiced directly on the Lucky Penny table.",
  },
];

const starterBets = [
  ["Pass Line", "Simple starting bet that follows the point cycle."],
  ["Pass Line + Odds", "Once a point is established, odds pay true odds and carry no additional house edge."],
  ["Place 6 & 8", "Common place bets that are easy to follow while learning table flow."],
  ["Come", "Works like a new Pass Line bet after the point is established, then travels to its own number."],
];

export default function HowToPlayPage() {
  return (
    <main className="min-h-screen bg-[#03130e] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-bold text-emerald-300 hover:text-white"
          >
            ← Home
          </Link>
          <Link
            href="/table"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-black text-black"
          >
            Practice It
          </Link>
        </div>

        <div className="mt-8">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
            Craps basics
          </div>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            How a craps round works
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-emerald-50/65">
            You do not need to learn every wager at once. Start by understanding
            the puck, the point, and the Pass Line cycle. The rest of the table
            becomes much easier after that.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5"
            >
              <h2 className="text-lg font-black text-emerald-100">
                {step.title}
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-emerald-50/60">
                {step.body}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
            Good starting bets to learn
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-900/80">
            {starterBets.map(([name, detail]) => (
              <div
                key={name}
                className="grid gap-1 border-b border-emerald-900/50 bg-emerald-950/15 px-5 py-4 last:border-b-0 sm:grid-cols-[180px_1fr]"
              >
                <div className="font-black text-amber-300">{name}</div>
                <div className="text-sm leading-6 text-emerald-50/65">
                  {detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-cyan-900/70 bg-cyan-950/15 p-5">
          <h2 className="text-xl font-black">Use Practice Mode</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-cyan-50/65">
            Lucky Penny can force totals, exact dice combinations, point states,
            and preset scenarios. That makes it possible to practice a specific
            outcome repeatedly instead of waiting for random dice to produce it.
          </p>
          <Link
            href="/table"
            className="mt-4 inline-block font-black text-cyan-300 hover:text-white"
          >
            Open Practice Mode →
          </Link>
        </section>
      </div>
    </main>
  );
}
