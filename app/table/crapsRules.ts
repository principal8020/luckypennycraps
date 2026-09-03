export type NumberBets = Record<number, number>;

export type ComeOutResult = "win" | "lose" | "push" | "point" | "none";

export function casinoPayout(amount: number) {
  return Math.floor(amount);
}

export function getPassOddsMultiplier(number: number) {
  if (number === 4 || number === 10) return 3;
  if (number === 5 || number === 9) return 4;
  return 5;
}

export function calculatePassOddsProfit(number: number, bet: number) {
  if (number === 4 || number === 10) return casinoPayout(bet * 2);
  if (number === 5 || number === 9) return casinoPayout(bet * 1.5);
  return casinoPayout(bet * 1.2);
}

export function calculateLayOddsProfit(number: number, bet: number) {
  if (number === 4 || number === 10) return casinoPayout(bet / 2);
  if (number === 5 || number === 9) {
    return casinoPayout((bet * 2) / 3);
  }
  return casinoPayout((bet * 5) / 6);
}

export function calculateNumberLayNetProfit(number: number, bet: number) {
  let trueOddsProfit: number;

  if (number === 4 || number === 10) {
    trueOddsProfit = bet / 2;
  } else if (number === 5 || number === 9) {
    trueOddsProfit = (bet * 2) / 3;
  } else {
    trueOddsProfit = (bet * 5) / 6;
  }

  // Existing Lucky Penny convention: 5% commission on the amount won,
  // with the final result rounded down.
  return casinoPayout(trueOddsProfit * 0.95);
}

export function layOddsLabel(number: number) {
  if (number === 4 || number === 10) return "1:2";
  if (number === 5 || number === 9) return "2:3";
  return "5:6";
}

export function placeOddsLabel(number: number) {
  if (number === 4 || number === 10) return "9:5";
  if (number === 5 || number === 9) return "7:5";
  return "7:6";
}

export function passOddsLabel(number: number) {
  if (number === 4 || number === 10) return "2:1";
  if (number === 5 || number === 9) return "3:2";
  return "6:5";
}

export function getPlaceBetMax(number: number) {
  return number === 6 || number === 8 ? 1200 : 1000;
}

export function calculatePlaceProfit(number: number, bet: number) {
  if (number === 4 || number === 10) {
    return casinoPayout((bet * 9) / 5);
  }
  if (number === 5 || number === 9) {
    return casinoPayout((bet * 7) / 5);
  }
  return casinoPayout((bet * 7) / 6);
}

export function calculateFieldProfit(total: number, bet: number) {
  if (total === 2) return casinoPayout(bet * 2);
  if (total === 12) return casinoPayout(bet * 3);
  if ([3, 4, 9, 10, 11].includes(total)) return casinoPayout(bet);
  return 0;
}

export function calculateHardwayProfit(number: number, bet: number) {
  const multiplier = number === 4 || number === 10 ? 7 : 9;
  return casinoPayout(bet * multiplier);
}

export function calculateHopProfit(
  first: number,
  second: number,
  bet: number
) {
  return casinoPayout(bet * (first === second ? 30 : 15));
}

export function resolveWorldNetProfit(total: number, bet: number) {
  const unit = bet / 5;
  if (total === 2 || total === 12) {
    return casinoPayout(unit * 26);
  }
  if (total === 3 || total === 11) {
    return casinoPayout(unit * 11);
  }
  if (total === 7) {
    return 0;
  }
  return -1;
}

export function resolveCeNetProfit(total: number, bet: number) {
  const unit = bet / 2;
  if ([2, 3, 12].includes(total)) {
    return casinoPayout(unit * 6);
  }
  if (total === 11) {
    return casinoPayout(unit * 14);
  }
  return -1;
}

export function resolveHornHighNetProfit(
  total: number,
  bet: number,
  highNumber: number
) {
  const hornNumbers = [2, 3, 11, 12];

  if (!hornNumbers.includes(total)) {
    return -1;
  }

  const unit = bet / 5;
  const payoutMultiplier = total === 2 || total === 12 ? 30 : 15;

  if (total === highNumber) {
    return casinoPayout(unit * 2 * payoutMultiplier - unit * 3);
  }

  return casinoPayout(unit * payoutMultiplier - unit * 4);
}

export function properSixEightAmount(baseAmount: number) {
  return casinoPayout((baseAmount * 6) / 5);
}

export function buildInsideTarget(baseAmount: number): NumberBets {
  const sixEight = properSixEightAmount(baseAmount);
  return {
    4: 0,
    5: baseAmount,
    6: sixEight,
    8: sixEight,
    9: baseAmount,
    10: 0,
  };
}

export function buildAcrossTarget(baseAmount: number): NumberBets {
  const sixEight = properSixEightAmount(baseAmount);
  return {
    4: baseAmount,
    5: baseAmount,
    6: sixEight,
    8: sixEight,
    9: baseAmount,
    10: baseAmount,
  };
}

export function buildIronCrossTarget(baseAmount: number): NumberBets {
  const fiveAmount = baseAmount * 2;
  const sixEightAmount = properSixEightAmount(baseAmount * 2);

  return {
    4: 0,
    5: fiveAmount,
    6: sixEightAmount,
    8: sixEightAmount,
    9: 0,
    10: 0,
  };
}

export function calculateCappedAdd(
  selectedChip: number,
  currentBet: number,
  maxBet: number,
  bankroll: number
) {
  const remainingRoom = Math.max(0, maxBet - currentBet);
  return Math.max(0, Math.min(selectedChip, remainingRoom, bankroll));
}

export function resolvePassLineComeOut(total: number): ComeOutResult {
  if (total === 7 || total === 11) return "win";
  if (total === 2 || total === 3 || total === 12) return "lose";
  if ([4, 5, 6, 8, 9, 10].includes(total)) return "point";
  return "none";
}

export function resolveDontPassComeOut(total: number): ComeOutResult {
  if (total === 2 || total === 3) return "win";
  if (total === 7 || total === 11) return "lose";
  if (total === 12) return "push";
  if ([4, 5, 6, 8, 9, 10].includes(total)) return "point";
  return "none";
}

export type TraveledContractResolution = {
  result: "win" | "loss" | "none";
  bankrollReturn: number;
  flatProfit: number;
  oddsProfit: number;
  oddsReturned: number;
  amountLost: number;
};

export function resolveTraveledComeBet(
  rolledTotal: number,
  number: number,
  flatBet: number,
  oddsBet: number,
  oddsWorking: boolean
): TraveledContractResolution {
  if (flatBet <= 0) {
    return {
      result: "none",
      bankrollReturn: 0,
      flatProfit: 0,
      oddsProfit: 0,
      oddsReturned: 0,
      amountLost: 0,
    };
  }

  if (rolledTotal === 7) {
    const oddsReturned = oddsWorking ? 0 : oddsBet;
    return {
      result: "loss",
      bankrollReturn: oddsReturned,
      flatProfit: 0,
      oddsProfit: 0,
      oddsReturned,
      amountLost: flatBet + (oddsWorking ? oddsBet : 0),
    };
  }

  if (rolledTotal === number) {
    const oddsProfit =
      oddsWorking && oddsBet > 0
        ? calculatePassOddsProfit(number, oddsBet)
        : 0;
    const oddsReturned = oddsWorking ? 0 : oddsBet;

    return {
      result: "win",
      bankrollReturn:
        flatBet * 2 +
        oddsBet +
        oddsProfit,
      flatProfit: flatBet,
      oddsProfit,
      oddsReturned,
      amountLost: 0,
    };
  }

  return {
    result: "none",
    bankrollReturn: 0,
    flatProfit: 0,
    oddsProfit: 0,
    oddsReturned: 0,
    amountLost: 0,
  };
}

export function resolveTraveledDontComeBet(
  rolledTotal: number,
  number: number,
  flatBet: number,
  layOddsBet: number,
  oddsWorking: boolean
): TraveledContractResolution {
  if (flatBet <= 0) {
    return {
      result: "none",
      bankrollReturn: 0,
      flatProfit: 0,
      oddsProfit: 0,
      oddsReturned: 0,
      amountLost: 0,
    };
  }

  if (rolledTotal === 7) {
    const oddsProfit =
      oddsWorking && layOddsBet > 0
        ? calculateLayOddsProfit(number, layOddsBet)
        : 0;
    const oddsReturned = oddsWorking ? 0 : layOddsBet;

    return {
      result: "win",
      bankrollReturn:
        flatBet * 2 +
        layOddsBet +
        oddsProfit,
      flatProfit: flatBet,
      oddsProfit,
      oddsReturned,
      amountLost: 0,
    };
  }

  if (rolledTotal === number) {
    const oddsReturned = oddsWorking ? 0 : layOddsBet;
    return {
      result: "loss",
      bankrollReturn: oddsReturned,
      flatProfit: 0,
      oddsProfit: 0,
      oddsReturned,
      amountLost: flatBet + (oddsWorking ? layOddsBet : 0),
    };
  }

  return {
    result: "none",
    bankrollReturn: 0,
    flatProfit: 0,
    oddsProfit: 0,
    oddsReturned: 0,
    amountLost: 0,
  };
}

export type WorkingBetKind =
  | "place"
  | "lay"
  | "odds"
  | "contractFlat"
  | "oneRoll"
  | "hardway";

export function isBetWorking(
  kind: WorkingBetKind,
  betsWorking: boolean,
  pointOn: boolean,
  placeBetsWorkingOnComeOut: boolean
) {
  if (kind === "contractFlat" || kind === "oneRoll" || kind === "hardway") {
    return true;
  }

  if (kind === "place") {
    return betsWorking && (pointOn || placeBetsWorkingOnComeOut);
  }

  return betsWorking;
}

