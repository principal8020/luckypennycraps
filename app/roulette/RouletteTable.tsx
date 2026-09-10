"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AMERICAN_WHEEL,
  pocketColor,
  payoutOdds,
  randomRoulettePocket,
  selectionKey,
  selectionLabel,
  selectionWins,
  settleRouletteBets,
  type RouletteBet,
  type RoulettePocket,
  type RouletteSelection,
  type RouletteSettlement,
} from "./rouletteRules";

const STARTING_BANKROLL = 5000;
const TABLE_MIN = 5;
const INSIDE_POSITION_MIN = 1;
const OUTSIDE_POSITION_MIN = 5;
const TABLE_MAX = 1000;
const RESULT_REVIEW_MS = 2000;
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
  grossReturn: number;
  bets: RouletteBet[];
};

type RoundResult = RouletteSettlement & {
  id: number;
  pocket: RoulettePocket;
};

type RouletteBetButtonProps = {
  selection: RouletteSelection;
  amount: number;
  disabled: boolean;
  highlighted?: boolean;
  onBet: (selection: RouletteSelection, reduce: boolean) => void;
  className: string;
  children: ReactNode;
};

type InsideBetSpot = {
  selection: RouletteSelection;
  left: string;
  top: string;
  shape: "horizontal" | "vertical" | "corner";
};

type RouletteLearnStep = {
  action: "bet" | "spin" | "complete";
  title: string;
  instruction: string;
  explanation: string;
  selection?: RouletteSelection;
  requiredChip?: number;
};

const rouletteLearnSteps: RouletteLearnStep[] = [
  {
    action: "bet",
    title: "Build a $5 inside wager",
    instruction: "Place one $1 chip directly on the highlighted 17.",
    explanation: "Inside bets can use $1 chips, but this table requires at least $5 in total action before a spin.",
    selection: { kind: "straight", pocket: "17" },
    requiredChip: 1,
  },
  {
    action: "bet",
    title: "Add the second inside number",
    instruction: "Place one $1 chip directly on the highlighted 20.",
    explanation: "Each straight-up number pays 35 to 1 if it wins.",
    selection: { kind: "straight", pocket: "20" },
    requiredChip: 1,
  },
  {
    action: "bet",
    title: "Add the third inside number",
    instruction: "Place one $1 chip directly on the highlighted 16.",
    explanation: "You now have $3 spread across three separate inside numbers.",
    selection: { kind: "straight", pocket: "16" },
    requiredChip: 1,
  },
  {
    action: "bet",
    title: "Add the fourth inside number",
    instruction: "Place one $1 chip directly on the highlighted 19.",
    explanation: "Spreading chips covers more numbers, but every straight-up wager is settled separately.",
    selection: { kind: "straight", pocket: "19" },
    requiredChip: 1,
  },
  {
    action: "bet",
    title: "Complete the $5 inside minimum",
    instruction: "Place one $1 chip directly on the highlighted 22.",
    explanation: "Five $1 number bets create $5 in total inside action, satisfying this table's minimum.",
    selection: { kind: "straight", pocket: "22" },
    requiredChip: 1,
  },
  {
    action: "bet",
    title: "Add a $5 outside bet",
    instruction: "The $5 chip is selected for you. Place it on the highlighted RED betting area.",
    explanation: "Outside bets have a $5 minimum per position. Red covers 18 of 38 pockets and pays even money. Both 0 and 00 still lose.",
    selection: { kind: "color", color: "red" },
    requiredChip: 5,
  },
  {
    action: "spin",
    title: "Spin and settle the bets",
    instruction: "Select the highlighted SPIN WHEEL button to complete the round.",
    explanation: "The same winning pocket will be checked against every bet on the table.",
  },
  {
    action: "complete",
    title: "Lesson complete",
    instruction: "You placed five $1 inside bets, one $5 outside bet, and watched the complete settlement.",
    explanation: "Open the newest Recent Spins result to see exactly how every wager performed.",
  },
];

const insideBetSpots: InsideBetSpot[] = [];

for (let row = 0; row < numberRows.length; row += 1) {
  for (let column = 0; column < numberRows[row].length - 1; column += 1) {
    insideBetSpots.push({
      selection: {
        kind: "split",
        pockets: [numberRows[row][column], numberRows[row][column + 1]],
      },
      left: `${((column + 1) / 12) * 100}%`,
      top: `${((row + 0.5) / 3) * 100}%`,
      shape: "vertical",
    });
  }
}

for (let row = 0; row < numberRows.length - 1; row += 1) {
  for (let column = 0; column < numberRows[row].length; column += 1) {
    insideBetSpots.push({
      selection: {
        kind: "split",
        pockets: [numberRows[row][column], numberRows[row + 1][column]],
      },
      left: `${((column + 0.5) / 12) * 100}%`,
      top: `${((row + 1) / 3) * 100}%`,
      shape: "horizontal",
    });
  }
}

for (let column = 0; column < numberRows[0].length; column += 1) {
  insideBetSpots.push({
    selection: {
      kind: "street",
      pockets: [
        numberRows[2][column],
        numberRows[1][column],
        numberRows[0][column],
      ],
    },
    left: `${((column + 0.5) / 12) * 100}%`,
    top: "100%",
    shape: "horizontal",
  });
}

const zeroBetSpots: InsideBetSpot[] = [
  {
    selection: { kind: "split", pockets: ["0", "00"] },
    left: "50%",
    top: "50%",
    shape: "horizontal",
  },
  {
    selection: { kind: "split", pockets: ["00", "3"] },
    left: "100%",
    top: "16.67%",
    shape: "vertical",
  },
  {
    selection: { kind: "split", pockets: ["00", "2"] },
    left: "100%",
    top: "43%",
    shape: "corner",
  },
  {
    selection: { kind: "split", pockets: ["0", "2"] },
    left: "100%",
    top: "57%",
    shape: "corner",
  },
  {
    selection: { kind: "split", pockets: ["0", "1"] },
    left: "100%",
    top: "83.33%",
    shape: "vertical",
  },
];

for (let row = 0; row < numberRows.length - 1; row += 1) {
  for (let column = 0; column < numberRows[row].length - 1; column += 1) {
    insideBetSpots.push({
      selection: {
        kind: "corner",
        pockets: [
          numberRows[row][column],
          numberRows[row][column + 1],
          numberRows[row + 1][column],
          numberRows[row + 1][column + 1],
        ],
      },
      left: `${((column + 1) / 12) * 100}%`,
      top: `${((row + 1) / 3) * 100}%`,
      shape: "corner",
    });
  }
}

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function signedMoney(amount: number) {
  if (amount === 0) return "$0";
  return `${amount > 0 ? "+" : "-"}$${money(Math.abs(amount))}`;
}

function betNet(bet: RouletteBet, outcome: RoulettePocket) {
  return selectionWins(bet.selection, outcome)
    ? bet.amount * payoutOdds(bet.selection)
    : -bet.amount;
}

function minimumForSelection(selection: RouletteSelection) {
  return selection.kind === "straight" ||
    selection.kind === "split" ||
    selection.kind === "street" ||
    selection.kind === "corner"
    ? INSIDE_POSITION_MIN
    : OUTSIDE_POSITION_MIN;
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
  highlighted = false,
  onBet,
  className,
  children,
}: RouletteBetButtonProps) {
  const label = selectionLabel(selection);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => onBet(selection, event.shiftKey)}
      data-selection-key={selectionKey(selection)}
      aria-label={`${label}. Current wager $${money(amount)}. Shift-click to reduce.`}
      className={`relative isolate overflow-hidden font-black transition hover:brightness-110 active:scale-[.98] disabled:cursor-not-allowed ${className} ${
        highlighted
          ? "z-20 outline outline-[5px] outline-amber-100 outline-offset-[-5px] brightness-125 shadow-[inset_0_0_28px_rgba(253,230,138,.65),0_0_22px_rgba(253,230,138,.8)] motion-safe:animate-pulse"
          : amount > 0
          ? "outline outline-[3px] outline-amber-300 outline-offset-[-3px] shadow-[inset_0_0_18px_rgba(251,191,36,.2)]"
          : ""
      }`}
    >
      {children}
      <BetMarker amount={amount} />
    </button>
  );
}

function InsideBetButton({
  spot,
  amount,
  disabled,
  highlighted = false,
  onBet,
}: {
  spot: InsideBetSpot;
  amount: number;
  disabled: boolean;
  highlighted?: boolean;
  onBet: (selection: RouletteSelection, reduce: boolean) => void;
}) {
  const label = selectionLabel(spot.selection);
  const odds = payoutOdds(spot.selection);
  const hitArea =
    spot.shape === "vertical"
      ? "h-11 w-8 sm:h-10 sm:w-5"
      : spot.shape === "horizontal"
        ? "h-8 w-11 sm:h-5 sm:w-10"
        : "h-9 w-9 sm:h-7 sm:w-7";
  const marker =
    spot.shape === "vertical"
      ? "h-7 w-[3px]"
      : spot.shape === "horizontal"
        ? "h-[3px] w-7"
        : "h-2.5 w-2.5 rounded-full";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => onBet(spot.selection, event.shiftKey)}
      data-selection-key={selectionKey(spot.selection)}
      aria-label={`${label}. Pays ${odds} to 1. Current wager $${money(amount)}. Shift-click to reduce.`}
      title={`${label} • Pays ${odds}:1 • Shift-click to reduce`}
      className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-200 disabled:cursor-not-allowed ${hitArea} ${highlighted ? "z-[60] bg-amber-300/25 ring-4 ring-amber-200/90 shadow-[0_0_22px_rgba(253,230,138,.95)] motion-safe:animate-pulse" : amount > 0 ? "z-50" : spot.shape === "corner" ? "z-40" : "z-30"}`}
      style={{ left: spot.left, top: spot.top }}
    >
      {amount > 0 ? (
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-dashed border-white bg-amber-400 px-1 text-[7px] font-black text-black shadow-[0_3px_9px_rgba(0,0,0,.7)]">
          ${money(amount)}
        </span>
      ) : (
        <span
          className={`border border-amber-100/45 bg-amber-200/35 opacity-65 shadow-[0_1px_4px_rgba(0,0,0,.8)] transition group-hover:scale-125 group-hover:border-amber-200 group-hover:bg-amber-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${marker}`}
        />
      )}
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
                className={`absolute left-1/2 top-1/2 flex h-6 min-w-6 items-center justify-center rounded-full border px-0.5 text-[7px] font-black shadow-md transition-transform duration-[3400ms] ease-[cubic-bezier(.12,.72,.1,1)] motion-reduce:duration-500 sm:h-7 sm:min-w-7 sm:text-[8px] ${pocketClasses(
                  wheelPocket
                )}`}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-142px) rotate(${-angle - rotation}deg)`,
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

function RouletteLearnCoach({
  enabled,
  stepIndex,
  feedback,
  disabled,
  onStart,
  onExit,
  onRestart,
}: {
  enabled: boolean;
  stepIndex: number;
  feedback: string;
  disabled: boolean;
  onStart: () => void;
  onExit: () => void;
  onRestart: () => void;
}) {
  if (!enabled) {
    return (
      <div className="rounded-2xl border border-sky-300/35 bg-sky-950/75 p-3 shadow-[0_12px_32px_rgba(0,0,0,.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.16em] text-sky-300">Learn Mode</div>
            <div className="mt-1 text-xs font-bold text-sky-50/75">Build a $5 inside wager, add a $5 outside bet, and watch both settle.</div>
          </div>
          <button type="button" onClick={onStart} disabled={disabled} className="rounded-xl bg-sky-300 px-4 py-2.5 text-xs font-black text-sky-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-45">
            START LESSON
          </button>
        </div>
      </div>
    );
  }

  const step = rouletteLearnSteps[stepIndex];
  const lessonStepCount = rouletteLearnSteps.length - 1;
  const completed = step.action === "complete";
  const progress = completed ? 100 : ((stepIndex + 1) / lessonStepCount) * 100;

  return (
    <div id="roulette-learn-mode-coach" aria-live="polite" className="rounded-2xl border border-sky-200/60 bg-[#08283a]/95 p-3 shadow-[0_14px_36px_rgba(0,0,0,.5)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-sky-300">
            Learn Mode On • {completed ? "Complete" : `Step ${stepIndex + 1} of ${lessonStepCount}`}
          </div>
          <div className="mt-1 text-sm font-black text-white">{step.title}</div>
        </div>
        <button type="button" onClick={onExit} disabled={disabled} className="shrink-0 rounded-lg border border-sky-100/25 px-2.5 py-1.5 text-[9px] font-black text-sky-100/70 hover:border-sky-100/50 hover:text-white disabled:opacity-40">
          EXIT
        </button>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/35">
        <div className="h-full rounded-full bg-sky-300 transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <p className="mt-3 text-xs font-bold leading-5 text-sky-50">{step.instruction}</p>
      <p className="mt-1 text-[10px] font-medium leading-4 text-sky-100/65">{step.explanation}</p>
      {feedback && <p className="mt-2 rounded-lg border border-emerald-300/20 bg-emerald-950/35 px-2.5 py-2 text-[10px] font-bold text-emerald-200">{feedback}</p>}

      {completed && (
        <button type="button" onClick={onRestart} disabled={disabled} className="mt-3 w-full rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-amber-300 disabled:opacity-45">
          PRACTICE AGAIN
        </button>
      )}
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
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [winningPocket, setWinningPocket] = useState<RoulettePocket | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [history, setHistory] = useState<SpinHistoryItem[]>([]);
  const [selectedSpin, setSelectedSpin] = useState<SpinHistoryItem | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [lifetimeWager, setLifetimeWager] = useState(0);
  const [learnMode, setLearnMode] = useState(false);
  const [learnStep, setLearnStep] = useState(0);
  const [learnFeedback, setLearnFeedback] = useState("");
  const [message, setMessage] = useState("Choose a chip, place one or more bets, then spin.");
  const spinTimerRef = useRef<number | null>(null);
  const boardScrollRef = useRef<HTMLDivElement | null>(null);
  const spinButtonRef = useRef<HTMLButtonElement | null>(null);

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
  const activeLearnStep = rouletteLearnSteps[learnStep];
  const learnTargetKey =
    learnMode && activeLearnStep.action === "bet" && activeLearnStep.selection
      ? selectionKey(activeLearnStep.selection)
      : null;

  useEffect(() => {
    if (!learnTargetKey) return;
    const target = boardScrollRef.current?.querySelector<HTMLElement>(
      `[data-selection-key="${learnTargetKey}"]`
    );
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [learnTargetKey]);

  useEffect(() => {
    if (!learnMode || activeLearnStep.action !== "spin") return;
    spinButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeLearnStep.action, learnMode]);

  function amountFor(selection: RouletteSelection) {
    return bets[selectionKey(selection)]?.amount ?? 0;
  }

  function startLearnMode() {
    if (isSpinning) return;
    if (totalOnTable > 0) setBankroll((current) => current + totalOnTable);
    setBets({});
    setRemoveMode(false);
    setRoundResult(null);
    setSelectedSpin(null);
    setLearnMode(true);
    setLearnStep(0);
    setSelectedChip(1);
    setLearnFeedback("");
    setMessage("Learn Mode started. Place one $1 chip on the highlighted 17.");
    window.setTimeout(() => {
      document.getElementById("roulette-learn-mode-coach")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function exitLearnMode() {
    if (isSpinning) return;
    setLearnMode(false);
    setLearnFeedback("");
    setMessage("Learn Mode closed. You can continue playing normally.");
  }

  function handleBet(selection: RouletteSelection, reduce = false) {
    if (isSpinning) return;

    const key = selectionKey(selection);
    const currentAmount = bets[key]?.amount ?? 0;
    const label = selectionLabel(selection);

    if (learnMode) {
      if (activeLearnStep.action !== "bet" || !activeLearnStep.selection) {
        const guidance = activeLearnStep.action === "spin"
          ? "Your lesson bets are ready. Select SPIN WHEEL next."
          : "This lesson is complete. Select Practice Again to restart it.";
        setLearnFeedback(guidance);
        setMessage(guidance);
        return;
      }

      if (removeMode || reduce) {
        const guidance = "Keep the lesson bets on the table until the guided spin is complete.";
        setLearnFeedback(guidance);
        setMessage(guidance);
        return;
      }

      if (key !== selectionKey(activeLearnStep.selection)) {
        const guidance = `Not quite. Find the gold highlight and place a chip on ${selectionLabel(activeLearnStep.selection)}.`;
        setLearnFeedback(guidance);
        setMessage(guidance);
        return;
      }

      if (activeLearnStep.requiredChip && selectedChip !== activeLearnStep.requiredChip) {
        const guidance = `Select the $${activeLearnStep.requiredChip} chip for this lesson step.`;
        setLearnFeedback(guidance);
        setMessage(guidance);
        return;
      }
    }

    if (removeMode || reduce) {
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

    if (learnMode) {
      const completedExplanation = activeLearnStep.explanation;
      const nextStepIndex = Math.min(learnStep + 1, rouletteLearnSteps.length - 1);
      const nextStep = rouletteLearnSteps[nextStepIndex];
      setLearnStep(nextStepIndex);
      if (nextStep.requiredChip) setSelectedChip(nextStep.requiredChip);
      setLearnFeedback(`Correct. ${completedExplanation}`);
      setMessage(`Correct: ${label}. ${completedExplanation}`);
    } else {
      const newAmount = currentAmount + selectedChip;
      const requiredMinimum = minimumForSelection(selection);
      setMessage(
        newAmount < requiredMinimum
          ? `Placed $${money(selectedChip)} on ${label}. Add $${money(requiredMinimum - newAmount)} more to meet the $${money(requiredMinimum)} minimum.`
          : `Placed $${money(selectedChip)} on ${label}.`
      );
    }
  }

  function clearBets() {
    if (isSpinning || totalOnTable === 0) return;
    if (learnMode) {
      const guidance = "Keep the guided bets in place. Select EXIT if you want to return to regular play.";
      setLearnFeedback(guidance);
      setMessage(guidance);
      return;
    }
    setBankroll((current) => current + totalOnTable);
    setBets({});
    setMessage("Bets cleared and returned to your bankroll.");
  }

  function repeatLastBets() {
    if (isSpinning || totalOnTable > 0 || lastBets.length === 0) return;
    if (learnMode) return;

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
    setSelectedSpin(null);
    setSpinCount(0);
    setLifetimeWager(0);
    setMessage("New session ready. Place your bets.");
  }

  function spinWheel() {
    if (isSpinning) return;
    if (learnMode && activeLearnStep.action !== "spin") {
      const guidance = activeLearnStep.action === "complete"
        ? "This lesson is complete. Select Practice Again to run it another time."
        : "Finish the highlighted betting step before spinning the wheel.";
      setLearnFeedback(guidance);
      setMessage(guidance);
      return;
    }
    if (totalOnTable <= 0) {
      setMessage("Place at least one bet before spinning.");
      return;
    }
    if (totalOnTable < TABLE_MIN) {
      setMessage(`This is a $${money(TABLE_MIN)} table. Add $${money(TABLE_MIN - totalOnTable)} more before spinning.`);
      return;
    }
    const underMinimumBet = Object.values(bets).find(
      (bet) => bet.amount < minimumForSelection(bet.selection)
    );
    if (underMinimumBet) {
      const requiredMinimum = minimumForSelection(underMinimumBet.selection);
      setMessage(`${selectionLabel(underMinimumBet.selection)} requires at least $${money(requiredMinimum)} on this table.`);
      return;
    }

    const outcome = randomRoulettePocket();
    const outcomeIndex = AMERICAN_WHEEL.indexOf(outcome);
    const sector = 360 / AMERICAN_WHEEL.length;
    const roundBets = Object.values(bets);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 500 : 3400;

    setRoundResult(null);
    setSelectedSpin(null);
    setIsSpinning(true);
    setIsWheelSpinning(true);
    setWinningPocket(null);
    setMessage("No more bets. The wheel is spinning.");
    if (learnMode) setLearnFeedback("The wheel is spinning. Watch how one result settles all four bets.");
    setWheelRotation((current) => {
      const normalized = ((current % 360) + 360) % 360;
      const target = (360 - outcomeIndex * sector) % 360;
      const distance = (target - normalized + 360) % 360;
      return current + (reducedMotion ? 360 : 1800) + distance;
    });

    spinTimerRef.current = window.setTimeout(() => {
      setIsWheelSpinning(false);
      setWinningPocket(outcome);
      setMessage(`${outcome} wins. Winning number highlighted for two seconds.`);

      spinTimerRef.current = window.setTimeout(() => {
        const settlement = settleRouletteBets(roundBets, outcome);
        const id = Date.now();

        setBankroll((current) => current + settlement.grossReturn);
        setLastBets(roundBets);
        setBets({});
        setWinningPocket(null);
        setRoundResult({ ...settlement, id, pocket: outcome });
        setHistory((current) => [
          {
            id,
            pocket: outcome,
            net: settlement.net,
            wager: settlement.totalStake,
            grossReturn: settlement.grossReturn,
            bets: roundBets,
          },
          ...current,
        ].slice(0, 12));
        setSpinCount((current) => current + 1);
        setLifetimeWager((current) => current + settlement.totalStake);
        setIsSpinning(false);
        spinTimerRef.current = null;

        if (learnMode) {
          const resultSummary = settlement.net > 0
            ? `The wheel landed on ${outcome}, and the lesson bets won ${signedMoney(settlement.net)} overall.`
            : settlement.net === 0
              ? `The wheel landed on ${outcome}, and the lesson bets broke even.`
              : `The wheel landed on ${outcome}, and the lesson bets finished ${signedMoney(settlement.net)} overall.`;
          setLearnStep(rouletteLearnSteps.length - 1);
          setLearnFeedback(resultSummary);
        }

        if (settlement.net > 0) {
          setMessage(`${outcome} wins. You made $${money(settlement.net)}.`);
        } else if (settlement.net === 0) {
          setMessage(`${outcome} wins. Your bets broke even.`);
        } else {
          setMessage(`${outcome} wins. You lost $${money(Math.abs(settlement.net))}.`);
        }
      }, RESULT_REVIEW_MS);
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
            Practice straight-up, split, street, corner, and outside bets on a 38-pocket American wheel with 0 and 00.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4">
          {[
            ["Bankroll", `$${money(bankroll)}`],
            ["On Table", `$${money(totalOnTable)}`],
            ["Session P/L", signedMoney(sessionPL)],
            ["Spins", String(spinCount)],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-xl border border-emerald-800/80 bg-black/25 px-3 py-2 text-center sm:min-w-[82px]">
              <div className="text-[7px] font-black uppercase tracking-[0.13em] text-emerald-400">{label}</div>
              <div className={`mt-1 text-base font-black ${label === "Session P/L" && sessionPL < 0 ? "text-red-300" : "text-white"}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {learnMode && (
        <div className="sticky top-2 z-[110] mb-3">
          <RouletteLearnCoach
            enabled
            stepIndex={learnStep}
            feedback={learnFeedback}
            disabled={isSpinning}
            onStart={startLearnMode}
            onExit={exitLearnMode}
            onRestart={startLearnMode}
          />
        </div>
      )}

      <section className="overflow-hidden rounded-[30px] border-[10px] border-[#60320f] bg-[#075b3a] shadow-[0_24px_60px_rgba(0,0,0,.58),inset_0_0_0_3px_rgba(221,177,73,.28)]">
        <div
          className="relative p-3 sm:p-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 8%, rgba(255,255,255,.06), transparent 27%), repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0px, rgba(255,255,255,.012) 1px, rgba(0,0,0,.018) 1px, rgba(0,0,0,.018) 3px)",
          }}
        >
          {roundResult && (
            <div key={roundResult.id} className="roulette-round-outcome pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 xl:absolute xl:z-[80] xl:bg-black/25 xl:px-0">
              <div className={`w-full max-w-sm rounded-2xl border-2 px-8 py-5 text-center shadow-[0_18px_55px_rgba(0,0,0,.7)] xl:w-auto xl:max-w-none ${roundResult.net >= 0 ? "border-emerald-200 bg-emerald-950/95" : "border-red-200 bg-red-950/95"}`}>
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
            <div className="order-2 rounded-2xl border border-emerald-200/20 bg-black/20 p-3 xl:order-1">
              <RouletteWheel rotation={wheelRotation} pocket={winningPocket} spinning={isWheelSpinning} />
              <div className="mt-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center">
                <div className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-400">Dealer</div>
                <div className="mt-1 min-h-5 text-xs font-bold text-amber-100" aria-live="polite">{message}</div>
              </div>
            </div>

            <div className="order-1 min-w-0 xl:order-2">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[8px] font-black uppercase tracking-[0.14em] text-emerald-200/75">
                <span>American layout • 0 and 00</span>
                <span>$5 table • $1 inside positions • $5 outside positions</span>
              </div>

              <div ref={boardScrollRef} className="overflow-x-auto overscroll-x-contain rounded-xl border border-emerald-100/30 bg-black/10 p-2">
                <div className="flex min-w-[850px] gap-1">
                  <div className="relative z-20 grid h-[194px] w-[62px] shrink-0 grid-rows-2 gap-1 self-start">
                    {(["00", "0"] as RoulettePocket[]).map((pocket) => {
                      const selection: RouletteSelection = { kind: "straight", pocket };
                      return (
                        <RouletteBetButton
                          key={pocket}
                          selection={selection}
                          amount={amountFor(selection)}
                          disabled={isSpinning}
                          highlighted={winningPocket === pocket || learnTargetKey === selectionKey(selection)}
                          onBet={handleBet}
                          className="rounded-l-3xl border-2 border-emerald-100/65 bg-emerald-700 text-2xl text-white"
                        >
                          {pocket}
                        </RouletteBetButton>
                      );
                    })}

                    {zeroBetSpots.map((spot) => (
                      <InsideBetButton
                        key={selectionKey(spot.selection)}
                        spot={spot}
                        amount={amountFor(spot.selection)}
                        disabled={isSpinning}
                        highlighted={learnTargetKey === selectionKey(spot.selection)}
                        onBet={handleBet}
                      />
                    ))}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="relative z-10 grid h-[194px] grid-rows-3 gap-1">
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
                                highlighted={winningPocket === pocket || learnTargetKey === selectionKey(selection)}
                                onBet={handleBet}
                                className={`h-[62px] border text-xl ${pocketClasses(pocket)}`}
                              >
                                {pocket}
                              </RouletteBetButton>
                            );
                          })}
                        </div>
                      ))}

                      {insideBetSpots.map((spot) => (
                        <InsideBetButton
                          key={selectionKey(spot.selection)}
                          spot={spot}
                          amount={amountFor(spot.selection)}
                          disabled={isSpinning}
                          highlighted={learnTargetKey === selectionKey(spot.selection)}
                          onBet={handleBet}
                        />
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
                          highlighted={learnTargetKey === selectionKey(selection)}
                          onBet={handleBet}
                          className={`h-14 border border-emerald-100/55 text-xs text-white ${selection.kind === "color" && selection.color === "red" ? "bg-red-700" : selection.kind === "color" && selection.color === "black" ? "bg-zinc-950" : "bg-emerald-950/35"}`}
                        >
                          {label}
                          <span className="block text-[8px] text-white/55">PAYS 1 TO 1</span>
                        </RouletteBetButton>
                      ))}
                    </div>
                  </div>

                  <div className="grid h-[194px] w-[76px] shrink-0 grid-rows-3 gap-1 self-start">
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
                  Number 35:1 • Split 17:1 • Street edge 11:1 • Corner 8:1 • <span className="sm:hidden">Use Remove Mode to take chips back</span><span className="hidden sm:inline">Shift-click removes a chip</span>
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
        <div className="flex items-center gap-3 overflow-x-auto overscroll-x-contain pb-1">
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

          <button ref={spinButtonRef} type="button" onClick={spinWheel} disabled={isSpinning || totalOnTable === 0 || (learnMode && activeLearnStep.action !== "spin")} className={`shrink-0 rounded-xl bg-amber-400 px-7 py-4 text-base font-black text-black shadow-[0_8px_25px_rgba(251,191,36,.2)] transition hover:bg-amber-300 active:scale-[.98] disabled:cursor-not-allowed disabled:bg-amber-900 disabled:text-amber-100/35 ${learnMode && activeLearnStep.action === "spin" ? "ring-4 ring-amber-100 ring-offset-2 ring-offset-[#03130e] motion-safe:animate-pulse" : ""}`}>
            {isWheelSpinning ? "SPINNING…" : isSpinning ? "CHECKING…" : "SPIN WHEEL"}
          </button>

          <div className="h-12 w-px shrink-0 bg-white/10" />

          <button type="button" onClick={() => setRemoveMode((current) => !current)} disabled={isSpinning || learnMode} className={`shrink-0 rounded-xl border px-4 py-3 text-xs font-black disabled:cursor-not-allowed disabled:opacity-35 ${removeMode ? "border-red-300 bg-red-600 text-white" : "border-amber-300 bg-amber-400 text-black"}`}>
            {removeMode ? "REMOVE MODE" : "ADD MODE"}
          </button>
          <button type="button" onClick={clearBets} disabled={isSpinning || learnMode || totalOnTable === 0} className="shrink-0 rounded-xl border border-emerald-700 bg-emerald-950/60 px-4 py-3 text-xs font-black text-emerald-100 disabled:cursor-not-allowed disabled:opacity-35">CLEAR</button>
          <button type="button" onClick={repeatLastBets} disabled={isSpinning || learnMode || totalOnTable > 0 || lastBets.length === 0} className="shrink-0 rounded-xl border border-emerald-700 bg-emerald-950/60 px-4 py-3 text-xs font-black text-emerald-100 disabled:cursor-not-allowed disabled:opacity-35">REPEAT</button>
          <button type="button" onClick={resetSession} disabled={isSpinning || learnMode} className="shrink-0 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-xs font-black text-white/65 disabled:cursor-not-allowed disabled:opacity-35">RESET</button>

          <div className="ml-auto shrink-0 rounded-xl border border-amber-300/35 bg-amber-950/25 px-4 py-2 text-center">
            <div className="text-[7px] font-black uppercase tracking-[0.14em] text-amber-300">Total bet</div>
            <div className="text-lg font-black text-white">${money(totalOnTable)}</div>
          </div>
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
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {history.map((item) => {
                  const selected = selectedSpin?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-expanded={selected}
                      onClick={() => setSelectedSpin(selected ? null : item)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition hover:border-emerald-400 hover:bg-emerald-950/35 ${selected ? "border-amber-300 bg-amber-950/25" : "border-white/10 bg-black/25"}`}
                    >
                      <span className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-1 text-sm font-black ${pocketClasses(item.pocket)}`}>{item.pocket}</span>
                      <span>
                        <span className={`block text-xs font-black ${item.net >= 0 ? "text-emerald-300" : "text-red-300"}`}>{signedMoney(item.net)}</span>
                        <span className="block text-[7px] font-bold uppercase text-white/35">Bet ${money(item.wager)} • Details</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedSpin && (
                <div className="mt-3 rounded-xl border border-amber-300/35 bg-black/35 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">Spin detail • Winner {selectedSpin.pocket}</div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-emerald-100/60">
                        <span>Wagered ${money(selectedSpin.wager)}</span>
                        <span>Returned ${money(selectedSpin.grossReturn)}</span>
                        <span className={selectedSpin.net >= 0 ? "text-emerald-300" : "text-red-300"}>Net {signedMoney(selectedSpin.net)}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => setSelectedSpin(null)} className="rounded-lg border border-white/15 px-3 py-1.5 text-[9px] font-black text-white/60 hover:border-white/35 hover:text-white">CLOSE</button>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {selectedSpin.bets.map((bet) => {
                      const net = betNet(bet, selectedSpin.pocket);
                      const won = net >= 0;

                      return (
                        <div key={selectionKey(bet.selection)} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                          <div className="min-w-0">
                            <div className="truncate text-[10px] font-black text-white">{selectionLabel(bet.selection)}</div>
                            <div className="mt-0.5 text-[8px] font-bold uppercase text-white/35">${money(bet.amount)} wager • {won ? `${payoutOdds(bet.selection)}:1 payout` : "Lost"}</div>
                          </div>
                          <div className={`shrink-0 text-xs font-black ${won ? "text-emerald-300" : "text-red-300"}`}>{signedMoney(net)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-amber-800/60 bg-amber-950/10 p-4">
          <div className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-300">First-table rules</div>
          <ul className="mt-3 space-y-2 text-xs font-medium leading-5 text-emerald-50/65">
            <li>• American roulette has 38 pockets: 1 through 36, 0, and 00.</li>
            <li>• This is a $5 table. Inside positions may start at $1, while each outside position requires at least $5.</li>
            <li>• Both green zero pockets lose on red/black, odd/even, high/low, dozens, and columns.</li>
            <li>• Tap a number for straight up, a shared line for a split, or a shared corner for four numbers.</li>
            <li>• Tap the line above a dozen for the three-number street directly above it.</li>
            <li>• Mix bets freely. Use Remove Mode, or hold Shift while clicking, to take a chip back.</li>
          </ul>
        </aside>
      </section>

      {!learnMode && (
        <div className="mt-4">
          <RouletteLearnCoach
            enabled={false}
            stepIndex={learnStep}
            feedback={learnFeedback}
            disabled={isSpinning}
            onStart={startLearnMode}
            onExit={exitLearnMode}
            onRestart={startLearnMode}
          />
        </div>
      )}
    </div>
  );
}
