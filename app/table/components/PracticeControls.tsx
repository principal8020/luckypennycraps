"use client";

type PracticeControlsProps = {
  testingMode: boolean;
  onToggleTestingMode: () => void;
  forcedTotal: number;
  onForcedTotalChange: (total: number) => void;
  forceHardway: boolean;
  onForceHardwayChange: (forceHardway: boolean) => void;
};

const hardwayNumbers = [4, 6, 8, 10];

export function PracticeControls({
  testingMode,
  onToggleTestingMode,
  forcedTotal,
  onForcedTotalChange,
  forceHardway,
  onForceHardwayChange,
}: PracticeControlsProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[9px] text-purple-300/80">
      <button
        onClick={onToggleTestingMode}
        className={`rounded border px-3 py-1.5 font-black ${
          testingMode
            ? "border-purple-300 bg-purple-600"
            : "border-purple-700/70 bg-purple-950/20"
        }`}
      >
        DEV TEST {testingMode ? "ON" : "OFF"}
      </button>

      {testingMode && (
        <>
          <select
            value={forcedTotal}
            onChange={(event) =>
              onForcedTotalChange(Number(event.target.value))
            }
            className="rounded bg-white px-2 py-1.5 font-bold text-black"
          >
            {Array.from({ length: 11 }, (_, index) => index + 2).map(
              (number) => (
                <option key={number} value={number}>
                  Force {number}
                </option>
              )
            )}
          </select>

          {hardwayNumbers.includes(forcedTotal) && (
            <label className="flex items-center gap-1 font-bold">
              <input
                type="checkbox"
                checked={forceHardway}
                onChange={(event) =>
                  onForceHardwayChange(event.target.checked)
                }
              />
              Hardway
            </label>
          )}
        </>
      )}
    </div>
  );
}
