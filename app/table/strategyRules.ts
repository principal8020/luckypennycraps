import {
  getPassOddsMultiplier,
  properSixEightAmount,
} from "./crapsRules";

export type NumberBets = Record<number, number>;

export type StrategyId =
  | "three-point-molly"
  | "three-point-dolly"
  | "iron-cross"
  | "place-6-8"
  | "inside"
  | "pass-max-odds"
  | "dont-pass-lay-odds";

export type StrategyTableState = {
  point: number | null;
  passLineBet: number;
  passOddsBet: number;
  dontPassBet: number;
  dontPassOddsBet: number;
  activeComeBet: number;
  comeBets: NumberBets;
  comeOdds: NumberBets;
  activeDontComeBet: number;
  dontComeBets: NumberBets;
  dontComeOdds: NumberBets;
  placeBets: NumberBets;
  fieldBet: number;
};

export type Recommendation = {
  action: string;
  why: string;
  status: string;
};

const pointNumbers = [4, 5, 6, 8, 9, 10];

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function activeNumbers(bets: NumberBets) {
  return pointNumbers.filter((number) => (bets[number] ?? 0) > 0);
}

function firstOddsShortfall(
  bets: NumberBets,
  odds: NumberBets,
  kind: "pass" | "dont"
) {
  for (const number of activeNumbers(bets)) {
    const flatBet = bets[number] ?? 0;
    const maxOdds =
      kind === "pass" ? flatBet * getPassOddsMultiplier(number) : flatBet * 6;
    const currentOdds = odds[number] ?? 0;

    if (currentOdds < maxOdds) {
      return {
        number,
        remaining: maxOdds - currentOdds,
      };
    }
  }

  return null;
}

export function recommendationFor(
  strategy: StrategyId,
  state: StrategyTableState,
  tableMinimum: number
): Recommendation {
  const {
    point,
    passLineBet,
    passOddsBet,
    dontPassBet,
    dontPassOddsBet,
    activeComeBet,
    comeBets,
    comeOdds,
    activeDontComeBet,
    dontComeBets,
    dontComeOdds,
    placeBets,
    fieldBet,
  } = state;

  const unit = tableMinimum;
  const comePoints = activeNumbers(comeBets);
  const dontComePoints = activeNumbers(dontComeBets);

  if (strategy === "three-point-molly") {
    if (point === null) {
      if (passLineBet <= 0) {
        return {
          action: `Bet $${money(unit)} on PASS LINE.`,
          why: "The Molly begins with the Pass Line on the come-out roll.",
          status: "Waiting to start point 1 of 3.",
        };
      }

      return {
        action: "ROLL to establish the Pass Line point.",
        why: "Once the point turns ON, the next step is to add maximum odds.",
        status: "Pass Line is ready for the come-out roll.",
      };
    }

    if (passLineBet <= 0) {
      return {
        action: "Wait for the next come-out roll, then begin with PASS LINE.",
        why: "A new Pass Line bet cannot be started after the point is already ON.",
        status: "You joined this hand after the Molly's starting step.",
      };
    }

    const maxPassOdds = passLineBet * getPassOddsMultiplier(point);
    if (passOddsBet < maxPassOdds) {
      return {
        action: `Add $${money(maxPassOdds - passOddsBet)} more PASS ODDS.`,
        why: "The Molly backs the Pass point with the table's maximum odds before adding more Come points.",
        status: `Point ${point}: $${money(passOddsBet)} of $${money(maxPassOdds)} Pass odds placed.`,
      };
    }

    const comeOddsShortfall = firstOddsShortfall(comeBets, comeOdds, "pass");
    if (comeOddsShortfall) {
      return {
        action: `Add $${money(comeOddsShortfall.remaining)} more COME ODDS on ${comeOddsShortfall.number}.`,
        why: "Each traveled Come bet should be backed with maximum odds before building the next point.",
        status: `${1 + comePoints.length} of 3 contract numbers established.`,
      };
    }

    const coverage = 1 + comePoints.length;
    if (coverage >= 3) {
      return {
        action: "HOLD and roll. Do not add a fourth contract number.",
        why: "The 3-Point Molly is fully built. When one contract number resolves, use a new Come bet to rebuild to three.",
        status: "3 of 3 contract numbers established with odds.",
      };
    }

    if (activeComeBet > 0) {
      return {
        action: "ROLL to resolve the COME bet currently in the Come box.",
        why: "If it travels to a box number, the next step will be to add odds behind it.",
        status: `${coverage} of 3 contract numbers established; one Come bet is traveling.`,
      };
    }

    return {
      action: `Bet $${money(unit)} in COME.`,
      why: "Add one Come bet at a time until the Pass point plus Come points total three contract numbers.",
      status: `${coverage} of 3 contract numbers established.`,
    };
  }

  if (strategy === "three-point-dolly") {
    if (point === null) {
      if (dontPassBet <= 0) {
        return {
          action: `Bet $${money(unit)} on DON'T PASS.`,
          why: "The Dolly begins on the dark side with Don't Pass during the come-out roll.",
          status: "Waiting to start point 1 of 3.",
        };
      }

      return {
        action: "ROLL to establish the Don't Pass point.",
        why: "After the point turns ON, the next step is to lay maximum odds.",
        status: "Don't Pass is ready for the come-out roll.",
      };
    }

    if (dontPassBet <= 0) {
      return {
        action: "Wait for the next come-out roll, then begin with DON'T PASS.",
        why: "A new Don't Pass bet cannot be started after the point is already ON.",
        status: "You joined this hand after the Dolly's starting step.",
      };
    }

    const maxDontPassOdds = dontPassBet * 6;
    if (dontPassOddsBet < maxDontPassOdds) {
      return {
        action: `Add $${money(maxDontPassOdds - dontPassOddsBet)} more DON'T PASS LAY ODDS.`,
        why: "The Dolly mirrors the Molly by backing the first contract number with the available lay odds.",
        status: `Point ${point}: $${money(dontPassOddsBet)} of $${money(maxDontPassOdds)} lay odds placed.`,
      };
    }

    const dontComeOddsShortfall = firstOddsShortfall(
      dontComeBets,
      dontComeOdds,
      "dont"
    );
    if (dontComeOddsShortfall) {
      return {
        action: `Add $${money(dontComeOddsShortfall.remaining)} more DON'T COME LAY ODDS behind ${dontComeOddsShortfall.number}.`,
        why: "Back each traveled Don't Come bet with the available lay odds before adding the next Don't Come bet.",
        status: `${1 + dontComePoints.length} of 3 dark-side contract numbers established.`,
      };
    }

    const coverage = 1 + dontComePoints.length;
    if (coverage >= 3) {
      return {
        action: "HOLD and roll. Do not add a fourth contract number.",
        why: "The 3-Point Dolly is fully built. When one contract number resolves, use a new Don't Come bet to rebuild to three.",
        status: "3 of 3 dark-side contract numbers established with lay odds.",
      };
    }

    if (activeDontComeBet > 0) {
      return {
        action: "ROLL to resolve the DON'T COME bet currently in the Don't Come box.",
        why: "If it travels behind a box number, the next step will be to add lay odds.",
        status: `${coverage} of 3 dark-side contract numbers established; one Don't Come bet is traveling.`,
      };
    }

    return {
      action: `Bet $${money(unit)} in DON'T COME.`,
      why: "Add one Don't Come bet at a time until Don't Pass plus Don't Come points total three contract numbers.",
      status: `${coverage} of 3 dark-side contract numbers established.`,
    };
  }

  if (strategy === "pass-max-odds") {
    if (point === null) {
      return passLineBet > 0
        ? {
            action: "ROLL the come-out roll.",
            why: "Your Pass Line bet is in place; wait for it to win, lose, or establish a point.",
            status: `Pass Line: $${money(passLineBet)}.`,
          }
        : {
            action: `Bet $${money(unit)} on PASS LINE.`,
            why: "This strategy begins with one Pass Line contract bet.",
            status: "Ready for a new come-out bet.",
          };
    }

    if (passLineBet <= 0) {
      return {
        action: "Wait for the next come-out roll.",
        why: "Pass Line cannot be added after the point is ON.",
        status: `Point ${point} is already established without a Pass Line bet.`,
      };
    }

    const maxOdds = passLineBet * getPassOddsMultiplier(point);
    if (passOddsBet < maxOdds) {
      return {
        action: `Add $${money(maxOdds - passOddsBet)} more PASS ODDS.`,
        why: "Fill the remaining 3x-4x-5x odds behind the Pass Line bet.",
        status: `$${money(passOddsBet)} of $${money(maxOdds)} Pass odds placed.`,
      };
    }

    return {
      action: "HOLD and roll until the Pass Line contract resolves.",
      why: "The Pass Line bet is fully backed with the table's maximum odds.",
      status: `Point ${point} with full odds.`,
    };
  }

  if (strategy === "dont-pass-lay-odds") {
    if (point === null) {
      return dontPassBet > 0
        ? {
            action: "ROLL the come-out roll.",
            why: "Your Don't Pass bet is in place; wait for it to resolve or establish a point.",
            status: `Don't Pass: $${money(dontPassBet)}.`,
          }
        : {
            action: `Bet $${money(unit)} on DON'T PASS.`,
            why: "This strategy begins with one Don't Pass contract bet.",
            status: "Ready for a new come-out bet.",
          };
    }

    if (dontPassBet <= 0) {
      return {
        action: "Wait for the next come-out roll.",
        why: "Don't Pass cannot be added after the point is ON.",
        status: `Point ${point} is already established without a Don't Pass bet.`,
      };
    }

    const maxOdds = dontPassBet * 6;
    if (dontPassOddsBet < maxOdds) {
      return {
        action: `Add $${money(maxOdds - dontPassOddsBet)} more DON'T PASS LAY ODDS.`,
        why: "Fill the remaining lay-odds allowance behind the Don't Pass bet.",
        status: `$${money(dontPassOddsBet)} of $${money(maxOdds)} lay odds placed.`,
      };
    }

    return {
      action: "HOLD and roll until the Don't Pass contract resolves.",
      why: "The Don't Pass bet is fully backed with the available lay odds.",
      status: `Point ${point} with full lay odds.`,
    };
  }

  if (point === null) {
    return {
      action: "ROLL until a box-number point is established.",
      why: "This place-bet strategy begins after the come-out roll so the box-number wagers can work with the point ON.",
      status: "Waiting for the puck to turn ON.",
    };
  }

  if (strategy === "place-6-8") {
    const target = properSixEightAmount(unit);

    for (const number of [6, 8]) {
      const current = placeBets[number] ?? 0;
      if (current < target) {
        return {
          action: `Add $${money(target - current)} to PLACE ${number}.`,
          why: `At a $${money(unit)} table minimum, Lucky Penny targets the proper $${money(target)} amount on both 6 and 8.`,
          status: `Place 6: $${money(placeBets[6] ?? 0)} • Place 8: $${money(placeBets[8] ?? 0)}.`,
        };
      }
    }

    return {
      action: "HOLD and roll with Place 6 and 8 working.",
      why: "Both target Place bets are established. Collecting or pressing beyond this point is a player choice, not part of v1 guidance.",
      status: `6 and 8 are both at the $${money(target)} target.`,
    };
  }

  if (strategy === "inside") {
    const targets: Record<number, number> = {
      5: unit,
      6: properSixEightAmount(unit),
      8: properSixEightAmount(unit),
      9: unit,
    };

    for (const number of [5, 6, 8, 9]) {
      const current = placeBets[number] ?? 0;
      if (current < targets[number]) {
        return {
          action: `Add $${money(targets[number] - current)} to PLACE ${number}.`,
          why: "Build the four inside numbers one at a time from the selected table minimum; 6 and 8 use the proper multiple of $6.",
          status: `Targets — 5: $${money(targets[5])}, 6: $${money(targets[6])}, 8: $${money(targets[8])}, 9: $${money(targets[9])}.`,
        };
      }
    }

    return {
      action: "HOLD and roll with all four inside numbers working.",
      why: "The initial Inside setup is complete.",
      status: "5, 6, 8 and 9 are at their target amounts.",
    };
  }

  const ironFive = unit * 2;
  const ironSixEight = properSixEightAmount(unit) * 2;
  const ironTargets: Record<number, number> = {
    5: ironFive,
    6: ironSixEight,
    8: ironSixEight,
  };

  for (const number of [5, 6, 8]) {
    const current = placeBets[number] ?? 0;
    if (current < ironTargets[number]) {
      return {
        action: `Add $${money(ironTargets[number] - current)} to PLACE ${number}.`,
        why: "Build the Place-bet side of the Iron Cross before completing the Field coverage.",
        status: `Target setup — 5: $${money(ironFive)}, 6/8: $${money(ironSixEight)}, Field: $${money(unit)}.`,
      };
    }
  }

  if (fieldBet < unit) {
    return {
      action: `Add $${money(unit - fieldBet)} to the FIELD.`,
      why: "The Field completes the Iron Cross coverage around Place 5, 6 and 8.",
      status: `Place 5/6/8 are set; Field currently $${money(fieldBet)} of $${money(unit)}.`,
    };
  }

  return {
    action: "HOLD and roll. Replace the Field if a non-Field result removes it.",
    why: "The initial Iron Cross setup is complete: Field plus Place 5, 6 and 8.",
    status: `5: $${money(placeBets[5] ?? 0)} • 6: $${money(placeBets[6] ?? 0)} • 8: $${money(placeBets[8] ?? 0)} • Field: $${money(fieldBet)}.`,
  };
}
