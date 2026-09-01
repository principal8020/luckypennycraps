"use client";

import Link from "next/link";
import {
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
          ? "h-7 min-w-7 border-[3px] px-1 text-[7px]"
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

  const [anySevenBet, setAnySevenBet] = useState(0);
  const [anyCrapsBet, setAnyCrapsBet] = useState(0);
  const [yoBet, setYoBet] = useState(0);
  const [hornBet, setHornBet] = useState(0);

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
    setMessage("Last bet change undone.");
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
    setMessage(`${name} placed for $${money(additions)}.`);
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
    setMessage(`Rebet restored $${money(required)} in eligible wagers.`);
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
    setAnySevenBet(0);
    setAnyCrapsBet(0);
    setYoBet(0);
    setHornBet(0);
    setLastBetSnapshot(null);
    setLastRollBets(null);
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
      "Pass odds"
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
      "Don't Pass lay odds"
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
      `Place ${number} is now $${money(placeBets[number] + selectedChip)}.`
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
    setBankroll((current) => current + profit);
    return `Place ${total} wins $${money(profit)}. Bet stays up.`;
  }

  function clearPlaceBets() {
    const lost = Object.values(placeBets).reduce(
      (sum, value) => sum + value,
      0
    );
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
      setBankroll((current) => current + fieldBet + profit);
      setFieldBet(0);
      return `Field wins $${money(profit)}.`;
    }

    const lost = fieldBet;
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
        )} in Come odds on ${number}.`
      );
    } else {
      setMessage(`Added $${money(amountToAdd)} in Come odds on ${number}.`);
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
        )} in Don't Come lay odds behind ${number}.`
      );
    } else {
      setMessage(
        `Added $${money(amountToAdd)} in Don't Come lay odds behind ${number}.`
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

      setBankroll((current) => current + profit);
      messages.push(
        `Hard ${total} wins $${money(profit)}. Bet stays up.`
      );
    } else {
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

    if (anySevenBet > 0) {
      if (total === 7) {
        const profit = anySevenBet * 4;
        setBankroll((current) => current + anySevenBet + profit);
        messages.push(`Any 7 wins $${money(profit)}.`);
      } else {
        messages.push(`Any 7 loses $${money(anySevenBet)}.`);
      }
      setAnySevenBet(0);
    }

    if (anyCrapsBet > 0) {
      if ([2, 3, 12].includes(total)) {
        const profit = anyCrapsBet * 7;
        setBankroll((current) => current + anyCrapsBet + profit);
        messages.push(`Any Craps wins $${money(profit)}.`);
      } else {
        messages.push(`Any Craps loses $${money(anyCrapsBet)}.`);
      }
      setAnyCrapsBet(0);
    }

    if (yoBet > 0) {
      if (total === 11) {
        const profit = yoBet * 15;
        setBankroll((current) => current + yoBet + profit);
        messages.push(`Yo 11 wins $${money(profit)}.`);
      } else {
        messages.push(`Yo 11 loses $${money(yoBet)}.`);
      }
      setYoBet(0);
    }

    if (hornBet > 0) {
      if ([2, 3, 11, 12].includes(total)) {
        const unit = hornBet / 4;
        const multiplier = total === 2 || total === 12 ? 30 : 15;
        const profit = casinoPayout(unit * multiplier - unit * 3);
        const returnAmount = hornBet + profit;

        setBankroll((current) => current + returnAmount);
        messages.push(
          `Horn hits ${total}. Net profit $${money(profit)}.`
        );
      } else {
        messages.push(`Horn loses $${money(hornBet)}.`);
      }
      setHornBet(0);
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
        lost += nextCome[number] + nextOdds[number];
        nextCome[number] = 0;
        nextOdds[number] = 0;
      }

      if (lost > 0) {
        messages.push(`Come bets and odds lose $${money(lost)}.`);
      }
    } else if (pointNumbers.includes(total) && nextCome[total] > 0) {
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
        messages.push(`$${money(bet)} Come moves to ${total}.`);
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
        messages.push(`$${money(bet)} Don't Come moves behind ${total}.`);
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
    messages.push(...resolveHardways(first, second, total));

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
          setBankroll((current) => current + passLineBet * 2);
          messages.push(`Pass Line wins $${money(passLineBet)}.`);
          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
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
          messages.push(`Pass Line loses $${money(passLineBet)}.`);
          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
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
        messages.push(
          `Pass Line/odds lose $${money(passLineBet + passOddsBet)}.`
        );
      }

      if (dontPassBet > 0) {
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
            <div className="pointer-events-none absolute left-1/2 top-[44%] z-0 -translate-x-1/2 -translate-y-1/2 text-center opacity-[0.09]">
              <div className="text-3xl font-black tracking-[0.28em] sm:text-5xl">
                LUCKY PENNY
              </div>
              <div className="mt-1 text-[9px] font-black tracking-[0.5em]">
                CRAPS
              </div>
            </div>

            {/* BOX NUMBERS */}
            <div className="relative z-10 grid grid-cols-3 gap-[3px] md:grid-cols-6">
              {pointNumbers.map((number) => (
                <div
                  key={number}
                  className={`relative min-h-[145px] border border-white/55 bg-black/[0.025] px-1 py-2 text-center transition ${
                    point === number ? "bg-white/[0.06] ring-2 ring-inset ring-amber-300/80" : ""
                  }`}
                >
                  {point === number && (
                    <div className="absolute -top-4 left-1/2 z-30 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white bg-zinc-950 text-[9px] font-black shadow-xl">
                      ON
                    </div>
                  )}

                  <button
                    onClick={(event) => handleLayBet(event, number)}
                    className="absolute inset-x-1 top-1 z-20 flex min-h-7 items-center justify-between border-b border-white/20 px-1 text-[8px] font-black uppercase tracking-[0.16em] text-red-100 hover:bg-red-950/25"
                    title={`Lay ${number}: 7 before ${number}; true odds less 5% vig`}
                  >
                    <span>
                      Lay {number === 4 || number === 10 ? "1:2" : number === 5 || number === 9 ? "2:3" : "5:6"}
                    </span>
                    <BetChip amount={layBets[number]} compact />
                  </button>

                  <button
                    onClick={(event) => handleNumberBet(event, number)}
                    className="h-full w-full pt-7"
                  >
                    <span className="block text-4xl font-black leading-none sm:text-5xl">
                      {number === 6 ? "SIX" : number === 9 ? "NINE" : number}
                    </span>
                    <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-emerald-100/70">
                      Place
                    </span>
                    <div className="mt-1 flex justify-center">
                      <BetChip amount={placeBets[number]} />
                    </div>
                  </button>

                  {comeBets[number] > 0 && (
                    <div className="absolute bottom-1 left-1 rounded bg-blue-950/80 px-1 py-0.5 text-[8px] font-black">
                      C ${money(comeBets[number])}
                      <button
                        onClick={(event) => handleComeOdds(event, number)}
                        className="ml-1 rounded bg-blue-700 px-1"
                      >
                        O ${money(comeOdds[number])}
                      </button>
                    </div>
                  )}

                  {dontComeBets[number] > 0 && (
                    <div className="absolute bottom-1 right-1 rounded bg-red-950/80 px-1 py-0.5 text-[8px] font-black">
                      DC ${money(dontComeBets[number])}
                      <button
                        onClick={(event) => handleDontComeOdds(event, number)}
                        className="ml-1 rounded bg-red-700 px-1"
                      >
                        L ${money(dontComeOdds[number])}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* OFF PUCK */}
            {point === null && (
              <div className="absolute left-3 top-[130px] z-20 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-zinc-900 bg-white text-[9px] font-black text-black shadow-xl md:left-4">
                OFF
              </div>
            )}

            {/* MAIN TABLE BODY */}
            <div className="relative z-10 mt-1 grid gap-1 xl:grid-cols-[2.65fr_1fr]">
              <div className="space-y-1">
                <button
                  onClick={handleComeBet}
                  className="relative min-h-[62px] w-full border border-white/60 bg-transparent text-3xl font-black tracking-[0.18em] hover:bg-white/[0.035]"
                >
                  COME
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <BetChip amount={activeComeBet} />
                  </span>
                </button>

                <button
                  onClick={handleFieldBet}
                  className="relative min-h-[70px] w-full border border-white/60 bg-transparent px-3 py-2 hover:bg-white/[0.035]"
                >
                  <div className="flex items-center justify-center gap-3">
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
                  onClick={handleDontComeBet}
                  className="relative min-h-[46px] w-full border border-white/45 bg-black/[0.035] text-base font-black tracking-[0.1em] hover:bg-white/[0.025]"
                >
                  DON&apos;T COME — BAR 12
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <BetChip amount={activeDontComeBet} />
                  </span>
                </button>

                <button
                  onClick={handleDontPassBet}
                  className="relative min-h-[44px] w-full border border-white/45 bg-black/[0.035] text-base font-black tracking-[0.1em] hover:bg-white/[0.025]"
                >
                  DON&apos;T PASS — BAR 12
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <BetChip amount={dontPassBet} />
                  </span>
                </button>

                {point !== null && dontPassBet > 0 && (
                  <button
                    onClick={handleDontPassOdds}
                    className="w-full border border-red-300/70 bg-red-950/55 py-1.5 text-[10px] font-black"
                  >
                    DON&apos;T PASS LAY ODDS ${money(dontPassOddsBet)}
                  </button>
                )}

                <button
                  onClick={handlePassLineBet}
                  className="relative min-h-[58px] w-full rounded-[15px] border-[3px] border-white bg-transparent text-2xl font-black tracking-[0.18em] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/[0.035]"
                >
                  PASS LINE
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <BetChip amount={passLineBet} />
                  </span>
                </button>

                {point !== null && passLineBet > 0 && (
                  <button
                    onClick={handlePassOdds}
                    className="w-full rounded-b-md border border-yellow-300 bg-yellow-400 py-1.5 text-[10px] font-black text-black"
                  >
                    PASS ODDS ${money(passOddsBet)}
                  </button>
                )}
              </div>

              {/* COMPACT CENTER ACTION */}
              <div className="border border-white/55 bg-black/[0.055] p-1.5">
                <p className="mb-1 text-center text-[8px] font-black uppercase tracking-[0.28em] text-emerald-100/70">
                  Center Action
                </p>

                <div className="grid grid-cols-2 gap-[3px]">
                  {hardwayNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={(event) => handleHardway(event, number)}
                      className="relative min-h-[62px] border border-white/40 bg-transparent p-1 text-sm font-black hover:bg-white/[0.035]"
                    >
                      HARD {number}
                      <span className="block text-[8px] text-emerald-100/65">
                        {number === 4 || number === 10 ? "7 TO 1" : "9 TO 1"}
                      </span>
                      <div className="absolute bottom-1 right-1">
                        <BetChip amount={hardways[number]} />
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={(event) =>
                      handlePropBet(event, anySevenBet, setAnySevenBet, "Any 7")
                    }
                    className="relative min-h-[58px] border border-white/40 p-1 text-sm font-black hover:bg-white/[0.035]"
                  >
                    ANY 7
                    <span className="block text-[8px]">4 TO 1</span>
                    <div className="absolute bottom-1 right-1">
                      <BetChip amount={anySevenBet} />
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
                    className="relative min-h-[58px] border border-white/40 p-1 text-sm font-black hover:bg-white/[0.035]"
                  >
                    ANY CRAPS
                    <span className="block text-[8px]">2 • 3 • 12</span>
                    <div className="absolute bottom-1 right-1">
                      <BetChip amount={anyCrapsBet} />
                    </div>
                  </button>

                  <button
                    onClick={(event) =>
                      handlePropBet(event, yoBet, setYoBet, "Yo 11")
                    }
                    className="relative min-h-[58px] border border-white/40 p-1 text-sm font-black hover:bg-white/[0.035]"
                  >
                    YO 11
                    <span className="block text-[8px]">15 TO 1</span>
                    <div className="absolute bottom-1 right-1">
                      <BetChip amount={yoBet} />
                    </div>
                  </button>

                  <button
                    onClick={(event) =>
                      handlePropBet(event, hornBet, setHornBet, "Horn")
                    }
                    className="relative min-h-[58px] border border-white/40 p-1 text-sm font-black hover:bg-white/[0.035]"
                  >
                    HORN
                    <span className="block text-[8px]">2 • 3 • 11 • 12</span>
                    <div className="absolute bottom-1 right-1">
                      <BetChip amount={hornBet} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPACT GAME BAR */}
        <div className="mt-2 grid gap-2 rounded-xl border border-emerald-900/80 bg-black/30 p-2 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-3">
            <div
              className={`flex items-center gap-1 text-5xl sm:text-6xl ${
                isRolling ? "animate-pulse" : ""
              }`}
              aria-live="polite"
              aria-label={isRolling ? "Dice rolling" : `Rolled ${rollTotal}`}
            >
              <span
                className={isRolling ? "animate-[spin_0.18s_linear_infinite]" : ""}
              >
                {diceFaces[dieOne - 1]}
              </span>
              <span
                className={isRolling ? "animate-[spin_0.21s_linear_infinite]" : ""}
                style={isRolling ? { animationDirection: "reverse" } : undefined}
              >
                {diceFaces[dieTwo - 1]}
              </span>
            </div>

            <div className="min-w-[78px] text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">
                {isRolling ? "Rolling" : "Last Roll"}
              </p>
              <p className="text-3xl font-black">
                {isRolling ? "…" : rollTotal}
              </p>
            </div>

            <button
              onClick={rollDice}
              disabled={isRolling}
              className={`rounded-lg px-8 py-3 text-base font-black text-black shadow-lg transition ${
                isRolling
                  ? "cursor-not-allowed bg-amber-200"
                  : "bg-amber-400 hover:scale-105 hover:bg-amber-300"
              }`}
            >
              {isRolling ? "ROLLING…" : "ROLL DICE"}
            </button>

            <p className="min-w-0 flex-1 text-sm font-semibold text-amber-200">
              {message}
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Recent
            </span>
            {rollHistory.length === 0 ? (
              <span className="text-xs text-emerald-300">No rolls yet</span>
            ) : (
              rollHistory.map((roll, index) => (
                <div
                  key={`${roll.first}-${roll.second}-${index}`}
                  className={`shrink-0 rounded border px-2 py-1 text-center ${
                    roll.total === 7
                      ? "border-red-400 bg-red-950/45"
                      : "border-emerald-800 bg-emerald-950/45"
                  }`}
                >
                  <div className="text-base leading-none">
                    {diceFaces[roll.first - 1]}
                    {diceFaces[roll.second - 1]}
                  </div>
                  <div className="text-[9px] font-black">{roll.total}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PLAYER CONTROLS + CHIP RACK */}
        <div className="mt-2 rounded-xl border border-emerald-900/80 bg-black/30 px-3 py-2">
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
              className={`rounded border px-3 py-2 text-[10px] font-black ${
                lastBetSnapshot && !isRolling
                  ? "border-blue-400 text-blue-100 hover:bg-blue-950/40"
                  : "cursor-not-allowed border-zinc-700 text-zinc-600"
              }`}
            >
              UNDO BET
            </button>

            <button
              onClick={rebetLastRoll}
              disabled={!lastRollBets || isRolling}
              className={`rounded border px-3 py-2 text-[10px] font-black ${
                lastRollBets && !isRolling
                  ? "border-amber-400 text-amber-100 hover:bg-amber-950/40"
                  : "cursor-not-allowed border-zinc-700 text-zinc-600"
              }`}
            >
              REBET
            </button>

            <button
              onClick={clearRemovableBets}
              disabled={removableBetsTotal <= 0 || isRolling}
              className={`rounded border px-3 py-2 text-[10px] font-black ${
                removableBetsTotal > 0 && !isRolling
                  ? "border-cyan-500 text-cyan-100 hover:bg-cyan-950/40"
                  : "cursor-not-allowed border-zinc-700 text-zinc-600"
              }`}
            >
              CLEAR BETS
            </button>

            <button
              onClick={resetTable}
              className="rounded border border-red-500/70 px-3 py-2 text-[10px] font-black text-red-200"
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
            <span className="mr-1 text-[8px] font-black uppercase tracking-[0.18em] text-emerald-500">
              Quick Place
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
