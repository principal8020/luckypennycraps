"use client";

import { useEffect, useRef, useState } from "react";
import { MiniDie } from "./TablePieces";

export type RollResolutionDetail = {
  text: string;
  result: "win" | "loss" | "info";
  amount?: number;
};

export type RollHistoryItem = {
  first: number;
  second: number;
  total: number;
  rollNumber?: number;
  event: "normal" | "pointSet" | "pointMade" | "sevenOut";
  pointBefore: number | null;
  net?: number;
  details?: RollResolutionDetail[];
};

type RollHistoryProps = {
  rollHistory: RollHistoryItem[];
  rollCount: number;
};

function eventLabelForRoll(roll: RollHistoryItem) {
  return roll.event === "pointMade"
    ? `POINT ${roll.total} MADE`
    : roll.event === "sevenOut"
      ? "SEVEN OUT"
      : roll.event === "pointSet"
        ? `POINT ${roll.total} ON`
        : "";
}

function statusAfterRoll(roll: RollHistoryItem) {
  if (roll.event === "sevenOut" || roll.event === "pointMade") {
    return "Puck OFF after roll";
  }

  if (roll.event === "pointSet") {
    return `Point ${roll.total} established`;
  }

  return roll.pointBefore
    ? `Point ${roll.pointBefore} remains ON`
    : "Come-out roll remains";
}

export function RollHistory({
  rollHistory,
  rollCount,
}: RollHistoryProps) {
  const rollHistoryRef = useRef<HTMLDivElement | null>(null);
  const [selectedRollNumber, setSelectedRollNumber] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (rollCount <= 0) return;

    setSelectedRollNumber(null);

    window.setTimeout(() => {
      rollHistoryRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }, 0);
  }, [rollCount]);

  const selectedRoll =
    selectedRollNumber === null
      ? null
      : rollHistory.find((roll, index) => {
          const rollNumber = roll.rollNumber ?? rollCount - index;
          return rollNumber === selectedRollNumber;
        }) ?? null;

  return (
    <div className="relative z-10 mt-2 border-t border-white/10 pt-2">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-400">
            Roll History • {rollCount} rolls
          </span>
          {rollHistory.length > 0 && (
            <span className="text-[7px] font-bold text-cyan-200/65">
              Click a roll for details
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="mr-1 text-[7px] text-emerald-100/45">
            newest first
          </span>

          <button
            onClick={() =>
              rollHistoryRef.current?.scrollBy({
                left: -360,
                behavior: "smooth",
              })
            }
            className="rounded border border-emerald-700/60 bg-emerald-950/40 px-2 py-1 text-[9px] font-black text-emerald-200 hover:bg-emerald-900/50"
            title="Scroll toward newer rolls"
          >
            ←
          </button>

          <button
            onClick={() =>
              rollHistoryRef.current?.scrollBy({
                left: 360,
                behavior: "smooth",
              })
            }
            className="rounded border border-emerald-700/60 bg-emerald-950/40 px-2 py-1 text-[9px] font-black text-emerald-200 hover:bg-emerald-900/50"
            title="Scroll toward older rolls"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={rollHistoryRef}
        className="flex min-w-0 gap-2 overflow-x-auto scroll-smooth pb-2"
      >
        {rollHistory.length === 0 ? (
          <span className="py-2 text-[9px] text-emerald-300/70">
            No rolls yet
          </span>
        ) : (
          rollHistory.map((roll, index) => {
            const eventStyle =
              roll.event === "pointMade"
                ? "border-amber-200 bg-amber-500/25 ring-2 ring-amber-300/70 shadow-[0_0_14px_rgba(251,191,36,.18)]"
                : roll.event === "sevenOut"
                  ? "border-red-300 bg-red-600/30 ring-2 ring-red-400/60 shadow-[0_0_14px_rgba(248,113,113,.16)]"
                  : roll.event === "pointSet"
                    ? "border-cyan-300 bg-cyan-500/20 ring-1 ring-cyan-300/60"
                    : "border-emerald-700 bg-emerald-950/45";

            const eventLabel = eventLabelForRoll(roll);
            const rollNumber = roll.rollNumber ?? rollCount - index;
            const isSelected = selectedRollNumber === rollNumber;

            return (
              <button
                key={rollNumber}
                type="button"
                onClick={() =>
                  setSelectedRollNumber((current) =>
                    current === rollNumber ? null : rollNumber
                  )
                }
                className={`min-w-[108px] shrink-0 rounded-lg border px-2.5 py-2 text-center transition hover:-translate-y-0.5 hover:border-cyan-200/80 hover:shadow-lg ${eventStyle} ${
                  isSelected
                    ? "outline outline-2 outline-cyan-300 outline-offset-2"
                    : ""
                }`}
                title={`Roll #${rollNumber}: click for wager details`}
                aria-expanded={isSelected}
              >
                <div className="text-[6px] font-black uppercase tracking-[0.14em] text-white/45">
                  Roll #{rollNumber}
                </div>

                <div className="mt-0.5 flex items-center justify-center gap-1">
                  <MiniDie value={roll.first} />
                  <MiniDie value={roll.second} />
                </div>

                <div className="mt-1 text-sm font-black">
                  {roll.total}
                </div>

                <div className="min-h-[13px] text-[7px] font-black uppercase tracking-[0.08em] text-white/80">
                  {eventLabel}
                </div>

                {typeof roll.net === "number" && (
                  <div
                    className={`mt-1 border-t border-white/10 pt-1 text-[8px] font-black ${
                      roll.net > 0
                        ? "text-emerald-300"
                        : roll.net < 0
                          ? "text-red-300"
                          : "text-white/45"
                    }`}
                  >
                    {roll.net > 0 ? "+" : roll.net < 0 ? "-" : ""}
                    ${Math.abs(roll.net).toLocaleString()}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {selectedRoll && (
        <div className="mt-2 overflow-hidden rounded-xl border border-cyan-700/60 bg-black/35 shadow-[0_12px_30px_rgba(0,0,0,.22)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-cyan-950/15 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MiniDie value={selectedRoll.first} />
                <MiniDie value={selectedRoll.second} />
              </div>

              <div>
                <div className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
                  Roll Details • Roll #
                  {selectedRoll.rollNumber ??
                    rollCount - rollHistory.indexOf(selectedRoll)}
                </div>
                <div className="text-sm font-black text-white">
                  {selectedRoll.total} rolled
                  {eventLabelForRoll(selectedRoll)
                    ? ` • ${eventLabelForRoll(selectedRoll)}`
                    : ""}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRollNumber(null)}
              className="rounded border border-white/15 bg-black/30 px-2 py-1 text-[7px] font-black uppercase tracking-[0.1em] text-white/65 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <div className="mb-2 text-[7px] font-black uppercase tracking-[0.14em] text-emerald-300">
                What happened
              </div>

              {selectedRoll.details && selectedRoll.details.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedRoll.details.map((detail, index) => (
                    <div
                      key={`${detail.text}-${index}`}
                      className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 ${
                        detail.result === "win"
                          ? "border-emerald-700/50 bg-emerald-950/30"
                          : detail.result === "loss"
                            ? "border-red-800/50 bg-red-950/25"
                            : "border-white/10 bg-white/[0.025]"
                      }`}
                    >
                      <span
                        className={`mt-[1px] min-w-[38px] rounded px-1.5 py-0.5 text-center text-[6px] font-black uppercase tracking-[0.1em] ${
                          detail.result === "win"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : detail.result === "loss"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-white/10 text-white/55"
                        }`}
                      >
                        {detail.result === "win"
                          ? "WIN"
                          : detail.result === "loss"
                            ? "LOSS"
                            : "INFO"}
                      </span>
                      <span className="text-[9px] font-semibold leading-4 text-white/85">
                        {detail.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-3 text-[9px] text-white/60">
                  No wager changed value on this roll.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="rounded-lg border border-white/10 bg-black/25 p-2.5">
                <div className="text-[6px] font-black uppercase tracking-[0.12em] text-white/45">
                  Table state
                </div>
                <div className="mt-1 text-[9px] font-bold text-white/80">
                  {selectedRoll.pointBefore
                    ? `Point before: ${selectedRoll.pointBefore}`
                    : "Point before: OFF"}
                </div>
                <div className="mt-0.5 text-[8px] text-white/55">
                  {statusAfterRoll(selectedRoll)}
                </div>
              </div>

              <div
                className={`rounded-lg border p-3 text-center ${
                  (selectedRoll.net ?? 0) > 0
                    ? "border-emerald-600/60 bg-emerald-950/35"
                    : (selectedRoll.net ?? 0) < 0
                      ? "border-red-700/60 bg-red-950/30"
                      : "border-white/10 bg-black/25"
                }`}
              >
                <div className="text-[6px] font-black uppercase tracking-[0.14em] text-white/45">
                  Net roll result
                </div>
                <div
                  className={`mt-1 text-xl font-black ${
                    (selectedRoll.net ?? 0) > 0
                      ? "text-emerald-300"
                      : (selectedRoll.net ?? 0) < 0
                        ? "text-red-300"
                        : "text-white/55"
                  }`}
                >
                  {(selectedRoll.net ?? 0) > 0
                    ? "+"
                    : (selectedRoll.net ?? 0) < 0
                      ? "-"
                      : ""}
                  ${Math.abs(selectedRoll.net ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
