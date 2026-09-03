"use client";

import { useMemo, useState } from "react";
import {
  recommendationFor,
  type StrategyId,
} from "../strategyRules";

type NumberBets = Record<number, number>;

export type StrategyId =
  | "three-point-molly"
  | "three-point-dolly"
  | "iron-cross"
  | "place-6-8"
  | "inside"
  | "pass-max-odds"
  | "dont-pass-lay-odds";

type StrategyModeProps = {
  bankroll: number;
  totalOnTable: number;
  rollCount: number;
  point: number | null;
  selectedChip: number;
  passLineBet: number;
  passOddsBet: number;
  dontPassBet: number;
  dontPassOddsBet: number;
  activeComeBet: number;
  comeBets: NumberBets;
  comeOdds: NumberBets;
  activeDontComeBet: number;
  dontComeBets: NumberBets;
  dontComeOdds: NumberBets;
  placeBets: NumberBets;
  fieldBet: number;
};

type StrategyDefinition = {
  id: StrategyId;
  name: string;
  badge: string;
  description: string;
  rules: string[];
};


const strategies: StrategyDefinition[] = [
  {
    id: "three-point-molly",
    name: "3-Point Molly",
    badge: "PASS + COME",
    description: "Build three light-side contract numbers using Pass, Come and odds.",
    rules: [
      "Start with a Pass Line bet on the come-out roll.",
      "After a point is established, take maximum odds.",
      "Add Come bets until the Pass point plus Come points cover three numbers; back each Come point with maximum odds.",
    ],
  },
  {
    id: "three-point-dolly",
    name: "3-Point Dolly",
    badge: "DON'T + DC",
    description: "The dark-side mirror of the Molly using Don't Pass, Don't Come and lay odds.",
    rules: [
      "Start with a Don't Pass bet on the come-out roll.",
      "After a point is established, lay maximum odds behind Don't Pass.",
      "Add Don't Come bets until three contract numbers are established; lay maximum odds behind each traveled Don't Come bet.",
    ],
  },
  {
    id: "iron-cross",
    name: "Iron Cross",
    badge: "FIELD + 5/6/8",
    description: "Cover the Field together with Place 5, 6 and 8.",
    rules: [
      "Wait until a point is established.",
      "Use the table minimum on 5 and the Field; size 6 and 8 to the proper multiple of $6.",
      "Keep a Field wager up; replace it after a non-Field result removes it.",
    ],
  },
  {
    id: "place-6-8",
    name: "Place 6 & 8",
    badge: "SIMPLE",
    description: "Focus only on the two most common place-bet numbers.",
    rules: [
      "Wait until a point is established.",
      "Place both 6 and 8.",
      "Collect wins and keep the bets working unless you intentionally change the strategy.",
    ],
  },
  {
    id: "inside",
    name: "Inside Numbers",
    badge: "5/6/8/9",
    description: "Cover the four inside box numbers with Place bets.",
    rules: [
      "Wait until a point is established.",
      "Place 5, 6, 8 and 9.",
      "Use the table minimum on 5 and 9; size 6 and 8 to the proper multiple of $6.",
    ],
  },
  {
    id: "pass-max-odds",
    name: "Pass Line + Max Odds",
    badge: "LOW COMPLEXITY",
    description: "A straightforward Pass Line approach with full available odds.",
    rules: [
      "Bet Pass Line before the come-out roll.",
      "When a point is established, take the table's maximum 3x-4x-5x odds.",
      "Wait for the contract bet to resolve before starting again.",
    ],
  },
  {
    id: "dont-pass-lay-odds",
    name: "Don't Pass + Lay Odds",
    badge: "DARK SIDE",
    description: "A simple Don't Pass approach backed with the available lay odds.",
    rules: [
      "Bet Don't Pass before the come-out roll.",
      "When a point is established, lay the maximum available odds.",
      "Wait for the contract bet to resolve before starting again.",
    ],
  },
];

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

export function StrategyMode(props: StrategyModeProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyId | null>(null);
  const [tableMinimum, setTableMinimum] = useState(5);
  const [startEquity, setStartEquity] = useState(
    props.bankroll + props.totalOnTable
  );
  const [startRollCount, setStartRollCount] = useState(props.rollCount);

  const currentStrategy = strategies.find(
    (strategy) => strategy.id === selectedStrategy
  );

  const recommendation = useMemo(
    () =>
      selectedStrategy
        ? recommendationFor(selectedStrategy, props, tableMinimum)
        : null,
    [selectedStrategy, props, tableMinimum]
  );

  const strategyPL = props.bankroll + props.totalOnTable - startEquity;
  const strategyRolls = Math.max(0, props.rollCount - startRollCount);

  function selectStrategy(id: StrategyId) {
    setSelectedStrategy(id);
    setStartEquity(props.bankroll + props.totalOnTable);
    setStartRollCount(props.rollCount);
  }

  function resetTracking() {
    setStartEquity(props.bankroll + props.totalOnTable);
    setStartRollCount(props.rollCount);
  }

  return (
    <section className="mt-2 rounded-xl border border-cyan-900/70 bg-black/25 px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-950/80 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg border border-cyan-700/70 bg-cyan-950/30 px-4 py-2.5 text-[12px] font-black uppercase tracking-[0.14em] text-cyan-100">
            Strategy Mode
          </span>
          <span className="text-[11px] font-bold text-cyan-200/75">
            Learn the sequence while you play • Practice Mode can be used at the same time
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-cyan-900/70 bg-black/20 px-3 py-2">
          <span className="mr-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-300">
            Table Minimum
          </span>
          {[5, 10, 25].map((minimum) => (
            <button
              key={minimum}
              onClick={() => setTableMinimum(minimum)}
              aria-pressed={tableMinimum === minimum}
              className={`min-w-12 rounded-md border px-3 py-1.5 text-[11px] font-black transition ${
                tableMinimum === minimum
                  ? "border-cyan-200 bg-cyan-600 text-black"
                  : "border-cyan-900/80 bg-cyan-950/20 text-cyan-200 hover:border-cyan-600"
              }`}
            >
              ${minimum}
            </button>
          ))}
          <span className="ml-1 text-[9px] font-bold text-cyan-200/60">
            Strategy bet sizing
          </span>
        </div>
      </div>

      <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {strategies.map((strategy) => {
          const active = strategy.id === selectedStrategy;

          return (
            <button
              key={strategy.id}
              onClick={() => selectStrategy(strategy.id)}
              className={`rounded-lg border px-4 py-3 text-left transition ${
                active
                  ? "border-cyan-300 bg-cyan-900/45 shadow-[0_0_18px_rgba(34,211,238,.12)]"
                  : "border-cyan-950/90 bg-cyan-950/10 hover:border-cyan-700 hover:bg-cyan-950/25"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-black uppercase tracking-[0.06em] text-white">
                  {strategy.name}
                </span>
                <span className="rounded border border-cyan-900/80 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-cyan-200/80">
                  {strategy.badge}
                </span>
              </span>
              <span className="mt-1.5 block text-[10px] font-semibold leading-relaxed text-cyan-100/70">
                {strategy.description}
              </span>
            </button>
          );
        })}
      </div>

      {currentStrategy && recommendation && (
        <div className="mt-2 grid gap-2 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-lg border border-cyan-700/55 bg-cyan-950/15 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                  Next Move
                </p>
                <p className="mt-1.5 text-lg font-black leading-snug text-cyan-50">
                  {recommendation.action}
                </p>
              </div>

              <button
                onClick={() => setSelectedStrategy(null)}
                className="rounded border border-zinc-700 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-zinc-300 hover:border-zinc-500 hover:text-white"
              >
                Exit Strategy
              </button>
            </div>

            <p className="mt-2 text-[12px] font-semibold leading-relaxed text-cyan-100/80">
              {recommendation.why}
            </p>

            <div className="mt-3 rounded-md border border-cyan-950/90 bg-black/20 px-3 py-2.5 text-[11px] font-bold text-cyan-200/75">
              {recommendation.status}
            </div>
          </div>

          <div className="rounded-lg border border-cyan-950/90 bg-black/15 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                {currentStrategy.name} Tracker
              </p>
              <button
                onClick={resetTracking}
                className="rounded border border-cyan-900/80 px-3 py-1.5 text-[9px] font-black uppercase text-cyan-200/80 hover:border-cyan-600"
              >
                Restart Tracking
              </button>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-md border border-white/10 bg-black/20 px-2 py-2">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-cyan-400">
                  Strategy P/L
                </p>
                <p
                  className={`mt-1 text-sm font-black ${
                    strategyPL > 0
                      ? "text-emerald-300"
                      : strategyPL < 0
                        ? "text-red-300"
                        : "text-white"
                  }`}
                >
                  {strategyPL > 0 ? "+" : strategyPL < 0 ? "-" : ""}${money(Math.abs(strategyPL))}
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-black/20 px-2 py-2">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-cyan-400">
                  Rolls
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {strategyRolls}
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-black/20 px-2 py-2">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-cyan-400">
                  Table Minimum
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  ${money(tableMinimum)}
                </p>
              </div>
            </div>

            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-400">
                Strategy sequence
              </p>
              <ol className="space-y-1.5 text-[11px] font-semibold leading-relaxed text-cyan-100/75">
                {currentStrategy.rules.map((rule, index) => (
                  <li key={rule}>
                    <span className="mr-1.5 font-black text-cyan-400">
                      {index + 1}.
                    </span>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {!selectedStrategy && (
        <p className="mt-3 text-center text-[11px] font-bold text-cyan-200/65">
          Choose a strategy above. Lucky Penny will watch the table and tell you the next step; you still place every wager yourself.
        </p>
      )}

      <p className="mt-3 text-center text-[9px] text-zinc-500">
        Strategy systems organize betting decisions; they do not guarantee a profit or remove the casino advantage.
      </p>
    </section>
  );
}
