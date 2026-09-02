"use client";

import {
  buildAcrossTarget,
  buildInsideTarget,
  buildIronCrossTarget,
} from "../crapsRules";

type NumberBets = Record<number, number>;

export type QuickBetPreview = {
  label: string;
  target: NumberBets;
  field: number;
  tone: "emerald" | "cyan" | "amber";
};

type QuickBetsProps = {
  selectedChip: number;
  quickBetPreview: QuickBetPreview | null;
  onSetQuickBetPreview: (preview: QuickBetPreview | null) => void;
  onApplyQuickBet: (
    name: string,
    requestedTarget: NumberBets,
    fieldTarget?: number
  ) => void;
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function totalTarget(target: NumberBets, fieldAmount = 0) {
  return (
    Object.values(target).reduce((sum, amount) => sum + amount, 0) +
    fieldAmount
  );
}

export function QuickBets({
  selectedChip,
  quickBetPreview,
  onSetQuickBetPreview,
  onApplyQuickBet,
}: QuickBetsProps) {
  const quickBetBase = Math.max(5, selectedChip);
  const quickBetDoubleBase = quickBetBase * 2;

  const quickInsideTarget = buildInsideTarget(quickBetBase);
  const quickAcrossTarget = buildAcrossTarget(quickBetBase);
  const quickIronCrossTarget = buildIronCrossTarget(quickBetBase);

  const quickDoubleInsideTarget = buildInsideTarget(quickBetDoubleBase);
  const quickDoubleAcrossTarget = buildAcrossTarget(quickBetDoubleBase);
  const quickDoubleIronCrossTarget = buildIronCrossTarget(quickBetDoubleBase);

  const quickInsideTotal = totalTarget(quickInsideTarget);
  const quickAcrossTotal = totalTarget(quickAcrossTarget);
  const quickIronCrossTotal = totalTarget(
    quickIronCrossTarget,
    quickBetBase
  );

  const quickDoubleInsideTotal = totalTarget(quickDoubleInsideTarget);
  const quickDoubleAcrossTotal = totalTarget(quickDoubleAcrossTarget);
  const quickDoubleIronCrossTotal = totalTarget(
    quickDoubleIronCrossTarget,
    quickBetDoubleBase
  );

  const quickPrimaryLabel =
    selectedChip <= 5 ? "$5 MIN" : `$${money(quickBetBase)} BASE`;
  const quickDoubleLabel =
    selectedChip <= 5 ? "$10 MIN" : `$${money(quickBetDoubleBase)} BASE`;

  function startQuickPreview(
    label: string,
    target: NumberBets,
    field: number,
    tone: QuickBetPreview["tone"]
  ) {
    onSetQuickBetPreview({
      label,
      target: { ...target },
      field,
      tone,
    });
  }

  function quickPreviewSummary() {
    if (!quickBetPreview) return "";

    const pointNumbers = [4, 5, 6, 8, 9, 10];
    const parts = pointNumbers
      .filter((number) => quickBetPreview.target[number] > 0)
      .map(
        (number) =>
          `${number} $${money(quickBetPreview.target[number])}`
      );

    if (quickBetPreview.field > 0) {
      parts.push(`Field $${money(quickBetPreview.field)}`);
    }

    return parts.join(" • ");
  }

  return (
    <div className="mt-2 border-t border-white/10 pt-2">
      <div className="mb-2 text-center">
        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
          Quick Bets
        </span>
        <span className="ml-2 text-[8px] text-emerald-600">
          proper 6/8 amounts • second row = 2× base
        </span>
        <div className="mt-1 min-h-[15px] text-[8px] font-bold">
          {quickBetPreview ? (
            <>
              <span
                className={
                  quickBetPreview.tone === "amber"
                    ? "text-amber-300"
                    : quickBetPreview.tone === "cyan"
                      ? "text-cyan-300"
                      : "text-emerald-300"
                }
              >
                PREVIEW {quickBetPreview.label}:
              </span>{" "}
              <span className="text-white/70">
                {quickPreviewSummary()}
              </span>
            </>
          ) : (
            <span className="text-emerald-700">
              Hover or focus a Quick Bet to preview its table positions
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1040px] gap-1.5">
        <div className="grid gap-1.5 sm:grid-cols-[90px_repeat(3,minmax(0,1fr))] sm:items-stretch">
          <div className="flex items-center justify-center rounded-lg border border-emerald-700/60 bg-emerald-950/30 px-2 py-2 text-center">
            <span className="text-[10px] font-black text-emerald-200">
              <span className="block text-[7px] font-black uppercase tracking-[0.12em] text-emerald-500">
                1×
              </span>
              {quickPrimaryLabel}
            </span>
          </div>

          <button
            onMouseEnter={() =>
              startQuickPreview(
                `$${money(quickInsideTotal)} Inside`,
                quickInsideTarget,
                0,
                "emerald"
              )
            }
            onMouseLeave={() => onSetQuickBetPreview(null)}
            onFocus={() =>
              startQuickPreview(
                `$${money(quickInsideTotal)} Inside`,
                quickInsideTarget,
                0,
                "emerald"
              )
            }
            onBlur={() => onSetQuickBetPreview(null)}
            onClick={() =>
              onApplyQuickBet(
                `$${money(quickInsideTotal)} Inside`,
                quickInsideTarget
              )
            }
            className="rounded-lg border border-emerald-500/70 bg-emerald-950/25 px-3 py-1.5 text-left transition hover:bg-emerald-950/55 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
          >
            <span className="block text-[12px] font-black text-white">
              ${money(quickInsideTotal)} INSIDE
            </span>
            <span className="mt-0.5 block text-[8px] font-bold text-emerald-300/80">
              5/9 ${money(quickInsideTarget[5])} • 6/8 ${money(quickInsideTarget[6])}
            </span>
          </button>

          <button
            onMouseEnter={() =>
              startQuickPreview(
                `$${money(quickAcrossTotal)} Across`,
                quickAcrossTarget,
                0,
                "emerald"
              )
            }
            onMouseLeave={() => onSetQuickBetPreview(null)}
            onFocus={() =>
              startQuickPreview(
                `$${money(quickAcrossTotal)} Across`,
                quickAcrossTarget,
                0,
                "emerald"
              )
            }
            onBlur={() => onSetQuickBetPreview(null)}
            onClick={() =>
              onApplyQuickBet(
                `$${money(quickAcrossTotal)} Across`,
                quickAcrossTarget
              )
            }
            className="rounded-lg border border-emerald-500/70 bg-emerald-950/25 px-3 py-1.5 text-left transition hover:bg-emerald-950/55 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
          >
            <span className="block text-[12px] font-black text-white">
              ${money(quickAcrossTotal)} ACROSS
            </span>
            <span className="mt-0.5 block text-[8px] font-bold text-emerald-300/80">
              4/5/9/10 ${money(quickAcrossTarget[4])} • 6/8 ${money(quickAcrossTarget[6])}
            </span>
          </button>

          <button
            onMouseEnter={() =>
              startQuickPreview(
                `$${money(quickIronCrossTotal)} Iron Cross`,
                quickIronCrossTarget,
                quickBetBase,
                "amber"
              )
            }
            onMouseLeave={() => onSetQuickBetPreview(null)}
            onFocus={() =>
              startQuickPreview(
                `$${money(quickIronCrossTotal)} Iron Cross`,
                quickIronCrossTarget,
                quickBetBase,
                "amber"
              )
            }
            onBlur={() => onSetQuickBetPreview(null)}
            onClick={() =>
              onApplyQuickBet(
                `$${money(quickIronCrossTotal)} Iron Cross`,
                quickIronCrossTarget,
                quickBetBase
              )
            }
            className="rounded-lg border border-amber-500/70 bg-amber-950/20 px-3 py-1.5 text-left transition hover:bg-amber-950/40 focus:outline-none focus:ring-2 focus:ring-amber-300/70"
          >
            <span className="block text-[12px] font-black text-amber-100">
              ${money(quickIronCrossTotal)} IRON CROSS
            </span>
            <span className="mt-0.5 block text-[8px] font-bold text-amber-300/85">
              5 ${money(quickIronCrossTarget[5])} • 6/8 ${money(quickIronCrossTarget[6])} • Field ${money(quickBetBase)}
            </span>
          </button>
        </div>

        <div className="grid gap-1.5 sm:grid-cols-[90px_repeat(3,minmax(0,1fr))] sm:items-stretch">
          <div className="flex items-center justify-center rounded-lg border border-cyan-700/60 bg-cyan-950/25 px-2 py-2 text-center">
            <span className="text-[10px] font-black text-cyan-200">
              <span className="block text-[7px] font-black uppercase tracking-[0.12em] text-cyan-500">
                2×
              </span>
              {quickDoubleLabel}
            </span>
          </div>

          <button
            onMouseEnter={() =>
              startQuickPreview(
                `$${money(quickDoubleInsideTotal)} Inside`,
                quickDoubleInsideTarget,
                0,
                "cyan"
              )
            }
            onMouseLeave={() => onSetQuickBetPreview(null)}
            onFocus={() =>
              startQuickPreview(
                `$${money(quickDoubleInsideTotal)} Inside`,
                quickDoubleInsideTarget,
                0,
                "cyan"
              )
            }
            onBlur={() => onSetQuickBetPreview(null)}
            onClick={() =>
              onApplyQuickBet(
                `$${money(quickDoubleInsideTotal)} Inside`,
                quickDoubleInsideTarget
              )
            }
            className="rounded-lg border border-cyan-500/55 bg-cyan-950/15 px-3 py-1.5 text-left transition hover:bg-cyan-950/35 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
          >
            <span className="block text-[12px] font-black text-white">
              ${money(quickDoubleInsideTotal)} INSIDE
            </span>
            <span className="mt-0.5 block text-[8px] font-bold text-cyan-200/75">
              5/9 ${money(quickDoubleInsideTarget[5])} • 6/8 ${money(quickDoubleInsideTarget[6])}
            </span>
          </button>

          <button
            onMouseEnter={() =>
              startQuickPreview(
                `$${money(quickDoubleAcrossTotal)} Across`,
                quickDoubleAcrossTarget,
                0,
                "cyan"
              )
            }
            onMouseLeave={() => onSetQuickBetPreview(null)}
            onFocus={() =>
              startQuickPreview(
                `$${money(quickDoubleAcrossTotal)} Across`,
                quickDoubleAcrossTarget,
                0,
                "cyan"
              )
            }
            onBlur={() => onSetQuickBetPreview(null)}
            onClick={() =>
              onApplyQuickBet(
                `$${money(quickDoubleAcrossTotal)} Across`,
                quickDoubleAcrossTarget
              )
            }
            className="rounded-lg border border-cyan-500/55 bg-cyan-950/15 px-3 py-1.5 text-left transition hover:bg-cyan-950/35 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
          >
            <span className="block text-[12px] font-black text-white">
              ${money(quickDoubleAcrossTotal)} ACROSS
            </span>
            <span className="mt-0.5 block text-[8px] font-bold text-cyan-200/75">
              4/5/9/10 ${money(quickDoubleAcrossTarget[4])} • 6/8 ${money(quickDoubleAcrossTarget[6])}
            </span>
          </button>

          <button
            onMouseEnter={() =>
              startQuickPreview(
                `$${money(quickDoubleIronCrossTotal)} Iron Cross`,
                quickDoubleIronCrossTarget,
                quickBetDoubleBase,
                "amber"
              )
            }
            onMouseLeave={() => onSetQuickBetPreview(null)}
            onFocus={() =>
              startQuickPreview(
                `$${money(quickDoubleIronCrossTotal)} Iron Cross`,
                quickDoubleIronCrossTarget,
                quickBetDoubleBase,
                "amber"
              )
            }
            onBlur={() => onSetQuickBetPreview(null)}
            onClick={() =>
              onApplyQuickBet(
                `$${money(quickDoubleIronCrossTotal)} Iron Cross`,
                quickDoubleIronCrossTarget,
                quickBetDoubleBase
              )
            }
            className="rounded-lg border border-amber-400/60 bg-amber-950/25 px-3 py-1.5 text-left transition hover:bg-amber-950/45 focus:outline-none focus:ring-2 focus:ring-amber-300/70"
          >
            <span className="block text-[12px] font-black text-amber-100">
              ${money(quickDoubleIronCrossTotal)} IRON CROSS
            </span>
            <span className="mt-0.5 block text-[8px] font-bold text-amber-200/80">
              5 ${money(quickDoubleIronCrossTarget[5])} • 6/8 ${money(quickDoubleIronCrossTarget[6])} • Field ${money(quickBetDoubleBase)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
