"use client";

import type { StrategyGuideTarget } from "./StrategyMode";

const chipValues = [1, 5, 25, 100, 500];

type MobileActionBarProps = {
  isRolling: boolean;
  onRollDice: () => void;
  selectedChip: number;
  onSelectChip: (chip: number) => void;
  removeMode: boolean;
  onSetRemoveMode: (removeMode: boolean) => void;
  onOpenCenterBets: () => void;
  strategyGuideTarget: StrategyGuideTarget | null;
};

function chipStyle(value: number) {
  if (value === 1) return "bg-white text-black border-slate-400";
  if (value === 5) return "bg-red-600 text-white border-white";
  if (value === 25) return "bg-green-700 text-white border-white";
  if (value === 100) return "bg-zinc-950 text-white border-white";
  return "bg-purple-700 text-white border-white";
}

function guideLabel(target: StrategyGuideTarget | null) {
  if (!target) return null;

  if (target === "pass-line") return "PASS LINE";
  if (target === "pass-odds") return "PASS ODDS";
  if (target === "dont-pass") return "DON'T PASS";
  if (target === "dont-pass-odds") return "DON'T PASS ODDS";
  if (target === "come") return "COME";
  if (target === "dont-come") return "DON'T COME";
  if (target === "field") return "FIELD";
  if (target.startsWith("place-")) return `PLACE ${target.replace("place-", "")}`;
  if (target.startsWith("come-odds-"))
    return `COME ODDS ${target.replace("come-odds-", "")}`;
  if (target.startsWith("dont-come-odds-"))
    return `DC ODDS ${target.replace("dont-come-odds-", "")}`;

  return null;
}

export function MobileActionBar({
  isRolling,
  onRollDice,
  selectedChip,
  onSelectChip,
  removeMode,
  onSetRemoveMode,
  onOpenCenterBets,
  strategyGuideTarget,
}: MobileActionBarProps) {
  const nextBet = guideLabel(strategyGuideTarget);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] border-t border-emerald-700/80 bg-[#03130e]/95 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_30px_rgba(0,0,0,.45)] backdrop-blur lg:hidden">
      {nextBet && (
        <div className="mx-auto mb-1 max-w-[980px] rounded-md border border-cyan-400/60 bg-cyan-950/70 px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.1em] text-cyan-100">
          Strategy next bet → {nextBet}
        </div>
      )}

      <div className="mx-auto flex max-w-[980px] items-center gap-1.5 overflow-x-auto">
        <button
          onClick={onRollDice}
          disabled={isRolling}
          className={`shrink-0 rounded-lg px-4 py-2.5 text-[12px] font-black text-black shadow-lg ${
            isRolling
              ? "cursor-not-allowed bg-amber-200"
              : "bg-amber-400 active:scale-[.98]"
          }`}
        >
          {isRolling ? "ROLLING…" : "ROLL DICE"}
        </button>

        <div className="flex shrink-0 items-center rounded-lg border border-white/10 bg-black/20 p-1">
          <button
            onClick={() => onSetRemoveMode(false)}
            className={`rounded px-2.5 py-2 text-[9px] font-black ${
              !removeMode
                ? "bg-amber-400 text-black"
                : "text-emerald-100/70"
            }`}
          >
            ADD
          </button>
          <button
            onClick={() => onSetRemoveMode(true)}
            className={`rounded px-2.5 py-2 text-[9px] font-black ${
              removeMode
                ? "bg-red-600 text-white"
                : "text-emerald-100/70"
            }`}
          >
            REMOVE
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {chipValues.map((chip) => (
            <button
              key={chip}
              onClick={() => onSelectChip(chip)}
              aria-label={`Select $${chip} chip`}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-dashed text-[8px] font-black shadow ${chipStyle(
                chip
              )} ${
                selectedChip === chip
                  ? "ring-2 ring-yellow-300 ring-offset-1 ring-offset-[#03130e]"
                  : ""
              }`}
            >
              ${chip}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenCenterBets}
          className="shrink-0 rounded-lg border border-emerald-400/70 bg-emerald-950/80 px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.06em] text-emerald-100"
        >
          Center Bets
        </button>
      </div>
    </div>
  );
}
