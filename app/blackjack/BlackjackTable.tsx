"use client";

import { useMemo, useRef, useState } from "react";
import {
  buildShoe,
  canSplitPair,
  dealerShouldHit,
  getHandValue,
  isBlackjack,
  resolveBlackjackRound,
  shuffleShoe,
  type BlackjackCard,
} from "./blackjackRules";

type RoundState = "betting" | "player" | "dealer" | "resolved";
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
    ? "h-24 w-16 sm:h-28 sm:w-20"
    : "h-28 w-20 sm:h-32 sm:w-24";

  if (hidden) {
    return (
      <div
        className={`relative ${size} overflow-hidden rounded-lg border-2 border-white/90 bg-[#0b2f63] shadow-[0_10px_24px_rgba(0,0,0,.45)] ${tilt}`}
        aria-label="Face-down card"
      >
        <div className="absolute inset-1 rounded-md border border-white/50 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.12)_0px,rgba(255,255,255,.12)_3px,transparent_3px,transparent_7px)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-300/70 bg-black/30 font-serif text-xs font-black text-amber-200 sm:h-11 sm:w-11 sm:text-sm">
            LP
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${size} rounded-lg border border-zinc-300 bg-[#fffdf6] text-zinc-950 shadow-[0_10px_24px_rgba(0,0,0,.45)] ${tilt}`}
    >
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
  );
}

function Chip({
  value,
  selected = false,
  onClick,
}: {
  value: number;
  selected?: boolean;
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
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-dashed text-[11px] font-black shadow-lg transition sm:h-14 sm:w-14 sm:text-xs ${style} ${
        selected
          ? "scale-110 ring-4 ring-amber-300 ring-offset-2 ring-offset-[#061710]"
          : "hover:-translate-y-0.5"
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

function resultBadge(result?: HandResult) {
  if (!result) return null;
  if (result === "blackjack") return "BLACKJACK";
  if (result === "win") return "WIN";
  if (result === "push") return "PUSH";
  return "LOSS";
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
  const [message, setMessage] = useState("Choose your bet, then deal.");
  const [sessionPL, setSessionPL] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const handIdRef = useRef(1);

  const dealerValue = useMemo(() => getHandValue(dealerCards), [dealerCards]);
  const activeHand = playerHands[activeHandIndex];
  const activeValue = activeHand ? getHandValue(activeHand.cards) : null;
  const holeHidden = roundState === "player";
  const totalWager = playerHands.reduce((sum, hand) => sum + hand.wager, 0);

  function resetShoeIfNeeded(currentShoe: BlackjackCard[]) {
    return currentShoe.length < 52
      ? shuffleShoe(buildShoe(6))
      : currentShoe;
  }

  function nextHandId() {
    const id = handIdRef.current;
    handIdRef.current += 1;
    return id;
  }

  function selectChip(value: number) {
    if (roundState !== "betting" && roundState !== "resolved") return;
    setSelectedChip(value);
    setMessage(`Selected $${value} chip. Use + or - to change the bet.`);
  }

  function increaseBet() {
    if (roundState !== "betting" && roundState !== "resolved") return;
    const next = Math.min(MAX_BET, bankroll, bet + selectedChip);
    setBet(next);
    setMessage(`Bet set to $${money(next)}.`);
  }

  function decreaseBet() {
    if (roundState !== "betting" && roundState !== "resolved") return;
    const next = Math.max(0, bet - selectedChip);
    setBet(next);
    setMessage(next === 0 ? "Bet cleared." : `Bet set to $${money(next)}.`);
  }

  function clearBet() {
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
    setMessage(outcomeMessage(outcome.result, outcome.profit));
  }

  function deal() {
    if (roundState !== "betting") return;
    if (bet < MIN_BET || bet > MAX_BET || bet > bankroll) {
      setMessage(`Bet must be between $${MIN_BET} and $${MAX_BET}, within your bankroll.`);
      return;
    }

    let nextShoe = resetShoeIfNeeded(shoe);
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

    setDealerCards(nextDealer);
    setActiveHandIndex(0);

    if (isBlackjack(nextPlayer) || isBlackjack(nextDealer)) {
      settleNatural(hand, nextDealer, nextShoe);
      return;
    }

    setShoe(nextShoe);
    setPlayerHands([hand]);
    setBankroll((current) => current - bet);
    setRoundState("player");
    setMessage("Your move: hit, stand, double, or split when available.");
  }

  function findNextPlayingHand(hands: PlayerHand[], startIndex: number) {
    for (let index = startIndex; index < hands.length; index += 1) {
      if (hands[index].status === "playing") return index;
    }
    return -1;
  }

  function finishRound(hands: PlayerHand[], startingShoe: BlackjackCard[]) {
    setRoundState("dealer");

    let nextDealer = [...dealerCards];
    let nextShoe = resetShoeIfNeeded(startingShoe);
    const hasLiveHand = hands.some((hand) => hand.status !== "bust");

    if (hasLiveHand) {
      while (dealerShouldHit(nextDealer)) {
        const draw = drawCard(nextShoe);
        nextDealer.push(draw.card);
        nextShoe = draw.rest;
      }
    }

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

  function continueOrFinish(
    hands: PlayerHand[],
    nextShoe: BlackjackCard[],
    startIndex: number
  ) {
    const nextIndex = findNextPlayingHand(hands, startIndex);
    setPlayerHands(hands);
    setShoe(nextShoe);

    if (nextIndex >= 0) {
      setActiveHandIndex(nextIndex);
      const value = getHandValue(hands[nextIndex].cards).total;
      setMessage(
        `${hands.length} hands • ${money(hands.reduce((sum, hand) => sum + hand.wager, 0))} total wager. Hand ${nextIndex + 1}: ${value}. Choose hit, stand, double, or split when available.`
      );
      return;
    }

    finishRound(hands, nextShoe);
  }

  function hit() {
    if (roundState !== "player" || !activeHand || activeHand.status !== "playing") return;

    const readyShoe = resetShoeIfNeeded(shoe);
    const draw = drawCard(readyShoe);
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
      continueOrFinish(nextHands, draw.rest, activeHandIndex + 1);
    } else if (value === 21) {
      setMessage(`Hand ${activeHandIndex + 1} has 21.`);
      continueOrFinish(nextHands, draw.rest, activeHandIndex + 1);
    } else {
      setPlayerHands(nextHands);
      setShoe(draw.rest);
      setMessage(`Hand ${activeHandIndex + 1} has ${value}. Hit or stand.`);
    }
  }

  function stand() {
    if (roundState !== "player" || !activeHand || activeHand.status !== "playing") return;
    const nextHands = [...playerHands];
    nextHands[activeHandIndex] = { ...activeHand, status: "stood" };
    continueOrFinish(nextHands, shoe, activeHandIndex + 1);
  }

  function doubleDown() {
    if (!activeHand || roundState !== "player") return;
    if (activeHand.cards.length !== 2 || activeHand.status !== "playing") return;
    if (bankroll < activeHand.wager) {
      setMessage("Not enough bankroll to double this hand.");
      return;
    }

    const readyShoe = resetShoeIfNeeded(shoe);
    const draw = drawCard(readyShoe);
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
    continueOrFinish(nextHands, draw.rest, activeHandIndex + 1);
  }

  function splitHand() {
    if (!activeHand || roundState !== "player") return;
    if (!canSplitPair(activeHand.cards) || playerHands.length >= 4) return;
    if (bankroll < activeHand.wager) {
      setMessage("Not enough bankroll to split this hand.");
      return;
    }

    let nextShoe = resetShoeIfNeeded(shoe);
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
      continueOrFinish(nextHands, nextShoe, activeHandIndex);
      return;
    }

    setMessage(`${nextHands.length} hands • ${money(nextHands.reduce((sum, hand) => sum + hand.wager, 0))} total wager. Playing Hand ${activeHandIndex + 1} first.`);
    continueOrFinish(nextHands, nextShoe, activeHandIndex);
  }

  function newRound() {
    setPlayerHands([]);
    setDealerCards([]);
    setActiveHandIndex(0);
    setRoundState("betting");
    if (bet > bankroll) setBet(Math.max(0, Math.min(25, bankroll)));
    setMessage("Choose your bet, then deal.");
  }

  const dealerDisplayTotal =
    dealerCards.length === 0
      ? "—"
      : holeHidden
        ? String(getHandValue(dealerCards.slice(0, 1)).total)
        : String(dealerValue.total);

  const canDeal = roundState === "betting" && bet >= MIN_BET && bet <= bankroll;
  const canAct = roundState === "player" && activeHand?.status === "playing";
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

  return (
    <>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Lucky Penny Blackjack
          </div>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Blackjack practice table</h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-emerald-50/60">
            Core game engine v1.1: deal, hit, stand, double, split, dealer play, payouts, bankroll, and session results.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ["BANKROLL", `$${money(bankroll)}`],
            ["TOTAL WAGER", `${money(displayedWager)}`],
            ["SESSION P/L", signedMoney(sessionPL)],
            ["HANDS", String(handsPlayed)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-[86px] rounded-xl border border-emerald-900/80 bg-black/25 px-3 py-2"
            >
              <div className="text-[7px] font-black uppercase tracking-[0.12em] text-emerald-400">
                {label}
              </div>
              <div className="mt-0.5 text-base font-black sm:text-lg">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[34px] border-[12px] border-[#5a2d0b] bg-[#075f3d] shadow-[0_26px_70px_rgba(0,0,0,.65),inset_0_0_0_3px_rgba(214,166,72,.28),inset_0_0_0_7px_rgba(45,18,4,.34)]">
        <div
          className="relative min-h-[690px] overflow-hidden border-[4px] border-[#cfbd8c]/75 bg-[#075f3d] px-3 py-4 sm:min-h-[760px] sm:px-6 sm:py-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 18%, rgba(255,255,255,.055), transparent 28%), radial-gradient(circle at 15% 85%, rgba(0,0,0,.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,.018), rgba(0,0,0,.035)), repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0px, rgba(255,255,255,.012) 1px, rgba(0,0,0,.018) 1px, rgba(0,0,0,.018) 3px)",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[54px] h-[510px] w-[92%] -translate-x-1/2 rounded-[50%] border-[3px] border-amber-100/70 sm:top-[66px] sm:h-[560px]" />
          <div className="pointer-events-none absolute left-1/2 top-[94px] h-[430px] w-[80%] -translate-x-1/2 rounded-[50%] border border-amber-100/25 sm:top-[112px] sm:h-[455px]" />

          <div className="relative z-10 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-100/80 sm:text-xs">
              Blackjack pays 3 to 2
            </div>
            <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-100/60 sm:text-[9px]">
              Dealer stands on soft 17 • 6-deck shoe
            </div>
          </div>

          <div className="relative z-10 mt-7 sm:mt-10">
            <div className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-emerald-200/70">
              Dealer • {dealerDisplayTotal}
            </div>
            <div className="mt-3 flex min-h-[128px] items-center justify-center gap-2 sm:gap-3">
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

          <div className="relative z-10 mx-auto mt-6 max-w-[900px] sm:mt-8">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="hidden text-right sm:block">
                <div className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-200/55">
                  Table minimum
                </div>
                <div className="text-xl font-black text-amber-100">$5</div>
              </div>

              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-amber-100/75 bg-black/10 shadow-[inset_0_0_24px_rgba(0,0,0,.2)] sm:h-28 sm:w-28">
                <div className="absolute inset-2 rounded-full border border-amber-100/30" />
                <div className="text-center">
                  <div className="text-[7px] font-black uppercase tracking-[0.13em] text-emerald-200/70">
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

          <div className="relative z-10 mt-5 sm:mt-6">
            <div className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-emerald-200/70">
              {playerHands.length > 1
                ? `Player • ${playerHands.length} hands`
                : `Player • ${activeValue ? activeValue.total : "—"}`}
            </div>
            <div className="mt-3 flex min-h-[155px] items-start justify-center gap-3 overflow-x-auto pb-2">
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
                      className={`min-w-[175px] rounded-xl border px-2 py-2 text-center transition sm:min-w-[205px] ${
                        isActive
                          ? "border-amber-300 bg-amber-300/10 shadow-[0_0_0_2px_rgba(252,211,77,.18)]"
                          : "border-emerald-200/20 bg-black/10"
                      }`}
                    >
                      <div className="text-[8px] font-black uppercase tracking-[0.13em] text-emerald-100/75">
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

          <div className="relative z-10 mx-auto mt-2 w-fit max-w-[92%] rounded-full border border-white/15 bg-black/30 px-5 py-2 text-center text-xs font-black text-amber-100 shadow-lg">
            {message}
          </div>

          <div className="relative z-10 mx-auto mt-4 max-w-[1080px] rounded-2xl border border-emerald-200/25 bg-black/20 p-3 backdrop-blur-[1px] sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3 text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300/70">
                  <span>Bet chips</span>
                  <button type="button" onClick={clearBet} className="text-amber-200 hover:text-white">
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CHIP_VALUES.map((value) => (
                    <Chip
                      key={value}
                      value={value}
                      selected={selectedChip === value}
                      onClick={() => selectChip(value)}
                    />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={decreaseBet}
                    disabled={roundState === "player" || roundState === "dealer" || bet === 0}
                    className="rounded-lg border border-emerald-300/30 bg-black/25 px-3 py-2 text-xs font-black text-emerald-50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    − ${selectedChip}
                  </button>
                  <button
                    type="button"
                    onClick={increaseBet}
                    disabled={roundState === "player" || roundState === "dealer" || bet >= Math.min(MAX_BET, bankroll)}
                    className="rounded-lg border border-emerald-300/30 bg-black/25 px-3 py-2 text-xs font-black text-emerald-50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    + ${selectedChip}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:px-4">
                <button
                  type="button"
                  onClick={hit}
                  disabled={!canAct}
                  className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50 shadow-sm disabled:cursor-not-allowed disabled:opacity-35"
                >
                  HIT
                </button>
                <button
                  type="button"
                  onClick={stand}
                  disabled={!canAct}
                  className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50 shadow-sm disabled:cursor-not-allowed disabled:opacity-35"
                >
                  STAND
                </button>
                <button
                  type="button"
                  onClick={doubleDown}
                  disabled={!canDouble}
                  title={canDouble ? "Double wager and receive exactly one card" : "Double requires two cards and enough bankroll"}
                  className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50 shadow-sm disabled:cursor-not-allowed disabled:opacity-35"
                >
                  DOUBLE
                </button>
                <button
                  type="button"
                  onClick={splitHand}
                  disabled={!canSplit}
                  title={canSplit ? "Split this pair into two hands" : "Split requires an equal-value pair, room for another hand, and enough bankroll"}
                  className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50 shadow-sm disabled:cursor-not-allowed disabled:opacity-35"
                >
                  SPLIT
                </button>
              </div>

              {roundState === "resolved" ? (
                <button
                  type="button"
                  onClick={newRound}
                  className="rounded-xl bg-amber-400 px-7 py-4 text-sm font-black text-black shadow-lg hover:bg-amber-300"
                >
                  NEW HAND
                </button>
              ) : (
                <button
                  type="button"
                  onClick={deal}
                  disabled={!canDeal}
                  className="rounded-xl bg-amber-400 px-7 py-4 text-sm font-black text-black shadow-lg hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  DEAL
                </button>
              )}
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-3 flex max-w-[1050px] flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[7px] font-bold uppercase tracking-[0.11em] text-emerald-100/50 sm:text-[8px]">
            <span>6-deck shoe</span>
            <span>Dealer stands on soft 17</span>
            <span>Blackjack pays 3:2</span>
            <span>Double after split</span>
            <span>Split up to 4 hands</span>
            <span>Split aces receive 1 card</span>
          </div>
        </div>
      </div>
    </>
  );
}
