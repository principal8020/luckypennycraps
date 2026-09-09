"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildShoe,
  canSplitPair,
  dealerShouldHit,
  getBasicStrategyRecommendation,
  getHandValue,
  isBlackjack,
  resolveBlackjackRound,
  shuffleShoe,
  shouldReshuffleBeforeDeal,
  type BasicStrategyAction,
  type BlackjackCard,
} from "./blackjackRules";

type RoundState = "betting" | "dealing" | "player" | "dealer" | "resolved";
type HandStatus = "playing" | "stood" | "bust";
type HandResult = "blackjack" | "win" | "loss" | "push";

type PlayerHand = {
  id: number;
  cards: BlackjackCard[];
  wager: number;
  status: HandStatus;
  fromSplit: boolean;
  splitAces: boolean;
  result?: HandResult;
  profit?: number;
};

type HistoryHand = {
  cards: BlackjackCard[];
  wager: number;
  total: number;
  result: HandResult;
  profit: number;
};

type RoundHistoryEntry = {
  id: number;
  dealerCards: BlackjackCard[];
  dealerTotal: number;
  hands: HistoryHand[];
  totalWager: number;
  net: number;
};

type StrategyDecisionFeedback = {
  chosen: BasicStrategyAction;
  recommended: BasicStrategyAction;
  correct: boolean;
};

type BlackjackRoundOutcome = {
  id: number;
  tone: "win" | "loss" | "push" | "blackjack";
  label: "WIN" | "LOSS" | "PUSH" | "EVEN" | "BLACKJACK";
  amount: number;
  detail: string;
};

type PlayingCardProps = {
  card: BlackjackCard;
  hidden?: boolean;
  tilted?: "left" | "right";
  compact?: boolean;
};

const STARTING_BANKROLL = 5000;
const MIN_BET = 5;
const MAX_BET = 1000;
const CHIP_VALUES = [1, 5, 25, 100, 500];
const OPENING_DEAL_DELAY_MS = 360;
const CARD_SETTLE_DELAY_MS = 430;
const HOLE_CARD_REVEAL_DELAY_MS = 540;
const RESULT_DELAY_MS = 260;
const OUTCOME_DISPLAY_MS = 1550;

function pause(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function money(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function signedMoney(amount: number) {
  if (amount === 0) return "$0";
  return `${amount > 0 ? "+" : "-"}$${money(Math.abs(amount))}`;
}

function PlayingCard({
  card,
  hidden = false,
  tilted,
  compact = false,
}: PlayingCardProps) {
  const red = card.suit === "♥" || card.suit === "♦";
  const tilt =
    tilted === "left"
      ? "-rotate-3"
      : tilted === "right"
        ? "rotate-3"
        : "";
  const size = compact
    ? "h-20 w-14 sm:h-28 sm:w-20"
    : "h-24 w-16 sm:h-32 sm:w-24";

  return (
    <div
      className={`blackjack-card-slot ${size} ${tilt}`}
      aria-label={hidden ? "Face-down card" : `${card.rank} of ${card.suit}`}
    >
      <div className="blackjack-card-enter h-full w-full">
        <div
          className={`blackjack-card-flipper h-full w-full ${
            hidden ? "blackjack-card-hidden" : ""
          }`}
        >
          <div className="blackjack-card-face relative h-full w-full rounded-lg border border-zinc-300 bg-[#fffdf6] text-zinc-950 shadow-[0_10px_24px_rgba(0,0,0,.45)]">
            <div
              className={`absolute left-2 top-1.5 text-base font-black leading-none sm:text-xl ${
                red ? "text-red-600" : "text-zinc-950"
              }`}
            >
              <div>{card.rank}</div>
              <div className="mt-0.5 text-sm sm:text-lg">{card.suit}</div>
            </div>
            <div
              className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl ${
                red ? "text-red-600" : "text-zinc-950"
              }`}
            >
              {card.suit}
            </div>
            <div
              className={`absolute bottom-1.5 right-2 rotate-180 text-base font-black leading-none sm:text-xl ${
                red ? "text-red-600" : "text-zinc-950"
              }`}
            >
              <div>{card.rank}</div>
              <div className="mt-0.5 text-sm sm:text-lg">{card.suit}</div>
            </div>
          </div>

          <div className="blackjack-card-face blackjack-card-back absolute inset-0 overflow-hidden rounded-lg border-2 border-white/90 bg-[#0b2f63] shadow-[0_10px_24px_rgba(0,0,0,.45)]">
            <div className="absolute inset-1 rounded-md border border-white/50 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.12)_0px,rgba(255,255,255,.12)_3px,transparent_3px,transparent_7px)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-300/70 bg-black/30 font-serif text-xs font-black text-amber-200 sm:h-11 sm:w-11 sm:text-sm">
                LP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({
  value,
  selected = false,
  disabled = false,
  onClick,
}: {
  value: number;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const style =
    value === 1
      ? "border-zinc-400 bg-zinc-100 text-zinc-950"
      : value === 5
        ? "border-white bg-red-600 text-white"
        : value === 25
          ? "border-white bg-emerald-700 text-white"
          : value === 100
            ? "border-white bg-zinc-950 text-white"
            : "border-white bg-purple-700 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full border-[4px] border-dashed text-[10px] font-black shadow-lg transition min-[380px]:h-12 min-[380px]:w-12 min-[380px]:text-[11px] sm:h-14 sm:w-14 sm:text-xs disabled:cursor-not-allowed disabled:opacity-35 ${style} ${
        selected
          ? "scale-110 ring-4 ring-amber-300 ring-offset-2 ring-offset-[#061710]"
          : "enabled:hover:-translate-y-0.5"
      }`}
    >
      <span className="absolute inset-[5px] rounded-full border border-current opacity-35" />
      <span className="relative">${value}</span>
    </button>
  );
}

function drawCard(shoe: BlackjackCard[]) {
  const [card, ...rest] = shoe;
  if (!card) throw new Error("Blackjack shoe is empty");
  return { card, rest };
}

function outcomeMessage(result: HandResult, profit: number) {
  if (result === "blackjack") return `Blackjack! You win $${money(profit)}.`;
  if (result === "win") return `You win $${money(profit)}.`;
  if (result === "push") return "Push. Your bet is returned.";
  return `Dealer wins. You lose $${money(Math.abs(profit))}.`;
}

function resultBadge(
  result?: HandResult
): BlackjackRoundOutcome["label"] | null {
  if (!result) return null;
  if (result === "blackjack") return "BLACKJACK";
  if (result === "win") return "WIN";
  if (result === "push") return "PUSH";
  return "LOSS";
}

function strategyActionLabel(action: BasicStrategyAction) {
  return action.toUpperCase();
}

export function BlackjackTable() {
  const [shoe, setShoe] = useState<BlackjackCard[]>(() =>
    shuffleShoe(buildShoe(6))
  );
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [bet, setBet] = useState(25);
  const [selectedChip, setSelectedChip] = useState(25);
  const [playerHands, setPlayerHands] = useState<PlayerHand[]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [dealerCards, setDealerCards] = useState<BlackjackCard[]>([]);
  const [roundState, setRoundState] = useState<RoundState>("betting");
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Choose your bet, then deal.");
  const [sessionPL, setSessionPL] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [handHistory, setHandHistory] = useState<RoundHistoryEntry[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null);
  const [strategyCoachOn, setStrategyCoachOn] = useState(true);
  const [strategyAttempts, setStrategyAttempts] = useState(0);
  const [strategyCorrect, setStrategyCorrect] = useState(0);
  const [strategyFeedback, setStrategyFeedback] =
    useState<StrategyDecisionFeedback | null>(null);
  const [roundOutcome, setRoundOutcome] =
    useState<BlackjackRoundOutcome | null>(null);
  const handIdRef = useRef(1);
  const roundIdRef = useRef(1);
  const historyDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const desktopHistory = window.matchMedia("(min-width: 640px)");
    const syncHistoryVisibility = () => {
      if (historyDetailsRef.current) {
        historyDetailsRef.current.open = desktopHistory.matches;
      }
    };

    syncHistoryVisibility();
    desktopHistory.addEventListener("change", syncHistoryVisibility);
    return () =>
      desktopHistory.removeEventListener("change", syncHistoryVisibility);
  }, []);

  const dealerValue = useMemo(() => getHandValue(dealerCards), [dealerCards]);
  const activeHand = playerHands[activeHandIndex];
  const activeValue = activeHand ? getHandValue(activeHand.cards) : null;
  const holeHidden = roundState === "dealing" || roundState === "player";
  const totalWager = playerHands.reduce((sum, hand) => sum + hand.wager, 0);

  function recordRound(
    finalDealer: BlackjackCard[],
    hands: PlayerHand[],
    net: number
  ) {
    const entry: RoundHistoryEntry = {
      id: roundIdRef.current,
      dealerCards: finalDealer.map((card) => ({ ...card })),
      dealerTotal: getHandValue(finalDealer).total,
      totalWager: hands.reduce((sum, hand) => sum + hand.wager, 0),
      net,
      hands: hands.map((hand) => ({
        cards: hand.cards.map((card) => ({ ...card })),
        wager: hand.wager,
        total: getHandValue(hand.cards).total,
        result: hand.result ?? "loss",
        profit: hand.profit ?? 0,
      })),
    };

    roundIdRef.current += 1;
    setHandHistory((current) => [entry, ...current]);
  }

  function showRoundOutcome(
    tone: BlackjackRoundOutcome["tone"],
    label: BlackjackRoundOutcome["label"],
    amount: number,
    detail: string
  ) {
    const outcomeId = Date.now() + Math.floor(Math.random() * 100000);
    setRoundOutcome({ id: outcomeId, tone, label, amount, detail });

    window.setTimeout(() => {
      setRoundOutcome((current) =>
        current?.id === outcomeId ? null : current
      );
    }, OUTCOME_DISPLAY_MS);
  }

  function prepareShoeForDeal(currentShoe: BlackjackCard[]) {
    return shouldReshuffleBeforeDeal(currentShoe.length)
      ? shuffleShoe(buildShoe(6))
      : currentShoe;
  }

  function nextHandId() {
    const id = handIdRef.current;
    handIdRef.current += 1;
    return id;
  }

  function currentStrategyRecommendation() {
    const hand = playerHands[activeHandIndex];
    const dealerUpCard = dealerCards[0];

    if (
      roundState !== "player" ||
      isAnimating ||
      !hand ||
      hand.status !== "playing" ||
      !dealerUpCard
    ) {
      return null;
    }

    return getBasicStrategyRecommendation(hand.cards, dealerUpCard, {
      canDouble: hand.cards.length === 2 && bankroll >= hand.wager,
      canSplit:
        hand.cards.length === 2 &&
        canSplitPair(hand.cards) &&
        playerHands.length < 4 &&
        bankroll >= hand.wager,
    });
  }

  function recordStrategyDecision(chosen: BasicStrategyAction) {
    if (!strategyCoachOn) return;
    const recommendation = currentStrategyRecommendation();
    if (!recommendation) return;

    const correct = chosen === recommendation.action;
    setStrategyAttempts((current) => current + 1);
    if (correct) setStrategyCorrect((current) => current + 1);
    setStrategyFeedback({
      chosen,
      recommended: recommendation.action,
      correct,
    });
  }

  function selectChip(value: number) {
    if (isAnimating) return;
    if (roundState !== "betting" && roundState !== "resolved") return;
    setSelectedChip(value);
    setMessage(`Selected $${value} chip. Use + or - to change the bet.`);
  }

  function increaseBet() {
    if (isAnimating) return;
    if (roundState !== "betting" && roundState !== "resolved") return;
    const next = Math.min(MAX_BET, bankroll, bet + selectedChip);
    setBet(next);
    setMessage(`Bet set to $${money(next)}.`);
  }

  function decreaseBet() {
    if (isAnimating) return;
    if (roundState !== "betting" && roundState !== "resolved") return;
    const next = Math.max(0, bet - selectedChip);
    setBet(next);
    setMessage(next === 0 ? "Bet cleared." : `Bet set to $${money(next)}.`);
  }

  function clearBet() {
    if (isAnimating) return;
    if (roundState !== "betting" && roundState !== "resolved") return;
    setBet(0);
    setMessage("Bet cleared.");
  }

  function settleNatural(
    hand: PlayerHand,
    nextDealer: BlackjackCard[],
    nextShoe: BlackjackCard[]
  ) {
    const outcome = resolveBlackjackRound(hand.cards, nextDealer, hand.wager);
    const settledHand: PlayerHand = {
      ...hand,
      status: outcome.result === "loss" ? "bust" : "stood",
      result: outcome.result,
      profit: outcome.profit,
    };

    setShoe(nextShoe);
    setDealerCards(nextDealer);
    setPlayerHands([settledHand]);
    setBankroll((current) => current - hand.wager + outcome.returnAmount);
    setSessionPL((current) => current + outcome.profit);
    setHandsPlayed((current) => current + 1);
    setRoundState("resolved");
    setIsAnimating(false);
    recordRound(nextDealer, [settledHand], outcome.profit);
    setMessage(outcomeMessage(outcome.result, outcome.profit));
    showRoundOutcome(
      outcome.result === "blackjack" ? "blackjack" : outcome.result,
      resultBadge(outcome.result) ?? "LOSS",
      Math.abs(outcome.profit),
      `Dealer ${getHandValue(nextDealer).total}`
    );
  }

  async function deal() {
    if (roundState !== "betting" || isAnimating) return;
    if (bet < MIN_BET || bet > MAX_BET || bet > bankroll) {
      setMessage(`Bet must be between $${MIN_BET} and $${MAX_BET}, within your bankroll.`);
      return;
    }

    let nextShoe = prepareShoeForDeal(shoe);
    const p1 = drawCard(nextShoe);
    nextShoe = p1.rest;
    const d1 = drawCard(nextShoe);
    nextShoe = d1.rest;
    const p2 = drawCard(nextShoe);
    nextShoe = p2.rest;
    const d2 = drawCard(nextShoe);
    nextShoe = d2.rest;

    const nextPlayer = [p1.card, p2.card];
    const nextDealer = [d1.card, d2.card];
    const hand: PlayerHand = {
      id: nextHandId(),
      cards: nextPlayer,
      wager: bet,
      status: "playing",
      fromSplit: false,
      splitAces: false,
    };

    setIsAnimating(true);
    setRoundState("dealing");
    setPlayerHands([]);
    setDealerCards([]);
    setActiveHandIndex(0);
    setStrategyFeedback(null);
    setMessage("Dealing the opening hand…");

    await pause(140);
    setPlayerHands([{ ...hand, cards: [p1.card] }]);
    await pause(OPENING_DEAL_DELAY_MS);
    setDealerCards([d1.card]);
    await pause(OPENING_DEAL_DELAY_MS);
    setPlayerHands([hand]);
    await pause(OPENING_DEAL_DELAY_MS);
    setDealerCards(nextDealer);
    setShoe(nextShoe);
    await pause(CARD_SETTLE_DELAY_MS);

    if (isBlackjack(nextPlayer) || isBlackjack(nextDealer)) {
      setRoundState("dealer");
      setMessage("Dealer reveals the hole card.");
      await pause(HOLE_CARD_REVEAL_DELAY_MS);
      settleNatural(hand, nextDealer, nextShoe);
      return;
    }

    setBankroll((current) => current - bet);
    setRoundState("player");
    setIsAnimating(false);
    setMessage("Your move: hit, stand, double, or split when available.");
  }

  function findNextPlayingHand(hands: PlayerHand[], startIndex: number) {
    for (let index = startIndex; index < hands.length; index += 1) {
      if (hands[index].status === "playing") return index;
    }
    return -1;
  }

  async function finishRound(
    hands: PlayerHand[],
    startingShoe: BlackjackCard[]
  ) {
    setRoundState("dealer");
    setMessage("Dealer reveals the hole card.");
    await pause(HOLE_CARD_REVEAL_DELAY_MS);

    const nextDealer = [...dealerCards];
    let nextShoe = startingShoe;
    const hasLiveHand = hands.some((hand) => hand.status !== "bust");

    if (hasLiveHand) {
      while (dealerShouldHit(nextDealer)) {
        const draw = drawCard(nextShoe);
        nextDealer.push(draw.card);
        nextShoe = draw.rest;
        setDealerCards([...nextDealer]);
        setShoe(nextShoe);
        setMessage(`Dealer draws to ${getHandValue(nextDealer).total}.`);
        await pause(CARD_SETTLE_DELAY_MS);
      }
    }

    await pause(RESULT_DELAY_MS);

    let totalReturn = 0;
    let totalProfit = 0;

    const settledHands = hands.map((hand) => {
      if (hand.status === "bust") {
        totalProfit -= hand.wager;
        return {
          ...hand,
          result: "loss" as const,
          profit: -hand.wager,
        };
      }

      const outcome = resolveBlackjackRound(
        hand.cards,
        nextDealer,
        hand.wager,
        { blackjackEligible: !hand.fromSplit }
      );
      totalReturn += outcome.returnAmount;
      totalProfit += outcome.profit;

      return {
        ...hand,
        status: "stood" as const,
        result: outcome.result,
        profit: outcome.profit,
      };
    });

    setShoe(nextShoe);
    setDealerCards(nextDealer);
    setPlayerHands(settledHands);
    setBankroll((current) => current + totalReturn);
    setSessionPL((current) => current + totalProfit);
    setHandsPlayed((current) => current + settledHands.length);
    setRoundState("resolved");
    setIsAnimating(false);
    recordRound(nextDealer, settledHands, totalProfit);

    const outcomeTone =
      totalProfit > 0 ? "win" : totalProfit < 0 ? "loss" : "push";
    const outcomeLabel =
      totalProfit > 0
        ? "WIN"
        : totalProfit < 0
          ? "LOSS"
          : settledHands.length > 1
            ? "EVEN"
            : "PUSH";
    showRoundOutcome(
      outcomeTone,
      outcomeLabel,
      Math.abs(totalProfit),
      `${settledHands.length} ${settledHands.length === 1 ? "hand" : "hands"} • Dealer ${getHandValue(nextDealer).total}`
    );

    if (settledHands.length === 1) {
      const hand = settledHands[0];
      setMessage(outcomeMessage(hand.result ?? "loss", hand.profit ?? 0));
    } else {
      const wins = settledHands.filter(
        (hand) => hand.result === "win" || hand.result === "blackjack"
      ).length;
      const losses = settledHands.filter((hand) => hand.result === "loss").length;
      const pushes = settledHands.filter((hand) => hand.result === "push").length;
      setMessage(
        `Split round complete: ${wins} win, ${losses} loss, ${pushes} push. Net ${signedMoney(totalProfit)}.`
      );
    }
  }

  async function continueOrFinish(
    hands: PlayerHand[],
    nextShoe: BlackjackCard[],
    startIndex: number
  ) {
    const nextIndex = findNextPlayingHand(hands, startIndex);
    setPlayerHands(hands);
    setShoe(nextShoe);

    if (nextIndex >= 0) {
      await pause(CARD_SETTLE_DELAY_MS);
      setActiveHandIndex(nextIndex);
      const value = getHandValue(hands[nextIndex].cards).total;
      setMessage(
        `${hands.length} hands • ${money(hands.reduce((sum, hand) => sum + hand.wager, 0))} total wager. Hand ${nextIndex + 1}: ${value}. Choose hit, stand, double, or split when available.`
      );
      setIsAnimating(false);
      return;
    }

    await pause(CARD_SETTLE_DELAY_MS);
    await finishRound(hands, nextShoe);
  }

  async function hit() {
    if (
      roundState !== "player" ||
      isAnimating ||
      !activeHand ||
      activeHand.status !== "playing"
    ) return;

    recordStrategyDecision("hit");
    setIsAnimating(true);
    const draw = drawCard(shoe);
    const nextCards = [...activeHand.cards, draw.card];
    const value = getHandValue(nextCards).total;
    const nextHands = [...playerHands];
    nextHands[activeHandIndex] = {
      ...activeHand,
      cards: nextCards,
      status: value > 21 ? "bust" : value === 21 ? "stood" : "playing",
    };

    if (value > 21) {
      setMessage(`Hand ${activeHandIndex + 1} busts with ${value}.`);
      await continueOrFinish(nextHands, draw.rest, activeHandIndex + 1);
    } else if (value === 21) {
      setMessage(`Hand ${activeHandIndex + 1} has 21.`);
      await continueOrFinish(nextHands, draw.rest, activeHandIndex + 1);
    } else {
      setPlayerHands(nextHands);
      setShoe(draw.rest);
      setMessage(`Hand ${activeHandIndex + 1} has ${value}. Hit or stand.`);
      await pause(CARD_SETTLE_DELAY_MS);
      setIsAnimating(false);
    }
  }

  async function stand() {
    if (
      roundState !== "player" ||
      isAnimating ||
      !activeHand ||
      activeHand.status !== "playing"
    ) return;
    recordStrategyDecision("stand");
    setIsAnimating(true);
    const nextHands = [...playerHands];
    nextHands[activeHandIndex] = { ...activeHand, status: "stood" };
    await continueOrFinish(nextHands, shoe, activeHandIndex + 1);
  }

  async function doubleDown() {
    if (!activeHand || roundState !== "player" || isAnimating) return;
    if (activeHand.cards.length !== 2 || activeHand.status !== "playing") return;
    if (bankroll < activeHand.wager) {
      setMessage("Not enough bankroll to double this hand.");
      return;
    }

    recordStrategyDecision("double");
    setIsAnimating(true);
    const draw = drawCard(shoe);
    const nextCards = [...activeHand.cards, draw.card];
    const value = getHandValue(nextCards).total;
    const nextHands = [...playerHands];
    nextHands[activeHandIndex] = {
      ...activeHand,
      cards: nextCards,
      wager: activeHand.wager * 2,
      status: value > 21 ? "bust" : "stood",
    };

    setBankroll((current) => current - activeHand.wager);
    setMessage(
      value > 21
        ? `Double: Hand ${activeHandIndex + 1} busts with ${value}.`
        : `Double: Hand ${activeHandIndex + 1} stands on ${value}.`
    );
    await continueOrFinish(nextHands, draw.rest, activeHandIndex + 1);
  }

  async function splitHand() {
    if (!activeHand || roundState !== "player" || isAnimating) return;
    if (!canSplitPair(activeHand.cards) || playerHands.length >= 4) return;
    if (bankroll < activeHand.wager) {
      setMessage("Not enough bankroll to split this hand.");
      return;
    }

    recordStrategyDecision("split");
    setIsAnimating(true);
    let nextShoe = shoe;
    const leftDraw = drawCard(nextShoe);
    nextShoe = leftDraw.rest;
    const rightDraw = drawCard(nextShoe);
    nextShoe = rightDraw.rest;

    const splitAces = activeHand.cards[0].rank === "A" && activeHand.cards[1].rank === "A";
    const leftCards = [activeHand.cards[0], leftDraw.card];
    const rightCards = [activeHand.cards[1], rightDraw.card];

    const makeSplitHand = (cards: BlackjackCard[]): PlayerHand => {
      const total = getHandValue(cards).total;
      return {
        id: nextHandId(),
        cards,
        wager: activeHand.wager,
        status: splitAces || total === 21 ? "stood" : "playing",
        fromSplit: true,
        splitAces,
      };
    };

    const leftHand = makeSplitHand(leftCards);
    const rightHand = makeSplitHand(rightCards);
    const nextHands = [
      ...playerHands.slice(0, activeHandIndex),
      leftHand,
      rightHand,
      ...playerHands.slice(activeHandIndex + 1),
    ];

    setBankroll((current) => current - activeHand.wager);

    if (splitAces) {
      setMessage("Split aces receive one card each. Dealer will play now.");
      await continueOrFinish(nextHands, nextShoe, activeHandIndex);
      return;
    }

    setMessage(`${nextHands.length} hands • ${money(nextHands.reduce((sum, hand) => sum + hand.wager, 0))} total wager. Playing Hand ${activeHandIndex + 1} first.`);
    await continueOrFinish(nextHands, nextShoe, activeHandIndex);
  }

  function newRound() {
    setPlayerHands([]);
    setDealerCards([]);
    setActiveHandIndex(0);
    setRoundState("betting");
    setIsAnimating(false);
    setRoundOutcome(null);
    if (bet > bankroll) setBet(Math.max(0, Math.min(25, bankroll)));
    setStrategyFeedback(null);
    setMessage("Choose your bet, then deal.");
  }

  const dealerDisplayTotal =
    dealerCards.length === 0
      ? "—"
      : holeHidden
        ? String(getHandValue(dealerCards.slice(0, 1)).total)
        : String(dealerValue.total);

  const canAdjustBet =
    !isAnimating && (roundState === "betting" || roundState === "resolved");
  const canDeal =
    !isAnimating &&
    roundState === "betting" &&
    bet >= MIN_BET &&
    bet <= bankroll;
  const canAct =
    !isAnimating &&
    roundState === "player" &&
    activeHand?.status === "playing";
  const canDouble =
    canAct &&
    activeHand.cards.length === 2 &&
    bankroll >= activeHand.wager;
  const canSplit =
    canAct &&
    activeHand.cards.length === 2 &&
    canSplitPair(activeHand.cards) &&
    playerHands.length < 4 &&
    bankroll >= activeHand.wager;
  const displayedWager = roundState === "betting" ? bet : totalWager || bet;
  const shoeStatus = shouldReshuffleBeforeDeal(shoe.length)
    ? "Auto reshuffle before next deal"
    : `${shoe.length} cards remaining`;
  const strategyRecommendation = currentStrategyRecommendation();
  const strategyAccuracy =
    strategyAttempts === 0
      ? null
      : Math.round((strategyCorrect / strategyAttempts) * 100);
  const coachedAction = strategyCoachOn
    ? strategyRecommendation?.action ?? null
    : null;

  function actionButtonClass(action: BasicStrategyAction) {
    const recommended = coachedAction === action;

    return `relative rounded-xl border px-4 py-3 text-xs font-black shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-35 ${
      recommended
        ? "z-10 scale-[1.03] border-sky-100 bg-sky-300 text-sky-950 ring-2 ring-sky-200/80 shadow-[0_0_24px_rgba(125,211,252,.6)]"
        : "border-emerald-300/35 bg-emerald-950/55 text-emerald-50 enabled:hover:border-emerald-200/60"
    }`;
  }

  return (
    <>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Lucky Penny Blackjack
          </div>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Blackjack practice table</h1>
          <p className="mt-1 max-w-2xl text-sm font-medium leading-5 text-emerald-50/65">
            Practice complete hands with real table rules. Turn on Strategy Coach whenever you want guidance on hit, stand, double, or split.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 text-center sm:w-auto sm:grid-cols-4">
          {[
            ["BANKROLL", `$${money(bankroll)}`],
            ["TOTAL WAGER", `${money(displayedWager)}`],
            ["SESSION P/L", signedMoney(sessionPL)],
            ["HANDS", String(handsPlayed)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-xl border border-emerald-900/80 bg-black/25 px-2 py-2 sm:min-w-[86px] sm:px-3"
            >
              <div className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-400 sm:text-[8px]">
                {label}
              </div>
              <div className="mt-0.5 text-base font-black sm:text-lg">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border-[7px] border-[#5a2d0b] bg-[#075f3d] shadow-[0_26px_70px_rgba(0,0,0,.65),inset_0_0_0_3px_rgba(214,166,72,.28),inset_0_0_0_7px_rgba(45,18,4,.34)] sm:rounded-[34px] sm:border-[12px]">
        <div
          className="relative min-h-[625px] overflow-hidden border-[3px] border-[#cfbd8c]/75 bg-[#075f3d] px-2 py-3 sm:min-h-[760px] sm:border-[4px] sm:px-6 sm:py-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 18%, rgba(255,255,255,.055), transparent 28%), radial-gradient(circle at 15% 85%, rgba(0,0,0,.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,.018), rgba(0,0,0,.035)), repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0px, rgba(255,255,255,.012) 1px, rgba(0,0,0,.018) 1px, rgba(0,0,0,.018) 3px)",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[50px] h-[430px] w-[94%] -translate-x-1/2 rounded-[50%] border-2 border-amber-100/70 sm:top-[66px] sm:h-[560px] sm:w-[92%] sm:border-[3px]" />
          <div className="pointer-events-none absolute left-1/2 top-[84px] h-[360px] w-[82%] -translate-x-1/2 rounded-[50%] border border-amber-100/25 sm:top-[112px] sm:h-[455px] sm:w-[80%]" />

          {roundOutcome ? (
            <div
              key={roundOutcome.id}
              className="pointer-events-none absolute inset-0 z-[95] overflow-hidden rounded-[18px]"
              role="status"
              aria-live="polite"
            >
              <div
                className={`blackjack-outcome-wash absolute inset-0 ${
                  roundOutcome.tone === "win"
                    ? "bg-[radial-gradient(circle_at_center,rgba(34,197,94,.42),rgba(6,78,59,.18)_38%,transparent_72%)]"
                    : roundOutcome.tone === "loss"
                      ? "bg-[radial-gradient(circle_at_center,rgba(239,68,68,.42),rgba(127,29,29,.2)_38%,transparent_72%)]"
                      : "bg-[radial-gradient(circle_at_center,rgba(251,191,36,.42),rgba(120,53,15,.18)_38%,transparent_72%)]"
                }`}
              />

              <div
                className={`blackjack-outcome-ring absolute left-1/2 top-[38%] h-44 w-44 rounded-full border-[5px] ${
                  roundOutcome.tone === "win"
                    ? "border-emerald-300/80 shadow-[0_0_45px_rgba(52,211,153,.85)]"
                    : roundOutcome.tone === "loss"
                      ? "border-red-300/80 shadow-[0_0_45px_rgba(248,113,113,.85)]"
                      : "border-amber-200/85 shadow-[0_0_45px_rgba(251,191,36,.85)]"
                }`}
              />

              <div
                className={`blackjack-round-outcome absolute left-1/2 top-[38%] min-w-[270px] max-w-[90%] rounded-2xl border-2 px-8 py-5 text-center shadow-[0_18px_55px_rgba(0,0,0,.65)] backdrop-blur-[2px] ${
                  roundOutcome.tone === "win"
                    ? "border-emerald-300 bg-emerald-950/95 text-emerald-50"
                    : roundOutcome.tone === "loss"
                      ? "border-red-300 bg-red-950/95 text-red-50"
                      : "border-amber-200 bg-amber-950/95 text-amber-50"
                }`}
              >
                <div
                  className={`text-[11px] font-black uppercase tracking-[0.24em] ${
                    roundOutcome.tone === "win"
                      ? "text-emerald-300"
                      : roundOutcome.tone === "loss"
                        ? "text-red-300"
                        : "text-amber-200"
                  }`}
                >
                  {roundOutcome.detail}
                </div>
                <div className="mt-1 text-3xl font-black tracking-[0.06em] sm:text-5xl">
                  {roundOutcome.label}
                </div>
                <div
                  className={`mt-1 text-2xl font-black ${
                    roundOutcome.tone === "win"
                      ? "text-emerald-300"
                      : roundOutcome.tone === "loss"
                        ? "text-red-300"
                        : "text-amber-200"
                  }`}
                >
                  {roundOutcome.tone === "win" ||
                  roundOutcome.tone === "blackjack"
                    ? "+"
                    : roundOutcome.tone === "loss"
                      ? "−"
                      : ""}
                  ${money(roundOutcome.amount)}
                </div>
              </div>
            </div>
          ) : null}

          <div className="relative z-10 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-100/80 sm:text-xs">
              Blackjack pays 3 to 2
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-100/65 sm:text-[10px] sm:tracking-[0.16em]">
              Dealer stands on soft 17 • 6-deck shoe
            </div>
          </div>

          <div className="relative z-10 mt-4 sm:mt-10">
            <div className="text-center text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200/75">
              Dealer • {dealerDisplayTotal}
            </div>
            <div className="mt-2 flex min-h-[104px] items-center justify-center gap-2 sm:mt-3 sm:min-h-[128px] sm:gap-3">
              {dealerCards.length === 0 ? (
                <div className="text-sm font-bold text-emerald-100/35">Waiting for deal</div>
              ) : (
                dealerCards.map((card, index) => (
                  <PlayingCard
                    key={card.id}
                    card={card}
                    hidden={holeHidden && index === 1}
                    tilted={index % 2 === 0 ? "left" : "right"}
                  />
                ))
              )}
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-3 max-w-[900px] sm:mt-8">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="hidden text-right sm:block">
                <div className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-200/55">
                  Table minimum
                </div>
                <div className="text-xl font-black text-amber-100">$5</div>
              </div>

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-amber-100/75 bg-black/10 shadow-[inset_0_0_24px_rgba(0,0,0,.2)] sm:h-28 sm:w-28">
                <div className="absolute inset-2 rounded-full border border-amber-100/30" />
                <div className="text-center">
                  <div className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-200/75 sm:text-[8px] sm:tracking-[0.13em]">
                    Base Bet
                  </div>
                  <div className="mt-1 text-2xl font-black text-amber-100">${money(bet)}</div>
                </div>
              </div>

              <div className="hidden text-left sm:block">
                <div className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-200/55">
                  Table maximum
                </div>
                <div className="text-xl font-black text-amber-100">$1,000</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-3 sm:mt-6">
            <div className="text-center text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200/75">
              {playerHands.length > 1
                ? `Player • ${playerHands.length} hands`
                : `Player • ${activeValue ? activeValue.total : "—"}`}
            </div>
            <div className="mt-2 flex min-h-[125px] items-start justify-center gap-2 overflow-x-auto pb-1 sm:mt-3 sm:min-h-[155px] sm:gap-3 sm:pb-2">
              {playerHands.length === 0 ? (
                <div className="self-center text-sm font-bold text-emerald-100/35">
                  Place a bet and deal
                </div>
              ) : (
                playerHands.map((hand, handIndex) => {
                  const value = getHandValue(hand.cards).total;
                  const isActive = roundState === "player" && handIndex === activeHandIndex;
                  return (
                    <div
                      key={hand.id}
                      className={`min-w-[150px] rounded-xl border px-2 py-2 text-center transition sm:min-w-[205px] ${
                        hand.result ? "blackjack-hand-result " : ""
                      }${
                        isActive
                          ? "border-amber-300 bg-amber-300/10 shadow-[0_0_0_2px_rgba(252,211,77,.18)]"
                          : "border-emerald-200/20 bg-black/10"
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-[0.1em] text-emerald-100/80 sm:text-[9px] sm:tracking-[0.13em]">
                        Hand {handIndex + 1} • ${money(hand.wager)} • {value}
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        {hand.cards.map((card, cardIndex) => (
                          <PlayingCard
                            key={card.id}
                            card={card}
                            compact={playerHands.length > 1}
                            tilted={cardIndex % 2 === 0 ? "left" : "right"}
                          />
                        ))}
                      </div>
                      {hand.result ? (
                        <div
                          className={`mt-2 text-[9px] font-black uppercase tracking-[0.12em] ${
                            hand.result === "loss"
                              ? "text-red-200"
                              : hand.result === "push"
                                ? "text-amber-100"
                                : "text-emerald-200"
                          }`}
                        >
                          {resultBadge(hand.result)} • {signedMoney(hand.profit ?? 0)}
                        </div>
                      ) : hand.status !== "playing" ? (
                        <div className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-100/55">
                          {hand.status === "bust" ? "BUST" : "STANDS"}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-2 w-fit max-w-[94%] rounded-full border border-white/15 bg-black/30 px-4 py-2 text-center text-xs font-black text-amber-100 shadow-lg sm:px-5">
            {message}
          </div>

          <div className="relative z-10 mx-auto mt-3 max-w-[1080px] rounded-2xl border border-emerald-200/25 bg-black/20 p-3 backdrop-blur-[1px] sm:mt-4 sm:p-4">
            {roundState === "betting" ? (
              <div className="mb-3 grid grid-cols-3 gap-1.5 text-center text-[9px] font-black uppercase tracking-[0.08em] text-emerald-100/75 sm:gap-2 sm:text-[10px]">
                <span className="rounded-lg bg-emerald-950/55 px-2 py-2">
                  <span className="text-amber-300">1</span> Choose chip
                </span>
                <span className="rounded-lg bg-emerald-950/55 px-2 py-2">
                  <span className="text-amber-300">2</span> Set wager
                </span>
                <span className="rounded-lg bg-emerald-950/55 px-2 py-2">
                  <span className="text-amber-300">3</span> Deal
                </span>
              </div>
            ) : null}

            <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="order-1">
                <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300/75">
                  <span>Bet chips</span>
                  <button
                    type="button"
                    onClick={clearBet}
                    disabled={!canAdjustBet}
                    className="text-amber-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Clear
                  </button>
                </div>
                <div className="grid grid-cols-5 place-items-center gap-1.5 sm:flex sm:flex-wrap sm:justify-start sm:gap-2">
                  {CHIP_VALUES.map((value) => (
                    <Chip
                      key={value}
                      value={value}
                      selected={selectedChip === value}
                      disabled={!canAdjustBet}
                      onClick={() => selectChip(value)}
                    />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={decreaseBet}
                    disabled={!canAdjustBet || bet === 0}
                    className="rounded-lg border border-emerald-300/30 bg-black/25 px-3 py-2 text-xs font-black text-emerald-50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    − ${selectedChip}
                  </button>
                  <button
                    type="button"
                    onClick={increaseBet}
                    disabled={!canAdjustBet || bet >= Math.min(MAX_BET, bankroll)}
                    className="rounded-lg border border-emerald-300/30 bg-black/25 px-3 py-2 text-xs font-black text-emerald-50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    + ${selectedChip}
                  </button>
                </div>
              </div>

              <div className="order-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:order-2 lg:px-4">
                <button
                  type="button"
                  onClick={hit}
                  disabled={!canAct}
                  className={actionButtonClass("hit")}
                >
                  {coachedAction === "hit" ? (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-sky-100 px-2 py-0.5 text-[8px] leading-none tracking-[0.1em] text-sky-950 shadow">
                      BEST PLAY
                    </span>
                  ) : null}
                  HIT
                </button>
                <button
                  type="button"
                  onClick={stand}
                  disabled={!canAct}
                  className={actionButtonClass("stand")}
                >
                  {coachedAction === "stand" ? (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-sky-100 px-2 py-0.5 text-[8px] leading-none tracking-[0.1em] text-sky-950 shadow">
                      BEST PLAY
                    </span>
                  ) : null}
                  STAND
                </button>
                <button
                  type="button"
                  onClick={doubleDown}
                  disabled={!canDouble}
                  title={canDouble ? "Double wager and receive exactly one card" : "Double requires two cards and enough bankroll"}
                  className={actionButtonClass("double")}
                >
                  {coachedAction === "double" ? (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-sky-100 px-2 py-0.5 text-[8px] leading-none tracking-[0.1em] text-sky-950 shadow">
                      BEST PLAY
                    </span>
                  ) : null}
                  DOUBLE
                </button>
                <button
                  type="button"
                  onClick={splitHand}
                  disabled={!canSplit}
                  title={canSplit ? "Split this pair into two hands" : "Split requires an equal-value pair, room for another hand, and enough bankroll"}
                  className={actionButtonClass("split")}
                >
                  {coachedAction === "split" ? (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-sky-100 px-2 py-0.5 text-[8px] leading-none tracking-[0.1em] text-sky-950 shadow">
                      BEST PLAY
                    </span>
                  ) : null}
                  SPLIT
                </button>
              </div>

              {roundState === "resolved" ? (
                <button
                  type="button"
                  onClick={newRound}
                  className="order-2 w-full rounded-xl bg-amber-400 px-7 py-4 text-sm font-black text-black shadow-lg hover:bg-amber-300 lg:order-3 lg:w-auto"
                >
                  NEW HAND
                </button>
              ) : (
                <button
                  type="button"
                  onClick={deal}
                  disabled={!canDeal}
                  className="order-2 w-full rounded-xl bg-amber-400 px-7 py-4 text-sm font-black text-black shadow-lg hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-35 lg:order-3 lg:w-auto"
                >
                  {roundState === "dealing" ? "DEALING…" : "DEAL"}
                </button>
              )}
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-4 max-w-[1080px] rounded-2xl border border-sky-300/35 bg-[#062438]/85 p-3 shadow-lg sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-pressed={strategyCoachOn}
                  onClick={() => {
                    setStrategyCoachOn((current) => !current);
                    setStrategyFeedback(null);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] transition ${
                    strategyCoachOn
                      ? "border-sky-200/70 bg-sky-300 text-sky-950"
                      : "border-sky-200/30 bg-black/20 text-sky-100/65"
                  }`}
                >
                  Strategy Coach {strategyCoachOn ? "On" : "Off"}
                </button>
                <div className="text-xs font-bold text-sky-100/60">
                  {strategyAttempts === 0
                    ? "No decisions scored yet"
                    : `${strategyCorrect}/${strategyAttempts} correct • ${strategyAccuracy}%`}
                </div>
              </div>

              <div className="text-xs font-black text-sky-200/55">
                6 decks • Dealer stands on soft 17 • Double after split • No surrender
              </div>
            </div>

            <div className="mt-3" aria-live="polite">
              {!strategyCoachOn ? (
                <p className="text-sm font-medium text-sky-100/55">
                  Turn the coach on whenever you want a recommended play and explanation.
                </p>
              ) : strategyRecommendation ? (
                <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="rounded-xl border border-sky-200/35 bg-sky-300/10 px-4 py-3 text-center">
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-sky-200/65">
                      Best play
                    </div>
                    <div className="mt-0.5 text-xl font-black text-sky-100">
                      {strategyActionLabel(strategyRecommendation.action)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-5 text-sky-50/80">
                      {strategyRecommendation.explanation}
                    </p>
                    {strategyFeedback ? (
                      <p
                        className={`mt-1 text-xs font-black ${
                          strategyFeedback.correct
                            ? "text-emerald-300"
                            : "text-amber-200"
                        }`}
                      >
                        {strategyFeedback.correct
                          ? `${strategyActionLabel(strategyFeedback.chosen)} was correct.`
                          : `You chose ${strategyActionLabel(strategyFeedback.chosen)}; basic strategy recommended ${strategyActionLabel(strategyFeedback.recommended)}.`}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div>
                  {strategyFeedback ? (
                    <p
                      className={`text-sm font-black ${
                        strategyFeedback.correct
                          ? "text-emerald-300"
                          : "text-amber-200"
                      }`}
                    >
                      {strategyFeedback.correct
                        ? `${strategyActionLabel(strategyFeedback.chosen)} was correct.`
                        : `You chose ${strategyActionLabel(strategyFeedback.chosen)}; basic strategy recommended ${strategyActionLabel(strategyFeedback.recommended)}.`}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm font-medium text-sky-100/55">
                    Deal a hand to receive the next basic-strategy recommendation.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-3 flex max-w-[1050px] flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[9px] font-bold uppercase tracking-[0.08em] text-emerald-100/55 sm:gap-x-5 sm:text-[9px] sm:tracking-[0.11em]">
            <span>6-deck shoe</span>
            <span>Dealer stands on soft 17</span>
            <span>Blackjack pays 3:2</span>
            <span>{shoeStatus}</span>
            <span>Double after split</span>
            <span>Split up to 4 hands</span>
            <span>Split aces receive 1 card</span>
          </div>
        </div>
      </div>

      <details
        ref={historyDetailsRef}
        className="group mt-4 rounded-2xl border border-emerald-900/80 bg-black/25"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl p-4 transition hover:bg-emerald-950/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 [&::-webkit-details-marker]:hidden">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
              Blackjack Hand History
            </div>
            <div className="mt-1 text-sm font-bold text-emerald-50/65">
              {handHistory.length === 0
                ? "Completed hands will appear here."
                : `${handHistory.length} ${handHistory.length === 1 ? "round" : "rounds"} • newest first`}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-emerald-200/70">
            <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span>
            <span className="text-xl leading-none transition group-open:rotate-45">+</span>
          </div>
        </summary>

        <div className="border-t border-emerald-900/70 p-4">
          {handHistory.length > 0 ? (
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setHandHistory([]);
                  setExpandedHistoryId(null);
                }}
                className="rounded-lg border border-emerald-700/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-100 hover:border-emerald-400"
              >
                Clear History
              </button>
            </div>
          ) : null}

          {handHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-emerald-900/80 bg-emerald-950/10 px-4 py-5 text-center text-sm font-medium text-emerald-100/40">
              Complete a hand and it will appear here.
            </div>
          ) : (
            <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1">
            {handHistory.map((entry) => {
              const expanded = expandedHistoryId === entry.id;
              const wins = entry.hands.filter(
                (hand) => hand.result === "win" || hand.result === "blackjack"
              ).length;
              const losses = entry.hands.filter((hand) => hand.result === "loss").length;
              const pushes = entry.hands.filter((hand) => hand.result === "push").length;

              return (
                <article
                  key={entry.id}
                  className="overflow-hidden rounded-xl border border-emerald-900/75 bg-[#04140f]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedHistoryId((current) =>
                        current === entry.id ? null : entry.id
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-emerald-950/35 sm:px-4"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-xs font-black text-emerald-100">
                          Round {entry.id}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-100/55">
                          Dealer {entry.dealerTotal}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-100/55">
                          {entry.hands.length} {entry.hands.length === 1 ? "hand" : "hands"}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-100/55">
                          ${money(entry.totalWager)} wager
                        </span>
                      </div>
                      <div className="mt-1 text-[9px] font-black uppercase tracking-[0.1em] text-emerald-200/45">
                        {wins} win • {losses} loss • {pushes} push
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          entry.net > 0
                            ? "bg-emerald-400/15 text-emerald-200"
                            : entry.net < 0
                              ? "bg-red-400/15 text-red-200"
                              : "bg-amber-300/15 text-amber-100"
                        }`}
                      >
                        {signedMoney(entry.net)}
                      </span>
                      <span className="text-lg font-black text-emerald-300/65">
                        {expanded ? "−" : "+"}
                      </span>
                    </div>
                  </button>

                  {expanded ? (
                    <div className="border-t border-emerald-900/70 px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-black uppercase tracking-[0.1em] text-emerald-400">
                          Dealer
                        </span>
                        {entry.dealerCards.map((card) => (
                          <span
                            key={card.id}
                            className="rounded-md border border-white/15 bg-white/5 px-2 py-1 font-black text-white"
                          >
                            {card.rank}{card.suit}
                          </span>
                        ))}
                        <span className="text-emerald-100/55">
                          Total {entry.dealerTotal}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                        {entry.hands.map((hand, index) => (
                          <div
                            key={`${entry.id}-${index}`}
                            className="rounded-lg border border-emerald-900/70 bg-black/20 p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] font-black uppercase tracking-[0.12em] text-emerald-300">
                                Hand {index + 1}
                              </span>
                              <span
                                className={`text-[10px] font-black ${
                                  hand.result === "loss"
                                    ? "text-red-200"
                                    : hand.result === "push"
                                      ? "text-amber-100"
                                      : "text-emerald-200"
                                }`}
                              >
                                {resultBadge(hand.result)}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {hand.cards.map((card) => (
                                <span
                                  key={card.id}
                                  className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs font-black text-white"
                                >
                                  {card.rank}{card.suit}
                                </span>
                              ))}
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3 text-[10px] font-bold text-emerald-100/55">
                              <span>
                                ${money(hand.wager)} • Total {hand.total}
                              </span>
                              <span>{signedMoney(hand.profit)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
            </div>
          )}
        </div>
      </details>
    </>
  );
}
