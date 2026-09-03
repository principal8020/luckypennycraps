import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#03130e] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-bold text-emerald-300 hover:text-white"
        >
          ← Lucky Penny Craps
        </Link>

        <div className="mt-8 rounded-3xl border border-emerald-900/80 bg-black/25 p-6 sm:p-9">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
            About
          </div>
          <h1 className="mt-2 text-4xl font-black">Why Lucky Penny exists</h1>

          <div className="mt-6 space-y-5 text-base font-medium leading-7 text-emerald-50/70">
            <p>
              Craps is one of the most exciting games in a casino — and one of
              the hardest to learn by watching from the rail. The table is
              crowded, the terminology is unfamiliar, and many bets behave
              differently depending on whether a point is established.
            </p>

            <p>
              Lucky Penny Craps is being built as a practice-first way to learn
              the game. You can place wagers on a playable table, see how they
              resolve, control rolls in Practice Mode, follow guided strategies,
              and review what happened after each roll.
            </p>

            <p>
              The goal is not to promise winning systems. Craps remains a game
              with a house advantage. The goal is to help players understand
              the rules, make informed betting decisions, and feel comfortable
              with the flow of the table.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Practice", "Recreate rolls and common table situations."],
              ["Play", "Use the simulator like a normal craps table."],
              ["Learn", "Follow strategies and understand each next move."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-emerald-900/70 bg-emerald-950/20 p-4"
              >
                <div className="font-black text-amber-300">{title}</div>
                <p className="mt-2 text-sm leading-6 text-emerald-50/60">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-900/50 bg-amber-950/15 p-4 text-sm leading-6 text-amber-100/70">
            Lucky Penny uses practice credits only. It does not accept real-money
            wagers or award cash prizes.
          </div>

          <Link
            href="/table"
            className="mt-7 inline-block rounded-xl bg-amber-400 px-5 py-3 font-black text-black"
          >
            Open the Table
          </Link>
        </div>
      </div>
    </main>
  );
}
