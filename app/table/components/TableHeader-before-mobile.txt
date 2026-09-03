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
    <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-900/80 bg-black/30 px-4 py-2">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-300/60 bg-amber-300/10 shadow-[inset_0_0_0_3px_rgba(251,191,36,.06)]">
          <span className="font-serif text-[13px] font-black tracking-[-0.08em] text-amber-200">
            LP
          </span>
          <span className="absolute bottom-[4px] text-[5px] font-black uppercase tracking-[0.18em] text-emerald-400">
            craps
          </span>
        </div>

        <div>
          <h1 className="text-lg font-black tracking-tight sm:text-xl">
            Lucky Penny Craps
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-400">
            Practice • Play • Learn
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-right">
        <Link href="/" className="text-xs text-emerald-300 underline">
          Home
        </Link>

        <div className="hidden items-center gap-1 rounded-lg border border-emerald-800/60 bg-emerald-950/30 px-2 py-1 lg:flex">
          <span className="text-[6px] font-black uppercase tracking-[0.16em] text-emerald-500">
            Table
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
  );
}
