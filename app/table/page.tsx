"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import {
  calculateCappedAdd,
  calculateFieldProfit,
  calculateHardwayProfit,
  calculateHopProfit,
  calculateLayOddsProfit,
  calculateNumberLayNetProfit,
  calculatePassOddsProfit,
  calculatePlaceProfit,
  calculateRollNet,
  casinoPayout,
  getPassOddsMultiplier,
  getPlaceBetMax,
  isBetWorking,
  layOddsLabel,
  passOddsLabel,
  placeOddsLabel,
  resolveCeNetProfit,
  resolveHornHighNetProfit,
  resolveTraveledComeBet,
  resolveTraveledDontComeBet,
  resolveWorldNetProfit,
} from "./crapsRules";
import { BetChip, MiniDie } from "./components/TablePieces";
import type { RollHistoryItem } from "./components/RollHistory";
import { MobileActionBar } from "./components/MobileActionBar";
import { MobileCenterActionDrawer } from "./components/MobileCenterActionDrawer";
import { TableAnalytics } from "./components/TableAnalytics";
import { UtilityControls } from "./components/UtilityControls";
import { CenterAction } from "./components/CenterAction";
import {
  QuickBets,
  type QuickBetPreview,
} from "./components/QuickBets";
import {
  PracticeControls,
  type DicePair,
  type PracticeScenarioId,
} from "./components/PracticeControls";
import { TableHeader } from "./components/TableHeader";
import {
  StrategyMode,
  type StrategyGuideTarget,
} from "./components/StrategyMode";
import {
  LearnMode,
  type LearnLessonId,
  type LearnLessonStep,
} from "./components/LearnMode";

const STARTING_BANKROLL = 5000;
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const pointNumbers = [4, 5, 6, 8, 9, 10];
const hardwayNumbers = [4, 6, 8, 10];

// 2, 3, Yo 11, and 12 already have dedicated One Roll boxes,
 // so their exact combinations are intentionally omitted here.
const hardHopPairs: Array<[number, number]> = [
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
];

const easyHopPairs: Array<[number, number]> = [
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 5],
  [4, 6],
];

const allHopPairs: Array<[number, number]> = [
  ...hardHopPairs,
  ...easyHopPairs,
];

type NumberBets = Record<number, number>;
type HopBets = Record<string, number>;

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
  worldBet: number;
  ceBet: number;
  hornHigh2Bet: number;
  hornHigh3Bet: number;
  hornHigh11Bet: number;
  hornHigh12Bet: number;
  hopBets: HopBets;
};

function emptyNumberBets(): NumberBets {
  return { 4: 0, 5: 0, 6: 0, 8: 0, 9: 0, 10: 0 };
}

function emptyHardways(): NumberBets {
  return { 4: 0, 6: 0, 8: 0, 10: 0 };
}

function hopKey(first: number, second: number) {
  const low = Math.min(first, second);
  const high = Math.max(first, second);
  return `${low}-${high}`;
}

function emptyHopBets(): HopBets {
  const bets: HopBets = {};
  for (const [first, second] of allHopPairs) {
    bets[hopKey(first, second)] = 0;
  }
  return bets;
}

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

function strategyGuideClass(
  current: StrategyGuideTarget | null,
  target: StrategyGuideTarget
) {
  return current === target
    ? "outline outline-[4px] outline-cyan-300 outline-offset-[-4px] shadow-[0_0_28px_rgba(34,211,238,.78)] animate-pulse"
    : "";
}

export default function TablePage() {
  const [dieOne, setDieOne] = useState(1);
  const [dieTwo, setDieTwo] = useState(1);
  const [rollTotal, setRollTotal] = useState(2);
  const [rollHistory, setRollHistory] = useState<RollHistoryItem[]>([]);
  const [rollCount, setRollCount] = useState(0);
  const rollStartEquityRef = useRef(STARTING_BANKROLL);
  const pendingRollNumberRef = useRef<number | null>(null);

  const [point, setPoint] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "Place your bets for the come-out roll."
  );

  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [selectedChip, setSelectedChip] = useState(25);
  const [removeMode, setRemoveMode] = useState(false);
  const [betsWorking, setBetsWorking] = useState(true);
  const [placeBetsWorking, setPlaceBetsWorking] = useState(false);
  const [hardwaysWorking, setHardwaysWorking] = useState(false);
  const [travelAnimation, setTravelAnimation] =
    useState<TravelAnimation | null>(null);
  const [resolutionFlashes, setResolutionFlashes] =
    useState<ResolutionFlash[]>([]);
  const [quickBetPreview, setQuickBetPreview] =
    useState<QuickBetPreview | null>(null);
  const [strategyGuideTarget, setStrategyGuideTarget] =
    useState<StrategyGuideTarget | null>(null);
  const [strategyGuideAmount, setStrategyGuideAmount] =
    useState<number | null>(null);
  const [learnModeActive, setLearnModeActive] = useState(false);
  const [learnLesson, setLearnLesson] =
    useState<LearnLessonId>("pass-line");
  const [learnStep, setLearnStep] =
    useState<LearnLessonStep>("pass-place");
  const [mobileCenterOpen, setMobileCenterOpen] = useState(false);

  const [testingMode, setTestingMode] = useState(false);
  const [forcedTotal, setForcedTotal] = useState(7);
  const [forcedDice, setForcedDice] = useState<DicePair | null>(null);
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
  const [worldBet, setWorldBet] = useState(0);
  const [ceBet, setCeBet] = useState(0);
  const [hornHigh2Bet, setHornHigh2Bet] = useState(0);
  const [hornHigh3Bet, setHornHigh3Bet] = useState(0);
  const [hornHigh11Bet, setHornHigh11Bet] = useState(0);
  const [hornHigh12Bet, setHornHigh12Bet] = useState(0);

  const [hopBets, setHopBets] = useState<HopBets>(emptyHopBets());
  const [hopBetsOpen, setHopBetsOpen] = useState(false);

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

  function classifyRollEvent(
    total: number
  ): RollHistoryItem["event"] {
    if (point !== null && total === point) return "pointMade";
    if (point !== null && total === 7) return "sevenOut";
    if (point === null && pointNumbers.includes(total)) return "pointSet";
    return "normal";
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
  const totalHopBets = Object.values(hopBets).reduce(
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
    hornBet +
    worldBet +
    ceBet +
    hornHigh2Bet +
    hornHigh3Bet +
    hornHigh11Bet +
    hornHigh12Bet +
    totalHopBets;

  const sessionPL = bankroll + totalOnTable - STARTING_BANKROLL;
  const lastRollNet =
    typeof rollHistory[0]?.net === "number"
      ? rollHistory[0].net
      : null;

  const learnGuideTarget: StrategyGuideTarget | null =
    !learnModeActive
      ? null
      : learnStep === "pass-place"
        ? "pass-line"
        : learnStep === "pass-odds"
          ? "pass-odds"
          : learnStep === "place-6"
            ? "place-6"
            : learnStep === "place-8"
              ? "place-8"
              : learnStep === "come-place"
                ? "come"
                : learnStep === "come-odds"
                  ? "come-odds-8"
                  : learnStep === "dp-place"
                    ? "dont-pass"
                    : learnStep === "dp-odds"
                      ? "dont-pass-odds"
                      : learnStep === "dc-place"
                        ? "dont-come"
                        : learnStep === "dc-odds"
                          ? "dont-come-odds-8"
                          : learnStep === "field-place"
                            ? "field"
                            : learnStep === "hard-place"
                              ? "hardway-6"
                              : null;

  const learnGuideAmount =
    !learnModeActive
      ? null
      : learnStep === "pass-place" ||
          learnStep === "pass-odds" ||
          learnStep === "come-place" ||
          learnStep === "come-odds" ||
          learnStep === "dp-place" ||
          learnStep === "dc-place" ||
          learnStep === "field-place" ||
          learnStep === "hard-place"
        ? 5
        : learnStep === "place-6"
          ? Math.max(0, 6 - placeBets[6])
          : learnStep === "place-8"
            ? Math.max(0, 6 - placeBets[8])
            : learnStep === "dp-odds"
              ? Math.max(0, 6 - dontPassOddsBet)
              : learnStep === "dc-odds"
                ? Math.max(0, 6 - dontComeOdds[8])
                : null;

  const effectiveGuideTarget = learnModeActive
    ? learnGuideTarget
    : strategyGuideTarget;
  const effectiveGuideAmount = learnModeActive
    ? learnGuideAmount
    : strategyGuideAmount;

  useEffect(() => {
    const pendingRoll = pendingRollNumberRef.current;

    if (
      isRolling ||
      pendingRoll === null ||
      pendingRoll !== rollCount
    ) {
      return;
    }

    const rollNet = calculateRollNet(
      rollStartEquityRef.current,
      bankroll + totalOnTable
    );

    pendingRollNumberRef.current = null;

    setRollHistory((current) => {
      if (current.length === 0 || typeof current[0].net === "number") {
        return current;
      }

      return [
        {
          ...current[0],
          net: rollNet,
        },
        ...current.slice(1),
      ];
    });
  }, [
    bankroll,
    isRolling,
    rollCount,
    totalOnTable,
  ]);

  function startPassLineLesson() {
    resetTable();
    setTestingMode(false);
    setSelectedChip(5);
    setRemoveMode(false);
    setLearnModeActive(true);
    setLearnLesson("pass-line");
    setLearnStep("pass-place");
    setStrategyGuideTarget(null);
    setStrategyGuideAmount(null);
    setMessage("Learn Mode: place $5 on the Pass Line.");
  }

  function startPlace68Lesson() {
    resetTable();
    setTestingMode(false);
    setSelectedChip(5);
    setRemoveMode(false);
    setBetsWorking(true);
    setPlaceBetsWorking(false);
    setPoint(5);
    setLearnModeActive(true);
    setLearnLesson("place-68");
    setLearnStep("place-6");
    setStrategyGuideTarget(null);
    setStrategyGuideAmount(null);
    setMessage("Learn Mode: build $6 on Place 6. Start with the $5 chip.");
  }

  function startComeLesson() {
    resetTable();
    setTestingMode(false);
    setSelectedChip(5);
    setRemoveMode(false);
    setBetsWorking(true);
    setPlaceBetsWorking(false);
    setPoint(6);
    setLearnModeActive(true);
    setLearnLesson("come");
    setLearnStep("come-place");
    setStrategyGuideTarget(null);
    setStrategyGuideAmount(null);
    setMessage("Learn Mode: place $5 in the Come.");
  }

  function startDontPassLesson() {
    resetTable();
    setTestingMode(false);
    setSelectedChip(5);
    setRemoveMode(false);
    setBetsWorking(true);
    setLearnModeActive(true);
    setLearnLesson("dont-pass");
    setLearnStep("dp-place");
    setStrategyGuideTarget(null);
    setStrategyGuideAmount(null);
    setMessage("Learn Mode: place $5 on Don't Pass.");
  }

  function startDontComeLesson() {
    resetTable();
    setTestingMode(false);
    setSelectedChip(5);
    setRemoveMode(false);
    setBetsWorking(true);
    setPoint(6);
    setLearnModeActive(true);
    setLearnLesson("dont-come");
    setLearnStep("dc-place");
    setStrategyGuideTarget(null);
    setStrategyGuideAmount(null);
    setMessage("Learn Mode: place $5 in Don't Come.");
  }

  function startFieldLesson() {
    resetTable();
    setTestingMode(false);
    setSelectedChip(5);
    setRemoveMode(false);
    setPoint(5);
    setLearnModeActive(true);
    setLearnLesson("field");
    setLearnStep("field-place");
    setStrategyGuideTarget(null);
    setStrategyGuideAmount(null);
    setMessage("Learn Mode: place $5 in the Field.");
  }

  function startHardwaysLesson() {
    resetTable();
    setTestingMode(false);
    setSelectedChip(5);
    setRemoveMode(false);
    setPoint(5);
    setHardwaysWorking(true);
    setLearnModeActive(true);
    setLearnLesson("hardways");
    setLearnStep("hard-place");
    setStrategyGuideTarget(null);
    setStrategyGuideAmount(null);
    setMessage("Learn Mode: place $5 on Hard 6.");
  }

  function restartLearnLesson() {
    if (learnLesson === "place-68") {
      startPlace68Lesson();
    } else if (learnLesson === "come") {
      startComeLesson();
    } else if (learnLesson === "dont-pass") {
      startDontPassLesson();
    } else if (learnLesson === "dont-come") {
      startDontComeLesson();
    } else if (learnLesson === "field") {
      startFieldLesson();
    } else if (learnLesson === "hardways") {
      startHardwaysLesson();
    } else {
      startPassLineLesson();
    }
  }

  function exitLearnMode() {
    setLearnModeActive(false);
    setLearnLesson("pass-line");
    setLearnStep("pass-place");
    setMessage("Learn Mode ended. The table is yours.");
  }

  function continueLearnLesson() {
    if (learnStep === "pass-point") {
      setLearnStep("pass-odds");
      setSelectedChip(5);
      setMessage("Learn Mode: add $5 in Pass Line odds.");
      return;
    }

    if (learnStep === "place-explain") {
      setLearnStep("place-roll-6");
      setSelectedChip(5);
      setMessage("Learn Mode: roll the dice to watch Place 6 pay.");
      return;
    }

    if (learnStep === "come-travel") {
      setLearnStep("come-odds");
      setSelectedChip(5);
      setMessage("Learn Mode: add $5 in Come odds on 8.");
      return;
    }

    if (learnStep === "dp-explain") {
      setLearnStep("dp-odds");
      setSelectedChip(5);
      setMessage("Learn Mode: build $6 in Don't Pass lay odds. Start with $5.");
      return;
    }

    if (learnStep === "dc-explain") {
      setLearnStep("dc-odds");
      setSelectedChip(5);
      setMessage("Learn Mode: build $6 in Don't Come lay odds behind 8.");
      return;
    }

    if (learnStep === "hard-explain") {
      setLearnStep("hard-easy");
      setMessage("Learn Mode: roll the dice to see an easy 6 beat the Hard 6.");
    }
  }

  useEffect(() => {
    if (!learnModeActive) return;

    if (learnLesson === "pass-line") {
      if (learnStep === "pass-place" && passLineBet >= 5) {
        setLearnStep("pass-come-out");
        setMessage("Good. Now make the come-out roll.");
        return;
      }

      if (learnStep === "pass-come-out" && rollCount > 0 && point !== null) {
        setLearnStep("pass-point");
        return;
      }

      if (learnStep === "pass-odds" && passOddsBet >= 5) {
        setLearnStep("pass-resolve");
        setMessage("Odds are up. Now roll for the point.");
        return;
      }

      if (
        learnStep === "pass-resolve" &&
        rollCount >= 2 &&
        point === null &&
        passLineBet === 0 &&
        passOddsBet === 0
      ) {
        setLearnStep("pass-complete");
      }
      return;
    }

    if (learnLesson === "come") {
      if (learnStep === "come-place" && activeComeBet >= 5) {
        setLearnStep("come-roll-travel");
        setMessage("Good. Roll the dice to give the Come bet its number.");
        return;
      }

      if (
        learnStep === "come-roll-travel" &&
        rollCount >= 1 &&
        comeBets[8] >= 5
      ) {
        setLearnStep("come-travel");
        setMessage("Your Come bet traveled to 8. Read the explanation below.");
        return;
      }

      if (learnStep === "come-odds" && comeOdds[8] >= 5) {
        setLearnStep("come-resolve");
        setMessage("Come odds are up. Roll again to resolve the Come 8.");
        return;
      }

      if (
        learnStep === "come-resolve" &&
        rollCount >= 2 &&
        comeBets[8] === 0 &&
        comeOdds[8] === 0
      ) {
        setLearnStep("come-complete");
      }
      return;
    }

    if (learnLesson === "dont-pass") {
      if (learnStep === "dp-place" && dontPassBet >= 5) {
        setLearnStep("dp-bar12");
        setMessage("Good. Roll once to see Bar 12 in action.");
        return;
      }

      if (
        learnStep === "dp-bar12" &&
        rollCount >= 1 &&
        rollHistory[0]?.total === 12 &&
        dontPassBet >= 5
      ) {
        setLearnStep("dp-point-roll");
        setMessage("12 pushed and the bet stayed up. Roll again to establish a point.");
        return;
      }

      if (
        learnStep === "dp-point-roll" &&
        rollCount >= 2 &&
        point === 6
      ) {
        setLearnStep("dp-explain");
        setMessage("Point 6 is ON. Read how Don't Pass changes after the point.");
        return;
      }

      if (learnStep === "dp-odds") {
        if (dontPassOddsBet >= 6) {
          setSelectedChip(5);
          setLearnStep("dp-seven");
          setMessage("Lay odds are ready. Roll 7 before the point.");
          return;
        }
        if (dontPassOddsBet >= 5) {
          setSelectedChip(1);
          setMessage("Good. Add $1 more to make the lay odds a proper $6.");
        }
        return;
      }

      if (
        learnStep === "dp-seven" &&
        rollCount >= 3 &&
        rollHistory[0]?.total === 7 &&
        point === null &&
        dontPassBet === 0 &&
        dontPassOddsBet === 0
      ) {
        setLearnStep("dp-complete");
      }
      return;
    }

    if (learnLesson === "dont-come") {
      if (learnStep === "dc-place" && activeDontComeBet >= 5) {
        setLearnStep("dc-roll-travel");
        setMessage("Good. Roll the dice to give Don't Come its number.");
        return;
      }

      if (
        learnStep === "dc-roll-travel" &&
        rollCount >= 1 &&
        dontComeBets[8] >= 5
      ) {
        setLearnStep("dc-explain");
        setMessage("Don't Come traveled behind 8. Read the explanation below.");
        return;
      }

      if (learnStep === "dc-odds") {
        if (dontComeOdds[8] >= 6) {
          setSelectedChip(5);
          setLearnStep("dc-seven");
          setMessage("Lay odds are ready. Roll 7 before the Don't Come 8.");
          return;
        }
        if (dontComeOdds[8] >= 5) {
          setSelectedChip(1);
          setMessage("Good. Add $1 more to make the lay odds a proper $6.");
        }
        return;
      }

      if (
        learnStep === "dc-seven" &&
        rollCount >= 2 &&
        rollHistory[0]?.total === 7 &&
        point === null &&
        dontComeBets[8] === 0 &&
        dontComeOdds[8] === 0
      ) {
        setLearnStep("dc-complete");
      }
      return;
    }

    if (learnLesson === "field") {
      if (learnStep === "field-place" && fieldBet >= 5) {
        setLearnStep("field-even");
        setMessage("Field is up. Roll to see an even-money winner.");
        return;
      }
      if (learnStep === "field-even" && rollCount >= 1 && rollHistory[0]?.total === 9) {
        setLearnStep("field-two");
        setMessage("9 paid even money. Roll again to see 2 pay double.");
        return;
      }
      if (learnStep === "field-two" && rollCount >= 2 && rollHistory[0]?.total === 2) {
        setLearnStep("field-twelve");
        setMessage("2 paid 2:1. Roll again to see 12 pay 3:1.");
        return;
      }
      if (learnStep === "field-twelve" && rollCount >= 3 && rollHistory[0]?.total === 12) {
        setLearnStep("field-loss");
        setMessage("12 paid 3:1. One last roll will show a Field loser.");
        return;
      }
      if (
        learnStep === "field-loss" &&
        rollCount >= 4 &&
        rollHistory[0]?.total === 6 &&
        fieldBet === 0
      ) {
        setLearnStep("field-complete");
      }
      return;
    }

    if (learnLesson === "hardways") {
      if (learnStep === "hard-place" && hardways[6] >= 5) {
        setLearnStep("hard-win");
        setMessage("Hard 6 is up. Roll 3 + 3 to see it win.");
        return;
      }
      if (
        learnStep === "hard-win" &&
        rollCount >= 1 &&
        rollHistory[0]?.first === 3 &&
        rollHistory[0]?.second === 3 &&
        hardways[6] >= 5
      ) {
        setLearnStep("hard-explain");
        setMessage("Hard 6 won and stayed up. Read the explanation below.");
        return;
      }
      if (
        learnStep === "hard-easy" &&
        rollCount >= 2 &&
        rollHistory[0]?.total === 6 &&
        rollHistory[0]?.first !== rollHistory[0]?.second &&
        hardways[6] === 0
      ) {
        setLearnStep("hard-complete");
      }
      return;
    }

    if (learnStep === "place-6") {
      if (placeBets[6] >= 6) {
        setLearnStep("place-8");
        setSelectedChip(5);
        setMessage("Great. Now build $6 on Place 8. Start with the $5 chip.");
        return;
      }
      if (placeBets[6] >= 5) {
        setSelectedChip(1);
        setMessage("Good. Add $1 more to make Place 6 a proper $6 wager.");
      }
      return;
    }

    if (learnStep === "place-8") {
      if (placeBets[8] >= 6) {
        setLearnStep("place-explain");
        setSelectedChip(5);
        setMessage("Both Place bets are up. Read the lesson explanation below.");
        return;
      }
      if (placeBets[8] >= 5) {
        setSelectedChip(1);
        setMessage("Good. Add $1 more to make Place 8 a proper $6 wager.");
      }
      return;
    }

    if (
      learnStep === "place-roll-6" &&
      rollCount >= 1 &&
      rollHistory[0]?.total === 6
    ) {
      setLearnStep("place-roll-8");
      setMessage("Place 6 paid and stayed up. Roll again to watch Place 8 pay.");
      return;
    }

    if (
      learnStep === "place-roll-8" &&
      rollCount >= 2 &&
      rollHistory[0]?.total === 8
    ) {
      setLearnStep("place-seven");
      setMessage("Place 8 paid and stayed up. One more roll will show the seven-out risk.");
      return;
    }

    if (
      learnStep === "place-seven" &&
      rollCount >= 3 &&
      rollHistory[0]?.total === 7 &&
      point === null
    ) {
      setLearnStep("place-complete");
    }
  }, [
    learnModeActive,
    learnLesson,
    learnStep,
    passLineBet,
    passOddsBet,
    activeComeBet,
    activeDontComeBet,
    comeBets,
    comeOdds,
    dontPassBet,
    dontPassOddsBet,
    dontComeBets,
    dontComeOdds,
    fieldBet,
    hardways,
    placeBets,
    point,
    rollCount,
    rollHistory,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lesson = new URLSearchParams(window.location.search).get("lesson");
    if (lesson === "pass-line") {
      window.setTimeout(() => startPassLineLesson(), 0);
    } else if (lesson === "place-68") {
      window.setTimeout(() => startPlace68Lesson(), 0);
    } else if (lesson === "come") {
      window.setTimeout(() => startComeLesson(), 0);
    } else if (lesson === "dont-pass") {
      window.setTimeout(() => startDontPassLesson(), 0);
    } else if (lesson === "dont-come") {
      window.setTimeout(() => startDontComeLesson(), 0);
    } else if (lesson === "field") {
      window.setTimeout(() => startFieldLesson(), 0);
    } else if (lesson === "hardways") {
      window.setTimeout(() => startHardwaysLesson(), 0);
    }
    // Run only once so the URL launches the lesson without restarting it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleBetsWorking() {
    setBetsWorking((current) => {
      const next = !current;
      setMessage(
        next
          ? "Eligible multi-roll bets are ON."
          : "Eligible multi-roll bets are OFF. Contract flat bets, one-roll bets and hardways keep their normal working rules."
      );
      return next;
    });
  }

  function quickPreviewNumberClass(number: number) {
    if (!quickBetPreview || quickBetPreview.target[number] <= 0) {
      return "";
    }

    if (quickBetPreview.tone === "amber") {
      return "shadow-[inset_0_0_0_3px_rgba(251,191,36,.92),inset_0_0_28px_rgba(251,191,36,.16)]";
    }

    if (quickBetPreview.tone === "cyan") {
      return "shadow-[inset_0_0_0_3px_rgba(34,211,238,.82),inset_0_0_28px_rgba(34,211,238,.13)]";
    }

    return "shadow-[inset_0_0_0_3px_rgba(52,211,153,.88),inset_0_0_28px_rgba(52,211,153,.14)]";
  }

  function quickPreviewFieldClass() {
    if (!quickBetPreview || quickBetPreview.field <= 0) return "";

    return quickBetPreview.tone === "amber"
      ? "shadow-[inset_0_0_0_3px_rgba(251,191,36,.92),inset_0_0_28px_rgba(251,191,36,.16)]"
      : "shadow-[inset_0_0_0_3px_rgba(34,211,238,.82),inset_0_0_28px_rgba(34,211,238,.13)]";
  }

  function placeMaxLabel(number: number) {
    return number === 6 || number === 8 ? '$1.2K' : '$1K';
  }

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
      worldBet,
      ceBet,
      hornHigh2Bet,
      hornHigh3Bet,
      hornHigh11Bet,
      hornHigh12Bet,
      hopBets: { ...hopBets },
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
    setWorldBet(snapshot.worldBet);
    setCeBet(snapshot.ceBet);
    setHornHigh2Bet(snapshot.hornHigh2Bet);
    setHornHigh3Bet(snapshot.hornHigh3Bet);
    setHornHigh11Bet(snapshot.hornHigh11Bet);
    setHornHigh12Bet(snapshot.hornHigh12Bet);
    setHopBets({ ...snapshot.hopBets });
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
    hornBet +
    worldBet +
    ceBet +
    hornHigh2Bet +
    hornHigh3Bet +
    hornHigh11Bet +
    hornHigh12Bet +
    totalHopBets;

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
    setWorldBet(0);
    setCeBet(0);
    setHornHigh2Bet(0);
    setHornHigh3Bet(0);
    setHornHigh11Bet(0);
    setHornHigh12Bet(0);
    setHopBets(emptyHopBets());
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

  function applyQuickBet(
    name: string,
    requestedTarget: NumberBets,
    fieldTarget = 0
  ) {
    const target = emptyNumberBets();

    for (const number of pointNumbers) {
      target[number] = Math.min(
        requestedTarget[number],
        getPlaceBetMax(number)
      );
    }

    const placeAdditions = pointNumbers.reduce(
      (sum, number) =>
        sum + Math.max(0, target[number] - placeBets[number]),
      0
    );
    const fieldAddition = Math.max(0, fieldTarget - fieldBet);
    const additions = placeAdditions + fieldAddition;

    if (additions <= 0) {
      setMessage(`${name} is already covered by your current wagers.`);
      return;
    }

    if (additions > bankroll) {
      setMessage(
        `You need $${money(additions)} to bring your bets up to ${name}.`
      );
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

    if (fieldTarget > 0) {
      setFieldBet((current) => Math.max(current, fieldTarget));
    }

    setBankroll((current) => current - additions);

    const layout = pointNumbers
      .filter((number) => target[number] > 0)
      .map((number) => `${number}=$${money(target[number])}`);

    if (fieldTarget > 0) {
      layout.push(`Field=$${money(fieldTarget)}`);
    }

    setMessage(
      `${name}: added $${money(additions)}. ${layout.join(' • ')}`
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
    const addHopBets = emptyHopBets();

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

    for (const [first, second] of allHopPairs) {
      const key = hopKey(first, second);
      addHopBets[key] = Math.max(
        0,
        (lastRollBets.hopBets[key] ?? 0) - (hopBets[key] ?? 0)
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
    const addWorld = Math.max(0, lastRollBets.worldBet - worldBet);
    const addCe = Math.max(0, lastRollBets.ceBet - ceBet);
    const addHornHigh2 = Math.max(
      0,
      lastRollBets.hornHigh2Bet - hornHigh2Bet
    );
    const addHornHigh3 = Math.max(
      0,
      lastRollBets.hornHigh3Bet - hornHigh3Bet
    );
    const addHornHigh11 = Math.max(
      0,
      lastRollBets.hornHigh11Bet - hornHigh11Bet
    );
    const addHornHigh12 = Math.max(
      0,
      lastRollBets.hornHigh12Bet - hornHigh12Bet
    );

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
      addWorld +
      addCe +
      addHornHigh2 +
      addHornHigh3 +
      addHornHigh11 +
      addHornHigh12 +
      Object.values(addPlace).reduce((sum, value) => sum + value, 0) +
      Object.values(addLay).reduce((sum, value) => sum + value, 0) +
      Object.values(addHardways).reduce((sum, value) => sum + value, 0) +
      Object.values(addComeOdds).reduce((sum, value) => sum + value, 0) +
      Object.values(addDontCome).reduce((sum, value) => sum + value, 0) +
      Object.values(addDontComeOdds).reduce((sum, value) => sum + value, 0) +
      Object.values(addHopBets).reduce((sum, value) => sum + value, 0);

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
    setWorldBet((current) => current + addWorld);
    setCeBet((current) => current + addCe);
    setHornHigh2Bet((current) => current + addHornHigh2);
    setHornHigh3Bet((current) => current + addHornHigh3);
    setHornHigh11Bet((current) => current + addHornHigh11);
    setHornHigh12Bet((current) => current + addHornHigh12);
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
    setHopBets((current) => {
      const next = { ...current };
      for (const [first, second] of allHopPairs) {
        const key = hopKey(first, second);
        next[key] = (next[key] ?? 0) + (addHopBets[key] ?? 0);
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
    rollStartEquityRef.current = STARTING_BANKROLL;
    pendingRollNumberRef.current = null;
    setPoint(null);
    setMessage("Table reset. Place your bets for the come-out roll.");
    setBankroll(STARTING_BANKROLL);
    setSelectedChip(25);
    setRemoveMode(false);
    setBetsWorking(true);
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
    setWorldBet(0);
    setCeBet(0);
    setHornHigh2Bet(0);
    setHornHigh3Bet(0);
    setHornHigh11Bet(0);
    setHornHigh12Bet(0);
    setHopBets(emptyHopBets());
    setHopBetsOpen(false);
    setLastBetSnapshot(null);
    setLastRollBets(null);
    setTravelAnimation(null);
    setResolutionFlashes([]);
    setQuickBetPreview(null);
  }

  function makeDiceForTotal(total: number): DicePair {
    const combinations: DicePair[] = [];
    for (let first = 1; first <= 6; first++) {
      for (let second = 1; second <= 6; second++) {
        if (first + second === total) {
          combinations.push([first, second]);
        }
      }
    }

    return combinations[Math.floor(Math.random() * combinations.length)];
  }

  function changePracticeTotal(total: number) {
    setForcedTotal(total);
    setForcedDice(null);
  }

  function changePracticePoint(nextPoint: number | null) {
    setPoint(nextPoint);
    setMessage(
      nextPoint === null
        ? "Practice setup: puck OFF for a come-out roll."
        : `Practice setup: point ${nextPoint} is ON.`
    );
  }

  function loadPracticeScenario(scenario: PracticeScenarioId) {
    resetTable();
    setTestingMode(true);
    setForcedDice(null);

    if (scenario === "come-out") {
      setPoint(null);
      setForcedTotal(7);
      setForcedDice([3, 4]);
      setMessage("Scenario loaded: Come-Out 7. Next roll is 3 + 4.");
      return;
    }

    if (scenario === "point-6-pass") {
      setPoint(6);
      setPassLineBet(25);
      setBankroll(STARTING_BANKROLL - 25);
      setForcedTotal(6);
      setMessage("Scenario loaded: Point 6 with $25 Pass Line. Next roll makes the point.");
      return;
    }

    if (scenario === "place-68") {
      const nextPlaceBets = emptyNumberBets();
      nextPlaceBets[6] = 30;
      nextPlaceBets[8] = 30;

      setPoint(6);
      setPlaceBets(nextPlaceBets);
      setBankroll(STARTING_BANKROLL - 60);
      setForcedTotal(8);
      setMessage("Scenario loaded: $30 Place 6 and 8. Next roll is 8.");
      return;
    }

    if (scenario === "come-travel") {
      setPoint(6);
      setActiveComeBet(25);
      setBankroll(STARTING_BANKROLL - 25);
      setForcedTotal(8);
      setForcedDice([2, 6]);
      setMessage("Scenario loaded: $25 Come bet with point 6. Next roll 2 + 6 travels to 8.");
      return;
    }

    if (scenario === "hard-8") {
      const nextHardways = emptyHardways();
      nextHardways[8] = 25;

      setPoint(6);
      setHardways(nextHardways);
      setHardwaysWorking(true);
      setBankroll(STARTING_BANKROLL - 25);
      setForcedTotal(8);
      setForcedDice([4, 4]);
      setMessage("Scenario loaded: $25 Hard 8. Next roll is 4 + 4.");
      return;
    }

    const nextPlaceBets = emptyNumberBets();
    nextPlaceBets[6] = 30;
    nextPlaceBets[8] = 30;

    setPoint(6);
    setPassLineBet(25);
    setPlaceBets(nextPlaceBets);
    setBankroll(STARTING_BANKROLL - 85);
    setForcedTotal(7);
    setForcedDice([3, 4]);
    setMessage("Scenario loaded: Point 6 with Pass and Place 6/8. Next roll is a seven-out.");
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

    const amountToAdd = calculateCappedAdd(selectedChip, currentBet, maxBet, bankroll);

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
    if (
      learnModeActive &&
      (learnLesson !== "pass-line" || learnStep !== "pass-place") &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: complete the current step first.");
      return;
    }

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
    if (
      learnModeActive &&
      (learnLesson !== "pass-line" || learnStep !== "pass-odds") &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: complete the current step first.");
      return;
    }

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
    if (
      learnModeActive &&
      (learnLesson !== "dont-pass" || learnStep !== "dp-place") &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: complete the current step first.");
      return;
    }

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
    if (
      learnModeActive &&
      (learnLesson !== "dont-pass" || learnStep !== "dp-odds") &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: build the highlighted Don't Pass lay odds.");
      return;
    }

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
    if (learnModeActive && !wantsRemove(event)) {
      const correctPlaceNumber =
        (learnStep === "place-6" && number === 6) ||
        (learnStep === "place-8" && number === 8);

      if (learnLesson !== "place-68" || !correctPlaceNumber) {
        setMessage("Learn Mode: complete the highlighted lesson step first.");
        return;
      }
    }

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

    const maxBet = getPlaceBetMax(number);
    const remainingRoom = maxBet - placeBets[number];

    if (remainingRoom <= 0) {
      setMessage(
        `Place ${number} is already at the table maximum of $${money(maxBet)}.`
      );
      return;
    }

    const lessonTarget =
      learnModeActive &&
      learnLesson === "place-68" &&
      ((learnStep === "place-6" && number === 6) ||
        (learnStep === "place-8" && number === 8))
        ? 6
        : null;
    const chipForThisAdd =
      lessonTarget === null
        ? selectedChip
        : Math.min(selectedChip, Math.max(0, lessonTarget - placeBets[number]));
    const amountToAdd = calculateCappedAdd(
      chipForThisAdd,
      placeBets[number],
      maxBet,
      bankroll
    );

    if (amountToAdd <= 0) {
      setMessage("Not enough bankroll.");
      return;
    }

    setPlaceBets((current) => ({
      ...current,
      [number]: current[number] + amountToAdd,
    }));
    setBankroll((current) => current - amountToAdd);

    const newTotal = placeBets[number] + amountToAdd;
    setMessage(
      amountToAdd < selectedChip
        ? `Added $${money(amountToAdd)} to Place ${number}, reaching $${money(
            newTotal
          )}. Table max is $${money(maxBet)}.`
        : `Place ${number} is now $${money(newTotal)}. Pays ${placeOddsLabel(
            number
          )}. Table max $${money(maxBet)}.`
    );
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
    if (
      learnModeActive &&
      (learnLesson !== "field" || learnStep !== "field-place") &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: complete the current Field step first.");
      return;
    }

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

    const profit = calculateFieldProfit(total, fieldBet);

    if (profit > 0) {
      flashOutcome("field", "field", "win");
      setBankroll((current) => current + profit);
      return `Field wins $${money(profit)}. Bet stays up.`;
    }

    const lost = fieldBet;
    flashOutcome("field", "field", "loss");
    setFieldBet(0);
    return `Field loses $${money(lost)}.`;
  }

  function handleComeBet(event?: MouseEvent<HTMLButtonElement>) {
    if (
      learnModeActive &&
      (learnLesson !== "come" || learnStep !== "come-place") &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: complete the current step first.");
      return;
    }

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
    if (
      learnModeActive &&
      (learnLesson !== "dont-come" || learnStep !== "dc-place") &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: complete the current step first.");
      return;
    }

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
    if (
      learnModeActive &&
      (learnLesson !== "come" ||
        learnStep !== "come-odds" ||
        number !== 8) &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: add odds to the highlighted Come 8.");
      return;
    }

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

    const amountToAdd = calculateCappedAdd(selectedChip, comeOdds[number], maxBet, bankroll);

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
    if (
      learnModeActive &&
      (learnLesson !== "dont-come" ||
        learnStep !== "dc-odds" ||
        number !== 8) &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: add lay odds behind the highlighted Don't Come 8.");
      return;
    }

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

    const amountToAdd = calculateCappedAdd(selectedChip, dontComeOdds[number], maxBet, bankroll);

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
    if (
      learnModeActive &&
      (learnLesson !== "hardways" ||
        learnStep !== "hard-place" ||
        number !== 6) &&
      !wantsRemove(event)
    ) {
      setMessage("Learn Mode: place the highlighted Hard 6 first.");
      return;
    }

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
      const profit = calculateHardwayProfit(total, bet);

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

  function handleHopBet(
    event: MouseEvent<HTMLButtonElement>,
    first: number,
    second: number
  ) {
    const key = hopKey(first, second);
    const currentBet = hopBets[key] ?? 0;
    const isHardHop = first === second;
    const pays = isHardHop ? 30 : 15;

    if (wantsRemove(event)) {
      if (currentBet <= 0) {
        setMessage(`There is no Hop ${key} bet to remove.`);
        return;
      }

      const amount = amountToRemove(currentBet);
      setHopBets((current) => ({
        ...current,
        [key]: Math.max(0, (current[key] ?? 0) - amount),
      }));
      setBankroll((current) => current + amount);
      setMessage(`Removed $${money(amount)} from Hop ${key}.`);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setHopBets((current) => ({
      ...current,
      [key]: (current[key] ?? 0) + selectedChip,
    }));
    setBankroll((current) => current - selectedChip);
    setMessage(
      `Hop ${key} is now $${money(
        currentBet + selectedChip
      )}. Pays ${pays}:1.`
    );
  }

  function resolveHopBets(first: number, second: number) {
    const messages: string[] = [];
    const rolledKey = hopKey(first, second);
    const next = { ...hopBets };
    let losingHopAction = 0;

    for (const [hopFirst, hopSecond] of allHopPairs) {
      const key = hopKey(hopFirst, hopSecond);
      const bet = hopBets[key] ?? 0;

      if (bet <= 0) continue;

      if (key === rolledKey) {
        const profit = calculateHopProfit(hopFirst, hopSecond, bet);

        flashOutcome("prop", `hop-${key}`, "win");
        setBankroll((current) => current + profit);
        messages.push(
          `Hop ${key} wins $${money(profit)}. Bet stays up.`
        );
      } else {
        losingHopAction += bet;
        next[key] = 0;
        flashOutcome("prop", `hop-${key}`, "loss");
      }
    }

    if (losingHopAction > 0) {
      messages.push(
        `Other Hop bets lose $${money(losingHopAction)}.`
      );
    }

    if (totalHopBets > 0) {
      setHopBets(next);
    }

    return messages;
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

    if (worldBet > 0) {
      const profit = resolveWorldNetProfit(total, worldBet);

      if (profit >= 0) {
        flashOutcome("prop", "world", "win");
        if (profit > 0) {
          setBankroll((current) => current + profit);
          messages.push(
            `World hits ${total}. Net profit $${money(profit)}. Bet stays up.`
          );
        } else {
          messages.push("World hits 7. Overall push. Bet stays up.");
        }
      } else {
        flashOutcome("prop", "world", "loss");
        messages.push(`World loses $${money(worldBet)}.`);
        setWorldBet(0);
      }
    }

    if (ceBet > 0) {
      const profit = resolveCeNetProfit(total, ceBet);

      if (profit >= 0) {
        flashOutcome("prop", "ce", "win");
        setBankroll((current) => current + profit);
        messages.push(
          `C & E hits ${total}. Net profit $${money(profit)}. Bet stays up.`
        );
      } else {
        flashOutcome("prop", "ce", "loss");
        messages.push(`C & E loses $${money(ceBet)}.`);
        setCeBet(0);
      }
    }

    const hornHighConfigs = [
      {
        high: 2,
        bet: hornHigh2Bet,
        setter: setHornHigh2Bet,
        key: "horn-high-2",
      },
      {
        high: 3,
        bet: hornHigh3Bet,
        setter: setHornHigh3Bet,
        key: "horn-high-3",
      },
      {
        high: 11,
        bet: hornHigh11Bet,
        setter: setHornHigh11Bet,
        key: "horn-high-11",
      },
      {
        high: 12,
        bet: hornHigh12Bet,
        setter: setHornHigh12Bet,
        key: "horn-high-12",
      },
    ];

    for (const config of hornHighConfigs) {
      if (config.bet <= 0) continue;

      const profit = resolveHornHighNetProfit(
        total,
        config.bet,
        config.high
      );

      if (profit >= 0) {
        flashOutcome("prop", config.key, "win");
        setBankroll((current) => current + profit);
        messages.push(
          `Horn High ${config.high} hits ${total}. Net profit $${money(
            profit
          )}. Bet stays up.`
        );
      } else {
        flashOutcome("prop", config.key, "loss");
        messages.push(
          `Horn High ${config.high} loses $${money(config.bet)}.`
        );
        config.setter(0);
      }
    }

    return messages;
  }

  function resolveComeBets(total: number, oddsWorking: boolean) {
    const messages: string[] = [];
    const nextCome = { ...comeBets };
    const nextOdds = { ...comeOdds };

    for (const number of pointNumbers) {
      const flat = nextCome[number];
      const odds = nextOdds[number];
      const result = resolveTraveledComeBet(
        total,
        number,
        flat,
        odds,
        oddsWorking
      );

      if (result.result === "none") continue;

      flashOutcome(
        "come",
        String(number),
        result.result === "win" ? "win" : "loss"
      );

      if (result.bankrollReturn > 0) {
        setBankroll((current) => current + result.bankrollReturn);
      }

      if (result.result === "win") {
        messages.push(
          `Come ${number} wins $${money(result.flatProfit)}` +
            (result.oddsProfit > 0
              ? ` + $${money(result.oddsProfit)} odds.`
              : result.oddsReturned > 0
                ? `. $${money(result.oddsReturned)} Come odds were OFF and returned.`
                : ".")
        );
      } else {
        messages.push(
          `Come ${number} loses $${money(result.amountLost)}` +
            (result.oddsReturned > 0
              ? `. $${money(result.oddsReturned)} Come odds were OFF and returned.`
              : ".")
        );
      }

      nextCome[number] = 0;
      nextOdds[number] = 0;
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

  function resolveDontComeBets(total: number, oddsWorking: boolean) {
    const messages: string[] = [];
    const nextDC = { ...dontComeBets };
    const nextOdds = { ...dontComeOdds };

    for (const number of pointNumbers) {
      const flat = nextDC[number];
      const lay = nextOdds[number];
      const result = resolveTraveledDontComeBet(
        total,
        number,
        flat,
        lay,
        oddsWorking
      );

      if (result.result === "none") continue;

      flashOutcome(
        "dontCome",
        String(number),
        result.result === "win" ? "win" : "loss"
      );

      if (result.bankrollReturn > 0) {
        setBankroll((current) => current + result.bankrollReturn);
      }

      if (result.result === "win") {
        messages.push(
          `Don't Come ${number} wins $${money(result.flatProfit)}` +
            (result.oddsProfit > 0
              ? ` + $${money(result.oddsProfit)} lay odds.`
              : result.oddsReturned > 0
                ? `. $${money(result.oddsReturned)} lay odds were OFF and returned.`
                : ".")
        );
      } else {
        messages.push(
          `Don't Come ${number} loses $${money(result.amountLost)}` +
            (result.oddsReturned > 0
              ? `. $${money(result.oddsReturned)} lay odds were OFF and returned.`
              : ".")
        );
      }

      nextDC[number] = 0;
      nextOdds[number] = 0;
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

    const learnRollStep =
      learnStep === "pass-come-out" ||
      learnStep === "pass-resolve" ||
      learnStep === "place-roll-6" ||
      learnStep === "place-roll-8" ||
      learnStep === "place-seven" ||
      learnStep === "come-roll-travel" ||
      learnStep === "come-resolve" ||
      learnStep === "dp-bar12" ||
      learnStep === "dp-point-roll" ||
      learnStep === "dp-seven" ||
      learnStep === "dc-roll-travel" ||
      learnStep === "dc-seven" ||
      learnStep === "field-even" ||
      learnStep === "field-two" ||
      learnStep === "field-twelve" ||
      learnStep === "field-loss" ||
      learnStep === "hard-win" ||
      learnStep === "hard-easy";

    if (learnModeActive && !learnRollStep) {
      setMessage("Learn Mode: complete the highlighted lesson step first.");
      return;
    }

    rollStartEquityRef.current = bankroll + totalOnTable;
    pendingRollNumberRef.current = rollCount + 1;

    setIsRolling(true);
    setTravelAnimation(null);
    setLastRollBets(captureBetSnapshot());
    setLastBetSnapshot(null);
    setMessage("Dice are rolling...");

    let finalFirst: number;
    let finalSecond: number;

    if (
      learnModeActive &&
      (learnStep === "place-roll-8" ||
        learnStep === "come-roll-travel" ||
        learnStep === "come-resolve" ||
        learnStep === "dc-roll-travel")
    ) {
      finalFirst = 4;
      finalSecond = 4;
    } else if (
      learnModeActive &&
      (learnStep === "place-seven" ||
        learnStep === "dp-seven" ||
        learnStep === "dc-seven")
    ) {
      finalFirst = 3;
      finalSecond = 4;
    } else if (
      learnModeActive &&
      (learnStep === "pass-come-out" ||
        learnStep === "pass-resolve" ||
        learnStep === "place-roll-6" ||
        learnStep === "dp-point-roll" ||
        learnStep === "field-loss" ||
        learnStep === "hard-win")
    ) {
      // Guided lessons use deterministic rolls so the teaching sequence is repeatable.
      finalFirst = 3;
      finalSecond = 3;
    } else if (learnModeActive && (learnStep === "dp-bar12" || learnStep === "field-twelve")) {
      finalFirst = 6;
      finalSecond = 6;
    } else if (learnModeActive && learnStep === "field-even") {
      finalFirst = 4;
      finalSecond = 5;
    } else if (learnModeActive && learnStep === "field-two") {
      finalFirst = 1;
      finalSecond = 1;
    } else if (learnModeActive && learnStep === "hard-easy") {
      finalFirst = 2;
      finalSecond = 4;
    } else if (testingMode) {
      [finalFirst, finalSecond] =
        forcedDice && forcedDice[0] + forcedDice[1] === forcedTotal
          ? forcedDice
          : makeDiceForTotal(forcedTotal);
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

    const rollEvent = classifyRollEvent(total);
    const pointBeforeRoll = point;

    setRollCount((current) => current + 1);
    setRollHistory((current) => [
      {
        first: finalFirst,
        second: finalSecond,
        total,
        event: rollEvent,
        pointBefore: pointBeforeRoll,
      },
      ...current,
    ]);

    resolveRoll(finalFirst, finalSecond, total);
    setIsRolling(false);
  }

  function resolveRoll(first: number, second: number, total: number) {
    const messages: string[] = [];

    if (
      isBetWorking(
        "lay",
        betsWorking,
        point !== null,
        placeBetsWorking
      )
    ) {
      const layMessage = resolveNumberLayBets(total);
      if (layMessage) messages.push(layMessage);
    }

    const fieldMessage = resolveField(total);
    if (fieldMessage) messages.push(fieldMessage);

    messages.push(...resolvePropBets(total));
    messages.push(...resolveHopBets(first, second));

    if (hardwaysWorking) {
      messages.push(...resolveHardways(first, second, total));
    }

    const traveledOddsWorking =
      point !== null &&
      isBetWorking(
        "odds",
        betsWorking,
        true,
        placeBetsWorking
      );
    messages.push(...resolveComeBets(total, traveledOddsWorking));
    messages.push(...resolveDontComeBets(total, traveledOddsWorking));

    if (point === null) {
      if (
        isBetWorking(
          "place",
          betsWorking,
          false,
          placeBetsWorking
        )
      ) {
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
        messages.unshift(`${total} — Natural! Contract bet remains for the next come-out.`);

        if (passLineBet > 0) {
          flashOutcome("pass", "pass", "win");
          setBankroll((current) => current + passLineBet);
          messages.push(
            `Pass Line wins $${money(passLineBet)}. Bet stays up.`
          );
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
          setBankroll((current) => current + dontPassBet);
          messages.push(
            `Don't Pass wins $${money(dontPassBet)}. Bet stays up.`
          );
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
          messages.push("Don't Pass bars 12. Bet stays up.");
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

      const multiRollBetsWorking = isBetWorking(
        "odds",
        betsWorking,
        true,
        placeBetsWorking
      );

      if (
        isBetWorking(
          "place",
          betsWorking,
          true,
          placeBetsWorking
        )
      ) {
        const placeLoss = clearPlaceBets();
        if (placeLoss > 0) {
          messages.push(`Place bets lose $${money(placeLoss)}.`);
        }
      }

      if (passLineBet + passOddsBet > 0) {
        flashOutcome("pass", "pass", "loss");

        if (passLineBet > 0) {
          messages.push(`Pass Line loses $${money(passLineBet)}.`);
        }

        if (passOddsBet > 0) {
          if (multiRollBetsWorking) {
            messages.push(`Pass odds lose $${money(passOddsBet)}.`);
          } else {
            setBankroll((current) => current + passOddsBet);
            messages.push(
              `Pass odds are OFF. $${money(passOddsBet)} returned.`
            );
          }
        }
      }

      if (dontPassBet > 0) {
        flashOutcome("dontPass", "dont-pass", "win");
        let returned = dontPassBet * 2;
        let profit = 0;

        if (dontPassOddsBet > 0) {
          if (multiRollBetsWorking) {
            profit = calculateLayOddsProfit(point!, dontPassOddsBet);
            returned += dontPassOddsBet + profit;
          } else {
            returned += dontPassOddsBet;
          }
        }

        setBankroll((current) => current + returned);
        messages.push(`Don't Pass wins $${money(dontPassBet)}.`);

        if (profit > 0) {
          messages.push(`Lay odds win $${money(profit)}.`);
        } else if (dontPassOddsBet > 0 && !multiRollBetsWorking) {
          messages.push(
            `Lay odds are OFF. $${money(dontPassOddsBet)} returned.`
          );
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

    if (
      isBetWorking(
        "place",
        betsWorking,
        true,
        placeBetsWorking
      )
    ) {
      const placeMessage = resolvePlaceBet(total);
      if (placeMessage) messages.push(placeMessage);
    }

    if (total === point) {
      messages.unshift(`${total} — Point made!`);

      const contractOddsWorking = isBetWorking(
        "odds",
        betsWorking,
        true,
        placeBetsWorking
      );

      if (passLineBet > 0) {
        flashOutcome("pass", "pass", "win");
        let returned = passLineBet * 2;
        let oddsProfit = 0;

        if (passOddsBet > 0) {
          if (contractOddsWorking) {
            oddsProfit = calculatePassOddsProfit(point, passOddsBet);
            returned += passOddsBet + oddsProfit;
          } else {
            returned += passOddsBet;
          }
        }

        setBankroll((current) => current + returned);
        messages.push(`Pass Line wins $${money(passLineBet)}.`);

        if (oddsProfit) {
          messages.push(`Pass odds win $${money(oddsProfit)}.`);
        } else if (passOddsBet > 0 && !contractOddsWorking) {
          messages.push(
            `Pass odds are OFF. $${money(passOddsBet)} returned.`
          );
        }
      }

      if (dontPassBet + dontPassOddsBet > 0) {
        flashOutcome("dontPass", "dont-pass", "loss");

        if (dontPassBet > 0) {
          messages.push(
            `Don't Pass loses $${money(dontPassBet)}.`
          );
        }

        if (dontPassOddsBet > 0) {
          if (contractOddsWorking) {
            messages.push(
              `Lay odds lose $${money(dontPassOddsBet)}.`
            );
          } else {
            setBankroll((current) => current + dontPassOddsBet);
            messages.push(
              `Lay odds are OFF. $${money(dontPassOddsBet)} returned.`
            );
          }
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

    if (messages.length === 0) {
      messages.push(`${total} — No decision.`);
    } else {
      messages.unshift(`${total} rolled.`);
    }

    setMessage(messages.join(" "));
  }


  return (
    <main className="min-h-screen bg-[#03130e] px-2 pb-28 pt-2 text-white sm:px-4 sm:pb-24 sm:pt-3 lg:pb-24">
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
          animation: luckyWinPulse 980ms ease-out both;
          position: relative;
          z-index: 35;
        }

        .lucky-loss-flash {
          animation: luckyLossPulse 980ms ease-out both;
          position: relative;
          z-index: 35;
        }

        .lucky-win-flash::after,
        .lucky-loss-flash::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 2px;
          border-radius: inherit;
          opacity: 0;
        }

        .lucky-win-flash::after {
          animation: luckyWinOverlay 980ms ease-out both;
          background: radial-gradient(circle at center, rgba(74,222,128,.22), transparent 70%);
        }

        .lucky-loss-flash::after {
          animation: luckyLossOverlay 980ms ease-out both;
          background: radial-gradient(circle at center, rgba(248,113,113,.22), transparent 70%);
        }

        @keyframes luckyWinOverlay {
          0% { opacity: 0; }
          25% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes luckyLossOverlay {
          0% { opacity: 0; }
          25% { opacity: 1; }
          100% { opacity: 0; }
        }

        .lucky-rotate-hint {
          display: none;
        }

        @media (max-width: 639px) and (orientation: portrait) {
          .lucky-rotate-hint {
            display: flex;
          }
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
        <TableHeader
          bankroll={bankroll}
          totalOnTable={totalOnTable}
          sessionPL={sessionPL}
          rollCount={rollCount}
        />

        <div className="lucky-rotate-hint mb-1 items-center justify-center gap-2 rounded-lg border border-amber-600/50 bg-amber-950/25 px-3 py-2 text-[10px] font-bold text-amber-200">
          <span aria-hidden="true">↻</span>
          <span>Rotate your phone to landscape for the best table view.</span>
        </div>

        {/* Phones keep the core table intact. Portrait can pan; landscape fits.
            Tablets show the full table including Center Action. */}
        <div className="-mx-2 overflow-x-auto overscroll-x-contain px-2 pb-2 sm:mx-0 sm:overflow-visible sm:px-0 lg:pb-0">
          <div className="min-w-[760px] sm:min-w-0">
            {/* FELT */}
            <div
              onPointerDownCapture={rememberUndo}
              className="overflow-hidden rounded-[30px] border-[9px] border-[#6c3b12] bg-[#087348] shadow-[0_18px_45px_rgba(0,0,0,.5),inset_0_0_0_2px_rgba(255,188,90,.08),inset_0_0_24px_rgba(0,0,0,.2)]"
            >
          <div
            className="relative border-[3px] border-[#2f1b0a] p-2 sm:p-3"
            style={{
              backgroundImage:
                "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.04), transparent 24%), radial-gradient(circle at 78% 78%, rgba(0,0,0,0.13), transparent 30%), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, rgba(0,0,0,0.012) 1px, rgba(0,0,0,0.012) 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.008) 0px, rgba(255,255,255,0.008) 1px, transparent 1px, transparent 4px)",
            }}
          >
            <div className="relative z-10 grid gap-1 lg:grid-cols-[minmax(0,3.2fr)_minmax(240px,.84fr)] xl:grid-cols-[minmax(0,3.2fr)_minmax(290px,.92fr)]">
              {/* MAIN PLAYER AREA */}
              <div className="min-w-0">
                {/* BOX NUMBERS */}
                <div className="relative grid grid-cols-6 gap-[3px]">
                  {pointNumbers.map((number) => (
                    <div
                      key={number}
                      className={`relative min-h-[212px] overflow-visible border border-white/60 bg-black/[0.025] text-center transition ${
                        point === number
                          ? "ring-2 ring-inset ring-amber-300/85"
                          : ""
                      } ${
                        learnModeActive &&
                        ((learnStep === "pass-point" && point === number) ||
                          (learnStep === "place-explain" &&
                            (number === 6 || number === 8)))
                          ? "outline outline-[5px] outline-cyan-300 outline-offset-[-5px] shadow-[0_0_34px_rgba(34,211,238,.82)]"
                          : ""
                      } ${quickPreviewNumberClass(number)}`}
                    >
                      {point === number && (
                        <div
                          className={`absolute left-1/2 top-[122px] z-[70] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-[radial-gradient(circle_at_35%_30%,#3f3f46_0%,#18181b_36%,#09090b_72%)] text-[9px] font-black tracking-[0.04em] shadow-[0_6px_12px_rgba(0,0,0,.55),inset_0_0_0_2px_rgba(255,255,255,.08)] ring-2 ring-black/50 ${
                            learnModeActive &&
                            (learnStep === "pass-point" ||
                              learnStep === "place-explain")
                              ? "outline outline-[4px] outline-cyan-300 outline-offset-2 shadow-[0_0_25px_rgba(34,211,238,.9)]"
                              : ""
                          }`}
                          title={`Point is ${number}`}
                        >
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
                          <span className="text-[10px] font-black uppercase tracking-[0.13em] text-red-50">
                            Don&apos;t Come
                          </span>

                          {dontComeBets[number] > 0 && (
                            <div className="flex items-center gap-1">
                              <BetChip amount={dontComeBets[number]} compact />
                              <button
                                onClick={(event) =>
                                  handleDontComeOdds(event, number)
                                }
                                className={`flex min-w-[58px] items-center justify-center gap-1 rounded border border-red-300/60 bg-red-950/90 px-1 py-0.5 font-black leading-tight text-red-50 ${strategyGuideClass(
                                  effectiveGuideTarget,
                                  `dont-come-odds-${number}`
                                )}`}
                                title={`Don't Come lay odds pay ${layOddsLabel(
                                  number
                                )}`}
                              >
                                <span className="text-[6px] uppercase tracking-[0.06em] text-red-100">
                                  {dontComeOdds[number] > 0 ? "LAY" : "+ ODDS"}
                                  <span className="block text-[7px] text-red-200">
                                    {layOddsLabel(number)}
                                  </span>
                                </span>
                                <BetChip
                                  amount={dontComeOdds[number]}
                                  compact
                                />
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
                          <span className="block text-[10px] font-black tracking-[0.14em] text-red-50">
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
                          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-50">
                            Come
                          </span>

                          {comeBets[number] > 0 && (
                            <div className="flex items-center gap-1">
                              <BetChip amount={comeBets[number]} compact />
                              <button
                                onClick={(event) =>
                                  handleComeOdds(event, number)
                                }
                                className={`flex min-w-[58px] items-center justify-center gap-1 rounded border border-blue-300/60 bg-blue-950/90 px-1 py-0.5 font-black leading-tight text-blue-50 ${strategyGuideClass(
                                  effectiveGuideTarget,
                                  `come-odds-${number}`
                                )}`}
                                title={`Come odds pay ${passOddsLabel(number)}`}
                              >
                                <span className="text-[6px] uppercase tracking-[0.06em] text-blue-100">
                                  {comeOdds[number] > 0 ? "ODDS" : "+ ODDS"}
                                  <span className="block text-[7px] text-blue-200">
                                    {passOddsLabel(number)}
                                  </span>
                                </span>
                                <BetChip amount={comeOdds[number]} compact />
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
                        <span
                          className={`box-number font-black leading-none text-white ${
                            number === 6 || number === 9
                              ? "text-4xl sm:text-[42px]"
                              : "text-[42px] sm:text-5xl"
                          }`}
                          style={{
                            textShadow:
                              "0 2px 0 rgba(0,0,0,.75), 0 0 10px rgba(255,255,255,.08)",
                          }}
                        >
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
                        } ${flashClass("place", String(number))} ${strategyGuideClass(
                          effectiveGuideTarget,
                          `place-${number}`
                        )}`}
                        title={`Place ${number} pays ${placeOddsLabel(number)}`}
                      >
                        <span className="text-left leading-tight">
                          <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-emerald-50">
                            PLACE • {placeOddsLabel(number)}
                          </span>
                          <span className="block text-[6px] font-black uppercase tracking-[0.1em] text-emerald-200/65">
                            MAX {placeMaxLabel(number)}
                          </span>
                        </span>
                        <BetChip amount={placeBets[number]} compact />
                      </button>
                    </div>
                  ))}

                  {point === null && (
                    <div
                      className="absolute -left-1 -top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-zinc-800 bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#f4f4f5_45%,#d4d4d8_100%)] text-[8px] font-black tracking-[0.03em] text-black shadow-[0_5px_12px_rgba(0,0,0,.45),inset_0_0_0_2px_rgba(255,255,255,.8)]"
                      title="Come-out roll"
                    >
                      OFF
                    </div>
                  )}
                </div>

                {/* CLASSIC COME / FIELD / DON'T PASS / PASS LAYOUT */}
                <div className="mt-1">
                  {/* DON'T COME BAR + COME */}
                  <div className="grid min-h-[92px] grid-cols-[112px_minmax(0,1fr)] gap-[3px] sm:grid-cols-[145px_minmax(0,1fr)] lg:grid-cols-[165px_minmax(0,1fr)]">
                    <button
                      onClick={handleDontComeBet}
                      className={`relative flex flex-col items-center justify-center rounded-sm border-2 border-white/70 bg-black/[0.035] px-2 text-center font-black transition hover:bg-white/[0.04] ${strategyGuideClass(
                        effectiveGuideTarget,
                        "dont-come"
                      )}`}
                      title="New Don't Come bet. Bar 12."
                    >
                      <span className="text-[11px] uppercase tracking-[0.08em] text-red-100">
                        DON&apos;T
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.08em] text-red-100">
                        COME
                      </span>
                      <span className="mt-1 text-[9px] uppercase tracking-[0.16em] text-red-200">
                        BAR 12
                      </span>
                      <span className="mt-1 flex items-center gap-1">
                        <MiniDie value={6} />
                        <MiniDie value={6} />
                      </span>
                      <span className="absolute bottom-1 right-1">
                        <BetChip amount={activeDontComeBet} compact />
                      </span>
                    </button>

                    <button
                      onClick={handleComeBet}
                      className={`relative flex items-center justify-center rounded-sm border-2 border-white/70 bg-black/[0.015] px-3 text-center transition hover:bg-white/[0.035] ${strategyGuideClass(
                        effectiveGuideTarget,
                        "come"
                      )}`}
                      title="Place a new Come bet"
                    >
                      <span
                        className="font-serif text-5xl tracking-[0.05em] text-red-300 sm:text-6xl"
                        style={{
                          textShadow:
                            "0 2px 0 rgba(0,0,0,.55), 0 0 12px rgba(248,113,113,.12)",
                        }}
                      >
                        COME
                      </span>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        <BetChip amount={activeComeBet} />
                      </span>
                    </button>
                  </div>

                  {/* CLASSIC FIELD */}
                  <button
                    onClick={handleFieldBet}
                    className={`relative mt-[3px] min-h-[102px] w-full overflow-hidden rounded-b-[54px] border-2 border-white/70 bg-black/[0.015] px-5 py-3 transition hover:bg-white/[0.035] ${flashClass(
                      "field",
                      "field"
                    )} ${quickPreviewFieldClass()} ${strategyGuideClass(
                      effectiveGuideTarget,
                      "field"
                    )}`}
                    title="Field: 3, 4, 9, 10, 11 pay even. 2 pays 2:1. 12 pays 3:1. Winning Field bets stay up."
                  >
                    <div className="flex h-full items-center justify-center gap-4 sm:gap-7">
                      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-amber-300/80 bg-amber-300/5 text-3xl font-black text-amber-100">
                        2
                        <span className="absolute -top-2 whitespace-nowrap text-[6px] font-black uppercase tracking-[0.12em] text-amber-200/80">
                          pays 2:1
                        </span>
                      </span>

                      <div className="text-center">
                        <div className="text-xl font-black tracking-[0.18em] sm:text-2xl">
                          3 • 4 • 9 • 10 • 11
                        </div>
                        <div className="mt-1 font-serif text-2xl font-black tracking-[0.12em] text-amber-100 sm:text-3xl">
                          FIELD
                        </div>
                      </div>

                      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-amber-300/80 bg-amber-300/5 text-3xl font-black text-amber-100">
                        12
                        <span className="absolute -top-2 whitespace-nowrap text-[6px] font-black uppercase tracking-[0.12em] text-amber-200/80">
                          pays 3:1
                        </span>
                      </span>
                    </div>

                    <span className="absolute bottom-2 right-5">
                      <BetChip amount={fieldBet} />
                    </span>
                  </button>

                  {/* CLASSIC DON'T PASS BAR */}
                  <div
                    className={`relative mt-[3px] min-h-[56px] overflow-hidden rounded-b-[28px] border-2 border-white/65 bg-black/[0.035] ${flashClass(
                      "dontPass",
                      "dont-pass"
                    )}`}
                  >
                    <button
                      onClick={handleDontPassBet}
                      className={`absolute inset-0 z-10 w-full text-base font-black tracking-[0.1em] hover:bg-white/[0.025] ${strategyGuideClass(
                          effectiveGuideTarget,
                          "dont-pass"
                        )}`}
                    >
                      DON&apos;T PASS — BAR 12
                      <span className="absolute left-4 top-1/2 -translate-y-1/2">
                        <BetChip amount={dontPassBet} compact />
                      </span>
                    </button>

                    {point !== null && dontPassBet > 0 && (
                      <button
                        onClick={handleDontPassOdds}
                        className={`absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 rounded-full border-2 border-red-300/70 bg-red-950/90 px-2.5 py-1 text-[8px] font-black text-red-50 shadow-lg ${strategyGuideClass(
                            effectiveGuideTarget,
                            "dont-pass-odds"
                          )}`}
                        title={`Don't Pass lay odds pay ${layOddsLabel(point)}`}
                      >
                        <span className="leading-tight">
                          <span className="block">
                            {dontPassOddsBet > 0 ? "LAY ODDS" : "+ LAY ODDS"}
                          </span>
                          <span className="block text-[7px] text-red-200">
                            {layOddsLabel(point)}
                          </span>
                        </span>
                        <BetChip amount={dontPassOddsBet} compact />
                      </button>
                    )}
                  </div>

                  {/* CLASSIC PASS LINE */}
                  <div
                    className={`relative mt-[3px] min-h-[78px] overflow-hidden rounded-b-[46px] rounded-t-[8px] border-[3px] border-white bg-black/[0.005] shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] ${flashClass(
                      "pass",
                      "pass"
                    )}`}
                  >
                    <button
                      onClick={handlePassLineBet}
                      className={`absolute inset-0 z-10 w-full pb-2 text-2xl font-black tracking-[0.2em] hover:bg-white/[0.025] sm:text-3xl ${strategyGuideClass(
                          effectiveGuideTarget,
                          "pass-line"
                        )}`}
                    >
                      PASS LINE
                      <span className="absolute left-5 top-1/2 -translate-y-1/2">
                        <BetChip amount={passLineBet} />
                      </span>
                    </button>

                    {point !== null && passLineBet > 0 && (
                      <button
                        onClick={handlePassOdds}
                        className={`absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 rounded-full border-2 border-amber-300/80 bg-amber-950/90 px-2.5 py-1 text-[8px] font-black text-amber-50 shadow-lg ${strategyGuideClass(
                            effectiveGuideTarget,
                            "pass-odds"
                          )}`}
                        title={`Pass odds pay ${passOddsLabel(point)}`}
                      >
                        <span className="leading-tight">
                          <span className="block">
                            {passOddsBet > 0 ? "PASS ODDS" : "+ PASS ODDS"}
                          </span>
                          <span className="block text-[7px] text-amber-200">
                            {passOddsLabel(point)}
                          </span>
                        </span>
                        <BetChip amount={passOddsBet} compact />
                      </button>
                    )}
                  </div>

                  <TableAnalytics
                    message={message}
                    rollHistory={rollHistory}
                    rollCount={rollCount}
                    sessionPL={sessionPL}
                  />
                </div>
              </div>

              {/* RIGHT RAIL: CENTER ACTION — full table on tablet/desktop */}
              <div className="hidden lg:block">
              <CenterAction
                hardwaysWorking={hardwaysWorking}
                onToggleHardways={() => {
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
                hardways={hardways}
                onHardway={handleHardway}
                flashClass={flashClass}
                guideTarget={effectiveGuideTarget}
                twoBet={twoBet}
                threeBet={threeBet}
                yoBet={yoBet}
                twelveBet={twelveBet}
                anyCrapsBet={anyCrapsBet}
                anySevenBet={anySevenBet}
                ceBet={ceBet}
                worldBet={worldBet}
                hornHigh2Bet={hornHigh2Bet}
                hornHigh3Bet={hornHigh3Bet}
                hornHigh11Bet={hornHigh11Bet}
                hornHigh12Bet={hornHigh12Bet}
                hornBet={hornBet}
                onTwoBet={(event) =>
                  handlePropBet(event, twoBet, setTwoBet, "2")
                }
                onThreeBet={(event) =>
                  handlePropBet(event, threeBet, setThreeBet, "3")
                }
                onYoBet={(event) =>
                  handlePropBet(event, yoBet, setYoBet, "Yo 11")
                }
                onTwelveBet={(event) =>
                  handlePropBet(event, twelveBet, setTwelveBet, "12")
                }
                onAnyCrapsBet={(event) =>
                  handlePropBet(
                    event,
                    anyCrapsBet,
                    setAnyCrapsBet,
                    "Any Craps"
                  )
                }
                onAnySevenBet={(event) =>
                  handlePropBet(
                    event,
                    anySevenBet,
                    setAnySevenBet,
                    "Any Seven"
                  )
                }
                onCeBet={(event) =>
                  handlePropBet(event, ceBet, setCeBet, "C & E")
                }
                onWorldBet={(event) =>
                  handlePropBet(event, worldBet, setWorldBet, "World")
                }
                onHornHigh2Bet={(event) =>
                  handlePropBet(
                    event,
                    hornHigh2Bet,
                    setHornHigh2Bet,
                    "HORN HIGH 2"
                  )
                }
                onHornHigh3Bet={(event) =>
                  handlePropBet(
                    event,
                    hornHigh3Bet,
                    setHornHigh3Bet,
                    "HORN HIGH 3"
                  )
                }
                onHornHigh11Bet={(event) =>
                  handlePropBet(
                    event,
                    hornHigh11Bet,
                    setHornHigh11Bet,
                    "HORN HIGH 11"
                  )
                }
                onHornHigh12Bet={(event) =>
                  handlePropBet(
                    event,
                    hornHigh12Bet,
                    setHornHigh12Bet,
                    "HORN HIGH 12"
                  )
                }
                onHornBet={(event) =>
                  handlePropBet(event, hornBet, setHornBet, "Horn")
                }
                hopBetsOpen={hopBetsOpen}
                onToggleHopBets={() =>
                  setHopBetsOpen((current) => !current)
                }
                totalHopBets={totalHopBets}
                hopBets={hopBets}
                selectedChip={selectedChip}
                onHopBet={handleHopBet}
              />
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>

        <MobileCenterActionDrawer
          open={mobileCenterOpen}
          onClose={() => setMobileCenterOpen(false)}
        >
          <CenterAction
            hardwaysWorking={hardwaysWorking}
            onToggleHardways={() => {
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
            hardways={hardways}
            onHardway={handleHardway}
            flashClass={flashClass}
            guideTarget={effectiveGuideTarget}
            twoBet={twoBet}
            threeBet={threeBet}
            yoBet={yoBet}
            twelveBet={twelveBet}
            anyCrapsBet={anyCrapsBet}
            anySevenBet={anySevenBet}
            ceBet={ceBet}
            worldBet={worldBet}
            hornHigh2Bet={hornHigh2Bet}
            hornHigh3Bet={hornHigh3Bet}
            hornHigh11Bet={hornHigh11Bet}
            hornHigh12Bet={hornHigh12Bet}
            hornBet={hornBet}
            onTwoBet={(event) =>
              handlePropBet(event, twoBet, setTwoBet, "2")
            }
            onThreeBet={(event) =>
              handlePropBet(event, threeBet, setThreeBet, "3")
            }
            onYoBet={(event) =>
              handlePropBet(event, yoBet, setYoBet, "Yo 11")
            }
            onTwelveBet={(event) =>
              handlePropBet(event, twelveBet, setTwelveBet, "12")
            }
            onAnyCrapsBet={(event) =>
              handlePropBet(
                event,
                anyCrapsBet,
                setAnyCrapsBet,
                "Any Craps"
              )
            }
            onAnySevenBet={(event) =>
              handlePropBet(
                event,
                anySevenBet,
                setAnySevenBet,
                "Any Seven"
              )
            }
            onCeBet={(event) =>
              handlePropBet(event, ceBet, setCeBet, "C & E")
            }
            onWorldBet={(event) =>
              handlePropBet(event, worldBet, setWorldBet, "World")
            }
            onHornHigh2Bet={(event) =>
              handlePropBet(
                event,
                hornHigh2Bet,
                setHornHigh2Bet,
                "HORN HIGH 2"
              )
            }
            onHornHigh3Bet={(event) =>
              handlePropBet(
                event,
                hornHigh3Bet,
                setHornHigh3Bet,
                "HORN HIGH 3"
              )
            }
            onHornHigh11Bet={(event) =>
              handlePropBet(
                event,
                hornHigh11Bet,
                setHornHigh11Bet,
                "HORN HIGH 11"
              )
            }
            onHornHigh12Bet={(event) =>
              handlePropBet(
                event,
                hornHigh12Bet,
                setHornHigh12Bet,
                "HORN HIGH 12"
              )
            }
            onHornBet={(event) =>
              handlePropBet(event, hornBet, setHornBet, "Horn")
            }
            hopBetsOpen={hopBetsOpen}
            onToggleHopBets={() =>
              setHopBetsOpen((current) => !current)
            }
            totalHopBets={totalHopBets}
            hopBets={hopBets}
            selectedChip={selectedChip}
            onHopBet={handleHopBet}
          />
        </MobileCenterActionDrawer>

        {/* PLAYER CONTROLS */}
        <div className="mt-2 rounded-xl border border-emerald-900/80 bg-black/30 px-3 py-2">
          <UtilityControls
            totalLayBets={totalLayBets}
            totalHopBets={totalHopBets}
            removableBetsTotal={removableBetsTotal}
            canUndo={Boolean(lastBetSnapshot)}
            canRebet={Boolean(lastRollBets)}
            isRolling={isRolling}
            onUndo={undoLastBet}
            onRebet={rebetLastRoll}
            onClearBets={clearRemovableBets}
            onReset={resetTable}
          />

          <QuickBets
            selectedChip={selectedChip}
            quickBetPreview={quickBetPreview}
            onSetQuickBetPreview={setQuickBetPreview}
            onApplyQuickBet={applyQuickBet}
          />
        </div>

        <LearnMode
          active={learnModeActive}
          lesson={learnLesson}
          step={learnStep}
          point={point}
          onStartPassLine={startPassLineLesson}
          onStartPlace68={startPlace68Lesson}
          onStartCome={startComeLesson}
          onStartDontPass={startDontPassLesson}
          onStartDontCome={startDontComeLesson}
          onStartField={startFieldLesson}
          onStartHardways={startHardwaysLesson}
          onContinue={continueLearnLesson}
          onRestart={restartLearnLesson}
          onExit={exitLearnMode}
        />

        {!learnModeActive && (
          <>
        <PracticeControls
          testingMode={testingMode}
          onToggleTestingMode={() =>
            setTestingMode((current) => !current)
          }
          forcedTotal={forcedTotal}
          onForcedTotalChange={changePracticeTotal}
          forcedDice={forcedDice}
          onForcedDiceChange={setForcedDice}
          point={point}
          onPointChange={changePracticePoint}
          onLoadScenario={loadPracticeScenario}
        />

        <StrategyMode
          bankroll={bankroll}
          totalOnTable={totalOnTable}
          rollCount={rollCount}
          point={point}
          selectedChip={selectedChip}
          passLineBet={passLineBet}
          passOddsBet={passOddsBet}
          dontPassBet={dontPassBet}
          dontPassOddsBet={dontPassOddsBet}
          activeComeBet={activeComeBet}
          comeBets={comeBets}
          comeOdds={comeOdds}
          activeDontComeBet={activeDontComeBet}
          dontComeBets={dontComeBets}
          dontComeOdds={dontComeOdds}
          placeBets={placeBets}
          fieldBet={fieldBet}
          onGuideTargetChange={setStrategyGuideTarget}
          onGuideAmountChange={setStrategyGuideAmount}
        />
          </>
        )}

        <MobileActionBar
          dieOne={dieOne}
          dieTwo={dieTwo}
          rollTotal={rollTotal}
          lastRollNet={lastRollNet}
          isRolling={isRolling}
          onRollDice={rollDice}
          selectedChip={selectedChip}
          onSelectChip={setSelectedChip}
          removeMode={removeMode}
          onToggleRemoveMode={() =>
            setRemoveMode((current) => !current)
          }
          onOpenCenterBets={() => setMobileCenterOpen(true)}
          betsWorking={betsWorking}
          onToggleBetsWorking={toggleBetsWorking}
          placeBetsWorking={placeBetsWorking}
          onTogglePlaceBetsWorking={() =>
            setPlaceBetsWorking((current) => !current)
          }
          bankroll={bankroll}
          totalOnTable={totalOnTable}
          strategyGuideTarget={effectiveGuideTarget}
          strategyGuideAmount={effectiveGuideAmount}
        />

        <p className="mt-2 text-center text-[9px] text-emerald-700">
          Practice credits have no cash value.
        </p>
      </div>
    </main>
  );


}
