type BetChipProps = {
  amount: number;
  compact?: boolean;
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function chipRangeStyle(amount: number) {
  if (amount < 5) {
    return "bg-white text-black border-slate-400";
  }
  if (amount < 25) {
    return "bg-red-600 text-white border-white";
  }
  if (amount < 100) {
    return "bg-green-700 text-white border-white";
  }
  if (amount < 500) {
    return "bg-zinc-950 text-white border-white";
  }
  if (amount < 1000) {
    return "bg-purple-700 text-white border-white";
  }
  return "bg-yellow-400 text-black border-yellow-100";
}

export function BetChip({
  amount,
  compact = false,
}: BetChipProps) {
  if (amount <= 0) return null;

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full border-dashed font-black shadow-xl ${
        compact
          ? "h-8 min-w-8 border-[3px] px-1.5 text-[8px] ring-1 ring-white/35"
          : "h-12 min-w-12 border-[4px] px-2 text-[10px]"
      } ${chipRangeStyle(amount)}`}
      title={`Total wager: $${money(amount)}`}
    >
      <span
        className={`absolute rounded-full border border-current opacity-40 ${
          compact ? "inset-[3px]" : "inset-[5px]"
        }`}
      />
      <span className="relative z-10">${money(amount)}</span>
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
