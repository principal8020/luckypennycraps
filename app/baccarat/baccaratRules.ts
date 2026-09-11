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

export type BaccaratBetType = "player" | "banker" | "tie";
export type BaccaratOutcome = BaccaratBetType;
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
  winningBet: BaccaratBetType | null;
  pushedBets: BaccaratBetType[];
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

export function settleBaccaratBets(
  bets: BaccaratBets,
  outcome: BaccaratOutcome
): BaccaratSettlement {
  const totalStake = bets.player + bets.banker + bets.tie;
  let grossReturn = 0;
  let commission = 0;
  const pushedBets: BaccaratBetType[] = [];

  if (outcome === "player") {
    grossReturn += bets.player * 2;
  } else if (outcome === "banker") {
    commission = bets.banker * 0.05;
    grossReturn += bets.banker * 1.95;
  } else {
    grossReturn += bets.tie * 9;
    grossReturn += bets.player + bets.banker;
    if (bets.player > 0) pushedBets.push("player");
    if (bets.banker > 0) pushedBets.push("banker");
  }

  return {
    totalStake,
    grossReturn,
    net: grossReturn - totalStake,
    commission,
    winningBet: bets[outcome] > 0 ? outcome : null,
    pushedBets,
  };
}

