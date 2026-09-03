type BetChipProps = {
  amount: number;
  compact?: boolean;
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

function chipPalette(amount: number): ChipPalette {
  if (amount < 5) {
    return {
      shell: "bg-slate-100",
      center: "bg-white",
      text: "text-slate-950",
      edge: "bg-slate-500",
    };
  }

  if (amount < 25) {
    return {
      shell: "bg-red-600",
      center: "bg-red-700",
      text: "text-white",
      edge: "bg-white",
    };
  }

  if (amount < 100) {
    return {
      shell: "bg-emerald-700",
      center: "bg-emerald-800",
      text: "text-white",
      edge: "bg-white",
    };
  }

  if (amount < 500) {
    return {
      shell: "bg-zinc-950",
      center: "bg-zinc-900",
      text: "text-white",
      edge: "bg-white",
    };
  }

  if (amount < 1000) {
    return {
      shell: "bg-purple-700",
      center: "bg-purple-800",
      text: "text-white",
      edge: "bg-white",
    };
  }

  return {
    shell: "bg-yellow-400",
    center: "bg-yellow-300",
    text: "text-black",
    edge: "bg-black",
  };
}

export function BetChip({
  amount,
  compact = false,
}: BetChipProps) {
  if (amount <= 0) return null;

  const palette = chipPalette(amount);
  const edgePositions = [
    "left-1/2 top-[-2px] h-[8px] w-[3px] -translate-x-1/2",
    "bottom-[-2px] left-1/2 h-[8px] w-[3px] -translate-x-1/2",
    "left-[-2px] top-1/2 h-[3px] w-[8px] -translate-y-1/2",
    "right-[-2px] top-1/2 h-[3px] w-[8px] -translate-y-1/2",
  ];

  const sizeClass = compact
    ? "h-9 min-w-9 px-1 text-[7px]"
    : "h-13 min-w-13 px-1.5 text-[9px]";

  return (
    <span
      className={`relative inline-flex items-center justify-center ${sizeClass}`}
      title={`Total wager: $${money(amount)}`}
    >
      {/* Two subtle offset layers create the look of a small chip stack
          without changing the wager footprint or representing chip count. */}
      <span
        className={`absolute translate-x-[3px] translate-y-[4px] rounded-full border-2 border-black/40 opacity-70 shadow-md ${sizeClass} ${palette.shell}`}
        aria-hidden="true"
      />
      <span
        className={`absolute translate-x-[1px] translate-y-[2px] rounded-full border-2 border-black/40 opacity-85 shadow-md ${sizeClass} ${palette.shell}`}
        aria-hidden="true"
      />

      <span
        className={`relative z-10 inline-flex items-center justify-center rounded-full border-2 border-black/50 font-black shadow-[0_4px_0_rgba(0,0,0,.4),0_8px_15px_rgba(0,0,0,.5)] ${sizeClass} ${palette.shell} ${palette.text}`}
      >
        {edgePositions.map((position) => (
          <span
            key={position}
            className={`absolute rounded-sm ${palette.edge} ${position}`}
          />
        ))}

        <span
          className={`absolute rounded-full border-2 border-white/60 shadow-[inset_0_0_0_2px_rgba(0,0,0,.2)] ${palette.center} ${
            compact ? "inset-[4px]" : "inset-[6px]"
          }`}
        />

        <span
          className={`absolute rounded-full border border-white/35 ${
            compact ? "inset-[7px]" : "inset-[10px]"
          }`}
        />

        <span className="relative z-10 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]">
          ${money(amount)}
        </span>
      </span>
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
