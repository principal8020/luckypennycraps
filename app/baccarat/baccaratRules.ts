export type BaccaratSuit = "♠" | "♥" | "♦" | "♣";
export type BaccaratRank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export type BaccaratCard = {
  id: string;
  rank: BaccaratRank;
  suit: BaccaratSuit;
};

export type BaccaratOutcome = "player" | "banker" | "tie";
export type BaccaratDragonSide = "player" | "banker";
export type BaccaratBetType = BaccaratOutcome | "playerDragon" | "bankerDragon";
export type BaccaratBets = Record<BaccaratBetType, number>;

export type BaccaratRound = {
  playerCards: BaccaratCard[];
  bankerCards: BaccaratCard[];
  playerInitialTotal: number;
  bankerInitialTotal: number;
  playerTotal: number;
  bankerTotal: number;
  outcome: BaccaratOutcome;
  natural: boolean;
  remainingShoe: BaccaratCard[];
};

export type BaccaratSettlement = {
  totalStake: number;
  grossReturn: number;
  net: number;
  commission: number;
  winningBets: BaccaratBetType[];
  pushedBets: BaccaratBetType[];
  dragonResults: BaccaratDragonResult[];
};

export type BaccaratDragonResult = {
  side: BaccaratDragonSide;
  result: "win" | "loss" | "push";
  odds: number | null;
  grossReturn: number;
};

const suits: BaccaratSuit[] = ["♠", "♥", "♦", "♣"];
const ranks: BaccaratRank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export function buildBaccaratShoe(deckCount = 8): BaccaratCard[] {
  const cards: BaccaratCard[] = [];

  for (let deck = 0; deck < deckCount; deck += 1) {
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({ id: `${deck}-${suit}-${rank}`, rank, suit });
      }
    }
  }

  return cards;
}

export function shuffleBaccaratShoe(
  cards: BaccaratCard[],
  random: () => number = Math.random
) {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function baccaratCardValue(card: BaccaratCard) {
  if (card.rank === "A") return 1;
  if (card.rank === "10" || card.rank === "J" || card.rank === "Q" || card.rank === "K") {
    return 0;
  }
  return Number(card.rank);
}

export function baccaratHandTotal(cards: BaccaratCard[]) {
  return cards.reduce((total, card) => total + baccaratCardValue(card), 0) % 10;
}

export function isBaccaratNatural(playerTotal: number, bankerTotal: number) {
  return playerTotal >= 8 || bankerTotal >= 8;
}

export function playerShouldDraw(total: number) {
  return total <= 5;
}

export function bankerShouldDraw(
  bankerTotal: number,
  playerThirdCard?: BaccaratCard
) {
  if (bankerTotal >= 7) return false;
  if (!playerThirdCard) return bankerTotal <= 5;

  const playerThirdValue = baccaratCardValue(playerThirdCard);

  if (bankerTotal <= 2) return true;
  if (bankerTotal === 3) return playerThirdValue !== 8;
  if (bankerTotal === 4) return playerThirdValue >= 2 && playerThirdValue <= 7;
  if (bankerTotal === 5) return playerThirdValue >= 4 && playerThirdValue <= 7;
  if (bankerTotal === 6) return playerThirdValue === 6 || playerThirdValue === 7;
  return false;
}

export function shouldReshuffleBaccaratShoe(cardsRemaining: number, reshuffleAt = 52) {
  return cardsRemaining < reshuffleAt;
}

function takeCard(cards: BaccaratCard[]) {
  const [card, ...remaining] = cards;
  if (!card) throw new Error("Baccarat shoe does not have enough cards");
  return { card, remaining };
}

export function dealBaccaratRound(shoe: BaccaratCard[]): BaccaratRound {
  if (shoe.length < 6) {
    throw new Error("Baccarat shoe needs at least six cards to start a round");
  }

  let remainingShoe = [...shoe];
  const playerCards: BaccaratCard[] = [];
  const bankerCards: BaccaratCard[] = [];

  let draw = takeCard(remainingShoe);
  playerCards.push(draw.card);
  remainingShoe = draw.remaining;

  draw = takeCard(remainingShoe);
  bankerCards.push(draw.card);
  remainingShoe = draw.remaining;

  draw = takeCard(remainingShoe);
  playerCards.push(draw.card);
  remainingShoe = draw.remaining;

  draw = takeCard(remainingShoe);
  bankerCards.push(draw.card);
  remainingShoe = draw.remaining;

  const playerInitialTotal = baccaratHandTotal(playerCards);
  const bankerInitialTotal = baccaratHandTotal(bankerCards);
  const natural = isBaccaratNatural(playerInitialTotal, bankerInitialTotal);

  if (!natural && playerShouldDraw(playerInitialTotal)) {
    draw = takeCard(remainingShoe);
    playerCards.push(draw.card);
    remainingShoe = draw.remaining;
  }

  if (
    !natural &&
    bankerShouldDraw(bankerInitialTotal, playerCards.length === 3 ? playerCards[2] : undefined)
  ) {
    draw = takeCard(remainingShoe);
    bankerCards.push(draw.card);
    remainingShoe = draw.remaining;
  }

  const playerTotal = baccaratHandTotal(playerCards);
  const bankerTotal = baccaratHandTotal(bankerCards);
  const outcome: BaccaratOutcome =
    playerTotal === bankerTotal
      ? "tie"
      : playerTotal > bankerTotal
        ? "player"
        : "banker";

  return {
    playerCards,
    bankerCards,
    playerInitialTotal,
    bankerInitialTotal,
    playerTotal,
    bankerTotal,
    outcome,
    natural,
    remainingShoe,
  };
}

const dragonBonusOddsByMargin: Record<number, number> = {
  4: 1,
  5: 2,
  6: 4,
  7: 6,
  8: 10,
  9: 30,
};

export function settleDragonBonus(
  side: BaccaratDragonSide,
  amount: number,
  round: BaccaratRound
): BaccaratDragonResult {
  if (amount <= 0) {
    return { side, result: "loss", odds: null, grossReturn: 0 };
  }

  if (round.natural && round.outcome === "tie") {
    return { side, result: "push", odds: null, grossReturn: amount };
  }

  if (round.outcome !== side) {
    return { side, result: "loss", odds: null, grossReturn: 0 };
  }

  if (round.natural) {
    return { side, result: "win", odds: 1, grossReturn: amount * 2 };
  }

  const margin = Math.abs(round.playerTotal - round.bankerTotal);
  const odds = dragonBonusOddsByMargin[margin];
  if (!odds) {
    return { side, result: "loss", odds: null, grossReturn: 0 };
  }

  return {
    side,
    result: "win",
    odds,
    grossReturn: amount * (odds + 1),
  };
}

export function settleBaccaratBets(
  bets: BaccaratBets,
  outcome: BaccaratOutcome,
  round?: BaccaratRound
): BaccaratSettlement {
  const playerDragon = bets.playerDragon ?? 0;
  const bankerDragon = bets.bankerDragon ?? 0;
  const totalStake = bets.player + bets.banker + bets.tie + playerDragon + bankerDragon;
  let grossReturn = 0;
  let commission = 0;
  const winningBets: BaccaratBetType[] = [];
  const pushedBets: BaccaratBetType[] = [];

  if (outcome === "player") {
    grossReturn += bets.player * 2;
    if (bets.player > 0) winningBets.push("player");
  } else if (outcome === "banker") {
    commission = bets.banker * 0.05;
    grossReturn += bets.banker * 1.95;
    if (bets.banker > 0) winningBets.push("banker");
  } else {
    grossReturn += bets.tie * 9;
    if (bets.tie > 0) winningBets.push("tie");
    grossReturn += bets.player + bets.banker;
    if (bets.player > 0) pushedBets.push("player");
    if (bets.banker > 0) pushedBets.push("banker");
  }

  const dragonResults: BaccaratDragonResult[] = [];
  if (round) {
    const playerResult = settleDragonBonus("player", playerDragon, round);
    const bankerResult = settleDragonBonus("banker", bankerDragon, round);
    dragonResults.push(playerResult, bankerResult);

    for (const dragonResult of dragonResults) {
      const betType: BaccaratBetType =
        dragonResult.side === "player" ? "playerDragon" : "bankerDragon";
      grossReturn += dragonResult.grossReturn;
      if (dragonResult.result === "win") winningBets.push(betType);
      if (dragonResult.result === "push") pushedBets.push(betType);
    }
  }

  return {
    totalStake,
    grossReturn,
    net: grossReturn - totalStake,
    commission,
    winningBets,
    pushedBets,
    dragonResults,
  };
}
