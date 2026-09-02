"use client";

type PracticeControlsProps = {
  testingMode: boolean;
  onToggleTestingMode: () => void;
  forcedTotal: number;
  onForcedTotalChange: (total: number) => void;
  forceHardway: boolean;
  onForceHardwayChange: (forceHardway: boolean) => void;
};

const rollTotals = Array.from({ length: 11 }, (_, index) => index + 2);
const hardwayNumbers = [4, 6, 8, 10];

export function PracticeControls({
  testingMode,
  onToggleTestingMode,
  forcedTotal,
  onForcedTotalChange,
  forceHardway,
  onForceHardwayChange,
}: PracticeControlsProps) {
  const canForceHardway = hardwayNumbers.includes(forcedTotal);

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
            ? `Next roll is set to ${forcedTotal}`
            : "Dice rolls are random"}
        </span>
      </div>

      {testingMode && (
        <div className="mt-2 border-t border-purple-900/50 pt-2">
          <div className="mb-2 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-purple-200">
              Choose the next roll total
            </p>
            <p className="mt-0.5 text-[8px] text-purple-300/60">
              Bets and payouts resolve normally — only the dice result is controlled.
            </p>
          </div>

          <div className="mx-auto flex max-w-[650px] flex-wrap items-center justify-center gap-1.5">
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

          <div className="mt-2 flex min-h-8 items-center justify-center">
            {canForceHardway ? (
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-amber-800/60 bg-amber-950/20 px-3 py-1.5 text-[8px] font-bold text-amber-200">
                <input
                  type="checkbox"
                  checked={forceHardway}
                  onChange={(event) =>
                    onForceHardwayChange(event.target.checked)
                  }
                  className="accent-amber-400"
                />
                Force {forcedTotal} as a hardway ({forcedTotal / 2} + {forcedTotal / 2})
              </label>
            ) : (
              <span className="text-[8px] text-purple-400/45">
                Hardway forcing is available for 4, 6, 8, and 10.
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
