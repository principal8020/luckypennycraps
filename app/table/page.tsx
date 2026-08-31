"use client";

import Link from "next/link";
import { useState } from "react";

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const pointNumbers = [4, 5, 6, 8, 9, 10];
const chipValues = [1, 5, 10, 25, 100, 500];

type NumberBets = {
  [key: number]: number;
};

function emptyNumberBets(): NumberBets {
  return {
    4: 0,
    5: 0,
    6: 0,
    8: 0,
    9: 0,
    10: 0,
  };
}

function money(amount: number) {
  return Number.isInteger(amount)
    ? amount.toLocaleString()
    : amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

export default function TablePage() {
  const [dieOne, setDieOne] = useState(1);
  const [dieTwo, setDieTwo] = useState(1);
  const [rollTotal, setRollTotal] = useState(2);

  const [point, setPoint] = useState<number | null>(null);
  const [message, setMessage] = useState("Come-out roll");

  const [bankroll, setBankroll] = useState(5000);
  const [selectedChip, setSelectedChip] = useState(25);
  const [removeMode, setRemoveMode] = useState(false);

  const [placeBetsWorking, setPlaceBetsWorking] = useState(false);

  const [testingMode, setTestingMode] = useState(false);
  const [forcedTotal, setForcedTotal] = useState(7);

  const [passLineBet, setPassLineBet] = useState(0);
  const [passOddsBet, setPassOddsBet] = useState(0);

  const [dontPassBet, setDontPassBet] = useState(0);
  const [dontPassOddsBet, setDontPassOddsBet] = useState(0);

  const [fieldBet, setFieldBet] = useState(0);

  const [activeComeBet, setActiveComeBet] = useState(0);
  const [comeBets, setComeBets] =
    useState<NumberBets>(emptyNumberBets());

  const [activeDontComeBet, setActiveDontComeBet] = useState(0);
  const [dontComeBets, setDontComeBets] =
    useState<NumberBets>(emptyNumberBets());

  const [placeBets, setPlaceBets] =
    useState<NumberBets>(emptyNumberBets());

  /*
    GENERAL HELPERS
  */

  function resetTable() {
    setDieOne(1);
    setDieTwo(1);
    setRollTotal(2);

    setPoint(null);
    setMessage("Table reset. Come-out roll.");

    setBankroll(5000);
    setSelectedChip(25);
    setRemoveMode(false);

    setPlaceBetsWorking(false);

    setPassLineBet(0);
    setPassOddsBet(0);

    setDontPassBet(0);
    setDontPassOddsBet(0);

    setFieldBet(0);

    setActiveComeBet(0);
    setComeBets(emptyNumberBets());

    setActiveDontComeBet(0);
    setDontComeBets(emptyNumberBets());

    setPlaceBets(emptyNumberBets());
  }

  function makeDiceForTotal(total: number) {
    const minimumFirst = Math.max(1, total - 6);
    const maximumFirst = Math.min(6, total - 1);

    const possibleFirstDice = [];

    for (
      let value = minimumFirst;
      value <= maximumFirst;
      value++
    ) {
      possibleFirstDice.push(value);
    }

    const first =
      possibleFirstDice[
        Math.floor(Math.random() * possibleFirstDice.length)
      ];

    const second = total - first;

    return [first, second];
  }

  /*
    PASS LINE
  */

  function getPassOddsMultiplier(currentPoint: number) {
    if (currentPoint === 4 || currentPoint === 10) return 3;
    if (currentPoint === 5 || currentPoint === 9) return 4;
    return 5;
  }

  function getMaxPassOdds() {
    if (point === null) return 0;

    return passLineBet * getPassOddsMultiplier(point);
  }

  function calculatePassOddsProfit(
    currentPoint: number,
    bet: number
  ) {
    if (currentPoint === 4 || currentPoint === 10) {
      return bet * 2;
    }

    if (currentPoint === 5 || currentPoint === 9) {
      return bet * 1.5;
    }

    return bet * 1.2;
  }

  function handlePassLineBet() {
    if (removeMode) {
      if (passLineBet === 0) {
        setMessage("There is no Pass Line bet to remove.");
        return;
      }

      if (point !== null) {
        setMessage(
          "Pass Line is a contract bet and cannot be removed after the point is established."
        );
        return;
      }

      if (selectedChip > passLineBet) {
        setMessage(
          `You only have $${money(
            passLineBet
          )} on the Pass Line.`
        );
        return;
      }

      setPassLineBet(
        (currentBet) => currentBet - selectedChip
      );

      setBankroll(
        (currentBankroll) =>
          currentBankroll + selectedChip
      );

      setMessage(
        `Removed $${selectedChip} from the Pass Line.`
      );

      return;
    }

    if (point !== null) {
      setMessage(
        "Pass Line bets can only be added while the point is OFF."
      );
      return;
    }

    if (dontPassBet > 0) {
      setMessage(
        "Remove your Don't Pass bet before betting Pass Line."
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setPassLineBet(
      (currentBet) => currentBet + selectedChip
    );

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    setMessage(
      `Added $${selectedChip} to the Pass Line.`
    );
  }

  function handlePassOdds() {
    if (point === null || passLineBet === 0) {
      setMessage(
        "Pass Line odds require a Pass Line bet and an established point."
      );
      return;
    }

    if (removeMode) {
      if (passOddsBet === 0) {
        setMessage("There are no Pass Line odds to remove.");
        return;
      }

      if (selectedChip > passOddsBet) {
        setMessage(
          `You only have $${money(
            passOddsBet
          )} in Pass Line odds.`
        );
        return;
      }

      setPassOddsBet(
        (currentBet) => currentBet - selectedChip
      );

      setBankroll(
        (currentBankroll) =>
          currentBankroll + selectedChip
      );

      setMessage(
        `Removed $${selectedChip} from Pass Line odds.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    const maxOdds = getMaxPassOdds();
    const newTotal = passOddsBet + selectedChip;

    if (newTotal > maxOdds) {
      setMessage(
        `Maximum Pass Line odds for point ${point} is $${money(
          maxOdds
        )}.`
      );
      return;
    }

    setPassOddsBet(newTotal);

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    setMessage(
      `Pass Line odds are now $${money(newTotal)}.`
    );
  }

  /*
    DON'T PASS
  */

  function getMaxDontPassLayOdds() {
    if (point === null) return 0;

    // On a 3x-4x-5x table, the dark side commonly
    // allows laying 6x the flat bet.
    return dontPassBet * 6;
  }

  function calculateDontPassOddsProfit(
    currentPoint: number,
    bet: number
  ) {
    if (currentPoint === 4 || currentPoint === 10) {
      return bet / 2;
    }

    if (currentPoint === 5 || currentPoint === 9) {
      return (bet * 2) / 3;
    }

    return (bet * 5) / 6;
  }

  function getDontPassLayIncrement(currentPoint: number) {
    if (currentPoint === 4 || currentPoint === 10) return 2;
    if (currentPoint === 5 || currentPoint === 9) return 3;
    return 6;
  }

  function handleDontPassBet() {
    if (removeMode) {
      if (dontPassBet === 0) {
        setMessage("There is no Don't Pass bet to remove.");
        return;
      }

      if (selectedChip > dontPassBet) {
        setMessage(
          `You only have $${money(
            dontPassBet
          )} on Don't Pass.`
        );
        return;
      }

      const newFlatBet = dontPassBet - selectedChip;

      if (
        dontPassOddsBet > 0 &&
        dontPassOddsBet > newFlatBet * 6
      ) {
        setMessage(
          "Reduce your Don't Pass lay odds before reducing the flat bet."
        );
        return;
      }

      setDontPassBet(newFlatBet);

      setBankroll(
        (currentBankroll) =>
          currentBankroll + selectedChip
      );

      setMessage(
        `Removed $${selectedChip} from Don't Pass.`
      );

      return;
    }

    if (point !== null) {
      setMessage(
        "New Don't Pass bets can only be added while the point is OFF."
      );
      return;
    }

    if (passLineBet > 0) {
      setMessage(
        "Remove your Pass Line bet before betting Don't Pass."
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setDontPassBet(
      (currentBet) => currentBet + selectedChip
    );

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    setMessage(
      `Added $${selectedChip} to Don't Pass.`
    );
  }

  function handleDontPassOdds() {
    if (point === null || dontPassBet === 0) {
      setMessage(
        "Don't Pass lay odds require a Don't Pass bet and an established point."
      );
      return;
    }

    if (removeMode) {
      if (dontPassOddsBet === 0) {
        setMessage("There are no Don't Pass lay odds to remove.");
        return;
      }

      if (selectedChip > dontPassOddsBet) {
        setMessage(
          `You only have $${money(
            dontPassOddsBet
          )} in lay odds.`
        );
        return;
      }

      setDontPassOddsBet(
        (currentBet) => currentBet - selectedChip
      );

      setBankroll(
        (currentBankroll) =>
          currentBankroll + selectedChip
      );

      setMessage(
        `Removed $${selectedChip} from Don't Pass lay odds.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    const maxLay = getMaxDontPassLayOdds();
    const newTotal = dontPassOddsBet + selectedChip;

    if (newTotal > maxLay) {
      setMessage(
        `Maximum lay odds is $${money(maxLay)}.`
      );
      return;
    }

    const increment =
      getDontPassLayIncrement(point);

    setDontPassOddsBet(newTotal);

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    if (newTotal % increment !== 0) {
      setMessage(
        `Lay odds are $${money(
          newTotal
        )}. For point ${point}, build the wager to a multiple of $${increment}.`
      );
    } else {
      setMessage(
        `Don't Pass lay odds are now $${money(
          newTotal
        )}.`
      );
    }
  }

  /*
    PLACE BETS
  */

  function placeNumberBet(number: number) {
    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    const newTotal =
      placeBets[number] + selectedChip;

    setPlaceBets((currentBets) => ({
      ...currentBets,
      [number]: newTotal,
    }));

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    if (
      (number === 6 || number === 8) &&
      newTotal % 6 !== 0
    ) {
      setMessage(
        `Place ${number} is $${newTotal}. Add chips until it is a multiple of $6.`
      );
    } else if (
      number !== 6 &&
      number !== 8 &&
      newTotal % 5 !== 0
    ) {
      setMessage(
        `Place ${number} is $${newTotal}. Add chips until it is a multiple of $5.`
      );
    } else {
      setMessage(
        `Place ${number} is now $${newTotal}.`
      );
    }
  }

  function removeNumberBet(number: number) {
    const currentBet = placeBets[number];

    if (currentBet === 0) {
      setMessage(
        `There is no Place ${number} bet to remove.`
      );
      return;
    }

    if (selectedChip > currentBet) {
      setMessage(
        `You only have $${currentBet} on Place ${number}.`
      );
      return;
    }

    setPlaceBets((currentBets) => ({
      ...currentBets,
      [number]:
        currentBets[number] - selectedChip,
    }));

    setBankroll(
      (currentBankroll) =>
        currentBankroll + selectedChip
    );

    setMessage(
      `Removed $${selectedChip} from Place ${number}.`
    );
  }

  function calculatePlaceProfit(
    number: number,
    bet: number
  ) {
    if (number === 4 || number === 10) {
      return (bet / 5) * 9;
    }

    if (number === 5 || number === 9) {
      return (bet / 5) * 7;
    }

    return (bet / 6) * 7;
  }

  function resolvePlaceBet(total: number) {
    const activeBet = placeBets[total];

    if (!activeBet) return null;

    const profit =
      calculatePlaceProfit(total, activeBet);

    setBankroll(
      (currentBankroll) =>
        currentBankroll + profit
    );

    return `Place ${total} wins $${money(
      profit
    )}. Bet stays up.`;
  }

  function clearAllPlaceBets() {
    const lost = Object.values(placeBets).reduce(
      (sum, bet) => sum + bet,
      0
    );

    setPlaceBets(emptyNumberBets());

    return lost;
  }

  /*
    FIELD
  */

  function handleFieldBet() {
    if (removeMode) {
      if (fieldBet === 0) {
        setMessage("There is no Field bet to remove.");
        return;
      }

      if (selectedChip > fieldBet) {
        setMessage(
          `You only have $${fieldBet} on the Field.`
        );
        return;
      }

      setFieldBet(
        (currentBet) => currentBet - selectedChip
      );

      setBankroll(
        (currentBankroll) =>
          currentBankroll + selectedChip
      );

      setMessage(
        `Removed $${selectedChip} from the Field.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setFieldBet(
      (currentBet) => currentBet + selectedChip
    );

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    setMessage(
      `Added $${selectedChip} to the Field.`
    );
  }

  function resolveFieldBet(total: number) {
    if (fieldBet === 0) return null;

    if (total === 2) {
      const profit = fieldBet * 2;

      setBankroll(
        (currentBankroll) =>
          currentBankroll + fieldBet + profit
      );

      setFieldBet(0);

      return `Field wins on 2. Profit $${money(
        profit
      )}.`;
    }

    if (total === 12) {
      const profit = fieldBet * 3;

      setBankroll(
        (currentBankroll) =>
          currentBankroll + fieldBet + profit
      );

      setFieldBet(0);

      return `Field wins on 12. Profit $${money(
        profit
      )}.`;
    }

    if ([3, 4, 9, 10, 11].includes(total)) {
      const profit = fieldBet;

      setBankroll(
        (currentBankroll) =>
          currentBankroll + fieldBet + profit
      );

      setFieldBet(0);

      return `Field wins $${money(profit)}.`;
    }

    const lost = fieldBet;

    setFieldBet(0);

    return `Field loses $${money(lost)}.`;
  }

  /*
    COME
  */

  function handleComeBet() {
    if (point === null) {
      setMessage(
        "Come bets are available after the table point is established."
      );
      return;
    }

    if (removeMode) {
      if (activeComeBet === 0) {
        setMessage(
          "There is no active Come bet to remove."
        );
        return;
      }

      if (selectedChip > activeComeBet) {
        setMessage(
          `You only have $${money(
            activeComeBet
          )} in the Come box.`
        );
        return;
      }

      setActiveComeBet(
        (currentBet) => currentBet - selectedChip
      );

      setBankroll(
        (currentBankroll) =>
          currentBankroll + selectedChip
      );

      setMessage(
        `Removed $${selectedChip} from the Come box.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setActiveComeBet(
      (currentBet) => currentBet + selectedChip
    );

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    setMessage(
      `Added $${selectedChip} to COME.`
    );
  }

  function resolveComeBets(total: number) {
    const messages: string[] = [];
    const nextComeBets = { ...comeBets };

    /*
      EXISTING COME POINTS
    */

    if (total === 7) {
      const lost = Object.values(nextComeBets).reduce(
        (sum, bet) => sum + bet,
        0
      );

      if (lost > 0) {
        messages.push(
          `Come point bets lose $${money(lost)}.`
        );
      }

      for (const number of pointNumbers) {
        nextComeBets[number] = 0;
      }
    } else if (
      pointNumbers.includes(total) &&
      nextComeBets[total] > 0
    ) {
      const winningBet = nextComeBets[total];

      setBankroll(
        (currentBankroll) =>
          currentBankroll + winningBet * 2
      );

      messages.push(
        `Come ${total} wins $${money(
          winningBet
        )}.`
      );

      nextComeBets[total] = 0;
    }

    /*
      ACTIVE COME BET
    */

    if (activeComeBet > 0) {
      const bet = activeComeBet;

      if (total === 7 || total === 11) {
        setBankroll(
          (currentBankroll) =>
            currentBankroll + bet * 2
        );

        messages.push(
          `Come wins $${money(bet)}.`
        );

        setActiveComeBet(0);
      } else if (
        total === 2 ||
        total === 3 ||
        total === 12
      ) {
        messages.push(
          `Come loses $${money(bet)}.`
        );

        setActiveComeBet(0);
      } else if (pointNumbers.includes(total)) {
        nextComeBets[total] += bet;

        messages.push(
          `$${money(bet)} Come bet moves to ${total}.`
        );

        setActiveComeBet(0);
      }
    }

    setComeBets(nextComeBets);

    return messages;
  }

  /*
    DON'T COME
  */

  function handleDontComeBet() {
    if (point === null) {
      setMessage(
        "Don't Come bets are available after the table point is established."
      );
      return;
    }

    if (removeMode) {
      if (activeDontComeBet === 0) {
        setMessage(
          "There is no active Don't Come bet to remove."
        );
        return;
      }

      if (selectedChip > activeDontComeBet) {
        setMessage(
          `You only have $${money(
            activeDontComeBet
          )} in Don't Come.`
        );
        return;
      }

      setActiveDontComeBet(
        (currentBet) =>
          currentBet - selectedChip
      );

      setBankroll(
        (currentBankroll) =>
          currentBankroll + selectedChip
      );

      setMessage(
        `Removed $${selectedChip} from Don't Come.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setActiveDontComeBet(
      (currentBet) => currentBet + selectedChip
    );

    setBankroll(
      (currentBankroll) =>
        currentBankroll - selectedChip
    );

    setMessage(
      `Added $${selectedChip} to DON'T COME.`
    );
  }

  function resolveDontComeBets(total: number) {
    const messages: string[] = [];
    const nextDontComeBets = {
      ...dontComeBets,
    };

    /*
      EXISTING DON'T COME POINTS
    */

    if (total === 7) {
      let totalReturned = 0;
      let totalProfit = 0;

      for (const number of pointNumbers) {
        const bet = nextDontComeBets[number];

        if (bet > 0) {
          totalReturned += bet * 2;
          totalProfit += bet;
          nextDontComeBets[number] = 0;
        }
      }

      if (totalReturned > 0) {
        setBankroll(
          (currentBankroll) =>
            currentBankroll + totalReturned
        );

        messages.push(
          `Don't Come point bets win $${money(
            totalProfit
          )}.`
        );
      }
    } else if (
      pointNumbers.includes(total) &&
      nextDontComeBets[total] > 0
    ) {
      const lost = nextDontComeBets[total];

      messages.push(
        `Don't Come ${total} loses $${money(
          lost
        )}.`
      );

      nextDontComeBets[total] = 0;
    }

    /*
      ACTIVE DON'T COME BET
    */

    if (activeDontComeBet > 0) {
      const bet = activeDontComeBet;

      if (total === 2 || total === 3) {
        setBankroll(
          (currentBankroll) =>
            currentBankroll + bet * 2
        );

        messages.push(
          `Don't Come wins $${money(bet)}.`
        );

        setActiveDontComeBet(0);
      } else if (total === 7 || total === 11) {
        messages.push(
          `Don't Come loses $${money(bet)}.`
        );

        setActiveDontComeBet(0);
      } else if (total === 12) {
        setBankroll(
          (currentBankroll) =>
            currentBankroll + bet
        );

        messages.push(
          `Don't Come bars 12. $${money(
            bet
          )} returned.`
        );

        setActiveDontComeBet(0);
      } else if (pointNumbers.includes(total)) {
        nextDontComeBets[total] += bet;

        messages.push(
          `$${money(
            bet
          )} Don't Come bet moves behind ${total}.`
        );

        setActiveDontComeBet(0);
      }
    }

    setDontComeBets(nextDontComeBets);

    return messages;
  }

  /*
    ROLL
  */

  function rollDice() {
    const invalidPlaceBet =
      pointNumbers.find((number) => {
        const bet = placeBets[number];

        if (bet === 0) return false;

        if (number === 6 || number === 8) {
          return bet % 6 !== 0;
        }

        return bet % 5 !== 0;
      });

    if (invalidPlaceBet !== undefined) {
      setMessage(
        `Fix your Place ${invalidPlaceBet} bet before rolling.`
      );
      return;
    }

    if (
      point !== null &&
      dontPassOddsBet > 0
    ) {
      const requiredIncrement =
        getDontPassLayIncrement(point);

      if (
        dontPassOddsBet % requiredIncrement !==
        0
      ) {
        setMessage(
          `Fix your Don't Pass lay odds. For point ${point}, use a multiple of $${requiredIncrement}.`
        );
        return;
      }
    }

    let first: number;
    let second: number;

    if (testingMode) {
      [first, second] =
        makeDiceForTotal(forcedTotal);
    } else {
      first =
        Math.floor(Math.random() * 6) + 1;

      second =
        Math.floor(Math.random() * 6) + 1;
    }

    const total = first + second;

    setDieOne(first);
    setDieTwo(second);
    setRollTotal(total);

    const rollMessages: string[] = [];

    /*
      FIELD
    */

    const fieldMessage =
      resolveFieldBet(total);

    if (fieldMessage) {
      rollMessages.push(fieldMessage);
    }

    /*
      COME / DON'T COME

      These resolve on every roll while the
      table point is ON.
    */

    if (point !== null) {
      rollMessages.push(
        ...resolveComeBets(total)
      );

      rollMessages.push(
        ...resolveDontComeBets(total)
      );
    }

    /*
      TABLE COME-OUT
    */

    if (point === null) {
      if (placeBetsWorking) {
        if (total === 7) {
          const placeLoss =
            clearAllPlaceBets();

          if (placeLoss > 0) {
            rollMessages.push(
              `Working Place bets lose $${money(
                placeLoss
              )}.`
            );
          }
        } else if (
          pointNumbers.includes(total)
        ) {
          const placeMessage =
            resolvePlaceBet(total);

          if (placeMessage) {
            rollMessages.push(placeMessage);
          }
        }
      }

      if (total === 7 || total === 11) {
        rollMessages.unshift(
          `${total} — Natural!`
        );

        if (passLineBet > 0) {
          setBankroll(
            (currentBankroll) =>
              currentBankroll +
              passLineBet * 2
          );

          rollMessages.push(
            `Pass Line wins $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          rollMessages.push(
            `Don't Pass loses $${money(
              dontPassBet
            )}.`
          );

          setDontPassBet(0);
          setDontPassOddsBet(0);
        }

        setMessage(
          rollMessages.join(" ")
        );

        return;
      }

      if (total === 2 || total === 3) {
        rollMessages.unshift(
          `${total} — Craps.`
        );

        if (passLineBet > 0) {
          rollMessages.push(
            `Pass Line loses $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          setBankroll(
            (currentBankroll) =>
              currentBankroll +
              dontPassBet * 2
          );

          rollMessages.push(
            `Don't Pass wins $${money(
              dontPassBet
            )}.`
          );

          setDontPassBet(0);
        }

        setMessage(
          rollMessages.join(" ")
        );

        return;
      }

      if (total === 12) {
        rollMessages.unshift(
          "12 — Craps."
        );

        if (passLineBet > 0) {
          rollMessages.push(
            `Pass Line loses $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          setBankroll(
            (currentBankroll) =>
              currentBankroll +
              dontPassBet
          );

          rollMessages.push(
            `Don't Pass bars 12. $${money(
              dontPassBet
            )} returned.`
          );

          setDontPassBet(0);
        }

        setMessage(
          rollMessages.join(" ")
        );

        return;
      }

      if (pointNumbers.includes(total)) {
        setPoint(total);

        rollMessages.unshift(
          `Point established: ${total}.`
        );

        setMessage(
          rollMessages.join(" ")
        );

        return;
      }
    }

    /*
      TABLE POINT ON — SEVEN OUT
    */

    if (total === 7) {
      rollMessages.unshift(
        "7 — Seven out!"
      );

      const placeLoss =
        clearAllPlaceBets();

      if (placeLoss > 0) {
        rollMessages.push(
          `Place bets lose $${money(
            placeLoss
          )}.`
        );
      }

      const passLoss =
        passLineBet + passOddsBet;

      if (passLoss > 0) {
        rollMessages.push(
          `Pass Line/odds lose $${money(
            passLoss
          )}.`
        );
      }

      if (dontPassBet > 0) {
        let returned =
          dontPassBet * 2;

        let layProfit = 0;

        if (dontPassOddsBet > 0) {
          layProfit =
            calculateDontPassOddsProfit(
              point,
              dontPassOddsBet
            );

          returned +=
            dontPassOddsBet + layProfit;
        }

        setBankroll(
          (currentBankroll) =>
            currentBankroll + returned
        );

        rollMessages.push(
          `Don't Pass wins $${money(
            dontPassBet
          )}.`
        );

        if (dontPassOddsBet > 0) {
          rollMessages.push(
            `Lay odds win $${money(
              layProfit
            )}.`
          );
        }
      }

      setPassLineBet(0);
      setPassOddsBet(0);

      setDontPassBet(0);
      setDontPassOddsBet(0);

      setPoint(null);

      setMessage(
        rollMessages.join(" ")
      );

      return;
    }

    /*
      PLACE BET HIT
    */

    const placeMessage =
      resolvePlaceBet(total);

    if (placeMessage) {
      rollMessages.push(placeMessage);
    }

    /*
      TABLE POINT MADE
    */

    if (total === point) {
      rollMessages.unshift(
        `${total} — Point made!`
      );

      if (passLineBet > 0) {
        let returned =
          passLineBet * 2;

        let oddsProfit = 0;

        if (passOddsBet > 0) {
          oddsProfit =
            calculatePassOddsProfit(
              point,
              passOddsBet
            );

          returned +=
            passOddsBet + oddsProfit;
        }

        setBankroll(
          (currentBankroll) =>
            currentBankroll + returned
        );

        rollMessages.push(
          `Pass Line wins $${money(
            passLineBet
          )}.`
        );

        if (passOddsBet > 0) {
          rollMessages.push(
            `Odds win $${money(
              oddsProfit
            )}.`
          );
        }
      }

      if (
        dontPassBet > 0 ||
        dontPassOddsBet > 0
      ) {
        rollMessages.push(
          `Don't Pass and lay odds lose $${money(
            dontPassBet +
              dontPassOddsBet
          )}.`
        );
      }

      setPassLineBet(0);
      setPassOddsBet(0);

      setDontPassBet(0);
      setDontPassOddsBet(0);

      setPoint(null);

      setMessage(
        rollMessages.join(" ")
      );

      return;
    }

    if (rollMessages.length === 0) {
      rollMessages.push(
        `${total} — No decision.`
      );
    } else {
      rollMessages.unshift(
        `${total} rolled.`
      );
    }

    setMessage(
      rollMessages.join(" ")
    );
  }

  return (
    <main className="min-h-screen bg-emerald-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              🎲 Lucky Penny Craps
            </h1>

            <p className="text-sm text-emerald-200">
              Practice Table
            </p>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-emerald-200 underline"
            >
              Home
            </Link>

            <div className="text-right">
              <p className="text-xs uppercase text-emerald-300">
                Bankroll
              </p>

              <p className="text-2xl font-bold">
                ${money(bankroll)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase text-emerald-300">
                Point
              </p>

              <p className="text-2xl font-bold">
                {point === null
                  ? "OFF"
                  : point}
              </p>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="rounded-3xl border-4 border-amber-700 bg-emerald-800 p-6 shadow-2xl">
          {/* BOX NUMBERS */}

          <div className="grid grid-cols-6 gap-2">
            {pointNumbers.map(
              (number) => (
                <button
                  key={number}
                  onClick={() =>
                    removeMode
                      ? removeNumberBet(
                          number
                        )
                      : placeNumberBet(
                          number
                        )
                  }
                  className={`rounded-lg border-2 p-5 text-3xl font-bold ${
                    point === number
                      ? "border-amber-300 bg-amber-500 text-black"
                      : "border-white/70 bg-emerald-700 hover:bg-emerald-600"
                  }`}
                >
                  {number}

                  <span className="mt-1 block text-xs font-normal">
                    PLACE
                  </span>

                  {placeBets[number] >
                    0 && (
                    <span className="mt-2 block rounded-full bg-white px-2 py-1 text-sm text-black">
                      $
                      {money(
                        placeBets[
                          number
                        ]
                      )}
                    </span>
                  )}

                  {comeBets[number] >
                    0 && (
                    <span className="mt-2 block text-xs text-blue-100">
                      COME $
                      {money(
                        comeBets[number]
                      )}
                    </span>
                  )}

                  {dontComeBets[
                    number
                  ] > 0 && (
                    <span className="mt-1 block text-xs text-red-100">
                      DC $
                      {money(
                        dontComeBets[
                          number
                        ]
                      )}
                    </span>
                  )}
                </button>
              )
            )}
          </div>

          {/* COME */}

          <button
            onClick={handleComeBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-6 text-3xl font-bold hover:bg-emerald-700"
          >
            COME

            {activeComeBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                $
                {money(
                  activeComeBet
                )}
              </span>
            )}
          </button>

          {/* FIELD */}

          <button
            onClick={handleFieldBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-5 text-2xl font-bold hover:bg-emerald-700"
          >
            FIELD

            <span className="ml-5 text-lg">
              2 • 3 • 4 • 9 • 10 •
              11 • 12
            </span>

            {fieldBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                $
                {money(fieldBet)}
              </span>
            )}
          </button>

          {/* DON'T COME */}

          <button
            onClick={handleDontComeBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-4 text-xl font-bold hover:bg-emerald-700"
          >
            DON&apos;T COME — BAR 12

            {activeDontComeBet >
              0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                $
                {money(
                  activeDontComeBet
                )}
              </span>
            )}
          </button>

          {/* DON'T PASS */}

          <button
            onClick={handleDontPassBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-4 text-xl font-bold hover:bg-emerald-700"
          >
            DON&apos;T PASS — BAR 12

            {dontPassBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                $
                {money(
                  dontPassBet
                )}
              </span>
            )}
          </button>

          {/* DON'T PASS ODDS */}

          {point !== null &&
            dontPassBet > 0 && (
              <button
                onClick={
                  handleDontPassOdds
                }
                className="mt-3 w-full rounded-lg border-2 border-red-300 bg-red-900/60 p-4 text-xl font-bold hover:bg-red-800"
              >
                DON&apos;T PASS LAY
                ODDS

                {dontPassOddsBet >
                  0 && (
                  <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                    $
                    {money(
                      dontPassOddsBet
                    )}
                  </span>
                )}

                <span className="ml-4 text-sm">
                  Max lay $
                  {money(
                    getMaxDontPassLayOdds()
                  )}
                </span>
              </button>
            )}

          {/* PASS LINE */}

          <button
            onClick={handlePassLineBet}
            className="mt-3 w-full rounded-lg border-2 border-white bg-emerald-700 p-5 text-2xl font-bold hover:bg-emerald-600"
          >
            PASS LINE

            {passLineBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                $
                {money(
                  passLineBet
                )}
              </span>
            )}
          </button>

          {/* PASS ODDS */}

          {point !== null &&
            passLineBet > 0 && (
              <button
                onClick={
                  handlePassOdds
                }
                className="mt-3 w-full rounded-lg border-2 border-amber-300 bg-amber-500 p-4 text-xl font-bold text-black hover:bg-amber-400"
              >
                PASS LINE ODDS

                {passOddsBet >
                  0 && (
                  <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                    $
                    {money(
                      passOddsBet
                    )}
                  </span>
                )}

                <span className="ml-4 text-sm">
                  Max $
                  {money(
                    getMaxPassOdds()
                  )}
                </span>
              </button>
            )}
        </div>

        {/* PLACE WORKING */}

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            onClick={() =>
              setPlaceBetsWorking(
                (current) =>
                  !current
              )
            }
            className={`rounded-lg px-6 py-3 font-bold ${
              placeBetsWorking
                ? "bg-amber-500 text-black"
                : "border border-emerald-400 bg-emerald-900"
            }`}
          >
            PLACE BETS:{" "}
            {placeBetsWorking
              ? "WORKING"
              : "OFF ON COME-OUT"}
          </button>

          <button
            onClick={resetTable}
            className="rounded-lg border border-red-400 px-6 py-3 font-bold text-red-200 hover:bg-red-900"
          >
            RESET TABLE
          </button>
        </div>

        {/* CHIPS */}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <span className="mr-2 text-sm uppercase text-emerald-200">
            Select Chip
          </span>

          {chipValues.map(
            (chip) => (
              <button
                key={chip}
                onClick={() =>
                  setSelectedChip(
                    chip
                  )
                }
                className={`flex h-16 w-16 items-center justify-center rounded-full border-4 font-bold shadow-lg transition hover:scale-110 ${
                  selectedChip ===
                  chip
                    ? "border-amber-400 bg-amber-100 text-black"
                    : "border-dashed border-white bg-white text-black"
                }`}
              >
                ${chip}
              </button>
            )
          )}
        </div>

        <p className="mt-3 text-center text-sm text-emerald-200">
          Selected chip: $
          {selectedChip}
        </p>

        {/* ADD / REMOVE */}

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() =>
              setRemoveMode(false)
            }
            className={`rounded-lg px-6 py-2 font-bold ${
              !removeMode
                ? "bg-amber-500 text-black"
                : "border border-white/50"
            }`}
          >
            ADD BET
          </button>

          <button
            onClick={() =>
              setRemoveMode(true)
            }
            className={`rounded-lg px-6 py-2 font-bold ${
              removeMode
                ? "bg-red-600"
                : "border border-white/50"
            }`}
          >
            REMOVE BET
          </button>
        </div>

        {/* TESTING MODE */}

        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-purple-400/50 bg-purple-950/40 p-4 text-center">
          <button
            onClick={() =>
              setTestingMode(
                (current) =>
                  !current
              )
            }
            className={`rounded-lg px-5 py-2 font-bold ${
              testingMode
                ? "bg-purple-500 text-white"
                : "border border-purple-300"
            }`}
          >
            TEST MODE:{" "}
            {testingMode
              ? "ON"
              : "OFF"}
          </button>

          {testingMode && (
            <div className="mt-4">
              <label className="mr-3 font-bold">
                Force Roll:
              </label>

              <select
                value={forcedTotal}
                onChange={(event) =>
                  setForcedTotal(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                className="rounded bg-white px-3 py-2 text-black"
              >
                {Array.from(
                  { length: 11 },
                  (_, index) =>
                    index + 2
                ).map(
                  (number) => (
                    <option
                      key={
                        number
                      }
                      value={
                        number
                      }
                    >
                      {number}
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs text-purple-200">
                ROLL DICE will
                produce the selected
                total.
              </p>
            </div>
          )}
        </div>

        {/* DICE */}

        <div className="mt-8 text-center">
          <div className="mb-2 text-7xl">
            {
              diceFaces[
                dieOne - 1
              ]
            }{" "}
            {
              diceFaces[
                dieTwo - 1
              ]
            }
          </div>

          <p className="text-2xl font-bold">
            You rolled {rollTotal}
          </p>

          <p className="mx-auto mb-4 mt-2 min-h-7 max-w-4xl text-lg text-amber-300">
            {message}
          </p>

          <button
            onClick={rollDice}
            className="rounded-xl bg-amber-500 px-12 py-4 text-xl font-bold text-black shadow-lg hover:bg-amber-400"
          >
            ROLL DICE
          </button>
        </div>
      </div>
    </main>
  );
}