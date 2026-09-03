"use client";

import { MiniDie } from "./TablePieces";
import type { StrategyGuideTarget } from "./StrategyMode";

const chipValues = [1, 5, 25, 100, 500];

type MobileActionBarProps = {
  dieOne: number;
  dieTwo: number;
  rollTotal: number;
  lastRollNet: number | null;
  isRolling: boolean;
  onRollDice: () => void;
  selectedChip: number;
  onSelectChip: (chip: number) => void;
  removeMode: boolean;
  onToggleRemoveMode: () => void;
  onOpenCenterBets: () => void;
  betsWorking: boolean;
  onToggleBetsWorking: () => void;
  placeBetsWorking: boolean;
  onTogglePlaceBetsWorking: () => void;
  bankroll: number;
  totalOnTable: number;
  strategyGuideTarget: StrategyGuideTarget | null;
  strategyGuideAmount: number | null;
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

type ChipPalette = {
  shell: string;
  center: string;
  text: string;
  edge: string;
};

function palette(value: number): ChipPalette {
  if (value === 1) {
    return {
      shell: "bg-slate-100",
      center: "bg-white",
      text: "text-slate-950",
      edge: "bg-slate-500",
    };
  }

  if (value === 5) {
    return {
      shell: "bg-red-600",
      center: "bg-red-700",
      text: "text-white",
      edge: "bg-white",
    };
  }

  if (value === 25) {
    return {
      shell: "bg-emerald-700",
      center: "bg-emerald-800",
      text: "text-white",
      edge: "bg-white",
    };
  }

  if (value === 100) {
    return {
      shell: "bg-zinc-950",
      center: "bg-zinc-900",
      text: "text-white",
      edge: "bg-white",
    };
  }

  return {
    shell: "bg-purple-700",
    center: "bg-purple-800",
    text: "text-white",
    edge: "bg-white",
  };
}

function CasinoRackChip({
  value,
  selected,
}: {
  value: number;
  selected: boolean;
}) {
  const colors = palette(value);
  const edgePositions = [
    "left-1/2 top-[-2px] h-[8px] w-[3px] -translate-x-1/2",
    "bottom-[-2px] left-1/2 h-[8px] w-[3px] -translate-x-1/2",
    "left-[-2px] top-1/2 h-[3px] w-[8px] -translate-y-1/2",
    "right-[-2px] top-1/2 h-[3px] w-[8px] -translate-y-1/2",
  ];

  return (
    <span
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-black/45 shadow-[0_3px_8px_rgba(0,0,0,.5)] transition lg:h-12 lg:w-12 ${colors.shell} ${
        selected
          ? "scale-105 ring-3 ring-yellow-300 ring-offset-2 ring-offset-[#03130e]"
          : ""
      }`}
    >
      {edgePositions.map((position) => (
        <span
          key={position}
          className={`absolute rounded-sm ${colors.edge} ${position}`}
        />
      ))}

      <span
        className={`absolute inset-[5px] rounded-full border-2 border-white/45 shadow-[inset_0_0_0_2px_rgba(0,0,0,.18)] ${colors.center}`}
      />
      <span
        className={`relative z-10 text-[8px] font-black lg:text-[9px] ${colors.text}`}
      >
        ${value}
      </span>
    </span>
  );
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
  if (target.startsWith("place-"))
    return `PLACE ${target.replace("place-", "")}`;
  if (target.startsWith("come-odds-"))
    return `COME ODDS ${target.replace("come-odds-", "")}`;
  if (target.startsWith("dont-come-odds-"))
    return `DC ODDS ${target.replace("dont-come-odds-", "")}`;

  return null;
}

export function MobileActionBar({
  dieOne,
  dieTwo,
  rollTotal,
  lastRollNet,
  isRolling,
  onRollDice,
  selectedChip,
  onSelectChip,
  removeMode,
  onToggleRemoveMode,
  onOpenCenterBets,
  betsWorking,
  onToggleBetsWorking,
  placeBetsWorking,
  onTogglePlaceBetsWorking,
  bankroll,
  totalOnTable,
  strategyGuideTarget,
  strategyGuideAmount,
}: MobileActionBarProps) {
  const nextBet = guideLabel(strategyGuideTarget);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-1.5 lg:bottom-2 lg:px-4 lg:pb-0">
      {nextBet && (
        <div className="mx-auto mb-1 max-w-[980px] rounded-md border-2 border-cyan-100 bg-cyan-400 px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-950 shadow-[0_0_18px_rgba(34,211,238,.65)] lg:hidden">
          Strategy next bet → {nextBet}
          {strategyGuideAmount !== null && (
            <span className="ml-2 rounded bg-slate-950/85 px-1.5 py-0.5 text-white">
              ${money(strategyGuideAmount)}
            </span>
          )}
        </div>
      )}

      <div className="mx-auto flex max-w-[1460px] items-center gap-2 overflow-x-auto border-t border-emerald-600/80 bg-[#03130e]/97 px-2 py-1.5 shadow-[0_-12px_35px_rgba(0,0,0,.5)] backdrop-blur lg:rounded-2xl lg:border lg:px-4 lg:py-2.5 lg:shadow-[0_10px_40px_rgba(0,0,0,.55)]">
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
          <MiniDie value={dieOne} large />
          <MiniDie value={dieTwo} large />

          <div className="ml-1 grid min-w-[72px] grid-cols-2 gap-x-2 text-center">
            <div>
              <p className="text-[6px] font-black uppercase tracking-[0.1em] text-emerald-500">
                Roll
              </p>
              <p className="text-lg font-black text-white lg:text-xl">
                {isRolling ? "…" : rollTotal}
              </p>
            </div>

            <div>
              <p className="text-[6px] font-black uppercase tracking-[0.1em] text-emerald-500">
                Net
              </p>
              <p
                className={`text-[12px] font-black lg:text-[14px] ${
                  lastRollNet === null
                    ? "text-white/45"
                    : lastRollNet > 0
                      ? "text-emerald-300"
                      : lastRollNet < 0
                        ? "text-red-300"
                        : "text-white/60"
                }`}
              >
                {lastRollNet === null
                  ? "—"
                  : `${lastRollNet > 0 ? "+" : lastRollNet < 0 ? "-" : ""}$${money(
                      Math.abs(lastRollNet)
                    )}`}
              </p>
            </div>
          </div>
        </div>

        {nextBet && (
          <div className="hidden shrink-0 rounded-xl border-2 border-cyan-100 bg-cyan-400 px-3 py-2 text-slate-950 shadow-[0_0_22px_rgba(34,211,238,.7)] lg:block">
            <span className="block text-[7px] font-black uppercase tracking-[0.14em]">
              Next Bet
            </span>
            <div className="flex items-end gap-2">
              <span className="block text-[12px] font-black">
                {nextBet}
              </span>
              {strategyGuideAmount !== null && (
                <span className="rounded-md bg-slate-950 px-2 py-0.5 text-[12px] font-black text-white shadow-sm">
                  ${money(strategyGuideAmount)}
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onRollDice}
          disabled={isRolling}
          className={`shrink-0 rounded-xl px-4 py-3 text-[12px] font-black text-black shadow-lg lg:px-7 lg:py-3.5 lg:text-[14px] ${
            isRolling
              ? "cursor-not-allowed bg-amber-200"
              : "bg-amber-400 active:scale-[.98]"
          }`}
        >
          {isRolling ? "ROLLING…" : "ROLL DICE"}
        </button>

        <button
          onClick={onToggleRemoveMode}
          className={`shrink-0 rounded-xl border px-3 py-3 text-[10px] font-black uppercase tracking-[0.06em] lg:px-4 lg:py-3.5 ${
            removeMode
              ? "border-red-300 bg-red-600 text-white"
              : "border-amber-300 bg-amber-400 text-black"
          }`}
          title="Toggle between adding and removing wager amounts"
        >
          {removeMode ? "REMOVE MODE" : "ADD MODE"}
        </button>

        <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-2 py-1.5">
          {chipValues.map((chip) => (
            <button
              key={chip}
              onClick={() => onSelectChip(chip)}
              aria-label={`Select $${chip} chip`}
              title={`Select $${chip}`}
              className="rounded-full"
            >
              <CasinoRackChip
                value={chip}
                selected={selectedChip === chip}
              />
            </button>
          ))}
        </div>

        <button
          onClick={onOpenCenterBets}
          className="shrink-0 rounded-xl border border-emerald-400/70 bg-emerald-950/80 px-3 py-3 text-[10px] font-black uppercase tracking-[0.06em] text-emerald-100 lg:hidden"
        >
          Center Bets
        </button>

        <button
          onClick={onToggleBetsWorking}
          className={`hidden shrink-0 rounded-xl border px-3 py-3 text-[9px] font-black uppercase tracking-[0.05em] lg:block ${
            betsWorking
              ? "border-emerald-300 bg-emerald-600 text-white"
              : "border-amber-400 bg-amber-950/70 text-amber-200"
          }`}
          title="Turns eligible multi-roll wagers on or off. Contract flat bets, one-roll bets and hardways are not controlled here."
        >
          BETS: {betsWorking ? "ON" : "OFF"}
        </button>

        <button
          onClick={onTogglePlaceBetsWorking}
          className={`hidden shrink-0 rounded-xl border px-3 py-3 text-[9px] font-black uppercase tracking-[0.05em] lg:block ${
            placeBetsWorking
              ? "border-amber-300 bg-amber-400 text-black"
              : "border-emerald-700 bg-emerald-950/60 text-emerald-100"
          }`}
          title="Controls whether Place bets work while the puck is OFF, provided BETS is ON."
        >
          PLACE: {placeBetsWorking ? "WORKING" : "OFF C/O"}
        </button>

        <div className="hidden shrink-0 items-stretch gap-1.5 lg:flex">
          <div className="min-w-[92px] rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center">
            <p className="text-[7px] font-black uppercase tracking-[0.1em] text-emerald-500">
              Bankroll
            </p>
            <p className="mt-0.5 text-[15px] font-black text-white">
              ${money(bankroll)}
            </p>
          </div>

          <div className="min-w-[88px] rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center">
            <p className="text-[7px] font-black uppercase tracking-[0.1em] text-emerald-500">
              On Table
            </p>
            <p className="mt-0.5 text-[15px] font-black text-white">
              ${money(totalOnTable)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
