import Link from "next/link";
import { Stat } from "./TablePieces";

type TableHeaderProps = {
  bankroll: number;
  totalOnTable: number;
  sessionPL: number;
  rollCount: number;
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

export function TableHeader({
  bankroll,
  totalOnTable,
  sessionPL,
  rollCount,
}: TableHeaderProps) {
  return (
    <header className="mb-2 rounded-xl border border-emerald-900/80 bg-black/30 px-2.5 py-2 sm:px-3 lg:px-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-amber-300/60 bg-amber-300/10 sm:h-10 sm:w-10">
            <span className="font-serif text-[12px] font-black tracking-[-0.08em] text-amber-200">
              LP
            </span>
            <span className="absolute bottom-[3px] text-[4px] font-black uppercase tracking-[0.16em] text-emerald-400">
              gaming
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-black tracking-tight sm:text-lg lg:text-xl">
              Lucky Penny Gaming
            </h1>
            <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-emerald-400 sm:text-[8px]">
              Craps • Practice • Play • Learn
            </p>
          </div>
        </div>

        {/* Phone landscape / medium screens: keep stats in the same row. */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 sm:flex lg:hidden">
          <Stat label="Bankroll" value={`$${money(bankroll)}`} />
          <Stat label="On Table" value={`$${money(totalOnTable)}`} />
          <Stat
            label="Session P/L"
            value={`${sessionPL > 0 ? "+" : ""}$${money(sessionPL)}`}
            positive={sessionPL > 0}
            negative={sessionPL < 0}
          />
          <Stat label="Rolls" value={`${rollCount}`} />
          <Link
            href="/"
            className="shrink-0 rounded-md border border-emerald-800/70 px-2 py-1.5 text-[9px] font-bold text-emerald-300"
          >
            Home
          </Link>
        </div>

        {/* Portrait phone */}
        <Link
          href="/"
          className="shrink-0 rounded-md border border-emerald-800/70 px-2 py-1.5 text-[9px] font-bold text-emerald-300 sm:hidden"
        >
          Home
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 text-right lg:flex">
          <Link href="/" className="text-xs text-emerald-300 underline">
            Home
          </Link>

          <div className="hidden items-center gap-1 rounded-lg border border-emerald-800/60 bg-emerald-950/30 px-2 py-1 xl:flex">
            <span className="text-[6px] font-black uppercase tracking-[0.16em] text-emerald-500">
              Craps Table
            </span>
            <span className="text-[8px] font-black text-emerald-100">
              $5 BASE
            </span>
            <span className="text-[7px] text-emerald-700">•</span>
            <span className="text-[8px] font-black text-emerald-100">
              PLACE MAX $1K
            </span>
            <span className="text-[7px] text-emerald-700">•</span>
            <span className="text-[8px] font-black text-emerald-100">
              6/8 $1.2K
            </span>
            <span className="text-[7px] text-emerald-700">•</span>
            <span className="text-[8px] font-black text-amber-200">
              3-4-5× ODDS
            </span>
          </div>

          <Stat label="Bankroll" value={`$${money(bankroll)}`} />
          <Stat label="On Table" value={`$${money(totalOnTable)}`} />
          <Stat
            label="Session P/L"
            value={`${sessionPL > 0 ? "+" : ""}$${money(sessionPL)}`}
            positive={sessionPL > 0}
            negative={sessionPL < 0}
          />
          <Stat label="Rolls" value={`${rollCount}`} />
        </div>
      </div>

      {/* Only portrait-sized phones need a separate stats row. */}
      <div className="mt-2 grid grid-cols-4 gap-1 border-t border-white/10 pt-2 text-center sm:hidden">
        <div className="rounded-md bg-black/15 px-1 py-1">
          <Stat label="Bankroll" value={`$${money(bankroll)}`} />
        </div>
        <div className="rounded-md bg-black/15 px-1 py-1">
          <Stat label="On Table" value={`$${money(totalOnTable)}`} />
        </div>
        <div className="rounded-md bg-black/15 px-1 py-1">
          <Stat
            label="Session P/L"
            value={`${sessionPL > 0 ? "+" : ""}$${money(sessionPL)}`}
            positive={sessionPL > 0}
            negative={sessionPL < 0}
          />
        </div>
        <div className="rounded-md bg-black/15 px-1 py-1">
          <Stat label="Rolls" value={`${rollCount}`} />
        </div>
      </div>
    </header>
  );
}
