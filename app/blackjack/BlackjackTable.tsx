"use client";

import { useMemo, useState } from "react";
import {
  buildShoe,
  dealerShouldHit,
  getHandValue,
  isBlackjack,
  resolveBlackjackRound,
  shuffleShoe,
  type BlackjackCard,
  type BlackjackSuit,
} from "./blackjackRules";

type RoundState = "betting" | "player" | "dealer" | "resolved";

type PlayingCardProps = {
  card: BlackjackCard;
  hidden?: boolean;
  tilted?: "left" | "right";
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

function PlayingCard({ card, hidden = false, tilted }: PlayingCardProps) {
  const red = card.suit === "♥" || card.suit === "♦";
  const tilt =
    tilted === "left"
      ? "-rotate-3"
      : tilted === "right"
        ? "rotate-3"
        : "";

  if (hidden) {
    return (
      <div
        className={`relative h-28 w-20 overflow-hidden rounded-lg border-2 border-white/90 bg-[#0b2f63] shadow-[0_10px_24px_rgba(0,0,0,.45)] sm:h-32 sm:w-24 ${tilt}`}
        aria-label="Face-down card"
      >
        <div className="absolute inset-1 rounded-md border border-white/50 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.12)_0px,rgba(255,255,255,.12)_3px,transparent_3px,transparent_7px)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-amber-300/70 bg-black/30 font-serif text-sm font-black text-amber-200">
            LP
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-28 w-20 rounded-lg border border-zinc-300 bg-[#fffdf6] text-zinc-950 shadow-[0_10px_24px_rgba(0,0,0,.45)] sm:h-32 sm:w-24 ${tilt}`}
    >
      <div
        className={`absolute left-2 top-1.5 text-lg font-black leading-none sm:text-xl ${
          red ? "text-red-600" : "text-zinc-950"
        }`}
      >
        <div>{card.rank}</div>
        <div className="mt-0.5 text-base sm:text-lg">{card.suit}</div>
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl ${
          red ? "text-red-600" : "text-zinc-950"
        }`}
      >
        {card.suit}
      </div>
      <div
        className={`absolute bottom-1.5 right-2 rotate-180 text-lg font-black leading-none sm:text-xl ${
          red ? "text-red-600" : "text-zinc-950"
        }`}
      >
        <div>{card.rank}</div>
        <div className="mt-0.5 text-base sm:text-lg">{card.suit}</div>
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

function outcomeMessage(result: ReturnType<typeof resolveBlackjackRound>["result"], profit: number) {
  if (result === "blackjack") return `Blackjack! You win $${money(profit)}.`;
  if (result === "win") return `You win $${money(profit)}.`;
  if (result === "push") return "Push. Your bet is returned.";
  return `Dealer wins. You lose $${money(Math.abs(profit))}.`;
}

export function BlackjackTable() {
  const [shoe, setShoe] = useState<BlackjackCard[]>(() =>
    shuffleShoe(buildShoe(6))
  );
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [bet, setBet] = useState(25);
  const [selectedChip, setSelectedChip] = useState(25);
  const [playerCards, setPlayerCards] = useState<BlackjackCard[]>([]);
  const [dealerCards, setDealerCards] = useState<BlackjackCard[]>([]);
  const [roundState, setRoundState] = useState<RoundState>("betting");
  const [message, setMessage] = useState("Choose your bet, then deal.");
  const [sessionPL, setSessionPL] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);

  const playerValue = useMemo(() => getHandValue(playerCards), [playerCards]);
  const dealerValue = useMemo(() => getHandValue(dealerCards), [dealerCards]);
  const holeHidden = roundState === "player";

  function resetShoeIfNeeded(currentShoe: BlackjackCard[]) {
    return currentShoe.length < 52
      ? shuffleShoe(buildShoe(6))
      : currentShoe;
  }

  function selectChip(value: number) {
    if (roundState !== "betting" && roundState !== "resolved") return;
    setSelectedChip(value);
    setMessage(`Selected ${value} chip. Use + or - to change the bet.`);
  }

  function increaseBet() {
    if (roundState !== "betting" && roundState !== "resolved") return;
    const next = Math.min(MAX_BET, bankroll, bet + selectedChip);
    setBet(next);
    setMessage(`Bet set to ${money(next)}.`);
  }

  function decreaseBet() {
    if (roundState !== "betting" && roundState !== "resolved") return;
    const next = Math.max(0, bet - selectedChip);
    setBet(next);
    setMessage(next === 0 ? "Bet cleared." : `Bet set to ${money(next)}.`);
  }

  function clearBet() {
    if (roundState !== "betting" && roundState !== "resolved") return;
    setBet(0);
    setMessage("Bet cleared.");
  }

  function settleRound(
    finalPlayer: BlackjackCard[],
    finalDealer: BlackjackCard[],
    wager = bet
  ) {
    const outcome = resolveBlackjackRound(finalPlayer, finalDealer, wager);
    setBankroll((current) => current + outcome.returnAmount);
    setSessionPL((current) => current + outcome.profit);
    setHandsPlayed((current) => current + 1);
    setRoundState("resolved");
    setMessage(outcomeMessage(outcome.result, outcome.profit));
  }

  function deal() {
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

    setShoe(nextShoe);
    setPlayerCards(nextPlayer);
    setDealerCards(nextDealer);
    setBankroll((current) => current - bet);

    const playerBlackjack = isBlackjack(nextPlayer);
    const dealerBlackjack = isBlackjack(nextDealer);

    if (playerBlackjack || dealerBlackjack) {
      settleRound(nextPlayer, nextDealer);
      return;
    }

    setRoundState("player");
    setMessage("Your move: hit or stand.");
  }

  function hit() {
    if (roundState !== "player") return;

    const draw = drawCard(resetShoeIfNeeded(shoe));
    const nextPlayer = [...playerCards, draw.card];
    setShoe(draw.rest);
    setPlayerCards(nextPlayer);

    const value = getHandValue(nextPlayer).total;
    if (value > 21) {
      settleRound(nextPlayer, dealerCards);
    } else if (value === 21) {
      playDealer(nextPlayer, dealerCards, draw.rest);
    } else {
      setMessage(`Player has ${value}. Hit or stand.`);
    }
  }

  function playDealer(
    finalPlayer = playerCards,
    startingDealer = dealerCards,
    startingShoe = shoe
  ) {
    if (roundState !== "player" && finalPlayer === playerCards) return;

    setRoundState("dealer");
    let nextDealer = [...startingDealer];
    let nextShoe = resetShoeIfNeeded(startingShoe);

    while (dealerShouldHit(nextDealer)) {
      const draw = drawCard(nextShoe);
      nextDealer.push(draw.card);
      nextShoe = draw.rest;
    }

    setDealerCards(nextDealer);
    setShoe(nextShoe);
    settleRound(finalPlayer, nextDealer);
  }

  function newRound() {
    setPlayerCards([]);
    setDealerCards([]);
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

  const playerDisplayTotal = playerCards.length ? String(playerValue.total) : "—";
  const canDeal = (roundState === "betting" || roundState === "resolved") && bet >= MIN_BET && bet <= bankroll;
  const canAct = roundState === "player";

  return (
    <>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Lucky Penny Blackjack
          </div>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Blackjack practice table</h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-emerald-50/60">
            Core game engine v1: bet, deal, hit, stand, dealer play, blackjack payouts, bankroll, and session results.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ["BANKROLL", `$${money(bankroll)}`],
            ["BET", `$${money(bet)}`],
            ["SESSION P/L", `${sessionPL >= 0 ? "+" : "-"}$${money(Math.abs(sessionPL))}`],
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

              <div
                className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-amber-100/75 bg-black/10 shadow-[inset_0_0_24px_rgba(0,0,0,.2)] sm:h-28 sm:w-28"
              >
                <div className="absolute inset-2 rounded-full border border-amber-100/30" />
                <div className="text-center">
                  <div className="text-[7px] font-black uppercase tracking-[0.13em] text-emerald-200/70">
                    Main Bet
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

          <div className="relative z-10 mt-6 sm:mt-7">
            <div className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-emerald-200/70">
              Player • {playerDisplayTotal}
            </div>
            <div className="mt-3 flex min-h-[128px] items-center justify-center gap-2 sm:gap-3">
              {playerCards.length === 0 ? (
                <div className="text-sm font-bold text-emerald-100/35">Place a bet and deal</div>
              ) : (
                playerCards.map((card, index) => (
                  <PlayingCard
                    key={card.id}
                    card={card}
                    tilted={index % 2 === 0 ? "left" : "right"}
                  />
                ))
              )}
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-4 w-fit max-w-[92%] rounded-full border border-white/15 bg-black/30 px-5 py-2 text-center text-xs font-black text-amber-100 shadow-lg">
            {message}
          </div>

          <div className="relative z-10 mx-auto mt-5 max-w-[980px] rounded-2xl border border-emerald-200/25 bg-black/20 p-3 backdrop-blur-[1px] sm:p-4">
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
                  onClick={() => playDealer()}
                  disabled={!canAct}
                  className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50 shadow-sm disabled:cursor-not-allowed disabled:opacity-35"
                >
                  STAND
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming in Blackjack Engine v1.1"
                  className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50/35 shadow-sm"
                >
                  DOUBLE
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming in Blackjack Engine v1.1"
                  className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50/35 shadow-sm"
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

          <div className="relative z-10 mx-auto mt-3 flex max-w-[950px] flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[7px] font-bold uppercase tracking-[0.11em] text-emerald-100/50 sm:text-[8px]">
            <span>6-deck shoe</span>
            <span>Dealer stands on soft 17</span>
            <span>Blackjack pays 3:2</span>
            <span>Double + split next</span>
          </div>
        </div>
      </div>
    </>
  );
}
