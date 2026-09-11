import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Craps Strategies Explained",
  description:
    "Explore common craps approaches including 3-Point Molly, Iron Cross, Place 6 and 8, and Pass Line with odds.",
  alternates: { canonical: "/strategies" },
};

const strategies = [
  {
    name: "3-Point Molly",
    type: "Pass + Come",
    detail:
      "Build three light-side contract numbers using Pass, Come bets, and odds.",
  },
  {
    name: "3-Point Dolly",
    type: "Don't + DC",
    detail:
      "The dark-side mirror of the Molly using Don't Pass, Don't Come, and lay odds.",
  },
  {
    name: "Iron Cross",
    type: "Field + 5/6/8",
    detail:
      "Combine the Field with Place 5, 6, and 8 to cover many common totals.",
  },
  {
    name: "Place 6 & 8",
    type: "Simple",
    detail:
      "Focus on two of the most commonly rolled place-bet numbers.",
  },
  {
    name: "Inside Numbers",
    type: "5/6/8/9",
    detail:
      "Cover the four inside box numbers with Place bets sized to the table minimum.",
  },
  {
    name: "Pass Line + Max Odds",
    type: "Low complexity",
    detail:
      "A straightforward Pass Line approach that takes the full available odds.",
  },
  {
    name: "Don't Pass + Lay Odds",
    type: "Dark side",
    detail:
      "A simple Don't Pass approach backed by the available lay odds.",
  },
];

export default function StrategiesPage() {
  return (
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader active="learn" />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
            Lucky Penny Gaming • Craps Strategy Mode
          </div>
          <h1 className="mt-2 text-4xl font-black text-[#0d3525] sm:text-5xl">
            Learn the sequence while you play.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-700">
            Craps Strategy Mode does not promise a profitable system. It is a
            coach: choose an approach, place each wager yourself, and Lucky Penny
            Gaming will identify the next move and highlight the corresponding
            table area.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {strategies.map((strategy) => (
            <article
              key={strategy.name}
              className="rounded-2xl border border-sky-200 bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black text-[#123b2a]">{strategy.name}</h2>
                <span className="shrink-0 rounded border border-sky-300 bg-sky-50 px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em] text-sky-800">
                  {strategy.type}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                {strategy.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="text-xl font-black text-amber-900">
            A strategy does not remove the house advantage.
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-amber-950/75">
            Betting systems organize decisions and can change volatility, but
            they do not make independent dice rolls predictable. Lucky Penny
            Gaming presents Strategy Mode as a learning tool, not as a guarantee
            of profit.
          </p>
        </div>
      </div>
    </main>
  );
}
