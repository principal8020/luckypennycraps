type BetChipProps = {
  amount: number;
  compact?: boolean;
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

type ChipDenomination = 1 | 5 | 25 | 100 | 500;

type ChipPalette = {
  shell: string;
  center: string;
  text: string;
  edge: string;
  ring: string;
};

type ChipGroup = {
  denomination: ChipDenomination;
  count: number;
};

const CHIP_DENOMINATIONS: ChipDenomination[] = [500, 100, 25, 5, 1];

function chipPalette(value: ChipDenomination): ChipPalette {
  if (value === 1) {
    return {
      shell:
        "bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_38%,#dbe4ee_72%,#94a3b8_100%)]",
      center: "bg-slate-100",
      text: "text-slate-950",
      edge: "bg-slate-700",
      ring: "border-slate-600/85",
    };
  }

  if (value === 5) {
    return {
      shell:
        "bg-[linear-gradient(145deg,#fb4b4b_0%,#dc2626_40%,#991b1b_76%,#681717_100%)]",
      center: "bg-red-700",
      text: "text-white",
      edge: "bg-white",
      ring: "border-red-950/85",
    };
  }

  if (value === 25) {
    return {
      shell:
        "bg-[linear-gradient(145deg,#42dca0_0%,#059669_38%,#047857_72%,#064e3b_100%)]",
      center: "bg-emerald-800",
      text: "text-white",
      edge: "bg-white",
      ring: "border-emerald-950/85",
    };
  }

  if (value === 100) {
    return {
      shell:
        "bg-[linear-gradient(145deg,#66666f_0%,#27272a_34%,#09090b_74%,#000000_100%)]",
      center: "bg-zinc-900",
      text: "text-white",
      edge: "bg-white",
      ring: "border-black",
    };
  }

  return {
    shell:
      "bg-[linear-gradient(145deg,#b15cff_0%,#7e22ce_38%,#581c87_74%,#35055c_100%)]",
    center: "bg-purple-800",
    text: "text-white",
    edge: "bg-white",
    ring: "border-purple-950/90",
  };
}

export function getChipBreakdown(amount: number): ChipDenomination[] {
  let remaining = Math.max(0, Math.floor(amount));
  const chips: ChipDenomination[] = [];

  for (const denomination of CHIP_DENOMINATIONS) {
    while (remaining >= denomination) {
      chips.push(denomination);
      remaining -= denomination;
    }
  }

  return chips;
}

function getChipGroups(amount: number): ChipGroup[] {
  const chips = getChipBreakdown(amount);

  return CHIP_DENOMINATIONS
    .map((denomination) => ({
      denomination,
      count: chips.filter((chip) => chip === denomination).length,
    }))
    .filter((group) => group.count > 0);
}

function chipBreakdownLabel(groups: ChipGroup[]) {
  return groups
    .map(({ denomination, count }) =>
      count === 1 ? `$${denomination}` : `${count}×$${denomination}`
    )
    .join(" + ");
}

function CasinoChipFace({
  value,
  count,
  compact,
}: {
  value: ChipDenomination;
  count: number;
  compact: boolean;
}) {
  const palette = chipPalette(value);
  const edgePositions = [
    "left-1/2 top-[-2px] h-[7px] w-[3px] -translate-x-1/2",
    "bottom-[-2px] left-1/2 h-[7px] w-[3px] -translate-x-1/2",
    "left-[-2px] top-1/2 h-[3px] w-[7px] -translate-y-1/2",
    "right-[-2px] top-1/2 h-[3px] w-[7px] -translate-y-1/2",
  ];

  const sizeClass = compact
    ? "h-11 w-11 text-[9px]"
    : "h-[52px] w-[52px] text-[10px]";
  const visibleLayers = Math.min(count, 3);
  // Casino-style diagonal stack: each lower chip remains roughly 20% visible.
  // The stack moves sideways more than vertically so it reads as multiple chips
  // without turning into a tall tower that covers the table layout.
  const layerOffsetX = compact ? 9 : 11;
  const layerOffsetY = compact ? 3 : 4;
  const stackPadding =
    count > 1
      ? compact
        ? "mr-3 mb-1"
        : "mr-4 mb-1.5"
      : "";

  return (
    <span className={`relative inline-flex shrink-0 ${stackPadding}`}>
      {Array.from({ length: Math.max(0, visibleLayers - 1) }, (_, index) => {
        const depth = visibleLayers - index - 1;
        return (
          <span
            key={`stack-${depth}`}
            className={`absolute rounded-full border-2 ${sizeClass} ${palette.shell} ${palette.ring} shadow-[0_2px_0_rgba(0,0,0,.55),0_5px_9px_rgba(0,0,0,.35),inset_0_2px_3px_rgba(255,255,255,.28)]`}
            style={{
              left: `${depth * layerOffsetX}px`,
              top: `${depth * layerOffsetY}px`,
              zIndex: 2 + index,
            }}
            aria-hidden="true"
          >
            {edgePositions.map((position) => (
              <span
                key={`${depth}-${position}`}
                className={`absolute rounded-sm ${palette.edge} ${position}`}
              />
            ))}
            <span
              className={`absolute rounded-full border-2 border-white/50 ${palette.center} ${
                compact ? "inset-[6px]" : "inset-[7px]"
              }`}
            />
          </span>
        );
      })}

      <span
        className={`relative z-10 inline-flex items-center justify-center rounded-full border-2 font-black ${sizeClass} ${palette.shell} ${palette.text} ${palette.ring} shadow-[0_3px_0_rgba(0,0,0,.62),0_7px_11px_rgba(0,0,0,.42),inset_0_2px_3px_rgba(255,255,255,.34)]`}
        aria-label={`${count > 1 ? `${count} times ` : ""}$${value} chip`}
      >
        {edgePositions.map((position) => (
          <span
            key={position}
            className={`absolute rounded-sm ${palette.edge} ${position}`}
            aria-hidden="true"
          />
        ))}

        <span
          className={`absolute rounded-full border-2 border-white/65 shadow-[inset_0_0_0_2px_rgba(0,0,0,.2),inset_0_2px_2px_rgba(255,255,255,.16)] ${palette.center} ${
            compact ? "inset-[6px]" : "inset-[7px]"
          }`}
          aria-hidden="true"
        />

        <span className="relative z-10 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,.9)]">
          ${value}
        </span>
      </span>

      {count > 1 && (
        <span
          className={`absolute -right-1 -top-1 z-20 flex items-center justify-center rounded-full border border-white/70 bg-slate-950 font-black text-white shadow-md ${
            compact ? "h-[17px] min-w-[17px] px-[3px] text-[7px]" : "h-5 min-w-5 px-1 text-[8px]"
          }`}
        >
          ×{count}
        </span>
      )}
    </span>
  );
}

export function BetChip({
  amount,
  compact = false,
}: BetChipProps) {
  if (amount <= 0) return null;

  const groups = getChipGroups(amount);
  const visibleGroups = groups.slice(0, 3);
  const hiddenGroups = Math.max(0, groups.length - visibleGroups.length);
  const isSimpleSingleChip = groups.length === 1 && groups[0].count === 1;
  const showTotalLabel = !isSimpleSingleChip;
  const labelClass = compact
    ? "px-2.5 py-[2px] text-[9px]"
    : "px-3 py-[3px] text-[10px]";
  const wrapClass = compact
    ? showTotalLabel
      ? "h-[58px] min-w-[70px] pb-[14px]"
      : "h-[48px] min-w-[56px] pb-0"
    : showTotalLabel
      ? "h-[70px] min-w-[86px] pb-[18px]"
      : "h-[58px] min-w-[66px] pb-0";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${wrapClass}`}
      title={`Total wager: $${money(amount)} • ${chipBreakdownLabel(groups)}`}
    >
      <span className="relative flex items-end justify-center">
        {visibleGroups.map((group, index) => (
          <span
            key={group.denomination}
            className="relative"
            style={{
              marginLeft: index === 0 ? 0 : compact ? -14 : -16,
              transform: `translateY(${index * -1}px) rotate(${index === 0 ? -2 : index === 1 ? 2 : 0}deg)`,
              zIndex: 10 + index,
            }}
          >
            <CasinoChipFace
              value={group.denomination}
              count={group.count}
              compact={compact}
            />
          </span>
        ))}

        {hiddenGroups > 0 && (
          <span
            className={`absolute -right-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/45 bg-black/90 px-1 font-black text-white shadow-md ${
              compact ? "text-[6px]" : "text-[7px]"
            }`}
          >
            +{hiddenGroups}
          </span>
        )}
      </span>

      {showTotalLabel && (
        <span
          className={`absolute bottom-0 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/40 bg-black/95 font-black text-white shadow-[0_2px_7px_rgba(0,0,0,.62)] ${labelClass}`}
        >
          ${money(amount)}
        </span>
      )}
    </span>
  );
}

export function MiniDie({
  value,
  large = false,
}: {
  value: number;
  large?: boolean;
}) {
  const pipsByValue: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  const activePips = pipsByValue[value] ?? [];

  return (
    <span
      className={`inline-grid shrink-0 grid-cols-3 grid-rows-3 rounded-[5px] border border-red-200/70 bg-red-700 p-[3px] shadow-md ${
        large ? "h-10 w-10 sm:h-11 sm:w-11" : "h-6 w-6"
      }`}
      aria-label={`Die showing ${value}`}
    >
      {Array.from({ length: 9 }, (_, index) => {
        const position = index + 1;
        return (
          <span
            key={position}
            className="flex items-center justify-center"
          >
            {activePips.includes(position) && (
              <span
                className={`rounded-full bg-white ${
                  large ? "h-2 w-2 sm:h-2.5 sm:w-2.5" : "h-1.5 w-1.5"
                }`}
              />
            )}
          </span>
        );
      })}
    </span>
  );
}

export function Stat({
  label,
  value,
  positive = false,
  negative = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400">
        {label}
      </p>
      <p
        className={`text-lg font-black ${
          positive
            ? "text-emerald-300"
            : negative
              ? "text-red-300"
              : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
