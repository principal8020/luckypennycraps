"use client";

import { useEffect, useRef } from "react";
import { MiniDie } from "./TablePieces";

export type RollHistoryItem = {
  first: number;
  second: number;
  total: number;
  event: "normal" | "pointSet" | "pointMade" | "sevenOut";
  pointBefore: number | null;
};

type RollHistoryProps = {
  rollHistory: RollHistoryItem[];
  rollCount: number;
};

export function RollHistory({
  rollHistory,
  rollCount,
}: RollHistoryProps) {
  const rollHistoryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (rollCount <= 0) return;

    window.setTimeout(() => {
      rollHistoryRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }, 0);
  }, [rollCount]);

  return (
    <div className="relative z-10 mt-2 border-t border-white/10 pt-2">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-400">
          Roll History • {rollCount} rolls
        </span>

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

            const eventLabel =
              roll.event === "pointMade"
                ? `POINT ${roll.total} MADE`
                : roll.event === "sevenOut"
                  ? "SEVEN OUT"
                  : roll.event === "pointSet"
                    ? `POINT ${roll.total} ON`
                    : "";

            return (
              <div
                key={`${roll.first}-${roll.second}-${index}`}
                className={`min-w-[108px] shrink-0 rounded-lg border px-2.5 py-2 text-center ${eventStyle}`}
                title={
                  eventLabel ||
                  `Roll ${roll.total}${
                    roll.pointBefore
                      ? ` with point ${roll.pointBefore}`
                      : ""
                  }`
                }
              >
                <div className="flex items-center justify-center gap-1">
                  <MiniDie value={roll.first} />
                  <MiniDie value={roll.second} />
                </div>

                <div className="mt-1 text-sm font-black">
                  {roll.total}
                </div>

                <div className="min-h-[13px] text-[7px] font-black uppercase tracking-[0.08em] text-white/80">
                  {eventLabel}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
