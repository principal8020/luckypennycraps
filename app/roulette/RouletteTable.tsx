"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AMERICAN_WHEEL,
  pocketColor,
  randomRoulettePocket,
  selectionKey,
  selectionLabel,
  settleRouletteBets,
  type RouletteBet,
  type RoulettePocket,
  type RouletteSelection,
  type RouletteSettlement,
} from "./rouletteRules";

const STARTING_BANKROLL = 5000;
const TABLE_MAX = 1000;
const chipValues = [1, 5, 25, 100, 500];

const numberRows: RoulettePocket[][] = [
  ["3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"],
  ["2", "5", "8", "11", "14", "17", "20", "23", "26", "29", "32", "35"],
  ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28", "31", "34"],
];

type BetMap = Record<string, RouletteBet>;

type SpinHistoryItem = {
  id: number;
  pocket: RoulettePocket;
  net: number;
  wager: number;
};

type RoundResult = RouletteSettlement & {
  id: number;
  pocket: RoulettePocket;
};

type RouletteBetButtonProps = {
  selection: RouletteSelection;
  amount: number;
  disabled: boolean;
  onBet: (selection: RouletteSelection) => void;
  className: string;
  children: ReactNode;
};

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function signedMoney(amount: number) {
  if (amount === 0) return "$0";
  return `${amount > 0 ? "+" : "-"}$${money(Math.abs(amount))}`;
}

function pocketClasses(pocket: RoulettePocket) {
  const color = pocketColor(pocket);
  if (color === "red") return "border-red-200/70 bg-red-700 text-white";
  if (color === "black") return "border-zinc-400/70 bg-zinc-950 text-white";
  return "border-emerald-200/70 bg-emerald-700 text-white";
}

function BetMarker({ amount }: { amount: number }) {
  if (amount <= 0) return null;

  return (
    <span className="absolute right-1 top-1 z-20 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-dashed border-white bg-amber-400 px-1 text-[8px] font-black text-black shadow-[0_3px_9px_rgba(0,0,0,.65)]">
      ${money(amount)}
    </span>
  );
}

function RouletteBetButton({
  selection,
  amount,
  disabled,
  onBet,
  className,
  children,
}: RouletteBetButtonProps) {
  const label = selectionLabel(selection);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onBet(selection)}
      aria-label={`${label}. Current wager $${money(amount)}.`}
      className={`relative isolate overflow-hidden font-black transition hover:brightness-110 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-70 ${className} ${
        amount > 0
          ? "outline outline-[3px] outline-amber-300 outline-offset-[-3px] shadow-[inset_0_0_18px_rgba(251,191,36,.2)]"
          : ""
      }`}
    >
      {children}
      <BetMarker amount={amount} />
    </button>
  );
}

function CasinoChip({ value, selected }: { value: number; selected: boolean }) {
  const colors =
    value === 1
      ? "border-slate-500 bg-white text-slate-950"
      : value === 5
        ? "border-white bg-red-600 text-white"
        : value === 25
          ? "border-white bg-emerald-700 text-white"
          : value === 100
            ? "border-white bg-zinc-950 text-white"
            : "border-white bg-purple-700 text-white";

  return (
    <span
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-dashed text-[9px] font-black shadow-[0_5px_12px_rgba(0,0,0,.58)] transition sm:h-14 sm:w-14 sm:text-[10px] ${colors} ${
        selected
          ? "scale-105 ring-4 ring-amber-300 ring-offset-2 ring-offset-[#03130e]"
          : ""
      }`}
    >
      <span className="absolute inset-[5px] rounded-full border border-current opacity-35" />
      <span className="relative">${value}</span>
    </span>
  );
}

function RouletteWheel({
  rotation,
  pocket,
  spinning,
}: {
  rotation: number;
  pocket: RoulettePocket | null;
  spinning: boolean;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[350px]" aria-live="polite">
      <div className="absolute left-1/2 top-0 z-40 h-0 w-0 -translate-x-1/2 border-l-[13px] border-r-[13px] border-t-[24px] border-l-transparent border-r-transparent border-t-amber-300 drop-shadow-[0_4px_4px_rgba(0,0,0,.8)]" />
      <div className="absolute inset-1 rounded-full border-[10px] border-[#704015] bg-[radial-gradient(circle,#d7ad4e_0_6%,#503015_7%_14%,#e0b85d_15%_17%,#17120b_18%_35%,transparent_36%),repeating-conic-gradient(#991b1b_0deg_9.473deg,#09090b_9.473deg_18.946deg)] shadow-[0_20px_45px_rgba(0,0,0,.55),inset_0_0_0_3px_rgba(255,238,170,.38)]">
        <div
          className="absolute inset-[11px] rounded-full transition-transform duration-[3400ms] ease-[cubic-bezier(.12,.72,.1,1)] motion-reduce:duration-500"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {AMERICAN_WHEEL.map((wheelPocket, index) => {
            const angle = (index / AMERICAN_WHEEL.length) * 360;
            return (
              <span
                key={wheelPocket}
                className={`absolute left-1/2 top-1/2 flex h-6 min-w-6 items-center justify-center rounded-full border px-0.5 text-[7px] font-black shadow-md sm:h-7 sm:min-w-7 sm:text-[8px] ${pocketClasses(
                  wheelPocket
                )}`}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-142px) rotate(${-angle}deg)`,
                }}
              >
                {wheelPocket}
              </span>
            );
          })}
        </div>

        <div className="absolute inset-[34%] z-30 flex items-center justify-center rounded-full border-[5px] border-amber-200/70 bg-[radial-gradient(circle_at_35%_28%,#fff2b8,#bf861d_28%,#4b2c0b_72%)] shadow-[0_8px_22px_rgba(0,0,0,.7)]">
          <div className="text-center text-amber-50">
            <div className="text-[8px] font-black uppercase tracking-[0.18em]">
              {spinning ? "Spinning" : pocket ? "Winner" : "American"}
            </div>
            <div className="mt-1 text-3xl font-black sm:text-4xl">
              {spinning ? "•" : pocket ?? "LP"}
            </div>
          </div>
        </div>
      </div>

      <span
        className={`absolute left-1/2 top-8 z-50 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-slate-300 bg-white shadow-[0_3px_8px_rgba(0,0,0,.8)] ${
          spinning ? "motion-safe:animate-bounce" : ""
        }`}
      />
    </div>
  );
}

export function RouletteTable() {
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [selectedChip, setSelectedChip] = useState(25);
  const [removeMode, setRemoveMode] = useState(false);
  const [bets, setBets] = useState<BetMap>({});
  const [lastBets, setLastBets] = useState<RouletteBet[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [winningPocket, setWinningPocket] = useState<RoulettePocket | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [history, setHistory] = useState<SpinHistoryItem[]>([]);
  const [spinCount, setSpinCount] = useState(0);
  const [lifetimeWager, setLifetimeWager] = useState(0);
  const [message, setMessage] = useState("Choose a chip, place one or more bets, then spin.");
  const spinTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimerRef.current !== null) window.clearTimeout(spinTimerRef.current);
    };
  }, []);

  const totalOnTable = useMemo(
    () => Object.values(bets).reduce((total, bet) => total + bet.amount, 0),
    [bets]
  );
  const sessionPL = bankroll + totalOnTable - STARTING_BANKROLL;

  function amountFor(selection: RouletteSelection) {
    return bets[selectionKey(selection)]?.amount ?? 0;
  }

  function handleBet(selection: RouletteSelection) {
    if (isSpinning) return;

    const key = selectionKey(selection);
    const currentAmount = bets[key]?.amount ?? 0;
    const label = selectionLabel(selection);

    if (removeMode) {
      if (currentAmount <= 0) {
        setMessage(`There is no wager on ${label} to remove.`);
        return;
      }

      const removed = Math.min(selectedChip, currentAmount);
      setBets((current) => {
        const next = { ...current };
        const remaining = currentAmount - removed;
        if (remaining > 0) next[key] = { selection, amount: remaining };
        else delete next[key];
        return next;
      });
      setBankroll((current) => current + removed);
      setMessage(`Removed $${money(removed)} from ${label}.`);
      return;
    }

    if (bankroll < selectedChip) {
      setMessage("Your bankroll is too low for that chip.");
      return;
    }

    if (currentAmount + selectedChip > TABLE_MAX) {
      setMessage(`${label} has reached the $${money(TABLE_MAX)} table maximum.`);
      return;
    }

    setBets((current) => ({
      ...current,
      [key]: { selection, amount: currentAmount + selectedChip },
    }));
    setBankroll((current) => current - selectedChip);
    setMessage(`Placed $${money(selectedChip)} on ${label}.`);
  }

  function clearBets() {
    if (isSpinning || totalOnTable === 0) return;
    setBankroll((current) => current + totalOnTable);
    setBets({});
    setMessage("Bets cleared and returned to your bankroll.");
  }

  function repeatLastBets() {
    if (isSpinning || totalOnTable > 0 || lastBets.length === 0) return;

    const repeatTotal = lastBets.reduce((total, bet) => total + bet.amount, 0);
    if (repeatTotal > bankroll) {
      setMessage("Your bankroll is too low to repeat the previous spin.");
      return;
    }

    const repeated = Object.fromEntries(
      lastBets.map((bet) => [selectionKey(bet.selection), bet])
    );
    setBets(repeated);
    setBankroll((current) => current - repeatTotal);
    setMessage(`Repeated $${money(repeatTotal)} across ${lastBets.length} bets.`);
  }

  function resetSession() {
    if (isSpinning) return;
    setBankroll(STARTING_BANKROLL);
    setBets({});
    setLastBets([]);
    setWinningPocket(null);
    setRoundResult(null);
    setHistory([]);
    setSpinCount(0);
    setLifetimeWager(0);
    setMessage("New session ready. Place your bets.");
  }

  function spinWheel() {
    if (isSpinning) return;
    if (totalOnTable <= 0) {
      setMessage("Place at least one bet before spinning.");
      return;
    }

    const outcome = randomRoulettePocket();
    const outcomeIndex = AMERICAN_WHEEL.indexOf(outcome);
    const sector = 360 / AMERICAN_WHEEL.length;
    const roundBets = Object.values(bets);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 500 : 3400;

    setRoundResult(null);
    setIsSpinning(true);
    setWinningPocket(null);
    setMessage("No more bets. The wheel is spinning.");
    setWheelRotation((current) => {
      const normalized = ((current % 360) + 360) % 360;
      const target = (360 - outcomeIndex * sector) % 360;
      const distance = (target - normalized + 360) % 360;
      return current + (reducedMotion ? 360 : 1800) + distance;
    });

    spinTimerRef.current = window.setTimeout(() => {
      const settlement = settleRouletteBets(roundBets, outcome);
      const id = Date.now();

      setBankroll((current) => current + settlement.grossReturn);
      setLastBets(roundBets);
      setBets({});
      setWinningPocket(outcome);
      setRoundResult({ ...settlement, id, pocket: outcome });
      setHistory((current) => [
        { id, pocket: outcome, net: settlement.net, wager: settlement.totalStake },
        ...current,
      ].slice(0, 12));
      setSpinCount((current) => current + 1);
      setLifetimeWager((current) => current + settlement.totalStake);
      setIsSpinning(false);
      spinTimerRef.current = null;

      if (settlement.net > 0) {
        setMessage(`${outcome} wins. You made $${money(settlement.net)}.`);
      } else if (settlement.net === 0) {
        setMessage(`${outcome} wins. Your bets broke even.`);
      } else {
        setMessage(`${outcome} wins. You lost $${money(Math.abs(settlement.net))}.`);
      }
    }, duration + 120);
  }

  return (
    <div className="text-white">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
            Lucky Penny American Roulette
          </div>
          <h1 className="mt-1 text-3xl font-black sm:text-4xl">Roulette practice table</h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-emerald-50/65">
            Practice straight-up and outside bets on a 38-pocket American wheel with 0 and 00.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            ["Bankroll", `$${money(bankroll)}`],
            ["On Table", `$${money(totalOnTable)}`],
            ["Session P/L", signedMoney(sessionPL)],
            ["Spins", String(spinCount)],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[82px] rounded-xl border border-emerald-800/80 bg-black/25 px-3 py-2 text-center">
              <div className="text-[7px] font-black uppercase tracking-[0.13em] text-emerald-400">{label}</div>
              <div className={`mt-1 text-base font-black ${label === "Session P/L" && sessionPL < 0 ? "text-red-300" : "text-white"}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-[30px] border-[10px] border-[#60320f] bg-[#075b3a] shadow-[0_24px_60px_rgba(0,0,0,.58),inset_0_0_0_3px_rgba(221,177,73,.28)]">
        <div
          className="relative p-3 sm:p-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 8%, rgba(255,255,255,.06), transparent 27%), repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0px, rgba(255,255,255,.012) 1px, rgba(0,0,0,.018) 1px, rgba(0,0,0,.018) 3px)",
          }}
        >
          {roundResult && (
            <div key={roundResult.id} className="roulette-round-outcome pointer-events-none absolute inset-0 z-[80] flex items-center justify-center bg-black/25">
              <div className={`rounded-2xl border-2 px-8 py-5 text-center shadow-[0_18px_55px_rgba(0,0,0,.7)] ${roundResult.net >= 0 ? "border-emerald-200 bg-emerald-950/95" : "border-red-200 bg-red-950/95"}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Winning number</div>
                <div className="mt-1 text-5xl font-black">{roundResult.pocket}</div>
                <div className={`mt-2 text-2xl font-black ${roundResult.net >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {roundResult.net > 0 ? "WIN " : roundResult.net === 0 ? "PUSH " : "LOSS "}
                  {signedMoney(roundResult.net)}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[350px_minmax(0,1fr)] xl:items-center">
            <div className="rounded-2xl border border-emerald-200/20 bg-black/20 p-3">
              <RouletteWheel rotation={wheelRotation} pocket={winningPocket} spinning={isSpinning} />
              <div className="mt-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center">
                <div className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-400">Dealer</div>
                <div className="mt-1 min-h-5 text-xs font-bold text-amber-100" aria-live="polite">{message}</div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[8px] font-black uppercase tracking-[0.14em] text-emerald-200/75">
                <span>American layout • 0 and 00</span>
                <span>Table minimum $1 • Maximum $1,000 per position</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-emerald-100/30 bg-black/10 p-2">
                <div className="flex min-w-[850px] gap-1">
                  <div className="grid w-[62px] shrink-0 grid-rows-2 gap-1">
                    {(["0", "00"] as RoulettePocket[]).map((pocket) => {
                      const selection: RouletteSelection = { kind: "straight", pocket };
                      return (
                        <RouletteBetButton
                          key={pocket}
                          selection={selection}
                          amount={amountFor(selection)}
                          disabled={isSpinning}
                          onBet={handleBet}
                          className="rounded-l-3xl border-2 border-emerald-100/65 bg-emerald-700 text-2xl text-white"
                        >
                          {pocket}
                        </RouletteBetButton>
                      );
                    })}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="grid gap-1">
                      {numberRows.map((row) => (
                        <div key={row[0]} className="grid grid-cols-12 gap-1">
                          {row.map((pocket) => {
                            const selection: RouletteSelection = { kind: "straight", pocket };
                            return (
                              <RouletteBetButton
                                key={pocket}
                                selection={selection}
                                amount={amountFor(selection)}
                                disabled={isSpinning}
                                onBet={handleBet}
                                className={`h-[62px] border text-xl ${pocketClasses(pocket)}`}
                              >
                                {pocket}
                              </RouletteBetButton>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    <div className="mt-1 grid grid-cols-3 gap-1">
                      {([1, 2, 3] as const).map((dozen) => {
                        const selection: RouletteSelection = { kind: "dozen", dozen };
                        return (
                          <RouletteBetButton
                            key={dozen}
                            selection={selection}
                            amount={amountFor(selection)}
                            disabled={isSpinning}
                            onBet={handleBet}
                            className="h-14 border border-emerald-100/55 bg-emerald-950/35 text-sm text-emerald-50"
                          >
                            {selectionLabel(selection)}
                            <span className="block text-[8px] text-emerald-200/65">PAYS 2 TO 1</span>
                          </RouletteBetButton>
                        );
                      })}
                    </div>

                    <div className="mt-1 grid grid-cols-6 gap-1">
                      {[
                        { selection: { kind: "range", range: "low" } as const, label: "1 TO 18" },
                        { selection: { kind: "parity", parity: "even" } as const, label: "EVEN" },
                        { selection: { kind: "color", color: "red" } as const, label: "RED" },
                        { selection: { kind: "color", color: "black" } as const, label: "BLACK" },
                        { selection: { kind: "parity", parity: "odd" } as const, label: "ODD" },
                        { selection: { kind: "range", range: "high" } as const, label: "19 TO 36" },
                      ].map(({ selection, label }) => (
                        <RouletteBetButton
                          key={selectionKey(selection)}
                          selection={selection}
                          amount={amountFor(selection)}
                          disabled={isSpinning}
                          onBet={handleBet}
                          className={`h-14 border border-emerald-100/55 text-xs text-white ${selection.kind === "color" && selection.color === "red" ? "bg-red-700" : selection.kind === "color" && selection.color === "black" ? "bg-zinc-950" : "bg-emerald-950/35"}`}
                        >
                          {label}
                          <span className="block text-[8px] text-white/55">PAYS 1 TO 1</span>
                        </RouletteBetButton>
                      ))}
                    </div>
                  </div>

                  <div className="grid w-[76px] shrink-0 grid-rows-3 gap-1">
                    {([3, 2, 1] as const).map((column) => {
                      const selection: RouletteSelection = { kind: "column", column };
                      return (
                        <RouletteBetButton
                          key={column}
                          selection={selection}
                          amount={amountFor(selection)}
                          disabled={isSpinning}
                          onBet={handleBet}
                          className="border border-emerald-100/55 bg-emerald-950/35 text-xs text-emerald-50"
                        >
                          2 TO 1
                          <span className="block text-[7px] text-emerald-200/55">COL {column}</span>
                        </RouletteBetButton>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-bold text-emerald-100/65">
                  Straight up pays 35:1 • Dozens and columns pay 2:1 • Even-money bets pay 1:1
                </div>
                <div className="text-right text-[9px] font-black uppercase tracking-[0.12em] text-emerald-300/70">
                  Lifetime wager ${money(lifetimeWager)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky bottom-2 z-[100] mt-3 rounded-2xl border border-emerald-700/80 bg-[#03130e]/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,.65)] backdrop-blur">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <div className="shrink-0">
            <div className="mb-1 text-[8px] font-black uppercase tracking-[0.14em] text-emerald-400">Bet chips</div>
            <div className="flex gap-2">
              {chipValues.map((chip) => (
                <button key={chip} type="button" onClick={() => setSelectedChip(chip)} disabled={isSpinning} aria-label={`Select $${chip} chip`} className="rounded-full disabled:opacity-60">
                  <CasinoChip value={chip} selected={selectedChip === chip} />
                </button>
              ))}
            </div>
          </div>

          <div className="h-12 w-px shrink-0 bg-white/10" />

          <button type="button" onClick={() => setRemoveMode((current) => !current)} disabled={isSpinning} className={`shrink-0 rounded-xl border px-4 py-3 text-xs font-black ${removeMode ? "border-red-300 bg-red-600 text-white" : "border-amber-300 bg-amber-400 text-black"}`}>
            {removeMode ? "REMOVE MODE" : "ADD MODE"}
          </button>
          <button type="button" onClick={clearBets} disabled={isSpinning || totalOnTable === 0} className="shrink-0 rounded-xl border border-emerald-700 bg-emerald-950/60 px-4 py-3 text-xs font-black text-emerald-100 disabled:opacity-35">CLEAR</button>
          <button type="button" onClick={repeatLastBets} disabled={isSpinning || totalOnTable > 0 || lastBets.length === 0} className="shrink-0 rounded-xl border border-emerald-700 bg-emerald-950/60 px-4 py-3 text-xs font-black text-emerald-100 disabled:opacity-35">REPEAT</button>
          <button type="button" onClick={resetSession} disabled={isSpinning} className="shrink-0 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-xs font-black text-white/65 disabled:opacity-35">RESET</button>

          <div className="ml-auto shrink-0 rounded-xl border border-amber-300/35 bg-amber-950/25 px-4 py-2 text-center">
            <div className="text-[7px] font-black uppercase tracking-[0.14em] text-amber-300">Total bet</div>
            <div className="text-lg font-black text-white">${money(totalOnTable)}</div>
          </div>

          <button type="button" onClick={spinWheel} disabled={isSpinning || totalOnTable === 0} className="shrink-0 rounded-xl bg-amber-400 px-7 py-4 text-base font-black text-black shadow-[0_8px_25px_rgba(251,191,36,.2)] transition hover:bg-amber-300 active:scale-[.98] disabled:cursor-not-allowed disabled:bg-amber-900 disabled:text-amber-100/35">
            {isSpinning ? "SPINNING…" : "SPIN WHEEL"}
          </button>
        </div>
      </div>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-emerald-900/80 bg-black/25 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400">Recent spins</div>
              <div className="mt-1 text-sm font-bold text-emerald-50/60">Newest result first</div>
            </div>
            <div className="text-[9px] font-black text-emerald-300/60">{history.length}/12 shown</div>
          </div>

          {history.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-emerald-800/60 px-4 py-6 text-center text-sm font-medium text-emerald-100/35">Complete a spin and the result will appear here.</div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {history.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                  <span className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-1 text-sm font-black ${pocketClasses(item.pocket)}`}>{item.pocket}</span>
                  <div>
                    <div className={`text-xs font-black ${item.net >= 0 ? "text-emerald-300" : "text-red-300"}`}>{signedMoney(item.net)}</div>
                    <div className="text-[7px] font-bold uppercase text-white/35">Bet ${money(item.wager)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-amber-800/60 bg-amber-950/10 p-4">
          <div className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-300">First-table rules</div>
          <ul className="mt-3 space-y-2 text-xs font-medium leading-5 text-emerald-50/65">
            <li>• American roulette has 38 pockets: 1 through 36, 0, and 00.</li>
            <li>• Both green zero pockets lose on red/black, odd/even, high/low, dozens, and columns.</li>
            <li>• Click a position repeatedly to build a wager. Switch to Remove Mode to take chips back.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
