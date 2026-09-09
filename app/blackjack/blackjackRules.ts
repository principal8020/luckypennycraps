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

export type BasicStrategyAction = "hit" | "stand" | "double" | "split";

export type BasicStrategyRecommendation = {
  action: BasicStrategyAction;
  explanation: string;
};

type BasicStrategyOptions = {
  canDouble?: boolean;
  canSplit?: boolean;
};

type ResolveBlackjackOptions = {
  blackjackEligible?: boolean;
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

export function shouldReshuffleBeforeDeal(
  cardsRemaining: number,
  reshuffleAt = 52
) {
  return cardsRemaining < reshuffleAt;
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

export function canSplitPair(cards: BlackjackCard[]) {
  return (
    cards.length === 2 &&
    rankValue(cards[0].rank) === rankValue(cards[1].rank)
  );
}

export function dealerShouldHit(cards: BlackjackCard[]) {
  // Lucky Penny Blackjack uses S17: the dealer stands on every 17,
  // including soft 17.
  return getHandValue(cards).total < 17;
}

export function getBasicStrategyRecommendation(
  playerCards: BlackjackCard[],
  dealerUpCard: BlackjackCard,
  options: BasicStrategyOptions = {}
): BasicStrategyRecommendation {
  const { canDouble = playerCards.length === 2, canSplit = false } = options;
  const dealer = rankValue(dealerUpCard.rank);
  const { total, soft } = getHandValue(playerCards);
  const pairValue =
    playerCards.length === 2 &&
    rankValue(playerCards[0].rank) === rankValue(playerCards[1].rank)
      ? rankValue(playerCards[0].rank)
      : null;

  if (canSplit && pairValue !== null) {
    const split =
      pairValue === 11 ||
      pairValue === 8 ||
      (pairValue === 9 && [2, 3, 4, 5, 6, 8, 9].includes(dealer)) ||
      (pairValue === 7 && dealer >= 2 && dealer <= 7) ||
      (pairValue === 6 && dealer >= 2 && dealer <= 6) ||
      (pairValue === 4 && (dealer === 5 || dealer === 6)) ||
      ((pairValue === 2 || pairValue === 3) && dealer >= 2 && dealer <= 7);

    if (split) {
      return {
        action: "split",
        explanation: `Split this pair to create two stronger opportunities against the dealer's ${dealerUpCard.rank}.`,
      };
    }
  }

  if (soft) {
    if (total >= 19) {
      return {
        action: "stand",
        explanation: `Soft ${total} is already a strong hand, so protect it by standing.`,
      };
    }

    if (total === 18) {
      if (canDouble && dealer >= 3 && dealer <= 6) {
        return {
          action: "double",
          explanation: `Soft 18 is favored enough against the dealer's ${dealerUpCard.rank} to double for one card.`,
        };
      }

      if (dealer >= 2 && dealer <= 8) {
        return {
          action: "stand",
          explanation: `Soft 18 is strong enough to stand against the dealer's ${dealerUpCard.rank}.`,
        };
      }

      return {
        action: "hit",
        explanation: `The dealer's ${dealerUpCard.rank} is too strong to stop on soft 18.`,
      };
    }

    const softDouble =
      (total === 17 && dealer >= 3 && dealer <= 6) ||
      ((total === 15 || total === 16) && dealer >= 4 && dealer <= 6) ||
      ((total === 13 || total === 14) && dealer >= 5 && dealer <= 6);

    if (canDouble && softDouble) {
      return {
        action: "double",
        explanation: `This soft ${total} is a good doubling opportunity against the dealer's ${dealerUpCard.rank}.`,
      };
    }

    return {
      action: "hit",
      explanation: `The ace protects this soft ${total} from busting on the next card, so keep drawing.`,
    };
  }

  if (total >= 17) {
    return {
      action: "stand",
      explanation: `${total} is strong enough to stand; hitting creates too much bust risk.`,
    };
  }

  if (total >= 13 && total <= 16 && dealer >= 2 && dealer <= 6) {
    return {
      action: "stand",
      explanation: `The dealer's ${dealerUpCard.rank} is a bust card, so avoid risking your ${total}.`,
    };
  }

  if (total === 12 && dealer >= 4 && dealer <= 6) {
    return {
      action: "stand",
      explanation: `Stand on 12 because the dealer's ${dealerUpCard.rank} has enough bust risk.`,
    };
  }

  const hardDouble =
    (total === 11 && dealer >= 2 && dealer <= 10) ||
    (total === 10 && dealer >= 2 && dealer <= 9) ||
    (total === 9 && dealer >= 3 && dealer <= 6);

  if (canDouble && hardDouble) {
    return {
      action: "double",
      explanation: `Your ${total} is a strong doubling hand against the dealer's ${dealerUpCard.rank}.`,
    };
  }

  return {
    action: "hit",
    explanation:
      total <= 11
        ? `You cannot bust with one more card on ${total}, so keep drawing.`
        : `The dealer's ${dealerUpCard.rank} is too strong to stand on ${total}.`,
  };
}

export function resolveBlackjackRound(
  playerCards: BlackjackCard[],
  dealerCards: BlackjackCard[],
  bet: number,
  options: ResolveBlackjackOptions = {}
): BlackjackOutcome {
  const playerTotal = getHandValue(playerCards).total;
  const dealerTotal = getHandValue(dealerCards).total;
  const playerBlackjack =
    options.blackjackEligible !== false && isBlackjack(playerCards);
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
