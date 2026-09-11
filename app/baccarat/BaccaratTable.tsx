"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  baccaratCardValue,
  baccaratHandTotal,
  buildBaccaratShoe,
  dealBaccaratRound,
  settleBaccaratBets,
  shouldReshuffleBaccaratShoe,
  shuffleBaccaratShoe,
  type BaccaratBets,
  type BaccaratBetResult,
  type BaccaratBetType,
  type BaccaratCard,
  type BaccaratOutcome,
  type BaccaratRound,
} from "./baccaratRules";

type RoundState = "betting" | "dealing" | "resolved";

type BaccaratHistoryEntry = {
  id: number;
  playerCards: BaccaratCard[];
  bankerCards: BaccaratCard[];
  playerTotal: number;
  bankerTotal: number;
  outcome: BaccaratOutcome;
  bets: BaccaratBets;
  wager: number;
  net: number;
  commission: number;
  natural: boolean;
  betResults: BaccaratBetResult[];
};

type RoundOutcomeNotice = {
  id: number;
  tone: "win" | "loss" | "push";
  label: "WIN" | "LOSS" | "PUSH";
  amount: number;
  detail: string;
};

const STARTING_BANKROLL = 5000;
const TABLE_MIN = 5;
const TABLE_MAX = 1000;
const CHIP_VALUES = [1, 5, 25, 100, 500];
const CARD_DELAY_MS = 380;
const THIRD_CARD_CUE_MS = 2000;
const RESULT_DELAY_MS = 350;
const OUTCOME_DISPLAY_MS = 1700;
const emptyBets: BaccaratBets = {
  player: 0,
  banker: 0,
  tie: 0,
  playerDragon: 0,
  bankerDragon: 0,
};

function pause(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

function money(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function signedMoney(amount: number) {
  if (amount === 0) return "$0";
  return `${amount > 0 ? "+" : "−"}$${money(Math.abs(amount))}`;
}

function PlayingCard({ card, index }: { card: BaccaratCard; index: number }) {
  const red = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      className={`baccarat-card blackjack-card-slot h-20 w-14 sm:h-28 sm:w-20 ${index % 2 === 0 ? "-rotate-2" : "rotate-2"}`}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <div className="blackjack-card-enter relative h-full w-full rounded-lg border border-zinc-300 bg-[#fffdf6] text-zinc-950 shadow-[0_10px_24px_rgba(0,0,0,.42)]">
        <div className={`absolute left-2 top-1.5 text-base font-black leading-none ${red ? "text-red-600" : "text-zinc-950"}`}>
          <div>{card.rank}</div>
          <div className="mt-0.5 text-sm">{card.suit}</div>
        </div>
        <div className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl ${red ? "text-red-600" : "text-zinc-950"}`}>
          {card.suit}
        </div>
        <div className={`absolute bottom-1.5 right-2 rotate-180 text-base font-black leading-none ${red ? "text-red-600" : "text-zinc-950"}`}>
          <div>{card.rank}</div>
          <div className="mt-0.5 text-sm">{card.suit}</div>
        </div>
      </div>
    </div>
  );
}

function Chip({ value, selected, disabled, onClick }: { value: number; selected: boolean; disabled: boolean; onClick: () => void }) {
  const color =
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
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[4px] border-dashed text-[9px] font-black shadow-lg transition sm:h-14 sm:w-14 sm:text-xs disabled:cursor-not-allowed disabled:opacity-35 ${color} ${selected ? "scale-110 ring-4 ring-amber-300 ring-offset-2 ring-offset-[#061710]" : "enabled:hover:-translate-y-0.5"}`}
    >
      <span className="absolute inset-[5px] rounded-full border border-current opacity-35" />
      <span className="relative">${value}</span>
    </button>
  );
}

function cardText(cards: BaccaratCard[]) {
  return cards.map((card) => `${card.rank}${card.suit}`).join(" ");
}

function betLabel(type: BaccaratBetType) {
  if (type === "player") return "Player";
  if (type === "banker") return "Banker";
  if (type === "tie") return "Tie";
  return type === "playerDragon" ? "Player Dragon Bonus" : "Banker Dragon Bonus";
}

function drawExplanation(round: BaccaratRound) {
  if (round.natural) {
    return `Natural: Player opened with ${round.playerInitialTotal} and Banker opened with ${round.bankerInitialTotal}. An opening 8 or 9 stops all drawing.`;
  }

  const playerText =
    round.playerCards.length === 3
      ? `Player started at ${round.playerInitialTotal} and drew because Player draws on 0 through 5.`
      : `Player started at ${round.playerInitialTotal} and stood because Player stands on 6 or 7.`;
  const playerThirdCard = round.playerCards[2];
  const bankerText =
    round.bankerCards.length === 3
      ? playerThirdCard
        ? `Banker started at ${round.bankerInitialTotal} and drew after Player's ${baccaratCardValue(playerThirdCard)}-value third card.`
        : `Banker started at ${round.bankerInitialTotal} and drew because Player stood and Banker had 5 or less.`
      : playerThirdCard
        ? `Banker started at ${round.bankerInitialTotal} and stood after Player's ${baccaratCardValue(playerThirdCard)}-value third card.`
        : `Banker started at ${round.bankerInitialTotal} and stood because Player stood and Banker had 6 or 7.`;

  return `${playerText} ${bankerText}`;
}

export function BaccaratTable() {
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [selectedChip, setSelectedChip] = useState(5);
  const [bets, setBets] = useState<BaccaratBets>({ ...emptyBets });
  const [lockedBets, setLockedBets] = useState<BaccaratBets>({ ...emptyBets });
  const [previousBets, setPreviousBets] = useState<BaccaratBets>({ ...emptyBets });
  const [shoe, setShoe] = useState(() => shuffleBaccaratShoe(buildBaccaratShoe()));
  const [roundState, setRoundState] = useState<RoundState>("betting");
  const [playerCards, setPlayerCards] = useState<BaccaratCard[]>([]);
  const [bankerCards, setBankerCards] = useState<BaccaratCard[]>([]);
  const [lastRound, setLastRound] = useState<BaccaratRound | null>(null);
  const [history, setHistory] = useState<BaccaratHistoryEntry[]>([]);
  const [sessionPL, setSessionPL] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [message, setMessage] = useState("Choose Player, Banker, Tie, or Dragon Bonus, then deal.");
  const [isAnimating, setIsAnimating] = useState(false);
  const [roundOutcome, setRoundOutcome] = useState<RoundOutcomeNotice | null>(null);
  const [learnMode, setLearnMode] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [nextRecipient, setNextRecipient] = useState<"player" | "banker" | null>(null);

  const totalBet = Object.values(bets).reduce((total, amount) => total + amount, 0);
  const displayedBets = roundState === "dealing" ? lockedBets : bets;
  const displayedTotalBet = Object.values(displayedBets).reduce(
    (total, amount) => total + amount,
    0
  );
  const playerTotal = playerCards.length ? baccaratHandTotal(playerCards) : null;
  const bankerTotal = bankerCards.length ? baccaratHandTotal(bankerCards) : null;
  const invalidPosition = (Object.values(bets) as number[]).some(
    (amount) => amount > 0 && amount < TABLE_MIN
  );
  const canDeal = !isAnimating && totalBet >= TABLE_MIN && !invalidPosition;
  const canBet = !isAnimating && roundState !== "dealing";
  const learnStep = !lastRound
    ? bets.player === TABLE_MIN &&
      bets.banker === 0 &&
      bets.tie === 0 &&
      bets.playerDragon === 0 &&
      bets.bankerDragon === 0
      ? "deal"
      : "bet"
    : "review";

  const trends = useMemo(() => {
    const recent = history.slice(0, 12);
    return {
      player: recent.filter((entry) => entry.outcome === "player").length,
      banker: recent.filter((entry) => entry.outcome === "banker").length,
      tie: recent.filter((entry) => entry.outcome === "tie").length,
    };
  }, [history]);

  const scoreboard = useMemo(() => {
    const player = history.filter((entry) => entry.outcome === "player").length;
    const banker = history.filter((entry) => entry.outcome === "banker").length;
    const tie = history.filter((entry) => entry.outcome === "tie").length;
    const leadingOutcome = history[0]?.outcome;
    const streak = leadingOutcome
      ? history.findIndex((entry) => entry.outcome !== leadingOutcome)
      : 0;

    return {
      player,
      banker,
      tie,
      streak: leadingOutcome ? (streak === -1 ? history.length : streak) : 0,
      leadingOutcome,
    };
  }, [history]);

  const beadRoad = useMemo(() => history.slice(0, 72).reverse(), [history]);

  function prepareFreshRound() {
    setRoundState("betting");
    setPlayerCards([]);
    setBankerCards([]);
    setLastRound(null);
    setLockedBets({ ...emptyBets });
    setRoundOutcome(null);
    setNextRecipient(null);
  }

  function placeBet(type: BaccaratBetType, reduce = false) {
    if (!canBet) return;
    if (roundState === "resolved") prepareFreshRound();

    if (reduce) {
      const reduction = Math.min(selectedChip, bets[type]);
      if (!reduction) return;
      setBets((current) => ({ ...current, [type]: current[type] - reduction }));
      setBankroll((current) => current + reduction);
      setMessage(`Removed $${money(reduction)} from ${betLabel(type)}.`);
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough practice credits for that chip.");
      return;
    }
    if (bets[type] + selectedChip > TABLE_MAX) {
      setMessage(`The maximum on each position is $${money(TABLE_MAX)}.`);
      return;
    }

    setBets((current) => ({ ...current, [type]: current[type] + selectedChip }));
    setBankroll((current) => current - selectedChip);
    setMessage(`${betLabel(type)} now has $${money(bets[type] + selectedChip)}.`);
  }

  function clearBets() {
    if (!canBet) return;
    setBankroll((current) => current + totalBet);
    setBets({ ...emptyBets });
    if (roundState === "resolved") prepareFreshRound();
    setMessage("Bets cleared. Choose a position to begin.");
  }

  function repeatLastBet() {
    if (!canBet) return;
    const amount = Object.values(previousBets).reduce(
      (total, wager) => total + wager,
      0
    );
    if (!amount) {
      setMessage("Complete a hand before using Repeat.");
      return;
    }
    if (amount > bankroll + totalBet) {
      setMessage("Not enough practice credits to repeat the last wager.");
      return;
    }
    setBankroll((current) => current + totalBet - amount);
    setBets({ ...previousBets });
    if (roundState === "resolved") prepareFreshRound();
    setMessage(`Repeated $${money(amount)} across the last positions.`);
  }

  function resetSession() {
    if (isAnimating) return;
    setBankroll(STARTING_BANKROLL);
    setBets({ ...emptyBets });
    setLockedBets({ ...emptyBets });
    setPreviousBets({ ...emptyBets });
    setShoe(shuffleBaccaratShoe(buildBaccaratShoe()));
    setRoundState("betting");
    setPlayerCards([]);
    setBankerCards([]);
    setLastRound(null);
    setHistory([]);
    setSessionPL(0);
    setHandsPlayed(0);
    setRoundOutcome(null);
    setNextRecipient(null);
    setRemoveMode(false);
    setMessage("Session reset. Choose a position to begin.");
  }

  function toggleLearnMode() {
    if (isAnimating) return;
    if (!learnMode) {
      setBankroll((current) => current + totalBet);
      setBets({ ...emptyBets });
      prepareFreshRound();
      setSelectedChip(5);
      setLearnMode(true);
      setMessage("Learn Mode: place one $5 chip on Player.");
    } else {
      setLearnMode(false);
      setMessage("Learn Mode off. Choose any valid wager.");
    }
  }

  async function deal() {
    if (!canDeal) {
      setMessage(
        invalidPosition
          ? "Each position with chips needs at least the $5 table minimum."
          : "Place at least $5 before dealing."
      );
      return;
    }

    if (learnMode && learnStep === "bet") {
      setMessage("For this lesson, place exactly one $5 chip on Player.");
      return;
    }

    setIsAnimating(true);
    setRoundState("dealing");
    setPlayerCards([]);
    setBankerCards([]);
    setLastRound(null);
    setRoundOutcome(null);
    setNextRecipient(null);
    const wagers = { ...bets };
    setLockedBets(wagers);
    setPreviousBets(wagers);

    let activeShoe = shoe;
    if (shouldReshuffleBaccaratShoe(activeShoe.length)) {
      activeShoe = shuffleBaccaratShoe(buildBaccaratShoe());
      setMessage("Fresh 8-deck shoe. Cards are coming out.");
      await pause(300);
    } else {
      setMessage("No more bets. Player receives the first card.");
    }

    const round = dealBaccaratRound(activeShoe);
    setPlayerCards([round.playerCards[0]]);
    await pause(CARD_DELAY_MS);
    setBankerCards([round.bankerCards[0]]);
    await pause(CARD_DELAY_MS);
    setPlayerCards(round.playerCards.slice(0, 2));
    await pause(CARD_DELAY_MS);
    setBankerCards(round.bankerCards.slice(0, 2));
    await pause(CARD_DELAY_MS);

    if (round.playerCards[2]) {
      setNextRecipient("player");
      setMessage(`Player draws on ${round.playerInitialTotal}. Player receives the next card.`);
      await pause(THIRD_CARD_CUE_MS);
      setPlayerCards(round.playerCards);
      setNextRecipient(null);
      await pause(CARD_DELAY_MS);
    } else if (round.natural) {
      setMessage("Natural 8 or 9. Both hands stand.");
    } else {
      setMessage(`Player stands on ${round.playerInitialTotal}.`);
    }

    if (round.bankerCards[2]) {
      setNextRecipient("banker");
      setMessage(`Banker draws on ${round.bankerInitialTotal}. Banker receives the next card.`);
      await pause(THIRD_CARD_CUE_MS);
      setBankerCards(round.bankerCards);
      setNextRecipient(null);
      await pause(CARD_DELAY_MS);
    }

    await pause(RESULT_DELAY_MS);
    const settlement = settleBaccaratBets(wagers, round.outcome, round);
    const id = Date.now();
    const winner = betLabel(round.outcome);
    const detail = `${winner} ${round.outcome === "tie" ? round.playerTotal : round.outcome === "player" ? round.playerTotal : round.bankerTotal}`;
    const tone = settlement.net > 0 ? "win" : settlement.net < 0 ? "loss" : "push";

    setShoe(round.remainingShoe);
    setBankroll((current) => current + settlement.grossReturn);
    setSessionPL((current) => current + settlement.net);
    setHandsPlayed((current) => current + 1);
    setRoundState("resolved");
    setLastRound(round);
    setBets({ ...emptyBets });
    setHistory((current) => [
      {
        id,
        playerCards: round.playerCards,
        bankerCards: round.bankerCards,
        playerTotal: round.playerTotal,
        bankerTotal: round.bankerTotal,
        outcome: round.outcome,
        bets: wagers,
        wager: settlement.totalStake,
        net: settlement.net,
        commission: settlement.commission,
        natural: round.natural,
        betResults: settlement.betResults,
      },
      ...current,
    ]);
    setMessage(
      `${winner} wins ${round.outcome === "tie" ? `${round.playerTotal} to ${round.bankerTotal}` : `${Math.max(round.playerTotal, round.bankerTotal)} to ${Math.min(round.playerTotal, round.bankerTotal)}`}. ${settlement.net > 0 ? `You won $${money(settlement.net)}.` : settlement.net < 0 ? `You lost $${money(Math.abs(settlement.net))}.` : "Your wagers pushed."}`
    );
    setRoundOutcome({
      id,
      tone,
      label: tone === "win" ? "WIN" : tone === "loss" ? "LOSS" : "PUSH",
      amount: Math.abs(settlement.net),
      detail,
    });

    await pause(OUTCOME_DISPLAY_MS);
    setRoundOutcome(null);
    setIsAnimating(false);
  }

  const learnPanel = (
    <div className="rounded-2xl border border-sky-300/55 bg-[#08283a]/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,.28)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={toggleLearnMode} className="rounded-full bg-sky-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-sky-950">
          Learn Mode On
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.13em] text-sky-200/70">
          {learnStep === "bet" ? "Step 1 of 2" : learnStep === "deal" ? "Step 2 of 2" : "Hand explained"}
        </div>
      </div>
      <h2 className="mt-3 text-lg font-black text-white">
        {learnStep === "bet" ? "Start with a Player bet" : learnStep === "deal" ? "Deal the hand" : `${betLabel(lastRound?.outcome ?? "player")} wins`}
      </h2>
      <p className="mt-1 text-sm font-medium leading-6 text-sky-50/80">
        {learnStep === "bet"
          ? "The $5 chip is selected. Place one chip on the highlighted Player position. Player is the name of a hand, not necessarily you. Baccarat enjoys making simple things sound mysterious."
          : learnStep === "deal"
            ? "Your Player wager meets the table minimum. Select the highlighted Deal button and watch the fixed drawing rules play out automatically."
            : lastRound
              ? drawExplanation(lastRound)
              : "The completed hand will be explained here."}
      </p>
      {learnStep === "review" ? (
        <button type="button" onClick={() => { prepareFreshRound(); setMessage("Learn Mode: place one $5 chip on Player."); }} className="mt-3 rounded-xl border border-sky-200/45 px-4 py-2 text-xs font-black text-sky-100 hover:bg-sky-300/10">
          Practice another hand
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="baccarat-page-summary mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Lucky Penny Baccarat</div>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Baccarat practice table</h1>
          <p className="mt-1 max-w-2xl text-sm font-medium leading-5 text-emerald-50/65">
            Bet Player, Banker, Tie, or Dragon Bonus while the standard Punto Banco drawing rules run automatically.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 text-center sm:w-auto sm:grid-cols-4">
          {[
            ["BANKROLL", `$${money(bankroll)}`],
            ["ON TABLE", `$${money(displayedTotalBet)}`],
            ["SESSION P/L", signedMoney(sessionPL)],
            ["HANDS", String(handsPlayed)],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-xl border border-emerald-900/80 bg-black/25 px-2 py-2 sm:min-w-[86px] sm:px-3">
              <div className="text-[8px] font-black uppercase tracking-[0.1em] text-emerald-400">{label}</div>
              <div className="mt-0.5 text-base font-black sm:text-lg">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="baccarat-table-shell overflow-hidden rounded-[24px] border-[7px] border-[#5a2d0b] bg-[#075f3d] shadow-[0_26px_70px_rgba(0,0,0,.65),inset_0_0_0_3px_rgba(214,166,72,.28)] sm:rounded-[34px] sm:border-[12px]">
        <div className="baccarat-felt relative min-h-[520px] overflow-hidden border-[3px] border-[#cfbd8c]/75 px-2 py-4 sm:min-h-[610px] sm:border-[4px] sm:px-6 sm:py-5" style={{ backgroundImage: "radial-gradient(circle at 50% 16%,rgba(255,255,255,.07),transparent 30%),linear-gradient(145deg,#0a6847,#075538 58%,#06442f),repeating-linear-gradient(0deg,rgba(255,255,255,.015) 0px,rgba(255,255,255,.015) 1px,transparent 1px,transparent 3px)" }}>
          <div className="baccarat-felt-oval pointer-events-none absolute left-1/2 top-[82px] hidden h-[430px] w-[88%] -translate-x-1/2 rounded-[50%] border-[3px] border-amber-100/65 sm:block" />
          <div className="baccarat-felt-oval pointer-events-none absolute left-1/2 top-[118px] hidden h-[355px] w-[76%] -translate-x-1/2 rounded-[50%] border border-amber-100/20 sm:block" />

          {roundOutcome ? (
            <div key={roundOutcome.id} className="pointer-events-none fixed inset-0 z-[200]" role="status" aria-live="polite">
              <div className={`blackjack-outcome-wash absolute inset-0 ${roundOutcome.tone === "win" ? "bg-emerald-950/30" : roundOutcome.tone === "loss" ? "bg-red-950/30" : "bg-amber-950/25"}`} />
              <div className={`blackjack-outcome-ring absolute left-1/2 top-1/2 h-44 w-44 rounded-full border-[5px] ${roundOutcome.tone === "win" ? "border-emerald-300/80" : roundOutcome.tone === "loss" ? "border-red-300/80" : "border-amber-200/85"}`} />
              <div className={`blackjack-round-outcome absolute left-1/2 top-1/2 min-w-[270px] max-w-[90%] rounded-2xl border-2 px-8 py-5 text-center shadow-[0_18px_55px_rgba(0,0,0,.65)] ${roundOutcome.tone === "win" ? "border-emerald-300 bg-emerald-950/95 text-emerald-50" : roundOutcome.tone === "loss" ? "border-red-300 bg-red-950/95 text-red-50" : "border-amber-200 bg-amber-950/95 text-amber-50"}`}>
                <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-80">{roundOutcome.detail}</div>
                <div className="mt-1 text-4xl font-black tracking-[0.06em]">{roundOutcome.label}</div>
                <div className="mt-1 text-2xl font-black">{roundOutcome.tone === "win" ? "+" : roundOutcome.tone === "loss" ? "−" : ""}${money(roundOutcome.amount)}</div>
              </div>
            </div>
          ) : null}

          <div className="baccarat-payout relative z-10 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-100/85 sm:text-xs">Player 1 to 1 • Banker 0.95 to 1 • Tie 8 to 1</div>
            <div className="baccarat-payout-sub mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-100/65">Standard Punto Banco • 8-deck shoe</div>
          </div>

          <div className="baccarat-hands relative z-10 mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:mt-12 sm:gap-10">
            {([
              ["PLAYER", playerCards, playerTotal, "border-sky-300/35 bg-sky-950/15 text-sky-100"],
              ["BANKER", bankerCards, bankerTotal, "border-red-300/35 bg-red-950/15 text-red-100"],
            ] as const).map(([label, cards, total, color]) => (
              <div key={label} className={`baccarat-hand relative min-h-[174px] rounded-2xl border p-3 text-center transition duration-300 sm:min-h-[218px] sm:p-4 ${color} ${nextRecipient === label.toLowerCase() ? "scale-[1.025] ring-4 ring-amber-200 shadow-[0_0_34px_rgba(253,230,138,.72)]" : ""}`}>
                {nextRecipient === label.toLowerCase() ? <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-amber-300 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-amber-950">Next card</span> : null}
                <div className="text-xs font-black tracking-[0.2em] sm:text-sm">{label}</div>
                <div className="mt-0.5 text-3xl font-black leading-none sm:text-4xl">{total ?? "?"}</div>
                <div className="mt-3 flex min-h-[90px] items-center justify-center -space-x-2 sm:min-h-[120px] sm:space-x-1">
                  {cards.length ? cards.map((card, index) => <PlayingCard key={card.id} card={card} index={index} />) : <span className="text-sm font-bold opacity-35">Waiting for cards</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="baccarat-message relative z-10 mx-auto mt-4 w-fit max-w-[95%] rounded-full border border-white/15 bg-black/30 px-4 py-2 text-center text-xs font-black text-amber-100 shadow-lg">{message}</div>

          {learnMode ? <div className="baccarat-learn-panel relative z-20 mx-auto mt-4 max-w-4xl">{learnPanel}</div> : null}

          <div className="baccarat-bets relative z-10 mx-auto mt-5 grid max-w-4xl grid-cols-3 gap-2 sm:gap-4">
            <button
              type="button"
              disabled={!canBet}
              onClick={(event) => placeBet("player", event.shiftKey || removeMode)}
              className={`baccarat-main-bet relative min-h-[112px] rounded-2xl border-2 border-sky-300 bg-sky-950/55 px-2 py-4 text-center text-sky-50 shadow-[inset_0_0_24px_rgba(0,0,0,.2)] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[136px] sm:px-4 ${learnMode && learnStep === "bet" ? "scale-[1.025] ring-4 ring-sky-200 shadow-[0_0_30px_rgba(125,211,252,.65)]" : ""}`}
            >
              <div className="text-base font-black sm:text-2xl">PLAYER</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] opacity-70 sm:text-[10px]">Pays 1 to 1</div>
              <div className="mt-2 text-xl font-black text-white sm:text-2xl">${money(displayedBets.player)}</div>
              {learnMode && learnStep === "bet" ? <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-300 px-3 py-1 text-[9px] font-black uppercase text-sky-950">Place here</span> : null}
            </button>

            <div className="baccarat-center-bets grid min-h-[112px] grid-rows-2 overflow-hidden rounded-2xl border-2 border-amber-300 shadow-[inset_0_0_24px_rgba(0,0,0,.2)] sm:min-h-[136px]">
              <button type="button" disabled={!canBet} onClick={(event) => placeBet("tie", event.shiftKey || removeMode)} className="bg-amber-950/55 px-2 text-center text-amber-50 transition enabled:hover:bg-amber-900/65 disabled:opacity-50">
                <span className="block text-sm font-black sm:text-xl">TIE</span>
                <span className="block text-[8px] font-bold uppercase opacity-70 sm:text-[9px]">8 to 1</span>
                <span className="block text-base font-black text-white sm:text-xl">${money(displayedBets.tie)}</span>
              </button>
              <div className="border-t-2 border-amber-300/70 bg-violet-950/60 px-1 py-1 text-center text-violet-50" title="Natural win pays 1 to 1. A non-natural win by 4 to 9 pays from 1 to 1 up to 30 to 1.">
                <div className="text-[9px] font-black uppercase tracking-[0.1em] sm:text-[10px]">Dragon Bonus</div>
                <div className="grid grid-cols-2 gap-1">
                  <button type="button" aria-label={`Player Dragon Bonus, $${money(displayedBets.playerDragon)} bet`} disabled={!canBet} onClick={(event) => placeBet("playerDragon", event.shiftKey || removeMode)} className="rounded-md border border-sky-300/45 bg-sky-950/55 py-1 text-[9px] font-black transition enabled:hover:bg-sky-900/75 disabled:opacity-50"><span className="block">PLAYER</span><span className="block text-xs">${money(displayedBets.playerDragon)}</span></button>
                  <button type="button" aria-label={`Banker Dragon Bonus, $${money(displayedBets.bankerDragon)} bet`} disabled={!canBet} onClick={(event) => placeBet("bankerDragon", event.shiftKey || removeMode)} className="rounded-md border border-red-300/45 bg-red-950/55 py-1 text-[9px] font-black transition enabled:hover:bg-red-900/75 disabled:opacity-50"><span className="block">BANKER</span><span className="block text-xs">${money(displayedBets.bankerDragon)}</span></button>
                </div>
              </div>
            </div>

            <button type="button" disabled={!canBet} onClick={(event) => placeBet("banker", event.shiftKey || removeMode)} className="baccarat-main-bet min-h-[112px] rounded-2xl border-2 border-red-300 bg-red-950/55 px-2 py-4 text-center text-red-50 shadow-[inset_0_0_24px_rgba(0,0,0,.2)] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[136px] sm:px-4">
              <div className="text-base font-black sm:text-2xl">BANKER</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] opacity-70 sm:text-[10px]">Pays 0.95 to 1</div>
              <div className="mt-2 text-xl font-black text-white sm:text-2xl">${money(displayedBets.banker)}</div>
            </button>
          </div>

          <div className="relative z-10 mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[8px] font-black uppercase tracking-[0.12em] text-emerald-100/55">
            <span>$5 minimum per position</span><span>$1,000 maximum</span><span>{shoe.length} cards remaining</span><span>5% Banker commission</span>
          </div>
        </div>
      </div>

      <div className="baccarat-control-bar sticky bottom-2 z-[100] mx-auto mt-3 max-w-6xl rounded-2xl border border-emerald-200/25 bg-[#073d2b]/95 p-2 shadow-[0_15px_36px_rgba(0,0,0,.55)] backdrop-blur sm:p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3">
          <div className="shrink-0">
            <div className="mb-1 hidden items-center justify-between text-[9px] font-black uppercase tracking-[0.12em] text-emerald-300/75 sm:flex"><span>Bet chips</span><span>Shift-click removes</span></div>
            <div className="flex gap-1.5 sm:gap-2">
              {CHIP_VALUES.map((value) => <Chip key={value} value={value} selected={selectedChip === value} disabled={!canBet} onClick={() => setSelectedChip(value)} />)}
            </div>
          </div>
          <button type="button" onClick={deal} disabled={!canDeal} className={`relative min-h-12 shrink-0 rounded-xl bg-amber-400 px-5 text-xs font-black text-black shadow-lg transition enabled:hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-800 disabled:text-amber-100/35 sm:min-h-14 sm:px-7 sm:text-sm ${learnMode && learnStep === "deal" ? "ring-4 ring-sky-200 shadow-[0_0_28px_rgba(125,211,252,.65)]" : ""}`}>DEAL</button>
          <div className="h-10 w-px shrink-0 bg-emerald-200/20" />
          <button type="button" disabled={!canBet} onClick={() => setRemoveMode((current) => !current)} className={`min-h-11 shrink-0 rounded-xl border px-3 text-[10px] font-black sm:hidden ${removeMode ? "border-amber-300 bg-amber-300 text-amber-950" : "border-emerald-300/35 bg-black/25 text-emerald-50"}`}>{removeMode ? "REMOVE" : "ADD"}</button>
          <button type="button" onClick={clearBets} disabled={!canBet || totalBet === 0} className="min-h-11 shrink-0 rounded-xl border border-emerald-300/35 bg-black/25 px-3 text-[10px] font-black text-emerald-50 disabled:opacity-35 sm:text-xs">CLEAR</button>
          <button type="button" onClick={repeatLastBet} disabled={!canBet} className="min-h-11 shrink-0 rounded-xl border border-emerald-300/35 bg-black/25 px-3 text-[10px] font-black text-emerald-50 disabled:opacity-35 sm:text-xs">REPEAT</button>
          <button type="button" onClick={resetSession} disabled={isAnimating} className="min-h-11 shrink-0 rounded-xl border border-emerald-300/35 bg-black/25 px-3 text-[10px] font-black text-emerald-50 disabled:opacity-35 sm:text-xs">RESET</button>
          <div className="shrink-0 rounded-xl border border-amber-300/40 bg-black/25 px-4 py-1.5 text-center"><div className="text-[8px] font-black uppercase tracking-[0.13em] text-amber-200/70">Total bet</div><div className="text-lg font-black text-white">${money(totalBet)}</div></div>
        </div>
      </div>

      <section className="mt-4 grid gap-4 lg:grid-cols-[320px_1fr]" aria-label="Baccarat scoreboards">
        <div className="rounded-2xl border border-emerald-800/80 bg-black/20 p-4">
          <div className="text-[9px] font-black uppercase tracking-[0.17em] text-emerald-400">Scoreboard</div>
          <div className="mt-1 flex items-end justify-between gap-3">
            <h2 className="text-lg font-black">Session results</h2>
            <span className="text-xs font-black text-emerald-100/55">{handsPlayed} hands</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {([
              ["Player", scoreboard.player, "border-sky-300/35 bg-sky-950/45 text-sky-100"],
              ["Banker", scoreboard.banker, "border-red-300/35 bg-red-950/45 text-red-100"],
              ["Tie", scoreboard.tie, "border-emerald-300/35 bg-emerald-950/45 text-emerald-100"],
            ] as const).map(([label, count, color]) => (
              <div key={label} className={`rounded-xl border px-2 py-3 ${color}`}>
                <div className="text-[9px] font-black uppercase tracking-[0.1em] opacity-70">{label}</div>
                <div className="mt-1 text-2xl font-black">{count}</div>
                <div className="text-[9px] font-bold opacity-60">{handsPlayed ? `${Math.round((count / handsPlayed) * 100)}%` : "0%"}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-emerald-900/75 bg-black/20 px-3 py-2 text-xs font-bold text-emerald-50/65">
            Current streak: <span className="font-black text-white">{scoreboard.leadingOutcome ? `${betLabel(scoreboard.leadingOutcome)} × ${scoreboard.streak}` : "Waiting for the first hand"}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-800/80 bg-black/20 p-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div><div className="text-[9px] font-black uppercase tracking-[0.17em] text-emerald-400">Bead Road</div><h2 className="mt-1 text-lg font-black">Results at a glance</h2></div>
            <div className="flex gap-3 text-[9px] font-black uppercase text-emerald-100/55"><span className="text-sky-200">● Player</span><span className="text-red-200">● Banker</span><span className="text-emerald-200">● Tie</span></div>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-emerald-50/50">Read each column from top to bottom, then continue to the right.</p>
            <Link href="/baccarat/scoreboards" className="text-xs font-black text-amber-200 hover:text-white">
              How to read the scoreboard →
            </Link>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-emerald-900/75 bg-[#e8dfca] p-2">
            <div className="grid w-max grid-flow-col grid-rows-6 gap-1" role="img" aria-label="Bead Road showing Baccarat hand results">
              {Array.from({ length: 72 }, (_, index) => {
                const entry = beadRoad[index];
                return (
                  <div key={entry?.id ?? `empty-${index}`} className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#b8aa8c]/55 bg-[#f7f0df]">
                    {entry ? <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[9px] font-black ${entry.outcome === "player" ? "border-blue-600 text-blue-700" : entry.outcome === "banker" ? "border-red-600 text-red-700" : "border-emerald-600 text-emerald-700"}`}>{entry.outcome === "player" ? "P" : entry.outcome === "banker" ? "B" : "T"}</span> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-emerald-800/80 bg-black/20 p-4">
          <div className="flex items-end justify-between gap-4"><div><div className="text-[9px] font-black uppercase tracking-[0.17em] text-emerald-400">Recent hands</div><h2 className="mt-1 text-lg font-black">Newest result first</h2></div><div className="text-[10px] font-black text-emerald-300/60">LAST 12: P {trends.player} • B {trends.banker} • T {trends.tie}</div></div>
          <div className="mt-3 space-y-2">
            {history.length === 0 ? <div className="rounded-xl border border-dashed border-emerald-800/70 px-4 py-6 text-center text-sm font-medium text-emerald-100/40">Complete a hand and it will appear here.</div> : history.slice(0, 12).map((entry) => (
              <details key={entry.id} className="group rounded-xl border border-emerald-900/75 bg-black/20 open:border-amber-300/45">
                <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 [&::-webkit-details-marker]:hidden">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black ${entry.outcome === "player" ? "border-sky-300/50 bg-sky-950/55 text-sky-100" : entry.outcome === "banker" ? "border-red-300/50 bg-red-950/55 text-red-100" : "border-amber-300/50 bg-amber-950/55 text-amber-100"}`}>{entry.outcome === "player" ? "P" : entry.outcome === "banker" ? "B" : "T"}</span>
                  <span><span className="block text-sm font-black">{betLabel(entry.outcome)} {entry.playerTotal}–{entry.bankerTotal}</span><span className="block text-[10px] font-bold text-emerald-100/45">${money(entry.wager)} wagered{entry.natural ? " • Natural" : ""}</span></span>
                  <span className={`text-sm font-black ${entry.net > 0 ? "text-emerald-300" : entry.net < 0 ? "text-red-300" : "text-amber-200"}`}>{signedMoney(entry.net)}</span>
                </summary>
                <div className="border-t border-emerald-900/60 px-4 py-3 text-xs font-medium leading-5 text-emerald-50/65">
                  <div>Player: {cardText(entry.playerCards)} = {entry.playerTotal}</div><div>Banker: {cardText(entry.bankerCards)} = {entry.bankerTotal}</div><div className="mt-2">Bets: Player ${money(entry.bets.player)} • Banker ${money(entry.bets.banker)} • Tie ${money(entry.bets.tie)} • Player Dragon ${money(entry.bets.playerDragon)} • Banker Dragon ${money(entry.bets.bankerDragon)}</div>
                  <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Wager result breakdown">
                    {entry.betResults.map((bet) => (
                      <span key={bet.type} className={`rounded-full border px-2.5 py-1 font-black ${bet.net > 0 ? "border-emerald-300/45 bg-emerald-950/45 text-emerald-200" : bet.net < 0 ? "border-red-300/45 bg-red-950/45 text-red-200" : "border-amber-200/45 bg-amber-950/35 text-amber-100"}`}>
                        {betLabel(bet.type)} {signedMoney(bet.net)}
                      </span>
                    ))}
                    <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-1 font-black text-white">Total {signedMoney(entry.net)}</span>
                  </div>
                  {entry.commission > 0 ? <div className="mt-2">Banker commission: ${money(entry.commission)}</div> : null}
                </div>
              </details>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-amber-500/45 bg-amber-950/10 p-4">
          <div className="text-[9px] font-black uppercase tracking-[0.17em] text-amber-300">First-table rules</div>
          <ul className="mt-3 space-y-3 text-sm font-medium leading-5 text-emerald-50/70">
            <li>• Closest to 9 wins. Only the final digit counts.</li><li>• Player and Banker are hand names, not seats.</li><li>• Drawing is automatic. There are no hit or stand decisions.</li><li>• Player and Banker wagers push when the result is Tie.</li><li>• Winning Banker wagers pay 0.95 to 1 after commission.</li><li>• Dragon Bonus is a separate Player or Banker wager based on a natural win or winning margin.</li>
          </ul>
          <Link href="/baccarat/how-to-play" className="mt-4 inline-flex text-sm font-black text-amber-200 hover:text-white">
            Read the Baccarat beginner guide →
          </Link>
          <Link href="/baccarat/scoreboards" className="mt-2 flex text-sm font-black text-amber-200 hover:text-white">
            Understand the scoreboard →
          </Link>
        </aside>
      </div>

      {!learnMode ? (
        <section className="mt-4 rounded-2xl border border-sky-800/60 bg-[#071b27] p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
          <div><div className="text-[9px] font-black uppercase tracking-[0.17em] text-sky-300">Baccarat Learn Mode</div><h2 className="mt-1 text-lg font-black">Let the table explain the draw</h2><p className="mt-1 text-sm font-medium leading-5 text-sky-50/60">Practice one guided Player bet, then see why each hand drew or stood.</p></div>
          <button type="button" onClick={toggleLearnMode} className="mt-3 shrink-0 rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-sky-950 sm:mt-0">Start Learn Mode</button>
        </section>
      ) : null}

      <footer className="mt-4 flex flex-col gap-3 rounded-2xl border border-emerald-900/80 bg-black/20 px-4 py-4 text-xs text-emerald-100/50 sm:flex-row sm:items-center sm:justify-between">
        <span>Practice credits only. No real-money wagering or cash prizes.</span>
        <div className="flex flex-wrap gap-2"><Link href="/#games" className="rounded-lg border border-emerald-700 px-3 py-2 font-black text-emerald-100">Back to Games</Link><Link href="/roulette" className="rounded-lg border border-emerald-700 px-3 py-2 font-black text-emerald-100">Play Roulette</Link><Link href="/blackjack" className="rounded-lg border border-amber-400 px-3 py-2 font-black text-amber-200">Play Blackjack</Link><Link href="/table" className="rounded-lg bg-amber-400 px-3 py-2 font-black text-black">Play Craps</Link></div>
      </footer>
    </>
  );
}
