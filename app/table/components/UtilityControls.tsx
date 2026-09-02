"use client";

type UtilityControlsProps = {
  totalLayBets: number;
  totalHopBets: number;
  removableBetsTotal: number;
  canUndo: boolean;
  canRebet: boolean;
  isRolling: boolean;
  onUndo: () => void;
  onRebet: () => void;
  onClearBets: () => void;
  onReset: () => void;
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

export function UtilityControls({
  totalLayBets,
  totalHopBets,
  removableBetsTotal,
  canUndo,
  canRebet,
  isRolling,
  onUndo,
  onRebet,
  onClearBets,
  onReset,
}: UtilityControlsProps) {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-b border-white/10 pb-2 text-[8px] font-black uppercase tracking-[0.12em]">
        <span className="text-emerald-500">Utility Controls</span>
        <span className="text-red-200">
          Lay action: ${money(totalLayBets)}
        </span>
        <span className="text-amber-200">
          Hop action: ${money(totalHopBets)}
        </span>
        <span className="text-cyan-200">
          Removable: ${money(removableBetsTotal)}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo || isRolling}
          title="Restore the table to before your most recent bet change"
          className={`rounded border px-2.5 py-1.5 text-[9px] font-black ${
            canUndo && !isRolling
              ? "border-blue-500/70 text-blue-200 hover:bg-blue-950/30"
              : "cursor-not-allowed border-zinc-800 text-zinc-700"
          }`}
        >
          UNDO BET
        </button>

        <button
          onClick={onRebet}
          disabled={!canRebet || isRolling}
          title="Restore eligible wagers that were up immediately before the previous roll"
          className={`rounded border px-2.5 py-1.5 text-[9px] font-black ${
            canRebet && !isRolling
              ? "border-amber-500/70 text-amber-200 hover:bg-amber-950/30"
              : "cursor-not-allowed border-zinc-800 text-zinc-700"
          }`}
        >
          REBET
        </button>

        <button
          onClick={onClearBets}
          disabled={removableBetsTotal <= 0 || isRolling}
          title="Return all currently removable wagers to your bankroll"
          className={`rounded border px-2.5 py-1.5 text-[9px] font-black ${
            removableBetsTotal > 0 && !isRolling
              ? "border-cyan-600/70 text-cyan-200 hover:bg-cyan-950/30"
              : "cursor-not-allowed border-zinc-800 text-zinc-700"
          }`}
        >
          CLEAR BETS
        </button>

        <button
          onClick={onReset}
          className="rounded border border-red-800/70 px-2.5 py-1.5 text-[9px] font-black text-red-300/80"
        >
          RESET
        </button>

        <span className="ml-2 text-[8px] font-bold text-emerald-600">
          Primary betting controls are in the dealer tray
        </span>
      </div>
    </>
  );
}
