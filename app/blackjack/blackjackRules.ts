export type BlackjackSuit = "♠" | "♥" | "♦" | "♣";
export type BlackjackRank =
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

export type BlackjackCard = {
  id: string;
  rank: BlackjackRank;
  suit: BlackjackSuit;
};

export type HandValue = {
  total: number;
  soft: boolean;
};

export type BlackjackOutcome = {
  result: "blackjack" | "win" | "loss" | "push";
  playerTotal: number;
  dealerTotal: number;
  profit: number;
  returnAmount: number;
};

const suits: BlackjackSuit[] = ["♠", "♥", "♦", "♣"];
const ranks: BlackjackRank[] = [
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

function rankValue(rank: BlackjackRank) {
  if (rank === "A") return 11;
  if (rank === "K" || rank === "Q" || rank === "J") return 10;
  return Number(rank);
}

export function buildShoe(deckCount = 6): BlackjackCard[] {
  const cards: BlackjackCard[] = [];

  for (let deck = 0; deck < deckCount; deck += 1) {
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({
          id: `${deck}-${suit}-${rank}`,
          rank,
          suit,
        });
      }
    }
  }

  return cards;
}

export function shuffleShoe(
  cards: BlackjackCard[],
  random: () => number = Math.random
): BlackjackCard[] {
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

export function getHandValue(cards: BlackjackCard[]): HandValue {
  let total = 0;
  let acesAsEleven = 0;

  for (const card of cards) {
    total += rankValue(card.rank);
    if (card.rank === "A") acesAsEleven += 1;
  }

  while (total > 21 && acesAsEleven > 0) {
    total -= 10;
    acesAsEleven -= 1;
  }

  return {
    total,
    soft: acesAsEleven > 0,
  };
}

export function isBlackjack(cards: BlackjackCard[]) {
  return cards.length === 2 && getHandValue(cards).total === 21;
}

export function dealerShouldHit(cards: BlackjackCard[]) {
  // Lucky Penny Blackjack uses S17: the dealer stands on every 17,
  // including soft 17.
  return getHandValue(cards).total < 17;
}

export function resolveBlackjackRound(
  playerCards: BlackjackCard[],
  dealerCards: BlackjackCard[],
  bet: number
): BlackjackOutcome {
  const playerTotal = getHandValue(playerCards).total;
  const dealerTotal = getHandValue(dealerCards).total;
  const playerBlackjack = isBlackjack(playerCards);
  const dealerBlackjack = isBlackjack(dealerCards);

  if (playerBlackjack && dealerBlackjack) {
    return {
      result: "push",
      playerTotal,
      dealerTotal,
      profit: 0,
      returnAmount: bet,
    };
  }

  if (playerBlackjack) {
    return {
      result: "blackjack",
      playerTotal,
      dealerTotal,
      profit: bet * 1.5,
      returnAmount: bet * 2.5,
    };
  }

  if (dealerBlackjack || playerTotal > 21) {
    return {
      result: "loss",
      playerTotal,
      dealerTotal,
      profit: -bet,
      returnAmount: 0,
    };
  }

  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    return {
      result: "win",
      playerTotal,
      dealerTotal,
      profit: bet,
      returnAmount: bet * 2,
    };
  }

  if (playerTotal < dealerTotal) {
    return {
      result: "loss",
      playerTotal,
      dealerTotal,
      profit: -bet,
      returnAmount: 0,
    };
  }

  return {
    result: "push",
    playerTotal,
    dealerTotal,
    profit: 0,
    returnAmount: bet,
  };
}
