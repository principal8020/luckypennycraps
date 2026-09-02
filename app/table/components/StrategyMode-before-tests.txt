"use client";

import { useMemo, useState } from "react";
import {
  getPassOddsMultiplier,
  properSixEightAmount,
} from "../crapsRules";

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

type Recommendation = {
  action: string;
  why: string;
  status: string;
};

const pointNumbers = [4, 5, 6, 8, 9, 10];

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

function activeNumbers(bets: NumberBets) {
  return pointNumbers.filter((number) => (bets[number] ?? 0) > 0);
}

function firstOddsShortfall(
  bets: NumberBets,
  odds: NumberBets,
  kind: "pass" | "dont"
) {
  for (const number of activeNumbers(bets)) {
    const flatBet = bets[number] ?? 0;
    const maxOdds =
      kind === "pass" ? flatBet * getPassOddsMultiplier(number) : flatBet * 6;
    const currentOdds = odds[number] ?? 0;

    if (currentOdds < maxOdds) {
      return {
        number,
        remaining: maxOdds - currentOdds,
      };
    }
  }

  return null;
}

function recommendationFor(
  strategy: StrategyId,
  props: StrategyModeProps,
  tableMinimum: number
): Recommendation {
  const {
    bankroll,
    point,
    passLineBet,
    passOddsBet,
    dontPassBet,
    dontPassOddsBet,
    activeComeBet,
    comeBets,
    comeOdds,
    activeDontComeBet,
    dontComeBets,
    dontComeOdds,
    placeBets,
    fieldBet,
  } = props;

  const unit = tableMinimum;
  const comePoints = activeNumbers(comeBets);
  const dontComePoints = activeNumbers(dontComeBets);

  if (strategy === "three-point-molly") {
    if (point === null) {
      if (passLineBet <= 0) {
        return {
          action: `Bet $${money(unit)} on PASS LINE.`,
          why: "The Molly begins with the Pass Line on the come-out roll.",
          status: "Waiting to start point 1 of 3.",
        };
      }

      return {
        action: "ROLL to establish the Pass Line point.",
        why: "Once the point turns ON, the next step is to add maximum odds.",
        status: "Pass Line is ready for the come-out roll.",
      };
    }

    if (passLineBet <= 0) {
      return {
        action: "Wait for the next come-out roll, then begin with PASS LINE.",
        why: "A new Pass Line bet cannot be started after the point is already ON.",
        status: "You joined this hand after the Molly's starting step.",
      };
    }

    const maxPassOdds = passLineBet * getPassOddsMultiplier(point);
    if (passOddsBet < maxPassOdds) {
      return {
        action: `Add $${money(maxPassOdds - passOddsBet)} more PASS ODDS.`,
        why: `The Molly backs the Pass point with the table's maximum odds before adding more Come points.`,
        status: `Point ${point}: $${money(passOddsBet)} of $${money(maxPassOdds)} Pass odds placed.`,
      };
    }

    const comeOddsShortfall = firstOddsShortfall(comeBets, comeOdds, "pass");
    if (comeOddsShortfall) {
      return {
        action: `Add $${money(comeOddsShortfall.remaining)} more COME ODDS on ${comeOddsShortfall.number}.`,
        why: "Each traveled Come bet should be backed with maximum odds before building the next point.",
        status: `${1 + comePoints.length} of 3 contract numbers established.`,
      };
    }

    const coverage = 1 + comePoints.length;
    if (coverage >= 3) {
      return {
        action: "HOLD and roll. Do not add a fourth contract number.",
        why: "The 3-Point Molly is fully built. When one contract number resolves, use a new Come bet to rebuild to three.",
        status: "3 of 3 contract numbers established with odds.",
      };
    }

    if (activeComeBet > 0) {
      return {
        action: "ROLL to resolve the COME bet currently in the Come box.",
        why: "If it travels to a box number, the next step will be to add odds behind it.",
        status: `${coverage} of 3 contract numbers established; one Come bet is traveling.`,
      };
    }

    return {
      action: `Bet $${money(unit)} in COME.`,
      why: "Add one Come bet at a time until the Pass point plus Come points total three contract numbers.",
      status: `${coverage} of 3 contract numbers established.`,
    };
  }

  if (strategy === "three-point-dolly") {
    if (point === null) {
      if (dontPassBet <= 0) {
        return {
          action: `Bet $${money(unit)} on DON'T PASS.`,
          why: "The Dolly begins on the dark side with Don't Pass during the come-out roll.",
          status: "Waiting to start point 1 of 3.",
        };
      }

      return {
        action: "ROLL to establish the Don't Pass point.",
        why: "After the point turns ON, the next step is to lay maximum odds.",
        status: "Don't Pass is ready for the come-out roll.",
      };
    }

    if (dontPassBet <= 0) {
      return {
        action: "Wait for the next come-out roll, then begin with DON'T PASS.",
        why: "A new Don't Pass bet cannot be started after the point is already ON.",
        status: "You joined this hand after the Dolly's starting step.",
      };
    }

    const maxDontPassOdds = dontPassBet * 6;
    if (dontPassOddsBet < maxDontPassOdds) {
      return {
        action: `Add $${money(maxDontPassOdds - dontPassOddsBet)} more DON'T PASS LAY ODDS.`,
        why: "The Dolly mirrors the Molly by backing the first contract number with the available lay odds.",
        status: `Point ${point}: $${money(dontPassOddsBet)} of $${money(maxDontPassOdds)} lay odds placed.`,
      };
    }

    const dontComeOddsShortfall = firstOddsShortfall(
      dontComeBets,
      dontComeOdds,
      "dont"
    );
    if (dontComeOddsShortfall) {
      return {
        action: `Add $${money(dontComeOddsShortfall.remaining)} more DON'T COME LAY ODDS behind ${dontComeOddsShortfall.number}.`,
        why: "Back each traveled Don't Come bet with the available lay odds before adding the next Don't Come bet.",
        status: `${1 + dontComePoints.length} of 3 dark-side contract numbers established.`,
      };
    }

    const coverage = 1 + dontComePoints.length;
    if (coverage >= 3) {
      return {
        action: "HOLD and roll. Do not add a fourth contract number.",
        why: "The 3-Point Dolly is fully built. When one contract number resolves, use a new Don't Come bet to rebuild to three.",
        status: "3 of 3 dark-side contract numbers established with lay odds.",
      };
    }

    if (activeDontComeBet > 0) {
      return {
        action: "ROLL to resolve the DON'T COME bet currently in the Don't Come box.",
        why: "If it travels behind a box number, the next step will be to add lay odds.",
        status: `${coverage} of 3 dark-side contract numbers established; one Don't Come bet is traveling.`,
      };
    }

    return {
      action: `Bet $${money(unit)} in DON'T COME.`,
      why: "Add one Don't Come bet at a time until Don't Pass plus Don't Come points total three contract numbers.",
      status: `${coverage} of 3 dark-side contract numbers established.`,
    };
  }

  if (strategy === "pass-max-odds") {
    if (point === null) {
      return passLineBet > 0
        ? {
            action: "ROLL the come-out roll.",
            why: "Your Pass Line bet is in place; wait for it to win, lose, or establish a point.",
            status: `Pass Line: $${money(passLineBet)}.`,
          }
        : {
            action: `Bet $${money(unit)} on PASS LINE.`,
            why: "This strategy begins with one Pass Line contract bet.",
            status: "Ready for a new come-out bet.",
          };
    }

    if (passLineBet <= 0) {
      return {
        action: "Wait for the next come-out roll.",
        why: "Pass Line cannot be added after the point is ON.",
        status: `Point ${point} is already established without a Pass Line bet.`,
      };
    }

    const maxOdds = passLineBet * getPassOddsMultiplier(point);
    if (passOddsBet < maxOdds) {
      return {
        action: `Add $${money(maxOdds - passOddsBet)} more PASS ODDS.`,
        why: "Fill the remaining 3x-4x-5x odds behind the Pass Line bet.",
        status: `$${money(passOddsBet)} of $${money(maxOdds)} Pass odds placed.`,
      };
    }

    return {
      action: "HOLD and roll until the Pass Line contract resolves.",
      why: "The Pass Line bet is fully backed with the table's maximum odds.",
      status: `Point ${point} with full odds.`,
    };
  }

  if (strategy === "dont-pass-lay-odds") {
    if (point === null) {
      return dontPassBet > 0
        ? {
            action: "ROLL the come-out roll.",
            why: "Your Don't Pass bet is in place; wait for it to resolve or establish a point.",
            status: `Don't Pass: $${money(dontPassBet)}.`,
          }
        : {
            action: `Bet $${money(unit)} on DON'T PASS.`,
            why: "This strategy begins with one Don't Pass contract bet.",
            status: "Ready for a new come-out bet.",
          };
    }

    if (dontPassBet <= 0) {
      return {
        action: "Wait for the next come-out roll.",
        why: "Don't Pass cannot be added after the point is ON.",
        status: `Point ${point} is already established without a Don't Pass bet.`,
      };
    }

    const maxOdds = dontPassBet * 6;
    if (dontPassOddsBet < maxOdds) {
      return {
        action: `Add $${money(maxOdds - dontPassOddsBet)} more DON'T PASS LAY ODDS.`,
        why: "Fill the remaining lay-odds allowance behind the Don't Pass bet.",
        status: `$${money(dontPassOddsBet)} of $${money(maxOdds)} lay odds placed.`,
      };
    }

    return {
      action: "HOLD and roll until the Don't Pass contract resolves.",
      why: "The Don't Pass bet is fully backed with the available lay odds.",
      status: `Point ${point} with full lay odds.`,
    };
  }

  if (point === null) {
    return {
      action: "ROLL until a box-number point is established.",
      why: "This place-bet strategy begins after the come-out roll so the box-number wagers can work with the point ON.",
      status: "Waiting for the puck to turn ON.",
    };
  }

  if (strategy === "place-6-8") {
    const target = properSixEightAmount(unit);

    for (const number of [6, 8]) {
      const current = placeBets[number] ?? 0;
      if (current < target) {
        return {
          action: `Add $${money(target - current)} to PLACE ${number}.`,
          why: `At a $${money(unit)} table minimum, Lucky Penny targets the proper $${money(target)} amount on both 6 and 8.`,
          status: `Place 6: $${money(placeBets[6] ?? 0)} • Place 8: $${money(placeBets[8] ?? 0)}.`,
        };
      }
    }

    return {
      action: "HOLD and roll with Place 6 and 8 working.",
      why: "Both target Place bets are established. Collecting or pressing beyond this point is a player choice, not part of v1 guidance.",
      status: `6 and 8 are both at the $${money(target)} target.`,
    };
  }

  if (strategy === "inside") {
    const targets: Record<number, number> = {
      5: unit,
      6: properSixEightAmount(unit),
      8: properSixEightAmount(unit),
      9: unit,
    };

    for (const number of [5, 6, 8, 9]) {
      const current = placeBets[number] ?? 0;
      if (current < targets[number]) {
        return {
          action: `Add $${money(targets[number] - current)} to PLACE ${number}.`,
          why: "Build the four inside numbers one at a time from the selected table minimum; 6 and 8 use the proper multiple of $6.",
          status: `Targets — 5: $${money(targets[5])}, 6: $${money(targets[6])}, 8: $${money(targets[8])}, 9: $${money(targets[9])}.`,
        };
      }
    }

    return {
      action: "HOLD and roll with all four inside numbers working.",
      why: "The initial Inside setup is complete.",
      status: "5, 6, 8 and 9 are at their target amounts.",
    };
  }

  const ironFive = unit;
  const ironSixEight = properSixEightAmount(unit);
  const ironTargets: Record<number, number> = {
    5: ironFive,
    6: ironSixEight,
    8: ironSixEight,
  };

  for (const number of [5, 6, 8]) {
    const current = placeBets[number] ?? 0;
    if (current < ironTargets[number]) {
      return {
        action: `Add $${money(ironTargets[number] - current)} to PLACE ${number}.`,
        why: "Build the Place-bet side of the Iron Cross before completing the Field coverage.",
        status: `Target setup — 5: $${money(ironFive)}, 6/8: $${money(ironSixEight)}, Field: $${money(unit)}.`,
      };
    }
  }

  if (fieldBet < unit) {
    return {
      action: `Add $${money(unit - fieldBet)} to the FIELD.`,
      why: "The Field completes the Iron Cross coverage around Place 5, 6 and 8.",
      status: `Place 5/6/8 are set; Field currently $${money(fieldBet)} of $${money(unit)}.`,
    };
  }

  return {
    action: "HOLD and roll. Replace the Field if a non-Field result removes it.",
    why: "The initial Iron Cross setup is complete: Field plus Place 5, 6 and 8.",
    status: `5: $${money(placeBets[5] ?? 0)} • 6: $${money(placeBets[6] ?? 0)} • 8: $${money(placeBets[8] ?? 0)} • Field: $${money(fieldBet)}.`,
  };
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
