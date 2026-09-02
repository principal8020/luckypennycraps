"use client";

export type DicePair = [number, number];

export type PracticeScenarioId =
  | "come-out"
  | "point-6-pass"
  | "place-68"
  | "come-travel"
  | "hard-8"
  | "seven-out";

type PracticeControlsProps = {
  testingMode: boolean;
  onToggleTestingMode: () => void;
  forcedTotal: number;
  onForcedTotalChange: (total: number) => void;
  forcedDice: DicePair | null;
  onForcedDiceChange: (dice: DicePair | null) => void;
  point: number | null;
  onPointChange: (point: number | null) => void;
  onLoadScenario: (scenario: PracticeScenarioId) => void;
};

const rollTotals = Array.from({ length: 11 }, (_, index) => index + 2);
const pointNumbers = [4, 5, 6, 8, 9, 10];

const scenarios: Array<{
  id: PracticeScenarioId;
  label: string;
  detail: string;
}> = [
  {
    id: "come-out",
    label: "Come-Out 7",
    detail: "Clean table • next roll 3+4",
  },
  {
    id: "point-6-pass",
    label: "Make Point 6",
    detail: "Point 6 • $25 Pass • next roll 6",
  },
  {
    id: "place-68",
    label: "Place 6 & 8",
    detail: "$30 each • point 6 • next roll 8",
  },
  {
    id: "come-travel",
    label: "Come Travels",
    detail: "$25 Come • point 6 • next roll 8",
  },
  {
    id: "hard-8",
    label: "Hard 8 Win",
    detail: "$25 Hard 8 • point 6 • next roll 4+4",
  },
  {
    id: "seven-out",
    label: "Seven-Out",
    detail: "$25 Pass + $30 6/8 • next roll 3+4",
  },
];

function combinationsForTotal(total: number): DicePair[] {
  const combinations: DicePair[] = [];

  for (let first = 1; first <= 6; first++) {
    for (let second = first; second <= 6; second++) {
      if (first + second === total) {
        combinations.push([first, second]);
      }
    }
  }

  return combinations;
}

function sameDice(a: DicePair | null, b: DicePair) {
  return Boolean(a && a[0] === b[0] && a[1] === b[1]);
}

export function PracticeControls({
  testingMode,
  onToggleTestingMode,
  forcedTotal,
  onForcedTotalChange,
  forcedDice,
  onForcedDiceChange,
  point,
  onPointChange,
  onLoadScenario,
}: PracticeControlsProps) {
  const exactCombinations = combinationsForTotal(forcedTotal);

  return (
    <section className="mt-2 rounded-xl border border-purple-900/70 bg-black/25 px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onToggleTestingMode}
          aria-pressed={testingMode}
          className={`rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition ${
            testingMode
              ? "border-purple-300 bg-purple-600 text-white shadow-[0_0_18px_rgba(168,85,247,.22)]"
              : "border-purple-700/70 bg-purple-950/20 text-purple-300 hover:bg-purple-950/40"
          }`}
        >
          Practice Mode {testingMode ? "ON" : "OFF"}
        </button>

        <span className="text-[8px] font-bold text-purple-300/70">
          {testingMode
            ? forcedDice
              ? `Next roll: ${forcedDice[0]} + ${forcedDice[1]} = ${forcedTotal}`
              : `Next roll total: ${forcedTotal} • combination random`
            : "Dice rolls are random"}
        </span>
      </div>

      {testingMode && (
        <div className="mt-2 border-t border-purple-900/50 pt-2">
          <div className="grid gap-2 xl:grid-cols-[1.1fr_1fr]">
            <div className="rounded-lg border border-purple-900/45 bg-purple-950/10 p-2">
              <div className="mb-2 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-purple-200">
                  Choose the next roll
                </p>
                <p className="mt-0.5 text-[8px] text-purple-300/60">
                  Pick a total, then optionally choose the exact two dice.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {rollTotals.map((number) => (
                  <button
                    key={number}
                    onClick={() => onForcedTotalChange(number)}
                    aria-pressed={forcedTotal === number}
                    className={`min-w-9 rounded-md border px-2.5 py-1.5 text-[10px] font-black transition ${
                      forcedTotal === number
                        ? "border-purple-200 bg-purple-500 text-white"
                        : "border-purple-900/80 bg-purple-950/20 text-purple-300 hover:border-purple-600 hover:bg-purple-950/45"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <div className="mt-2 border-t border-purple-900/40 pt-2">
                <p className="mb-1.5 text-center text-[8px] font-black uppercase tracking-[0.12em] text-purple-300/80">
                  Exact dice combination
                </p>

                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    onClick={() => onForcedDiceChange(null)}
                    aria-pressed={forcedDice === null}
                    className={`rounded-md border px-2.5 py-1.5 text-[8px] font-black transition ${
                      forcedDice === null
                        ? "border-cyan-300 bg-cyan-700/70 text-white"
                        : "border-cyan-900/70 bg-cyan-950/20 text-cyan-300 hover:border-cyan-600"
                    }`}
                  >
                    RANDOM COMBO
                  </button>

                  {exactCombinations.map((dice) => (
                    <button
                      key={`${dice[0]}-${dice[1]}`}
                      onClick={() => onForcedDiceChange(dice)}
                      aria-pressed={sameDice(forcedDice, dice)}
                      className={`rounded-md border px-2.5 py-1.5 text-[9px] font-black transition ${
                        sameDice(forcedDice, dice)
                          ? "border-amber-300 bg-amber-600/80 text-black"
                          : "border-amber-900/70 bg-amber-950/20 text-amber-200 hover:border-amber-600"
                      }`}
                    >
                      {dice[0]} + {dice[1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-purple-900/45 bg-purple-950/10 p-2">
              <div className="mb-2 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-purple-200">
                  Set the puck
                </p>
                <p className="mt-0.5 text-[8px] text-purple-300/60">
                  Changes the current point without changing existing bets.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  onClick={() => onPointChange(null)}
                  aria-pressed={point === null}
                  className={`rounded-md border px-2.5 py-1.5 text-[9px] font-black transition ${
                    point === null
                      ? "border-white bg-white text-black"
                      : "border-zinc-700 bg-black/20 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  COME-OUT
                </button>

                {pointNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => onPointChange(number)}
                    aria-pressed={point === number}
                    className={`min-w-9 rounded-md border px-2.5 py-1.5 text-[10px] font-black transition ${
                      point === number
                        ? "border-white bg-white text-black"
                        : "border-zinc-700 bg-black/20 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <div className="mt-2 text-center text-[8px] font-bold text-purple-300/65">
                Current state: {point === null ? "COME-OUT" : `POINT ${point} ON`}
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-purple-800/50 bg-black/15 p-2">
            <div className="mb-2 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-purple-200">
                Scenario trainer
              </p>
              <p className="mt-0.5 text-[8px] text-purple-300/60">
                These presets reset the table, preload the listed bets, and set the next roll.
              </p>
            </div>

            <div className="mx-auto grid max-w-[1000px] gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => onLoadScenario(scenario.id)}
                  className="rounded-lg border border-purple-800/65 bg-purple-950/20 px-3 py-2 text-left transition hover:border-purple-500 hover:bg-purple-950/40"
                >
                  <span className="block text-[9px] font-black uppercase tracking-[0.08em] text-purple-100">
                    {scenario.label}
                  </span>
                  <span className="mt-0.5 block text-[7px] font-bold text-purple-300/60">
                    {scenario.detail}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-2 text-center text-[8px] text-purple-300/55">
            Bets and payouts still resolve using the normal Lucky Penny rules — Practice Mode only controls the setup and dice.
          </p>
        </div>
      )}
    </section>
  );
}
