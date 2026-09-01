"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";

const STARTING_BANKROLL = 5000;
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const pointNumbers = [4, 5, 6, 8, 9, 10];
const hardwayNumbers = [4, 6, 8, 10];
const chipValues = [1, 5, 25, 100, 500];

type NumberBets = Record<number, number>;

type RollHistoryItem = {
  first: number;
  second: number;
  total: number;
};

type TravelAnimation = {
  id: number;
  kind: "come" | "dontCome";
  number: number;
  amount: number;
};

type ResolutionFlash = {
  id: number;
  area:
    | "place"
    | "lay"
    | "come"
    | "dontCome"
    | "hardway"
    | "prop"
    | "field"
    | "pass"
    | "dontPass";
  key: string;
  result: "win" | "loss";
};

type BetSnapshot = {
  bankroll: number;
  passLineBet: number;
  passOddsBet: number;
  dontPassBet: number;
  dontPassOddsBet: number;
  fieldBet: number;
  activeComeBet: number;
  comeBets: NumberBets;
  comeOdds: NumberBets;
  activeDontComeBet: number;
  dontComeBets: NumberBets;
  dontComeOdds: NumberBets;
  placeBets: NumberBets;
  layBets: NumberBets;
  hardways: NumberBets;
  twoBet: number;
  threeBet: number;
  twelveBet: number;
  anySevenBet: number;
  anyCrapsBet: number;
  yoBet: number;
  hornBet: number;
};

function emptyNumberBets(): NumberBets {
  return { 4: 0, 5: 0, 6: 0, 8: 0, 9: 0, 10: 0 };
}

function emptyHardways(): NumberBets {
  return { 4: 0, 6: 0, 8: 0, 10: 0 };
}

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function casinoPayout(amount: number) {
  return Math.floor(amount);
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

function rackChipStyle(value: number) {
  if (value === 1) return "bg-white text-black border-slate-400";
  if (value === 5) return "bg-red-600 text-white border-white";
  if (value === 25) return "bg-green-700 text-white border-white";
  if (value === 100) return "bg-zinc-950 text-white border-white";
  return "bg-purple-700 text-white border-white";
}

function CasinoChip({
  value,
  selected = false,
}: {
  value: number;
  selected?: boolean;
}) {
  return (
    <div
      className={`relative flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-dashed font-black shadow-xl transition ${rackChipStyle(
        value
      )} ${
        selected
          ? "scale-110 ring-4 ring-yellow-300 ring-offset-2 ring-offset-emerald-950"
          : ""
      }`}
    >
      <div className="absolute inset-[7px] rounded-full border-2 border-current opacity-40" />
      <span className="relative z-10">${value}</span>
    </div>
  );
}

function BetChip({
  amount,
  compact = false,
}: {
  amount: number;
  compact?: boolean;
}) {
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

function MiniDie({
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

function TravelChip({
  amount,
  kind,
}: {
  amount: number;
  kind: "come" | "dontCome";
}) {
  return (
    <span
      className={`lucky-travel pointer-events-none absolute left-1/2 top-1/2 z-50 inline-flex h-9 min-w-9 items-center justify-center rounded-full border-[3px] border-dashed px-1 text-[8px] font-black shadow-2xl ${chipRangeStyle(
        amount
      )}`}
      style={{
        animation:
          kind === "come"
            ? "comeChipTravel 760ms cubic-bezier(.2,.8,.2,1) both"
            : "dontComeChipTravel 760ms cubic-bezier(.2,.8,.2,1) both",
      }}
    >
      <span className="absolute inset-[3px] rounded-full border border-current opacity-40" />
      <span className="relative z-10">${money(amount)}</span>
    </span>
  );
}

function Stat({
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

export default function TablePage() {
  const [dieOne, setDieOne] = useState(1);
  const [dieTwo, setDieTwo] = useState(1);
  const [rollTotal, setRollTotal] = useState(2);
  const [rollHistory, setRollHistory] = useState<RollHistoryItem[]>([]);
  const [rollCount, setRollCount] = useState(0);

  const [point, setPoint] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "Place your bets for the come-out roll."
  );

  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [selectedChip, setSelectedChip] = useState(25);
  const [removeMode, setRemoveMode] = useState(false);
  const [placeBetsWorking, setPlaceBetsWorking] = useState(false);
  const [hardwaysWorking, setHardwaysWorking] = useState(false);
  const [travelAnimation, setTravelAnimation] =
    useState<TravelAnimation | null>(null);
  const [resolutionFlashes, setResolutionFlashes] =
    useState<ResolutionFlash[]>([]);

  const [testingMode, setTestingMode] = useState(false);
  const [forcedTotal, setForcedTotal] = useState(7);
  const [forceHardway, setForceHardway] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const [passLineBet, setPassLineBet] = useState(0);
  const [passOddsBet, setPassOddsBet] = useState(0);
  const [dontPassBet, setDontPassBet] = useState(0);
  const [dontPassOddsBet, setDontPassOddsBet] = useState(0);
  const [fieldBet, setFieldBet] = useState(0);

  const [activeComeBet, setActiveComeBet] = useState(0);
  const [comeBets, setComeBets] = useState<NumberBets>(emptyNumberBets());
  const [comeOdds, setComeOdds] = useState<NumberBets>(emptyNumberBets());

  const [activeDontComeBet, setActiveDontComeBet] = useState(0);
  const [dontComeBets, setDontComeBets] =
    useState<NumberBets>(emptyNumberBets());
  const [dontComeOdds, setDontComeOdds] =
    useState<NumberBets>(emptyNumberBets());

  const [placeBets, setPlaceBets] =
    useState<NumberBets>(emptyNumberBets());
  const [layBets, setLayBets] =
    useState<NumberBets>(emptyNumberBets());
  const [hardways, setHardways] = useState<NumberBets>(emptyHardways());

  const [lastBetSnapshot, setLastBetSnapshot] =
    useState<BetSnapshot | null>(null);
  const [lastRollBets, setLastRollBets] =
    useState<BetSnapshot | null>(null);

  const [twoBet, setTwoBet] = useState(0);
  const [threeBet, setThreeBet] = useState(0);
  const [twelveBet, setTwelveBet] = useState(0);
  const [anySevenBet, setAnySevenBet] = useState(0);
  const [anyCrapsBet, setAnyCrapsBet] = useState(0);
  const [yoBet, setYoBet] = useState(0);
  const [hornBet, setHornBet] = useState(0);

  useEffect(() => {
    // Hardways follow the puck by default. The player can override this
    // at any time; the default is re-applied only when the puck changes.
    setHardwaysWorking(point !== null);
  }, [point]);

  function triggerTravel(
    kind: "come" | "dontCome",
    number: number,
    amount: number
  ) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setTravelAnimation({ id, kind, number, amount });

    window.setTimeout(() => {
      setTravelAnimation((current) =>
        current?.id === id ? null : current
      );
    }, 820);
  }

  function flashOutcome(
    area: ResolutionFlash["area"],
    key: string,
    result: ResolutionFlash["result"]
  ) {
    const id = Date.now() + Math.floor(Math.random() * 100000);

    setResolutionFlashes((current) => [
      ...current.filter(
        (flash) => !(flash.area === area && flash.key === key)
      ),
      { id, area, key, result },
    ]);

    window.setTimeout(() => {
      setResolutionFlashes((current) =>
        current.filter((flash) => flash.id !== id)
      );
    }, 850);
  }

  function flashClass(area: ResolutionFlash["area"], key: string) {
    const flash = resolutionFlashes.find(
      (item) => item.area === area && item.key === key
    );

    if (!flash) return "";

    return flash.result === "win"
      ? "lucky-win-flash"
      : "lucky-loss-flash";
  }

  function wantsRemove(event?: MouseEvent<HTMLButtonElement>) {
    return removeMode || Boolean(event?.shiftKey);
  }

  function amountToRemove(currentBet: number) {
    return Math.min(selectedChip, currentBet);
  }

  const totalPlaceBets = Object.values(placeBets).reduce(
    (sum, bet) => sum + bet,
    0
  );
  const totalComeBets = Object.values(comeBets).reduce(
    (sum, bet) => sum + bet,
    0
  );
  const totalComeOdds = Object.values(comeOdds).reduce(
    (sum, bet) => sum + bet,
    0
  );
  const totalDontComeBets = Object.values(dontComeBets).reduce(
    (sum, bet) => sum + bet,
    0
  );
  const totalDontComeOdds = Object.values(dontComeOdds).reduce(
    (sum, bet) => sum + bet,
    0
  );
  const totalLayBets = Object.values(layBets).reduce(
    (sum, bet) => sum + bet,
    0
  );
  const totalHardways = Object.values(hardways).reduce(
    (sum, bet) => sum + bet,
    0
  );

  const totalOnTable =
    passLineBet +
    passOddsBet +
    dontPassBet +
    dontPassOddsBet +
    fieldBet +
    activeComeBet +
    activeDontComeBet +
    totalPlaceBets +
    totalComeBets +
    totalComeOdds +
    totalDontComeBets +
    totalDontComeOdds +
    totalLayBets +
    totalHardways +
    twoBet +
    threeBet +
    twelveBet +
    anySevenBet +
    anyCrapsBet +
    yoBet +
    hornBet;

  const sessionPL = bankroll + totalOnTable - STARTING_BANKROLL;

  function captureBetSnapshot(): BetSnapshot {
    return {
      bankroll,
      passLineBet,
      passOddsBet,
      dontPassBet,
      dontPassOddsBet,
      fieldBet,
      activeComeBet,
      comeBets: { ...comeBets },
      comeOdds: { ...comeOdds },
      activeDontComeBet,
      dontComeBets: { ...dontComeBets },
      dontComeOdds: { ...dontComeOdds },
      placeBets: { ...placeBets },
      layBets: { ...layBets },
      hardways: { ...hardways },
      twoBet,
      threeBet,
      twelveBet,
      anySevenBet,
      anyCrapsBet,
      yoBet,
      hornBet,
    };
  }

  function rememberUndo() {
    setLastBetSnapshot(captureBetSnapshot());
  }

  function restoreBetSnapshot(snapshot: BetSnapshot) {
    setBankroll(snapshot.bankroll);
    setPassLineBet(snapshot.passLineBet);
    setPassOddsBet(snapshot.passOddsBet);
    setDontPassBet(snapshot.dontPassBet);
    setDontPassOddsBet(snapshot.dontPassOddsBet);
    setFieldBet(snapshot.fieldBet);
    setActiveComeBet(snapshot.activeComeBet);
    setComeBets({ ...snapshot.comeBets });
    setComeOdds({ ...snapshot.comeOdds });
    setActiveDontComeBet(snapshot.activeDontComeBet);
    setDontComeBets({ ...snapshot.dontComeBets });
    setDontComeOdds({ ...snapshot.dontComeOdds });
    setPlaceBets({ ...snapshot.placeBets });
    setLayBets({ ...snapshot.layBets });
    setHardways({ ...snapshot.hardways });
    setTwoBet(snapshot.twoBet);
    setThreeBet(snapshot.threeBet);
    setTwelveBet(snapshot.twelveBet);
    setAnySevenBet(snapshot.anySevenBet);
    setAnyCrapsBet(snapshot.anyCrapsBet);
    setYoBet(snapshot.yoBet);
    setHornBet(snapshot.hornBet);
  }

  function undoLastBet() {
    if (!lastBetSnapshot) {
      setMessage("There is no bet change to undo.");
      return;
    }

    restoreBetSnapshot(lastBetSnapshot);
    setLastBetSnapshot(null);
    setMessage("Undo complete — table restored to before your last bet change.");
  }

  const removableBetsTotal =
    (point === null ? passLineBet : 0) +
    passOddsBet +
    dontPassBet +
    dontPassOddsBet +
    fieldBet +
    activeComeBet +
    activeDontComeBet +
    totalPlaceBets +
    totalLayBets +
    totalHardways +
    totalComeOdds +
    totalDontComeBets +
    totalDontComeOdds +
    twoBet +
    threeBet +
    twelveBet +
    anySevenBet +
    anyCrapsBet +
    yoBet +
    hornBet;

  function clearRemovableBets() {
    if (removableBetsTotal <= 0) {
      setMessage("There are no removable bets to clear.");
      return;
    }

    rememberUndo();

    if (point === null) setPassLineBet(0);
    setPassOddsBet(0);
    setDontPassBet(0);
    setDontPassOddsBet(0);
    setFieldBet(0);
    setActiveComeBet(0);
    setActiveDontComeBet(0);
    setPlaceBets(emptyNumberBets());
    setLayBets(emptyNumberBets());
    setHardways(emptyHardways());
    setComeOdds(emptyNumberBets());
    setDontComeBets(emptyNumberBets());
    setDontComeOdds(emptyNumberBets());
    setTwoBet(0);
    setThreeBet(0);
    setTwelveBet(0);
    setAnySevenBet(0);
    setAnyCrapsBet(0);
    setYoBet(0);
    setHornBet(0);
    setBankroll((current) => current + removableBetsTotal);

    const contractsRemain =
      (point !== null && passLineBet > 0) ||
      Object.values(comeBets).some((bet) => bet > 0);

    setMessage(
      `Cleared $${money(removableBetsTotal)} in removable bets.${
        contractsRemain ? " Contract bets remain in action." : ""
      }`
    );
  }

  function applyPlacePreset(name: string, target: NumberBets) {
    const additions = pointNumbers.reduce(
      (sum, number) => sum + Math.max(0, target[number] - placeBets[number]),
      0
    );

    if (additions <= 0) {
      setMessage(`${name} is already covered by your current Place bets.`);
      return;
    }

    if (additions > bankroll) {
      setMessage(`You need $${money(additions)} to apply ${name}.`);
      return;
    }

    rememberUndo();
    setPlaceBets((current) => {
      const next = { ...current };
      for (const number of pointNumbers) {
        next[number] = Math.max(current[number], target[number]);
      }
      return next;
    });
    setBankroll((current) => current - additions);
    const layout = pointNumbers
      .filter((number) => target[number] > 0)
      .map((number) => `${number}=$${money(target[number])}`)
      .join(" • ");

    setMessage(
      `${name}: added $${money(additions)} in Place bets. ${layout}`
    );
  }

  function rebetLastRoll() {
    if (!lastRollBets) {
      setMessage("Roll once before using Rebet.");
      return;
    }

    const addPlace = emptyNumberBets();
    const addLay = emptyNumberBets();
    const addHardways = emptyHardways();
    const addComeOdds = emptyNumberBets();
    const addDontCome = emptyNumberBets();
    const addDontComeOdds = emptyNumberBets();

    for (const number of pointNumbers) {
      addPlace[number] = Math.max(
        0,
        lastRollBets.placeBets[number] - placeBets[number]
      );
      addLay[number] = Math.max(
        0,
        lastRollBets.layBets[number] - layBets[number]
      );
      addComeOdds[number] =
        comeBets[number] > 0
          ? Math.max(0, lastRollBets.comeOdds[number] - comeOdds[number])
          : 0;
      addDontCome[number] = Math.max(
        0,
        lastRollBets.dontComeBets[number] - dontComeBets[number]
      );
      addDontComeOdds[number] =
        dontComeBets[number] + addDontCome[number] > 0
          ? Math.max(
              0,
              lastRollBets.dontComeOdds[number] - dontComeOdds[number]
            )
          : 0;
    }

    for (const number of hardwayNumbers) {
      addHardways[number] = Math.max(
        0,
        lastRollBets.hardways[number] - hardways[number]
      );
    }

    const addPassLine =
      point === null && dontPassBet === 0
        ? Math.max(0, lastRollBets.passLineBet - passLineBet)
        : 0;
    const addDontPass =
      point === null && passLineBet === 0
        ? Math.max(0, lastRollBets.dontPassBet - dontPassBet)
        : 0;
    const addPassOdds =
      point !== null && passLineBet > 0
        ? Math.max(0, lastRollBets.passOddsBet - passOddsBet)
        : 0;
    const addDontPassOdds =
      point !== null && dontPassBet > 0
        ? Math.max(0, lastRollBets.dontPassOddsBet - dontPassOddsBet)
        : 0;
    const addField = Math.max(0, lastRollBets.fieldBet - fieldBet);
    const addActiveCome =
      point !== null
        ? Math.max(0, lastRollBets.activeComeBet - activeComeBet)
        : 0;
    const addActiveDontCome =
      point !== null
        ? Math.max(
            0,
            lastRollBets.activeDontComeBet - activeDontComeBet
          )
        : 0;
    const addTwo = Math.max(0, lastRollBets.twoBet - twoBet);
    const addThree = Math.max(0, lastRollBets.threeBet - threeBet);
    const addTwelve = Math.max(0, lastRollBets.twelveBet - twelveBet);
    const addAnySeven = Math.max(0, lastRollBets.anySevenBet - anySevenBet);
    const addAnyCraps = Math.max(0, lastRollBets.anyCrapsBet - anyCrapsBet);
    const addYo = Math.max(0, lastRollBets.yoBet - yoBet);
    const addHorn = Math.max(0, lastRollBets.hornBet - hornBet);

    const required =
      addPassLine +
      addDontPass +
      addPassOdds +
      addDontPassOdds +
      addField +
      addActiveCome +
      addActiveDontCome +
      addTwo +
      addThree +
      addTwelve +
      addAnySeven +
      addAnyCraps +
      addYo +
      addHorn +
      Object.values(addPlace).reduce((sum, value) => sum + value, 0) +
      Object.values(addLay).reduce((sum, value) => sum + value, 0) +
      Object.values(addHardways).reduce((sum, value) => sum + value, 0) +
      Object.values(addComeOdds).reduce((sum, value) => sum + value, 0) +
      Object.values(addDontCome).reduce((sum, value) => sum + value, 0) +
      Object.values(addDontComeOdds).reduce((sum, value) => sum + value, 0);

    if (required <= 0) {
      setMessage("All eligible wagers from the last roll are already up.");
      return;
    }

    if (required > bankroll) {
      setMessage(
        `Rebet needs $${money(required)}, but your bankroll is $${money(
          bankroll
        )}.`
      );
      return;
    }

    rememberUndo();
    setBankroll((current) => current - required);
    setPassLineBet((current) => current + addPassLine);
    setDontPassBet((current) => current + addDontPass);
    setPassOddsBet((current) => current + addPassOdds);
    setDontPassOddsBet((current) => current + addDontPassOdds);
    setFieldBet((current) => current + addField);
    setActiveComeBet((current) => current + addActiveCome);
    setActiveDontComeBet((current) => current + addActiveDontCome);
    setTwoBet((current) => current + addTwo);
    setThreeBet((current) => current + addThree);
    setTwelveBet((current) => current + addTwelve);
    setAnySevenBet((current) => current + addAnySeven);
    setAnyCrapsBet((current) => current + addAnyCraps);
    setYoBet((current) => current + addYo);
    setHornBet((current) => current + addHorn);
    setPlaceBets((current) => {
      const next = { ...current };
      for (const number of pointNumbers) next[number] += addPlace[number];
      return next;
    });
    setLayBets((current) => {
      const next = { ...current };
      for (const number of pointNumbers) next[number] += addLay[number];
      return next;
    });
    setHardways((current) => {
      const next = { ...current };
      for (const number of hardwayNumbers) next[number] += addHardways[number];
      return next;
    });
    setComeOdds((current) => {
      const next = { ...current };
      for (const number of pointNumbers) next[number] += addComeOdds[number];
      return next;
    });
    setDontComeBets((current) => {
      const next = { ...current };
      for (const number of pointNumbers) next[number] += addDontCome[number];
      return next;
    });
    setDontComeOdds((current) => {
      const next = { ...current };
      for (const number of pointNumbers) {
        next[number] += addDontComeOdds[number];
      }
      return next;
    });
    setMessage(`Rebet restored $${money(required)} from the previous roll.`);
  }

  function resetTable() {
    setDieOne(1);
    setDieTwo(1);
    setRollTotal(2);
    setRollHistory([]);
    setRollCount(0);
    setPoint(null);
    setMessage("Table reset. Place your bets for the come-out roll.");
    setBankroll(STARTING_BANKROLL);
    setSelectedChip(25);
    setRemoveMode(false);
    setPlaceBetsWorking(false);
    setHardwaysWorking(false);
    setPassLineBet(0);
    setPassOddsBet(0);
    setDontPassBet(0);
    setDontPassOddsBet(0);
    setFieldBet(0);
    setActiveComeBet(0);
    setComeBets(emptyNumberBets());
    setComeOdds(emptyNumberBets());
    setActiveDontComeBet(0);
    setDontComeBets(emptyNumberBets());
    setDontComeOdds(emptyNumberBets());
    setPlaceBets(emptyNumberBets());
    setLayBets(emptyNumberBets());
    setHardways(emptyHardways());
    setTwoBet(0);
    setThreeBet(0);
    setTwelveBet(0);
    setAnySevenBet(0);
    setAnyCrapsBet(0);
    setYoBet(0);
    setHornBet(0);
    setLastBetSnapshot(null);
    setLastRollBets(null);
    setTravelAnimation(null);
    setResolutionFlashes([]);
  }

  function makeDiceForTotal(total: number) {
    if (forceHardway && hardwayNumbers.includes(total)) {
      const die = total / 2;
      return [die, die];
    }

    const combinations: number[][] = [];
    for (let first = 1; first <= 6; first++) {
      for (let second = 1; second <= 6; second++) {
        if (first + second === total) {
          combinations.push([first, second]);
        }
      }
    }

    return combinations[Math.floor(Math.random() * combinations.length)];
  }

  function getPassOddsMultiplier(number: number) {
    if (number === 4 || number === 10) return 3;
    if (number === 5 || number === 9) return 4;
    return 5;
  }

  function calculatePassOddsProfit(number: number, bet: number) {
    if (number === 4 || number === 10) return casinoPayout(bet * 2);
    if (number === 5 || number === 9) return casinoPayout(bet * 1.5);
    return casinoPayout(bet * 1.2);
  }

  function calculateLayOddsProfit(number: number, bet: number) {
    if (number === 4 || number === 10) return casinoPayout(bet / 2);
    if (number === 5 || number === 9) {
      return casinoPayout((bet * 2) / 3);
    }
    return casinoPayout((bet * 5) / 6);
  }

  function calculateNumberLayNetProfit(number: number, bet: number) {
    let trueOddsProfit: number;

    if (number === 4 || number === 10) {
      trueOddsProfit = bet / 2;
    } else if (number === 5 || number === 9) {
      trueOddsProfit = (bet * 2) / 3;
    } else {
      trueOddsProfit = (bet * 5) / 6;
    }

    // True odds less a 5% commission on the amount won, rounded down.
    return casinoPayout(trueOddsProfit * 0.95);
  }

  function layOddsLabel(number: number) {
    if (number === 4 || number === 10) return "1:2";
    if (number === 5 || number === 9) return "2:3";
    return "5:6";
  }

  function placeOddsLabel(number: number) {
    if (number === 4 || number === 10) return "9:5";
    if (number === 5 || number === 9) return "7:5";
    return "7:6";
  }

  function passOddsLabel(number: number) {
    if (number === 4 || number === 10) return "2:1";
    if (number === 5 || number === 9) return "3:2";
    return "6:5";
  }

  function smartAddOdds(
    currentBet: number,
    maxBet: number,
    setter: Dispatch<SetStateAction<number>>,
    label: string
  ) {
    const remainingRoom = Math.max(0, maxBet - currentBet);

    if (remainingRoom <= 0) {
      setMessage(`You already have the maximum $${money(maxBet)} in ${label}.`);
      return;
    }

    const amountToAdd = Math.min(selectedChip, remainingRoom, bankroll);

    if (amountToAdd <= 0) {
      setMessage("Not enough bankroll.");
      return;
    }

    setter((current) => current + amountToAdd);
    setBankroll((current) => current - amountToAdd);

    if (amountToAdd < selectedChip) {
      setMessage(
        `Added the maximum available $${money(amountToAdd)} to ${label}.`
      );
    } else {
      setMessage(`Added $${money(amountToAdd)} to ${label}.`);
    }
  }

  function handlePassLineBet(event?: MouseEvent<HTMLButtonElement>) {
    if (wantsRemove(event)) {
      if (passLineBet === 0) {
        setMessage("There is no Pass Line bet to remove.");
        return;
      }
      if (point !== null) {
        setMessage(
          "Pass Line is a contract bet and cannot be removed after the point is established."
        );
        return;
      }

      const amount = amountToRemove(passLineBet);
      setPassLineBet((current) => current - amount);
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Pass Line.`);
      return;
    }

    if (point !== null) {
      setMessage("Pass Line can only be added while the point is OFF.");
      return;
    }
    if (dontPassBet > 0) {
      setMessage("Remove Don't Pass before betting Pass Line.");
      return;
    }
    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setPassLineBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
    setMessage(`Added $${selectedChip} to Pass Line.`);
  }

  function handlePassOdds(event?: MouseEvent<HTMLButtonElement>) {
    if (point === null || passLineBet === 0) {
      setMessage("Pass odds require a Pass Line bet and a point.");
      return;
    }

    if (wantsRemove(event)) {
      if (passOddsBet === 0) {
        setMessage("There are no Pass odds to remove.");
        return;
      }

      const amount = amountToRemove(passOddsBet);
      setPassOddsBet((current) => current - amount);
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Pass odds.`);
      return;
    }

    smartAddOdds(
      passOddsBet,
      passLineBet * getPassOddsMultiplier(point),
      setPassOddsBet,
      `Pass odds at ${passOddsLabel(point)}`
    );
  }

  function handleDontPassBet(event?: MouseEvent<HTMLButtonElement>) {
    if (wantsRemove(event)) {
      if (dontPassBet === 0) {
        setMessage("There is no Don't Pass bet to remove.");
        return;
      }

      const amount = amountToRemove(dontPassBet);
      const newBet = dontPassBet - amount;

      if (dontPassOddsBet > newBet * 6) {
        setMessage(
          "Reduce your Don't Pass lay odds before reducing the flat bet."
        );
        return;
      }

      setDontPassBet(newBet);
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Don't Pass.`);
      return;
    }

    if (point !== null) {
      setMessage("New Don't Pass bets require the point to be OFF.");
      return;
    }
    if (passLineBet > 0) {
      setMessage("Remove Pass Line before betting Don't Pass.");
      return;
    }
    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setDontPassBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
    setMessage(`Added $${selectedChip} to Don't Pass.`);
  }

  function handleDontPassOdds(event?: MouseEvent<HTMLButtonElement>) {
    if (point === null || dontPassBet === 0) {
      setMessage("Don't Pass lay odds require a point.");
      return;
    }

    if (wantsRemove(event)) {
      if (dontPassOddsBet === 0) {
        setMessage("There are no Don't Pass lay odds to remove.");
        return;
      }

      const amount = amountToRemove(dontPassOddsBet);
      setDontPassOddsBet((current) => current - amount);
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Don't Pass lay odds.`);
      return;
    }

    smartAddOdds(
      dontPassOddsBet,
      dontPassBet * 6,
      setDontPassOddsBet,
      `Don't Pass lay odds at ${layOddsLabel(point)}`
    );
  }

  function handleLayBet(
    event: MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    if (wantsRemove(event)) {
      const currentBet = layBets[number];

      if (currentBet === 0) {
        setMessage(`There is no Lay ${number} bet to remove.`);
        return;
      }

      const amount = amountToRemove(currentBet);
      setLayBets((current) => ({
        ...current,
        [number]: current[number] - amount,
      }));
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Lay ${number}.`);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setLayBets((current) => ({
      ...current,
      [number]: current[number] + selectedChip,
    }));
    setBankroll((current) => current - selectedChip);
    setMessage(
      `Lay ${number} is now $${money(layBets[number] + selectedChip)}.`
    );
  }

  function resolveNumberLayBets(total: number) {
    if (total === 7) {
      let totalStake = 0;
      let totalNetProfit = 0;

      for (const number of pointNumbers) {
        const bet = layBets[number];
        if (bet > 0) {
          totalStake += bet;
          totalNetProfit += calculateNumberLayNetProfit(number, bet);
          flashOutcome("lay", String(number), "win");
        }
      }

      if (totalStake <= 0) return null;

      setBankroll((current) => current + totalStake + totalNetProfit);
      setLayBets(emptyNumberBets());

      return `Lay bets win $${money(
        totalNetProfit
      )} net after the 5% vig. Bets come down.`;
    }

    if (pointNumbers.includes(total) && layBets[total] > 0) {
      const lost = layBets[total];
      flashOutcome("lay", String(total), "loss");
      setLayBets((current) => ({ ...current, [total]: 0 }));
      return `Lay ${total} loses $${money(lost)}.`;
    }

    return null;
  }

  function handleNumberBet(
    event: MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    if (wantsRemove(event)) {
      const currentBet = placeBets[number];

      if (currentBet === 0) {
        setMessage(`There is no Place ${number} bet to remove.`);
        return;
      }

      const amount = amountToRemove(currentBet);
      setPlaceBets((current) => ({
        ...current,
        [number]: current[number] - amount,
      }));
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Place ${number}.`);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setPlaceBets((current) => ({
      ...current,
      [number]: current[number] + selectedChip,
    }));
    setBankroll((current) => current - selectedChip);
    setMessage(
      `Place ${number} is now $${money(
        placeBets[number] + selectedChip
      )}. Pays ${placeOddsLabel(number)}.`
    );
  }

  function calculatePlaceProfit(number: number, bet: number) {
    if (number === 4 || number === 10) {
      return casinoPayout((bet * 9) / 5);
    }
    if (number === 5 || number === 9) {
      return casinoPayout((bet * 7) / 5);
    }
    return casinoPayout((bet * 7) / 6);
  }

  function resolvePlaceBet(total: number) {
    const bet = placeBets[total];
    if (!bet) return null;

    const profit = calculatePlaceProfit(total, bet);
    flashOutcome("place", String(total), "win");
    setBankroll((current) => current + profit);
    return `Place ${total} wins $${money(profit)}. Bet stays up.`;
  }

  function clearPlaceBets() {
    const lost = Object.values(placeBets).reduce(
      (sum, value) => sum + value,
      0
    );

    for (const number of pointNumbers) {
      if (placeBets[number] > 0) {
        flashOutcome("place", String(number), "loss");
      }
    }

    setPlaceBets(emptyNumberBets());
    return lost;
  }

  function handleFieldBet(event?: MouseEvent<HTMLButtonElement>) {
    if (wantsRemove(event)) {
      if (fieldBet === 0) {
        setMessage("There is no Field bet to remove.");
        return;
      }

      const amount = amountToRemove(fieldBet);
      setFieldBet((current) => current - amount);
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Field.`);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setFieldBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
  }

  function resolveField(total: number) {
    if (!fieldBet) return null;

    let profit = 0;
    if (total === 2) profit = fieldBet * 2;
    else if (total === 12) profit = fieldBet * 3;
    else if ([3, 4, 9, 10, 11].includes(total)) profit = fieldBet;

    if (profit > 0) {
      flashOutcome("field", "field", "win");
      setBankroll((current) => current + fieldBet + profit);
      setFieldBet(0);
      return `Field wins $${money(profit)}.`;
    }

    const lost = fieldBet;
    flashOutcome("field", "field", "loss");
    setFieldBet(0);
    return `Field loses $${money(lost)}.`;
  }

  function handleComeBet(event?: MouseEvent<HTMLButtonElement>) {
    if (point === null) {
      setMessage("Come bets require the table point to be ON.");
      return;
    }

    if (wantsRemove(event)) {
      if (activeComeBet === 0) {
        setMessage("There is no active Come bet to remove.");
        return;
      }

      const amount = amountToRemove(activeComeBet);
      setActiveComeBet((current) => current - amount);
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Come.`);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setActiveComeBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
  }

  function handleDontComeBet(event?: MouseEvent<HTMLButtonElement>) {
    if (point === null) {
      setMessage("Don't Come requires the table point to be ON.");
      return;
    }

    if (wantsRemove(event)) {
      if (activeDontComeBet === 0) {
        setMessage("There is no active Don't Come bet to remove.");
        return;
      }

      const amount = amountToRemove(activeDontComeBet);
      setActiveDontComeBet((current) => current - amount);
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Don't Come.`);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setActiveDontComeBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
  }

  function handleComeOdds(
    event: MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    const flatBet = comeBets[number];

    if (!flatBet) {
      setMessage(`No Come bet on ${number}.`);
      return;
    }

    if (wantsRemove(event)) {
      const currentBet = comeOdds[number];

      if (currentBet === 0) {
        setMessage(`There are no Come odds on ${number}.`);
        return;
      }

      const amount = amountToRemove(currentBet);
      setComeOdds((current) => ({
        ...current,
        [number]: current[number] - amount,
      }));
      setBankroll((current) => current + amount);
      return;
    }

    const maxBet = flatBet * getPassOddsMultiplier(number);
    const remainingRoom = Math.max(0, maxBet - comeOdds[number]);

    if (remainingRoom <= 0) {
      setMessage(
        `Come ${number} already has the maximum $${money(maxBet)} odds.`
      );
      return;
    }

    const amountToAdd = Math.min(selectedChip, remainingRoom, bankroll);

    if (amountToAdd <= 0) {
      setMessage("Not enough bankroll.");
      return;
    }

    setComeOdds((current) => ({
      ...current,
      [number]: current[number] + amountToAdd,
    }));
    setBankroll((current) => current - amountToAdd);

    if (amountToAdd < selectedChip) {
      setMessage(
        `Added the maximum available $${money(
          amountToAdd
        )} in Come odds on ${number} at ${passOddsLabel(number)}.`
      );
    } else {
      setMessage(
        `Added $${money(amountToAdd)} in Come odds on ${number} at ${passOddsLabel(
          number
        )}.`
      );
    }
  }

  function handleDontComeOdds(
    event: MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    const flatBet = dontComeBets[number];

    if (!flatBet) {
      setMessage(`No Don't Come bet behind ${number}.`);
      return;
    }

    if (wantsRemove(event)) {
      const currentBet = dontComeOdds[number];

      if (currentBet === 0) {
        setMessage(`There are no Don't Come lay odds behind ${number}.`);
        return;
      }

      const amount = amountToRemove(currentBet);
      setDontComeOdds((current) => ({
        ...current,
        [number]: current[number] - amount,
      }));
      setBankroll((current) => current + amount);
      return;
    }

    const maxBet = flatBet * 6;
    const remainingRoom = Math.max(0, maxBet - dontComeOdds[number]);

    if (remainingRoom <= 0) {
      setMessage(
        `Don't Come ${number} already has the maximum $${money(
          maxBet
        )} lay odds.`
      );
      return;
    }

    const amountToAdd = Math.min(selectedChip, remainingRoom, bankroll);

    if (amountToAdd <= 0) {
      setMessage("Not enough bankroll.");
      return;
    }

    setDontComeOdds((current) => ({
      ...current,
      [number]: current[number] + amountToAdd,
    }));
    setBankroll((current) => current - amountToAdd);

    if (amountToAdd < selectedChip) {
      setMessage(
        `Added the maximum available $${money(
          amountToAdd
        )} in Don't Come lay odds behind ${number} at ${layOddsLabel(number)}.`
      );
    } else {
      setMessage(
        `Added $${money(
          amountToAdd
        )} in Don't Come lay odds behind ${number} at ${layOddsLabel(number)}.`
      );
    }
  }

  function handleHardway(
    event: MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    if (wantsRemove(event)) {
      const currentBet = hardways[number];

      if (currentBet === 0) {
        setMessage(`There is no Hard ${number} bet to remove.`);
        return;
      }

      const amount = amountToRemove(currentBet);
      setHardways((current) => ({
        ...current,
        [number]: current[number] - amount,
      }));
      setBankroll((current) => current + amount);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setHardways((current) => ({
      ...current,
      [number]: current[number] + selectedChip,
    }));
    setBankroll((current) => current - selectedChip);
  }

  function resolveHardways(first: number, second: number, total: number) {
    const messages: string[] = [];
    const next = { ...hardways };

    if (total === 7) {
      const lost = Object.values(next).reduce(
        (sum, value) => sum + value,
        0
      );

      if (lost > 0) {
        messages.push(`Hardways lose $${money(lost)}.`);

        for (const number of hardwayNumbers) {
          if (next[number] > 0) {
            flashOutcome("hardway", String(number), "loss");
          }
        }
      }

      setHardways(emptyHardways());
      return messages;
    }

    if (!hardwayNumbers.includes(total)) return messages;

    const bet = next[total];
    if (!bet) return messages;

    if (first === second) {
      const multiplier = total === 4 || total === 10 ? 7 : 9;
      const profit = casinoPayout(bet * multiplier);

      flashOutcome("hardway", String(total), "win");
      setBankroll((current) => current + profit);
      messages.push(
        `Hard ${total} wins $${money(profit)}. Bet stays up.`
      );
    } else {
      flashOutcome("hardway", String(total), "loss");
      messages.push(
        `Easy ${total}. Hard ${total} loses $${money(bet)}.`
      );
      next[total] = 0;
      setHardways(next);
    }

    return messages;
  }

  function handlePropBet(
    event: MouseEvent<HTMLButtonElement>,
    currentBet: number,
    setter: Dispatch<SetStateAction<number>>,
    name: string
  ) {
    if (wantsRemove(event)) {
      if (currentBet === 0) {
        setMessage(`There is no ${name} bet to remove.`);
        return;
      }

      const amount = amountToRemove(currentBet);
      setter((current) => current - amount);
      setBankroll((current) => current + amount);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setter((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
  }

  function resolvePropBets(total: number) {
    const messages: string[] = [];

    // One-roll proposition bets stay up after a win. Because the original
    // wager remains on the table, only the profit is returned to bankroll.
    // Losing one-roll wagers come down normally.

    if (twoBet > 0) {
      if (total === 2) {
        flashOutcome("prop", "2", "win");
        const profit = casinoPayout(twoBet * 30);
        setBankroll((current) => current + profit);
        messages.push(`2 wins $${money(profit)}. Bet stays up.`);
      } else {
        flashOutcome("prop", "2", "loss");
        messages.push(`2 loses $${money(twoBet)}.`);
        setTwoBet(0);
      }
    }

    if (threeBet > 0) {
      if (total === 3) {
        flashOutcome("prop", "3", "win");
        const profit = casinoPayout(threeBet * 15);
        setBankroll((current) => current + profit);
        messages.push(`3 wins $${money(profit)}. Bet stays up.`);
      } else {
        flashOutcome("prop", "3", "loss");
        messages.push(`3 loses $${money(threeBet)}.`);
        setThreeBet(0);
      }
    }

    if (twelveBet > 0) {
      if (total === 12) {
        flashOutcome("prop", "12", "win");
        const profit = casinoPayout(twelveBet * 30);
        setBankroll((current) => current + profit);
        messages.push(`12 wins $${money(profit)}. Bet stays up.`);
      } else {
        flashOutcome("prop", "12", "loss");
        messages.push(`12 loses $${money(twelveBet)}.`);
        setTwelveBet(0);
      }
    }

    if (anySevenBet > 0) {
      if (total === 7) {
        flashOutcome("prop", "any-seven", "win");
        const profit = casinoPayout(anySevenBet * 4);
        setBankroll((current) => current + profit);
        messages.push(`Any Seven wins $${money(profit)}. Bet stays up.`);
      } else {
        flashOutcome("prop", "any-seven", "loss");
        messages.push(`Any Seven loses $${money(anySevenBet)}.`);
        setAnySevenBet(0);
      }
    }

    if (anyCrapsBet > 0) {
      if ([2, 3, 12].includes(total)) {
        flashOutcome("prop", "any-craps", "win");
        const profit = casinoPayout(anyCrapsBet * 7);
        setBankroll((current) => current + profit);
        messages.push(`Any Craps wins $${money(profit)}. Bet stays up.`);
      } else {
        flashOutcome("prop", "any-craps", "loss");
        messages.push(`Any Craps loses $${money(anyCrapsBet)}.`);
        setAnyCrapsBet(0);
      }
    }

    if (yoBet > 0) {
      if (total === 11) {
        flashOutcome("prop", "yo", "win");
        const profit = casinoPayout(yoBet * 15);
        setBankroll((current) => current + profit);
        messages.push(`Yo 11 wins $${money(profit)}. Bet stays up.`);
      } else {
        flashOutcome("prop", "yo", "loss");
        messages.push(`Yo 11 loses $${money(yoBet)}.`);
        setYoBet(0);
      }
    }

    if (hornBet > 0) {
      if ([2, 3, 11, 12].includes(total)) {
        flashOutcome("prop", "horn", "win");
        const unit = hornBet / 4;
        const multiplier = total === 2 || total === 12 ? 30 : 15;
        const profit = casinoPayout(unit * multiplier - unit * 3);

        setBankroll((current) => current + profit);
        messages.push(
          `Horn hits ${total}. Net profit $${money(profit)}. Bet stays up.`
        );
      } else {
        flashOutcome("prop", "horn", "loss");
        messages.push(`Horn loses $${money(hornBet)}.`);
        setHornBet(0);
      }
    }

    return messages;
  }

  function resolveComeBets(total: number) {
    const messages: string[] = [];
    const nextCome = { ...comeBets };
    const nextOdds = { ...comeOdds };

    if (total === 7) {
      let lost = 0;

      for (const number of pointNumbers) {
        if (nextCome[number] + nextOdds[number] > 0) {
          flashOutcome("come", String(number), "loss");
        }
        lost += nextCome[number] + nextOdds[number];
        nextCome[number] = 0;
        nextOdds[number] = 0;
      }

      if (lost > 0) {
        messages.push(`Come bets and odds lose $${money(lost)}.`);
      }
    } else if (pointNumbers.includes(total) && nextCome[total] > 0) {
      flashOutcome("come", String(total), "win");
      const flat = nextCome[total];
      const odds = nextOdds[total];

      let returned = flat * 2;
      let oddsProfit = 0;

      if (odds > 0) {
        oddsProfit = calculatePassOddsProfit(total, odds);
        returned += odds + oddsProfit;
      }

      setBankroll((current) => current + returned);
      messages.push(
        `Come ${total} wins $${money(flat)}` +
          (odds ? ` + $${money(oddsProfit)} odds.` : ".")
      );

      nextCome[total] = 0;
      nextOdds[total] = 0;
    }

    if (activeComeBet > 0) {
      const bet = activeComeBet;

      if (total === 7 || total === 11) {
        setBankroll((current) => current + bet * 2);
        messages.push(`Come wins $${money(bet)}.`);
        setActiveComeBet(0);
      } else if ([2, 3, 12].includes(total)) {
        messages.push(`Come loses $${money(bet)}.`);
        setActiveComeBet(0);
      } else if (pointNumbers.includes(total)) {
        nextCome[total] += bet;
        triggerTravel("come", total, bet);
        messages.push(`$${money(bet)} Come travels to ${total}.`);
        setActiveComeBet(0);
      }
    }

    setComeBets(nextCome);
    setComeOdds(nextOdds);
    return messages;
  }

  function resolveDontComeBets(total: number) {
    const messages: string[] = [];
    const nextDC = { ...dontComeBets };
    const nextOdds = { ...dontComeOdds };

    if (total === 7) {
      for (const number of pointNumbers) {
        const flat = nextDC[number];
        const lay = nextOdds[number];

        if (flat > 0) {
          flashOutcome("dontCome", String(number), "win");
          let returned = flat * 2;
          let layProfit = 0;

          if (lay > 0) {
            layProfit = calculateLayOddsProfit(number, lay);
            returned += lay + layProfit;
          }

          setBankroll((current) => current + returned);
          messages.push(
            `Don't Come ${number} wins $${money(flat)}` +
              (lay ? ` + $${money(layProfit)} lay odds.` : ".")
          );

          nextDC[number] = 0;
          nextOdds[number] = 0;
        }
      }
    } else if (pointNumbers.includes(total) && nextDC[total] > 0) {
      flashOutcome("dontCome", String(total), "loss");
      const lost = nextDC[total] + nextOdds[total];
      messages.push(`Don't Come ${total} loses $${money(lost)}.`);
      nextDC[total] = 0;
      nextOdds[total] = 0;
    }

    if (activeDontComeBet > 0) {
      const bet = activeDontComeBet;

      if (total === 2 || total === 3) {
        setBankroll((current) => current + bet * 2);
        messages.push(`Don't Come wins $${money(bet)}.`);
        setActiveDontComeBet(0);
      } else if (total === 7 || total === 11) {
        messages.push(`Don't Come loses $${money(bet)}.`);
        setActiveDontComeBet(0);
      } else if (total === 12) {
        setBankroll((current) => current + bet);
        messages.push(`Don't Come bars 12. $${money(bet)} returned.`);
        setActiveDontComeBet(0);
      } else if (pointNumbers.includes(total)) {
        nextDC[total] += bet;
        triggerTravel("dontCome", total, bet);
        messages.push(`$${money(bet)} Don't Come travels behind ${total}.`);
        setActiveDontComeBet(0);
      }
    }

    setDontComeBets(nextDC);
    setDontComeOdds(nextOdds);
    return messages;
  }

  async function rollDice() {
    if (isRolling) return;

    setIsRolling(true);
    setTravelAnimation(null);
    setLastRollBets(captureBetSnapshot());
    setLastBetSnapshot(null);
    setMessage("Dice are rolling...");

    let finalFirst: number;
    let finalSecond: number;

    if (testingMode) {
      [finalFirst, finalSecond] = makeDiceForTotal(forcedTotal);
    } else {
      finalFirst = Math.floor(Math.random() * 6) + 1;
      finalSecond = Math.floor(Math.random() * 6) + 1;
    }

    // Quick visual tumble. Only the final dice are recorded/resolved.
    for (let frame = 0; frame < 8; frame++) {
      setDieOne(Math.floor(Math.random() * 6) + 1);
      setDieTwo(Math.floor(Math.random() * 6) + 1);
      await new Promise((resolve) => setTimeout(resolve, 65));
    }

    const total = finalFirst + finalSecond;

    setDieOne(finalFirst);
    setDieTwo(finalSecond);
    setRollTotal(total);

    await new Promise((resolve) => setTimeout(resolve, 120));

    setRollCount((current) => current + 1);
    setRollHistory((current) =>
      [{ first: finalFirst, second: finalSecond, total }, ...current].slice(0, 12)
    );

    resolveRoll(finalFirst, finalSecond, total);
    setIsRolling(false);
  }

  function resolveRoll(first: number, second: number, total: number) {
    const messages: string[] = [];

    const layMessage = resolveNumberLayBets(total);
    if (layMessage) messages.push(layMessage);

    const fieldMessage = resolveField(total);
    if (fieldMessage) messages.push(fieldMessage);

    messages.push(...resolvePropBets(total));

    if (hardwaysWorking) {
      messages.push(...resolveHardways(first, second, total));
    }

    if (point !== null) {
      messages.push(...resolveComeBets(total));
      messages.push(...resolveDontComeBets(total));
    }

    if (point === null) {
      if (placeBetsWorking) {
        if (total === 7) {
          const placeLoss = clearPlaceBets();
          if (placeLoss) {
            messages.push(
              `Working Place bets lose $${money(placeLoss)}.`
            );
          }
        } else if (pointNumbers.includes(total)) {
          const result = resolvePlaceBet(total);
          if (result) messages.push(result);
        }
      }

      if (total === 7 || total === 11) {
        messages.unshift(`${total} — Natural!`);

        if (passLineBet > 0) {
          flashOutcome("pass", "pass", "win");
          setBankroll((current) => current + passLineBet * 2);
          messages.push(`Pass Line wins $${money(passLineBet)}.`);
          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          flashOutcome("dontPass", "dont-pass", "loss");
          messages.push(`Don't Pass loses $${money(dontPassBet)}.`);
          setDontPassBet(0);
          setDontPassOddsBet(0);
        }

        setMessage(messages.join(" "));
        return;
      }

      if (total === 2 || total === 3) {
        messages.unshift(`${total} — Craps.`);

        if (passLineBet > 0) {
          flashOutcome("pass", "pass", "loss");
          messages.push(`Pass Line loses $${money(passLineBet)}.`);
          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          flashOutcome("dontPass", "dont-pass", "win");
          setBankroll((current) => current + dontPassBet * 2);
          messages.push(`Don't Pass wins $${money(dontPassBet)}.`);
          setDontPassBet(0);
        }

        setMessage(messages.join(" "));
        return;
      }

      if (total === 12) {
        messages.unshift("12 — Craps.");

        if (passLineBet > 0) {
          flashOutcome("pass", "pass", "loss");
          messages.push(`Pass Line loses $${money(passLineBet)}.`);
          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          setBankroll((current) => current + dontPassBet);
          messages.push("Don't Pass bars 12.");
          setDontPassBet(0);
        }

        setMessage(messages.join(" "));
        return;
      }

      if (pointNumbers.includes(total)) {
        setPoint(total);
        messages.unshift(`Point established: ${total}.`);
        setMessage(messages.join(" "));
        return;
      }
    }

    if (total === 7) {
      messages.unshift("7 — Seven out!");

      const placeLoss = clearPlaceBets();
      if (placeLoss > 0) {
        messages.push(`Place bets lose $${money(placeLoss)}.`);
      }

      if (passLineBet + passOddsBet > 0) {
        flashOutcome("pass", "pass", "loss");
        messages.push(
          `Pass Line/odds lose $${money(passLineBet + passOddsBet)}.`
        );
      }

      if (dontPassBet > 0) {
        flashOutcome("dontPass", "dont-pass", "win");
        let returned = dontPassBet * 2;
        let profit = 0;

        if (dontPassOddsBet > 0) {
          profit = calculateLayOddsProfit(point!, dontPassOddsBet);
          returned += dontPassOddsBet + profit;
        }

        setBankroll((current) => current + returned);
        messages.push(`Don't Pass wins $${money(dontPassBet)}.`);

        if (profit > 0) {
          messages.push(`Lay odds win $${money(profit)}.`);
        }
      }

      setPassLineBet(0);
      setPassOddsBet(0);
      setDontPassBet(0);
      setDontPassOddsBet(0);
      setPoint(null);
      setMessage(messages.join(" "));
      return;
    }

    const placeMessage = resolvePlaceBet(total);
    if (placeMessage) messages.push(placeMessage);

    if (total === point) {
      messages.unshift(`${total} — Point made!`);

      if (passLineBet > 0) {
        flashOutcome("pass", "pass", "win");
        let returned = passLineBet * 2;
        let oddsProfit = 0;

        if (passOddsBet > 0) {
          oddsProfit = calculatePassOddsProfit(point, passOddsBet);
          returned += passOddsBet + oddsProfit;
        }

        setBankroll((current) => current + returned);
        messages.push(`Pass Line wins $${money(passLineBet)}.`);

        if (oddsProfit) {
          messages.push(`Pass odds win $${money(oddsProfit)}.`);
        }
      }

      if (dontPassBet + dontPassOddsBet > 0) {
        flashOutcome("dontPass", "dont-pass", "loss");
        messages.push(
          `Don't Pass/lay odds lose $${money(
            dontPassBet + dontPassOddsBet
          )}.`
        );
      }

      setPassLineBet(0);
      setPassOddsBet(0);
      setDontPassBet(0);
      setDontPassOddsBet(0);
      setPoint(null);
      setMessage(messages.join(" "));
      return;
    }

    if (messages.length === 0) {
      messages.push(`${total} — No decision.`);
    } else {
      messages.unshift(`${total} rolled.`);
    }

    setMessage(messages.join(" "));
  }


  return (
    <main className="min-h-screen bg-[#03130e] px-2 py-2 text-white sm:px-4 sm:py-3">
      <style>{`
        @keyframes comeChipTravel {
          0% {
            transform: translate(-50%, 155px) scale(.78) rotate(-18deg);
            opacity: 0;
          }
          18% { opacity: 1; }
          72% {
            transform: translate(-50%, -8px) scale(1.08) rotate(4deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes dontComeChipTravel {
          0% {
            transform: translate(160px, 70px) scale(.78) rotate(16deg);
            opacity: 0;
          }
          18% { opacity: 1; }
          72% {
            transform: translate(-58%, -54%) scale(1.08) rotate(-4deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes luckyWinPulse {
          0% { box-shadow: inset 0 0 0 0 rgba(250, 204, 21, 0); }
          28% {
            box-shadow:
              inset 0 0 0 3px rgba(250, 204, 21, .95),
              inset 0 0 24px rgba(250, 204, 21, .28);
          }
          100% { box-shadow: inset 0 0 0 0 rgba(250, 204, 21, 0); }
        }

        @keyframes luckyLossPulse {
          0% { box-shadow: inset 0 0 0 0 rgba(248, 113, 113, 0); }
          28% {
            box-shadow:
              inset 0 0 0 3px rgba(248, 113, 113, .95),
              inset 0 0 24px rgba(127, 29, 29, .42);
          }
          100% { box-shadow: inset 0 0 0 0 rgba(248, 113, 113, 0); }
        }

        .lucky-win-flash {
          animation: luckyWinPulse 820ms ease-out both;
        }

        .lucky-loss-flash {
          animation: luckyLossPulse 820ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .lucky-travel,
          .lucky-win-flash,
          .lucky-loss-flash {
            animation-duration: 1ms !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1500px]">
        {/* COMPACT HEADER */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-900/80 bg-black/30 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/50 bg-amber-300/10 text-lg">
              🐾
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

        {/* FELT */}
        <div
          onPointerDownCapture={rememberUndo}
          className="overflow-hidden rounded-[28px] border-[8px] border-[#6c3b12] bg-[#087348] shadow-2xl"
        >
          <div
            className="relative border-[3px] border-[#2f1b0a] p-2 sm:p-3"
            style={{
              backgroundImage:
                "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.035), transparent 24%), radial-gradient(circle at 78% 78%, rgba(0,0,0,0.12), transparent 30%)",
            }}
          >
            {/* SUBTLE BRAND / FUTURE LOGO AREA */}
            <div className="pointer-events-none absolute left-1/2 top-[48%] z-0 -translate-x-1/2 -translate-y-1/2 text-center opacity-[0.07]">
              <div className="text-3xl font-black tracking-[0.28em] sm:text-5xl">
                LUCKY PENNY
              </div>
              <div className="mt-1 text-[9px] font-black tracking-[0.5em]">
                CRAPS
              </div>
            </div>

            <div className="relative z-10 grid gap-1 xl:grid-cols-[minmax(0,2.5fr)_minmax(360px,1fr)]">
              {/* MAIN PLAYER AREA */}
              <div className="min-w-0">
                {/* BOX NUMBERS */}
                <div className="relative grid grid-cols-3 gap-[3px] md:grid-cols-6">
                  {pointNumbers.map((number) => (
                    <div
                      key={number}
                      className={`relative min-h-[212px] overflow-visible border border-white/60 bg-black/[0.025] text-center transition ${
                        point === number
                          ? "ring-2 ring-inset ring-amber-300/85"
                          : ""
                      }`}
                    >
                      {point === number && (
                        <div className="absolute left-2 top-[130px] z-[70] flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-zinc-950 text-[9px] font-black shadow-xl">
                          ON
                        </div>
                      )}

                      {/* DON'T COME TRAVEL ZONE */}
                      <div
                        className={`absolute inset-x-0 top-0 h-[44px] border-b border-red-100/25 bg-red-950/[0.13] px-1 ${
                          dontComeBets[number] > 0 ? "bg-red-950/50" : ""
                        } ${flashClass("dontCome", String(number))}`}
                      >
                        <div className="flex h-full items-center justify-between gap-1">
                          <span className="text-[8px] font-black uppercase tracking-[0.13em] text-red-100/90">
                            Don&apos;t Come
                          </span>

                          {dontComeBets[number] > 0 && (
                            <div className="flex items-center gap-1">
                              <BetChip amount={dontComeBets[number]} compact />
                              <button
                                onClick={(event) =>
                                  handleDontComeOdds(event, number)
                                }
                                className="min-w-[60px] rounded border border-red-300/60 bg-red-950/90 px-1.5 py-1 text-[9px] font-black leading-tight text-red-50"
                                title={`Don't Come odds pay ${layOddsLabel(
                                  number
                                )}`}
                              >
                                ODDS ${money(dontComeOdds[number])}
                                <span className="block text-[8px] text-red-200">
                                  {layOddsLabel(number)}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>

                        {travelAnimation?.kind === "dontCome" &&
                          travelAnimation.number === number && (
                            <TravelChip
                              key={travelAnimation.id}
                              amount={travelAnimation.amount}
                              kind="dontCome"
                            />
                          )}
                      </div>

                      {/* LAY ZONE */}
                      <button
                        onClick={(event) => handleLayBet(event, number)}
                        className={`absolute inset-x-0 top-[44px] flex h-[38px] items-center justify-between border-b px-2 text-left font-black uppercase transition ${
                          layBets[number] > 0
                            ? "border-red-300/60 bg-red-950/48 text-red-50"
                            : "border-red-100/20 bg-red-950/[0.09] text-red-100 hover:bg-red-950/25"
                        } ${flashClass("lay", String(number))}`}
                        title={`Lay ${number}: 7 before ${number}; true odds less 5% vig`}
                      >
                        <span className="leading-tight">
                          <span className="block text-[9px] tracking-[0.14em]">
                            LAY • {layOddsLabel(number)}
                          </span>
                          {layBets[number] > 0 && (
                            <span className="block text-[6px] normal-case tracking-normal text-red-200">
                              wins +$
                              {money(
                                calculateNumberLayNetProfit(
                                  number,
                                  layBets[number]
                                )
                              )} net
                            </span>
                          )}
                        </span>
                        <BetChip amount={layBets[number]} compact />
                      </button>

                      {/* COME TRAVEL ZONE */}
                      <div
                        className={`absolute inset-x-0 top-[82px] h-[42px] border-b border-blue-100/25 bg-blue-950/[0.12] px-1 ${
                          comeBets[number] > 0 ? "bg-blue-950/45" : ""
                        } ${flashClass("come", String(number))}`}
                      >
                        <div className="flex h-full items-center justify-between gap-1">
                          <span className="text-[8px] font-black uppercase tracking-[0.14em] text-blue-100/90">
                            Come
                          </span>

                          {comeBets[number] > 0 && (
                            <div className="flex items-center gap-1">
                              <BetChip amount={comeBets[number]} compact />
                              <button
                                onClick={(event) =>
                                  handleComeOdds(event, number)
                                }
                                className="min-w-[60px] rounded border border-blue-300/60 bg-blue-950/90 px-1.5 py-1 text-[9px] font-black leading-tight text-blue-50"
                                title={`Come odds pay ${passOddsLabel(number)}`}
                              >
                                ODDS ${money(comeOdds[number])}
                                <span className="block text-[8px] text-blue-200">
                                  {passOddsLabel(number)}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>

                        {travelAnimation?.kind === "come" &&
                          travelAnimation.number === number && (
                            <TravelChip
                              key={travelAnimation.id}
                              amount={travelAnimation.amount}
                              kind="come"
                            />
                          )}
                      </div>

                      {/* NUMBER */}
                      <div className="absolute inset-x-0 bottom-[42px] top-[120px] flex items-center justify-center bg-emerald-950/[0.13]">
                        <span className="text-4xl font-black leading-none sm:text-5xl">
                          {number === 6
                            ? "SIX"
                            : number === 9
                              ? "NINE"
                              : number}
                        </span>
                      </div>

                      {/* PLACE ZONE */}
                      <button
                        onClick={(event) => handleNumberBet(event, number)}
                        className={`absolute inset-x-0 bottom-0 flex h-[42px] items-center justify-between border-t border-emerald-100/30 bg-emerald-950/[0.18] px-2 font-black transition hover:bg-white/[0.04] ${
                          placeBets[number] > 0 ? "bg-emerald-950/45" : ""
                        } ${flashClass("place", String(number))}`}
                        title={`Place ${number} pays ${placeOddsLabel(number)}`}
                      >
                        <span className="text-[9px] uppercase tracking-[0.14em] text-emerald-50">
                          PLACE • {placeOddsLabel(number)}
                        </span>
                        <BetChip amount={placeBets[number]} compact />
                      </button>
                    </div>
                  ))}

                  {point === null && (
                    <div className="absolute -left-2 -top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-zinc-900 bg-white text-[9px] font-black text-black shadow-xl">
                      OFF
                    </div>
                  )}
                </div>

                {/* COME / FIELD / DON'T PASS / PASS */}
                <div className="mt-1 space-y-1">
                  <button
                    onClick={handleComeBet}
                    className="relative min-h-[58px] w-full border border-white/60 bg-transparent text-3xl font-black tracking-[0.18em] hover:bg-white/[0.035]"
                  >
                    COME
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <BetChip amount={activeComeBet} />
                    </span>
                  </button>

                  <button
                    onClick={handleFieldBet}
                    className={`relative min-h-[66px] w-full border border-white/60 bg-transparent px-3 py-2 hover:bg-white/[0.035] ${flashClass("field", "field")}`}
                  >
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                      <span className="text-3xl font-black">2</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-100/70">
                        pays 2:1
                      </span>
                      <span className="text-xl font-black tracking-[0.14em]">
                        FIELD
                      </span>
                      <span className="text-sm font-black tracking-[0.16em]">
                        3 • 4 • 9 • 10 • 11
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-100/70">
                        pays 3:1
                      </span>
                      <span className="text-3xl font-black">12</span>
                    </div>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <BetChip amount={fieldBet} />
                    </span>
                  </button>

                  <button
                    onClick={handleDontPassBet}
                    className={`relative min-h-[44px] w-full border border-white/45 bg-black/[0.035] text-base font-black tracking-[0.1em] hover:bg-white/[0.025] ${flashClass("dontPass", "dont-pass")}`}
                  >
                    DON&apos;T PASS — BAR 12
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <BetChip amount={dontPassBet} />
                    </span>
                  </button>

                  {point !== null && dontPassBet > 0 && (
                    <button
                      onClick={handleDontPassOdds}
                      className="relative min-h-[44px] w-full border border-red-300/70 bg-red-950/60 px-14 py-1.5 text-[10px] font-black"
                      title={`Don't Pass lay odds pay ${layOddsLabel(point)}`}
                    >
                      DON&apos;T PASS LAY ODDS ${money(dontPassOddsBet)}
                      {" • "}PAYS {layOddsLabel(point)}
                      {" • "}MAX ${money(dontPassBet * 6)}

                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        <BetChip amount={dontPassOddsBet} />
                      </span>
                    </button>
                  )}

                  <button
                    onClick={handlePassLineBet}
                    className={`relative min-h-[56px] w-full rounded-[15px] border-[3px] border-white bg-transparent text-2xl font-black tracking-[0.18em] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/[0.035] ${flashClass("pass", "pass")}`}
                  >
                    PASS LINE
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <BetChip amount={passLineBet} />
                    </span>
                  </button>

                  {point !== null && passLineBet > 0 && (
                    <button
                      onClick={handlePassOdds}
                      className="relative min-h-[50px] w-full rounded-b-md border border-yellow-300 bg-yellow-400 px-16 py-1.5 text-[10px] font-black text-black"
                      title={`Pass odds pay ${passOddsLabel(point)}`}
                    >
                      PASS ODDS ${money(passOddsBet)}
                      {" • "}PAYS {passOddsLabel(point)}
                      {" • "}MAX $
                      {money(passLineBet * getPassOddsMultiplier(point))}

                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        <BetChip amount={passOddsBet} />
                      </span>
                    </button>
                  )}

                  {/* INTEGRATED DEALER / ROLL TRAY */}
                  <div className="mt-1 min-h-[154px] border border-emerald-100/25 bg-black/[0.10] px-3 py-3">
                    <div className="grid h-full gap-3 lg:grid-cols-[auto_auto_auto_1fr] lg:items-center">
                      <div
                        className={`flex items-center justify-center gap-1 text-5xl ${
                          isRolling ? "animate-pulse" : ""
                        }`}
                        aria-live="polite"
                        aria-label={
                          isRolling ? "Dice rolling" : `Rolled ${rollTotal}`
                        }
                      >
                        <span
                          className={
                            isRolling
                              ? "animate-[spin_0.18s_linear_infinite]"
                              : ""
                          }
                        >
                          {diceFaces[dieOne - 1]}
                        </span>
                        <span
                          className={
                            isRolling
                              ? "animate-[spin_0.21s_linear_infinite]"
                              : ""
                          }
                          style={
                            isRolling
                              ? { animationDirection: "reverse" }
                              : undefined
                          }
                        >
                          {diceFaces[dieTwo - 1]}
                        </span>
                      </div>

                      <div className="min-w-[76px] text-center">
                        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300">
                          {isRolling ? "Rolling" : "Last Roll"}
                        </p>
                        <p className="text-3xl font-black">
                          {isRolling ? "…" : rollTotal}
                        </p>
                      </div>

                      <button
                        onClick={rollDice}
                        disabled={isRolling}
                        className={`rounded-lg px-8 py-4 text-base font-black text-black shadow-lg transition ${
                          isRolling
                            ? "cursor-not-allowed bg-amber-200"
                            : "bg-amber-400 hover:scale-105 hover:bg-amber-300"
                        }`}
                      >
                        {isRolling ? "ROLLING…" : "ROLL DICE"}
                      </button>

                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400">
                          Dealer
                        </p>
                        <p className="mt-1 min-h-10 text-sm font-semibold text-amber-200">
                          {message}
                        </p>

                        <div className="mt-2 flex min-w-0 items-center gap-1.5 overflow-x-auto">
                          <span className="mr-1 shrink-0 text-[7px] font-black uppercase tracking-[0.16em] text-emerald-500">
                            Recent
                          </span>
                          {rollHistory.length === 0 ? (
                            <span className="text-[9px] text-emerald-300/70">
                              No rolls yet
                            </span>
                          ) : (
                            rollHistory.slice(0, 8).map((roll, index) => (
                              <div
                                key={`${roll.first}-${roll.second}-${index}`}
                                className={`shrink-0 rounded border px-1.5 py-1 text-center ${
                                  roll.total === 7
                                    ? "border-red-400/80 bg-red-950/45"
                                    : "border-emerald-700 bg-emerald-950/45"
                                }`}
                              >
                                <div className="text-xs leading-none">
                                  {diceFaces[roll.first - 1]}
                                  {diceFaces[roll.second - 1]}
                                </div>
                                <div className="text-[8px] font-black">
                                  {roll.total}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT RAIL: DON'T COME + CENTER ACTION */}
              <div className="grid min-w-0 grid-rows-[212px_auto] gap-1">
                <button
                  onClick={handleDontComeBet}
                  className="relative flex h-full min-h-[212px] flex-col items-center justify-center border border-white/60 bg-black/[0.045] px-3 text-center font-black hover:bg-white/[0.035]"
                >
                  <span className="text-xl tracking-[0.08em] text-red-100">
                    DON&apos;T COME
                  </span>
                  <span className="mt-1 text-sm tracking-[0.18em] text-red-200">
                    BAR 12
                  </span>
                  <span className="mt-3 flex items-center gap-2">
                    <MiniDie value={6} />
                    <MiniDie value={6} />
                  </span>
                  <span className="mt-3 text-[8px] uppercase tracking-[0.14em] text-red-100/65">
                    New Don&apos;t Come bet
                  </span>
                  <span className="mt-2">
                    <BetChip amount={activeDontComeBet} />
                  </span>
                </button>

                {/* CENTER ACTION */}
                <div className="border border-white/55 bg-black/[0.055] p-1.5">
                  <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-white/15 pb-1.5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100">
                        Hardways
                      </p>
                      <p className="text-[7px] text-emerald-100/60">
                        follows the puck by default • tap to override
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setHardwaysWorking((current) => {
                          const next = !current;
                          setMessage(
                            next
                              ? "Hardways are ON and working."
                              : "Hardways are OFF and not working."
                          );
                          return next;
                        });
                      }}
                      className={`min-w-[92px] rounded border px-2 py-1.5 text-[9px] font-black ${
                        hardwaysWorking
                          ? "border-amber-300 bg-amber-400 text-black"
                          : "border-red-400 bg-red-950/45 text-red-100"
                      }`}
                    >
                      HARDWAY {hardwaysWorking ? "ON" : "OFF"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-[3px]">
                    {hardwayNumbers.map((number) => {
                      const dieValue = number / 2;
                      return (
                        <button
                          key={number}
                          onClick={(event) => handleHardway(event, number)}
                          className={`relative min-h-[66px] border border-white/45 bg-black/[0.025] p-1.5 text-center font-black hover:bg-white/[0.035] ${flashClass("hardway", String(number))}`}
                        >
                          <div className="text-[9px] uppercase tracking-[0.14em] text-emerald-50/85">
                            HARD {number}
                          </div>

                          <div className="my-1 flex items-center justify-center gap-2">
                            <MiniDie value={dieValue} large />
                            <MiniDie value={dieValue} large />
                          </div>

                          <div className="text-[8px] text-emerald-100/70">
                            {number === 4 || number === 10
                              ? "7 TO 1"
                              : "9 TO 1"}
                          </div>

                          <div className="absolute bottom-1 right-1">
                            <BetChip amount={hardways[number]} compact />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="my-1 border-t border-white/15 pt-1 text-center text-[8px] font-black uppercase tracking-[0.22em] text-emerald-100/75">
                    One Roll
                  </div>

                  {/* Individual horn numbers: 2 / 3 / 12 */}
                  <div className="grid grid-cols-3 gap-[3px]">
                    <button
                      onClick={(event) =>
                        handlePropBet(event, twoBet, setTwoBet, "2")
                      }
                      className={`relative min-h-[62px] border border-white/45 bg-black/[0.03] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "2")}`}
                    >
                      <div className="text-[10px] text-red-200">2</div>
                      <div className="my-0.5 flex items-center justify-center gap-1">
                        <MiniDie value={1} />
                        <MiniDie value={1} />
                      </div>
                      <div className="text-[7px]">30 TO 1</div>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={twoBet} compact />
                      </div>
                    </button>

                    <button
                      onClick={(event) =>
                        handlePropBet(event, threeBet, setThreeBet, "3")
                      }
                      className={`relative min-h-[62px] border border-white/45 bg-black/[0.03] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "3")}`}
                    >
                      <div className="text-[10px] text-red-200">3</div>
                      <div className="my-0.5 flex items-center justify-center gap-1">
                        <MiniDie value={1} />
                        <MiniDie value={2} />
                      </div>
                      <div className="text-[7px]">15 TO 1</div>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={threeBet} compact />
                      </div>
                    </button>

                    <button
                      onClick={(event) =>
                        handlePropBet(event, twelveBet, setTwelveBet, "12")
                      }
                      className={`relative min-h-[62px] border border-white/45 bg-black/[0.03] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "12")}`}
                    >
                      <div className="text-[10px] text-red-200">12</div>
                      <div className="my-0.5 flex items-center justify-center gap-1">
                        <MiniDie value={6} />
                        <MiniDie value={6} />
                      </div>
                      <div className="text-[7px]">30 TO 1</div>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={twelveBet} compact />
                      </div>
                    </button>
                  </div>

                  {/* Combination / one-roll bets */}
                  <div className="mt-[3px] grid grid-cols-4 gap-[3px]">
                    <button
                      onClick={(event) =>
                        handlePropBet(
                          event,
                          anySevenBet,
                          setAnySevenBet,
                          "Any Seven"
                        )
                      }
                      className={`relative min-h-[58px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "any-seven")}`}
                    >
                      <div className="text-[9px] text-red-200">ANY SEVEN</div>
                      <div className="mt-1 text-[8px]">4 TO 1</div>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={anySevenBet} compact />
                      </div>
                    </button>

                    <button
                      onClick={(event) =>
                        handlePropBet(
                          event,
                          anyCrapsBet,
                          setAnyCrapsBet,
                          "Any Craps"
                        )
                      }
                      className={`relative min-h-[58px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "any-craps")}`}
                    >
                      <div className="text-[9px] text-red-200">ANY CRAPS</div>
                      <div className="mt-0.5 text-[8px] font-black tracking-[0.08em]">
                        2 • 3 • 12
                      </div>
                      <div className="text-[7px]">7 TO 1</div>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={anyCrapsBet} compact />
                      </div>
                    </button>

                    <button
                      onClick={(event) =>
                        handlePropBet(event, yoBet, setYoBet, "Yo 11")
                      }
                      className={`relative min-h-[58px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "yo")}`}
                    >
                      <div className="text-[9px]">YO 11</div>
                      <div className="mt-0.5 flex items-center justify-center gap-0.5">
                        <MiniDie value={5} />
                        <MiniDie value={6} />
                      </div>
                      <div className="text-[7px]">15 TO 1</div>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={yoBet} compact />
                      </div>
                    </button>

                    <button
                      onClick={(event) =>
                        handlePropBet(event, hornBet, setHornBet, "Horn")
                      }
                      className={`relative min-h-[58px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "horn")}`}
                    >
                      <div className="text-[9px]">HORN</div>
                      <div className="mt-0.5 text-[7px] font-black tracking-[0.05em]">
                        2 • 3 • 11 • 12
                      </div>
                      <div className="text-[6px] text-emerald-100/60">
                        combo
                      </div>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={hornBet} compact />
                      </div>
                    </button>
                  </div>

                  <p className="mt-0.5 text-center text-[6px] font-bold uppercase tracking-[0.06em] text-emerald-100/45">
                    Winners stay up • losers come down
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYER CONTROLS + CHIP RACK */}
        <div className="mt-2 rounded-xl border border-emerald-900/80 bg-black/30 px-3 py-2">
          <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-b border-white/10 pb-2 text-[9px] font-black uppercase tracking-[0.12em]">
            <span className={removeMode ? "text-red-300" : "text-amber-300"}>
              Mode: {removeMode ? "Remove" : "Add"}
            </span>
            <span className="text-emerald-300">
              Selected: ${money(selectedChip)}
            </span>
            <span className="text-red-200">
              Lay action: ${money(totalLayBets)}
            </span>
            <span className="text-cyan-200">
              Removable: ${money(removableBetsTotal)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setRemoveMode(false)}
              className={`rounded px-4 py-2 text-xs font-black ${
                !removeMode
                  ? "bg-amber-400 text-black"
                  : "border border-white/35"
              }`}
            >
              ADD
            </button>

            <button
              onClick={() => setRemoveMode(true)}
              className={`rounded px-4 py-2 text-xs font-black ${
                removeMode ? "bg-red-600" : "border border-white/35"
              }`}
            >
              REMOVE
            </button>

            <button
              onClick={() => setPlaceBetsWorking((current) => !current)}
              className={`rounded px-3 py-2 text-[10px] font-black ${
                placeBetsWorking
                  ? "bg-amber-400 text-black"
                  : "border border-emerald-600"
              }`}
            >
              PLACE BETS: {placeBetsWorking ? "WORKING" : "OFF COME-OUT"}
            </button>

            <button
              onClick={undoLastBet}
              disabled={!lastBetSnapshot || isRolling}
              title="Restore the table to before your most recent bet change"
              className={`rounded border px-2.5 py-1.5 text-[9px] font-black ${
                lastBetSnapshot && !isRolling
                  ? "border-blue-500/70 text-blue-200 hover:bg-blue-950/30"
                  : "cursor-not-allowed border-zinc-800 text-zinc-700"
              }`}
            >
              UNDO BET
            </button>

            <button
              onClick={rebetLastRoll}
              disabled={!lastRollBets || isRolling}
              title="Restore eligible wagers that were up immediately before the previous roll"
              className={`rounded border px-2.5 py-1.5 text-[9px] font-black ${
                lastRollBets && !isRolling
                  ? "border-amber-500/70 text-amber-200 hover:bg-amber-950/30"
                  : "cursor-not-allowed border-zinc-800 text-zinc-700"
              }`}
            >
              REBET
            </button>

            <button
              onClick={clearRemovableBets}
              disabled={removableBetsTotal <= 0 || isRolling}
              title="Return all currently removable wagers to your bankroll"
              className={`rounded border px-2.5 py-1.5 text-[9px] font-black ${
                removableBetsTotal > 0 && !isRolling
                  ? "border-cyan-600/70 text-cyan-200 hover:bg-cyan-950/30"
                  : "cursor-not-allowed border-zinc-800 text-zinc-700"
              }`}
            >
              CLEAR BETS
            </button>

            <button
              onClick={resetTable}
              className="rounded border border-red-800/70 px-2.5 py-1.5 text-[9px] font-black text-red-300/80"
            >
              RESET
            </button>

            <span className="mx-1 hidden h-8 w-px bg-white/15 sm:block" />

            {chipValues.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedChip(chip)}
                className="transition hover:scale-110"
                aria-label={`Select $${chip} chip`}
              >
                <div
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border-[4px] border-dashed text-[10px] font-black shadow-lg ${rackChipStyle(
                    chip
                  )} ${
                    selectedChip === chip
                      ? "scale-105 ring-3 ring-yellow-300 ring-offset-1 ring-offset-[#03130e]"
                      : ""
                  }`}
                >
                  ${chip}
                </div>
              </button>
            ))}

            <span className="ml-2 text-[9px] font-bold text-emerald-400">
              Shift-click reduces a wager
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 border-t border-white/10 pt-2">
            <span className="mr-1 text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Quick Place
            </span>
            <span className="mr-2 hidden text-[8px] text-emerald-600 sm:inline">
              brings current Place bets up to the selected layout
            </span>
            <button
              onClick={() =>
                applyPlacePreset("$44 Inside", {
                  4: 0,
                  5: 10,
                  6: 12,
                  8: 12,
                  9: 10,
                  10: 0,
                })
              }
              className="rounded border border-emerald-600 px-2 py-1 text-[9px] font-black hover:bg-emerald-950/45"
            >
              $44 INSIDE
            </button>
            <button
              onClick={() =>
                applyPlacePreset("$66 Inside", {
                  4: 0,
                  5: 15,
                  6: 18,
                  8: 18,
                  9: 15,
                  10: 0,
                })
              }
              className="rounded border border-emerald-600 px-2 py-1 text-[9px] font-black hover:bg-emerald-950/45"
            >
              $66 INSIDE
            </button>
            <button
              onClick={() =>
                applyPlacePreset("$96 Across", {
                  4: 15,
                  5: 15,
                  6: 18,
                  8: 18,
                  9: 15,
                  10: 15,
                })
              }
              className="rounded border border-emerald-600 px-2 py-1 text-[9px] font-black hover:bg-emerald-950/45"
            >
              $96 ACROSS
            </button>
          </div>
        </div>

        {/* TEST MODE — SUBORDINATE */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] text-purple-200">
          <button
            onClick={() => setTestingMode((current) => !current)}
            className={`rounded border px-3 py-1.5 font-black ${
              testingMode
                ? "border-purple-300 bg-purple-600"
                : "border-purple-700/70 bg-purple-950/20"
            }`}
          >
            TEST {testingMode ? "ON" : "OFF"}
          </button>

          {testingMode && (
            <>
              <select
                value={forcedTotal}
                onChange={(event) => setForcedTotal(Number(event.target.value))}
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
                    onChange={(event) => setForceHardway(event.target.checked)}
                  />
                  Hardway
                </label>
              )}
            </>
          )}
        </div>

        <p className="mt-2 text-center text-[9px] text-emerald-700">
          Practice credits have no cash value.
        </p>
      </div>
    </main>
  );


}
