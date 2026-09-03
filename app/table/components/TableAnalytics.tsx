"use client";

import { useMemo, useState } from "react";
import {
  RollHistory,
  type RollHistoryItem,
} from "./RollHistory";

type AnalyticsTab = "history" | "distribution" | "shooter";
type DistributionFilter = "all" | "puckOn" | "puckOff";

type TableAnalyticsProps = {
  message: string;
  rollHistory: RollHistoryItem[];
  rollCount: number;
  sessionPL: number;
};

const totals = Array.from({ length: 11 }, (_, index) => index + 2);
const ways: Record<number, number> = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 5,
  9: 4,
  10: 3,
  11: 2,
  12: 1,
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function isBoxNumber(total: number) {
  return [4, 5, 6, 8, 9, 10].includes(total);
}

function isHardway(roll: RollHistoryItem) {
  return (
    roll.first === roll.second &&
    [4, 6, 8, 10].includes(roll.total)
  );
}

function currentHandRolls(history: RollHistoryItem[]) {
  const sevenOutIndex = history.findIndex(
    (roll) => roll.event === "sevenOut"
  );

  if (sevenOutIndex === 0) return [];
  return sevenOutIndex < 0 ? history : history.slice(0, sevenOutIndex);
}

type HandSummary = {
  shooter: number;
  rolls: number;
  points: number;
  boxHits: number;
  hardways: number;
  net: number;
  completed: boolean;
};

function buildHands(history: RollHistoryItem[]) {
  const chronological = [...history].reverse();
  const hands: HandSummary[] = [];
  let shooter = 1;
  let current: HandSummary = {
    shooter,
    rolls: 0,
    points: 0,
    boxHits: 0,
    hardways: 0,
    net: 0,
    completed: false,
  };

  for (const roll of chronological) {
    current.rolls += 1;
    current.net += roll.net ?? 0;

    if (roll.event === "pointMade") {
      current.points += 1;
    }

    if (isBoxNumber(roll.total)) {
      current.boxHits += 1;
    }

    if (isHardway(roll)) {
      current.hardways += 1;
    }

    if (roll.event === "sevenOut") {
      current.completed = true;
      hands.push(current);
      shooter += 1;
      current = {
        shooter,
        rolls: 0,
        points: 0,
        boxHits: 0,
        hardways: 0,
        net: 0,
        completed: false,
      };
    }
  }

  if (current.rolls > 0 || hands.length === 0) {
    hands.push(current);
  }

  return hands;
}

export function TableAnalytics({
  message,
  rollHistory,
  rollCount,
  sessionPL,
}: TableAnalyticsProps) {
  const [tab, setTab] = useState<AnalyticsTab>("history");
  const [filter, setFilter] = useState<DistributionFilter>("all");

  const filteredRolls = useMemo(() => {
    if (filter === "puckOn") {
      return rollHistory.filter((roll) => roll.pointBefore !== null);
    }

    if (filter === "puckOff") {
      return rollHistory.filter((roll) => roll.pointBefore === null);
    }

    return rollHistory;
  }, [rollHistory, filter]);

  const distribution = useMemo(() => {
    const counts = Object.fromEntries(totals.map((total) => [total, 0])) as Record<
      number,
      number
    >;

    for (const roll of filteredRolls) {
      counts[roll.total] += 1;
    }

    const expected = Object.fromEntries(
      totals.map((total) => [
        total,
        (filteredRolls.length * ways[total]) / 36,
      ])
    ) as Record<number, number>;

    const maxValue = Math.max(
      1,
      ...totals.map((total) =>
        Math.max(counts[total], expected[total])
      )
    );

    return {
      counts,
      expected,
      maxValue,
    };
  }, [filteredRolls]);

  const handStats = useMemo(() => {
    const hands = buildHands(rollHistory);
    const current = hands[hands.length - 1];
    const completed = hands.filter((hand) => hand.completed);
    const handsWithRolls = hands.filter((hand) => hand.rolls > 0);

    const sevenTotals = rollHistory.filter(
      (roll) => roll.total === 7
    ).length;
    const sevenOuts = rollHistory.filter(
      (roll) => roll.event === "sevenOut"
    ).length;
    const pointsMade = rollHistory.filter(
      (roll) => roll.event === "pointMade"
    ).length;
    const boxHits = rollHistory.filter((roll) =>
      isBoxNumber(roll.total)
    ).length;
    const hardways = rollHistory.filter(isHardway).length;

    const completedAverage =
      completed.length > 0
        ? completed.reduce((sum, hand) => sum + hand.rolls, 0) /
          completed.length
        : 0;

    return {
      hands,
      current,
      completed,
      handsWithRolls,
      longestHand:
        handsWithRolls.length > 0
          ? Math.max(...handsWithRolls.map((hand) => hand.rolls))
          : 0,
      averageHand: completedAverage,
      sevenTotals,
      sevenOuts,
      pointsMade,
      boxHits,
      hardways,
      rollsPerSeven:
        sevenTotals > 0 ? rollCount / sevenTotals : null,
    };
  }, [rollHistory, rollCount]);

  return (
    <section className="relative mt-1 overflow-hidden border border-emerald-100/25 bg-black/[0.11] px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <span className="rounded bg-emerald-950/80 px-2 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300">
          Dealer Call
        </span>
        <p className="min-w-0 flex-1 text-[11px] font-semibold text-amber-200 sm:text-sm">
          {message}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-lg border border-emerald-900/80 bg-black/25 p-1">
          {(
            [
              ["history", "Roll History"],
              ["distribution", "Distribution"],
              ["shooter", "Shooter / Hands"],
            ] as Array<[AnalyticsTab, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`rounded-md px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] transition sm:text-[10px] ${
                tab === value
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-300/70 hover:bg-emerald-950/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.08em] text-emerald-500">
          <span>{rollCount} rolls</span>
          <span>•</span>
          <span
            className={
              sessionPL > 0
                ? "text-emerald-300"
                : sessionPL < 0
                  ? "text-red-300"
                  : "text-emerald-500"
            }
          >
            Session {sessionPL > 0 ? "+" : ""}${money(sessionPL)}
          </span>
        </div>
      </div>

      {tab === "history" && (
        <div className="mt-1">
          <RollHistory
            rollHistory={rollHistory}
            rollCount={rollCount}
          />
        </div>
      )}

      {tab === "distribution" && (
        <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-300">
                Roll Distribution
              </p>
              <p className="mt-0.5 text-[8px] font-bold text-emerald-100/45">
                Actual rolls compared with the mathematically expected count.
              </p>
            </div>

            <div className="flex rounded-lg border border-white/10 bg-black/25 p-1">
              {(
                [
                  ["all", "All"],
                  ["puckOn", "Puck On"],
                  ["puckOff", "Puck Off"],
                ] as Array<[DistributionFilter, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded px-2.5 py-1.5 text-[8px] font-black uppercase ${
                    filter === value
                      ? "bg-cyan-600 text-white"
                      : "text-zinc-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2 flex items-center gap-4 text-[8px] font-bold">
            <span className="flex items-center gap-1 text-cyan-200">
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-500" />
              Actual
            </span>
            <span className="flex items-center gap-1 text-amber-200">
              <span className="h-[2px] w-4 bg-amber-300" />
              Expected
            </span>
            <span className="ml-auto text-emerald-400">
              {filteredRolls.length} filtered rolls
            </span>
          </div>

          <div className="grid h-[175px] grid-cols-11 items-end gap-1 sm:gap-2">
            {totals.map((total) => {
              const actual = distribution.counts[total];
              const expected = distribution.expected[total];
              const actualHeight =
                (actual / distribution.maxValue) * 100;
              const expectedBottom =
                (expected / distribution.maxValue) * 100;

              return (
                <div
                  key={total}
                  className="relative flex h-full min-w-0 flex-col justify-end"
                >
                  <div className="relative flex-1">
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-sm bg-cyan-600/90"
                      style={{
                        height: `${Math.max(
                          actual > 0 ? 4 : 0,
                          actualHeight
                        )}%`,
                      }}
                    />
                    <div
                      className="absolute inset-x-[-2px] h-[2px] bg-amber-300 shadow-[0_0_5px_rgba(252,211,77,.55)]"
                      style={{
                        bottom: `${expectedBottom}%`,
                      }}
                    />
                    <span className="absolute inset-x-0 bottom-[calc(100%+2px)] text-center text-[8px] font-black text-white">
                      {actual > 0 ? actual : ""}
                    </span>
                  </div>

                  <div
                    className={`pt-1 text-center text-[9px] font-black ${
                      total === 7
                        ? "text-red-300"
                        : "text-amber-200"
                    }`}
                  >
                    {total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "shooter" && (
        <div className="mt-3 space-y-2">
          <div className="grid gap-2 lg:grid-cols-2">
            <div className="rounded-lg border border-amber-700/55 bg-amber-950/10 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-300">
                  Current Shooter #{handStats.current.shooter}
                </p>
                <div
                  className={`rounded-md border px-3 py-1.5 text-[11px] font-black ${
                    handStats.current.net > 0
                      ? "border-emerald-500/60 bg-emerald-950/30 text-emerald-300"
                      : handStats.current.net < 0
                        ? "border-red-500/60 bg-red-950/30 text-red-300"
                        : "border-white/10 bg-black/20 text-white/55"
                  }`}
                >
                  SHOOTER TOTAL{" "}
                  {handStats.current.net > 0 ? "+" : handStats.current.net < 0 ? "-" : ""}
                  ${money(Math.abs(handStats.current.net))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["Rolls", handStats.current.rolls],
                  ["Box Hits", handStats.current.boxHits],
                  ["Points Made", handStats.current.points],
                  ["Hardways", handStats.current.hardways],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-white/10 bg-black/25 px-2 py-2 text-center"
                  >
                    <p className="text-[7px] font-black uppercase tracking-[0.1em] text-amber-500">
                      {label}
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[8px] font-bold text-amber-100/45">
                A shooter ends only on a puck-ON 7 (seven-out). Come-out 7s remain part of the same shooter.
              </p>
            </div>

            <div className="rounded-lg border border-cyan-800/55 bg-cyan-950/10 p-3">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-300">
                Session Hands
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-md border border-white/10 bg-black/25 px-2 py-2 text-center">
                  <p className="text-[7px] font-black uppercase tracking-[0.1em] text-cyan-500">
                    Shooters
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {handStats.handsWithRolls.length}
                  </p>
                </div>

                <div className="rounded-md border border-white/10 bg-black/25 px-2 py-2 text-center">
                  <p className="text-[7px] font-black uppercase tracking-[0.1em] text-cyan-500">
                    Longest
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {handStats.longestHand}
                  </p>
                </div>

                <div className="rounded-md border border-white/10 bg-black/25 px-2 py-2 text-center">
                  <p className="text-[7px] font-black uppercase tracking-[0.1em] text-cyan-500">
                    Avg Hand
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {handStats.completed.length > 0
                      ? handStats.averageHand.toFixed(1)
                      : "—"}
                  </p>
                </div>

                <div className="rounded-md border border-white/10 bg-black/25 px-2 py-2 text-center">
                  <p className="text-[7px] font-black uppercase tracking-[0.1em] text-cyan-500">
                    Rolls / 7
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {handStats.rollsPerSeven
                      ? handStats.rollsPerSeven.toFixed(1)
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-bold text-cyan-100/55">
                <span>Seven-outs: {handStats.sevenOuts}</span>
                <span>Points made: {handStats.pointsMade}</span>
                <span>Box hits: {handStats.boxHits}</span>
                <span>Hardways: {handStats.hardways}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/20">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead className="border-b border-white/10 bg-black/25 text-[8px] font-black uppercase tracking-[0.1em] text-cyan-400">
                <tr>
                  <th className="px-3 py-2">Shooter</th>
                  <th className="px-3 py-2 text-right">Rolls</th>
                  <th className="px-3 py-2 text-right">Points</th>
                  <th className="px-3 py-2 text-right">Box Hits</th>
                  <th className="px-3 py-2 text-right">Hardways</th>
                  <th className="px-3 py-2 text-right">Net</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...handStats.hands].reverse().map((hand) => (
                  <tr
                    key={hand.shooter}
                    className="border-b border-white/5 text-[10px] font-semibold text-white/80 last:border-b-0"
                  >
                    <td className="px-3 py-2.5 font-black text-white">
                      Shooter {hand.shooter}
                    </td>
                    <td className="px-3 py-2.5 text-right">{hand.rolls}</td>
                    <td className="px-3 py-2.5 text-right">{hand.points}</td>
                    <td className="px-3 py-2.5 text-right">{hand.boxHits}</td>
                    <td className="px-3 py-2.5 text-right">{hand.hardways}</td>
                    <td
                      className={`px-3 py-2.5 text-right font-black ${
                        hand.net > 0
                          ? "text-emerald-300"
                          : hand.net < 0
                            ? "text-red-300"
                            : "text-white/50"
                      }`}
                    >
                      {hand.net > 0 ? "+" : hand.net < 0 ? "-" : ""}
                      ${money(Math.abs(hand.net))}
                    </td>
                    <td className="px-3 py-2.5 text-right text-[8px] font-black uppercase tracking-[0.08em]">
                      <span
                        className={
                          hand.completed
                            ? "text-zinc-500"
                            : "text-amber-300"
                        }
                      >
                        {hand.completed ? "Complete" : "Current"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
