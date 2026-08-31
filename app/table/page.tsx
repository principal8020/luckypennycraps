"use client";

import Link from "next/link";
import { useState } from "react";

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const pointNumbers = [4, 5, 6, 8, 9, 10];
const hardwayNumbers = [4, 6, 8, 10];
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

function emptyHardways(): NumberBets {
  return {
    4: 0,
    6: 0,
    8: 0,
    10: 0,
  };
}

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

function casinoPayout(amount: number) {
  return Math.floor(amount);
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
  const [forceHardway, setForceHardway] = useState(false);

  const [passLineBet, setPassLineBet] = useState(0);
  const [passOddsBet, setPassOddsBet] = useState(0);

  const [dontPassBet, setDontPassBet] = useState(0);
  const [dontPassOddsBet, setDontPassOddsBet] = useState(0);

  const [fieldBet, setFieldBet] = useState(0);

  const [activeComeBet, setActiveComeBet] = useState(0);
  const [comeBets, setComeBets] =
    useState<NumberBets>(emptyNumberBets());
  const [comeOdds, setComeOdds] =
    useState<NumberBets>(emptyNumberBets());

  const [activeDontComeBet, setActiveDontComeBet] = useState(0);
  const [dontComeBets, setDontComeBets] =
    useState<NumberBets>(emptyNumberBets());
  const [dontComeOdds, setDontComeOdds] =
    useState<NumberBets>(emptyNumberBets());

  const [placeBets, setPlaceBets] =
    useState<NumberBets>(emptyNumberBets());

  const [hardways, setHardways] =
    useState<NumberBets>(emptyHardways());

  const [anySevenBet, setAnySevenBet] = useState(0);
  const [anyCrapsBet, setAnyCrapsBet] = useState(0);
  const [yoBet, setYoBet] = useState(0);
  const [hornBet, setHornBet] = useState(0);

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
    setComeOdds(emptyNumberBets());

    setActiveDontComeBet(0);
    setDontComeBets(emptyNumberBets());
    setDontComeOdds(emptyNumberBets());

    setPlaceBets(emptyNumberBets());
    setHardways(emptyHardways());

    setAnySevenBet(0);
    setAnyCrapsBet(0);
    setYoBet(0);
    setHornBet(0);
  }

  function makeDiceForTotal(total: number) {
    if (
      forceHardway &&
      hardwayNumbers.includes(total)
    ) {
      const die = total / 2;
      return [die, die];
    }

    const combinations: number[][] = [];

    for (let first = 1; first <= 6; first++) {
      for (let second = 1; second <= 6; second++) {
        if (first + second === total) {
          combinations.push([first, second]);
        }
      }
    }

    return combinations[
      Math.floor(Math.random() * combinations.length)
    ];
  }

  function getPassOddsMultiplier(number: number) {
    if (number === 4 || number === 10) return 3;
    if (number === 5 || number === 9) return 4;
    return 5;
  }

  function calculatePassOddsProfit(
    number: number,
    bet: number
  ) {
    if (number === 4 || number === 10) {
      return casinoPayout(bet * 2);
    }

    if (number === 5 || number === 9) {
      return casinoPayout(bet * 1.5);
    }

    return casinoPayout(bet * 1.2);
  }

  function calculateLayOddsProfit(
    number: number,
    bet: number
  ) {
    if (number === 4 || number === 10) {
      return casinoPayout(bet / 2);
    }

    if (number === 5 || number === 9) {
      return casinoPayout((bet * 2) / 3);
    }

    return casinoPayout((bet * 5) / 6);
  }

  function handlePassLineBet() {
    if (removeMode) {
      if (passLineBet === 0) {
        setMessage("There is no Pass Line bet.");
        return;
      }

      if (point !== null) {
        setMessage(
          "Pass Line cannot be removed after the point is established."
        );
        return;
      }

      if (selectedChip > passLineBet) {
        setMessage("Selected chip is larger than the bet.");
        return;
      }

      setPassLineBet((current) => current - selectedChip);
      setBankroll((current) => current + selectedChip);
      return;
    }

    if (point !== null) {
      setMessage(
        "Pass Line can only be added while the point is OFF."
      );
      return;
    }

    if (dontPassBet > 0) {
      setMessage(
        "Remove Don't Pass before betting Pass Line."
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setPassLineBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
  }

  function handlePassOdds() {
    if (point === null || passLineBet === 0) {
      setMessage(
        "Pass odds require a Pass Line bet and a point."
      );
      return;
    }

    if (removeMode) {
      if (selectedChip > passOddsBet) {
        setMessage("Not enough Pass Line odds to remove.");
        return;
      }

      setPassOddsBet((current) => current - selectedChip);
      setBankroll((current) => current + selectedChip);
      return;
    }

    const max =
      passLineBet *
      getPassOddsMultiplier(point);

    if (passOddsBet + selectedChip > max) {
      setMessage(
        `Maximum Pass Line odds is $${money(max)}.`
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setPassOddsBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
  }

  function handleDontPassBet() {
    if (removeMode) {
      if (selectedChip > dontPassBet) {
        setMessage("Not enough Don't Pass bet to remove.");
        return;
      }

      const newBet = dontPassBet - selectedChip;

      if (dontPassOddsBet > newBet * 6) {
        setMessage(
          "Reduce lay odds before reducing Don't Pass."
        );
        return;
      }

      setDontPassBet(newBet);
      setBankroll((current) => current + selectedChip);
      return;
    }

    if (point !== null) {
      setMessage(
        "New Don't Pass bets can only be made with point OFF."
      );
      return;
    }

    if (passLineBet > 0) {
      setMessage(
        "Remove Pass Line before betting Don't Pass."
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setDontPassBet((current) => current + selectedChip);
    setBankroll((current) => current - selectedChip);
  }

  function handleDontPassOdds() {
    if (point === null || dontPassBet === 0) {
      setMessage(
        "Don't Pass lay odds require a point."
      );
      return;
    }

    if (removeMode) {
      if (selectedChip > dontPassOddsBet) {
        setMessage("Not enough lay odds to remove.");
        return;
      }

      setDontPassOddsBet(
        (current) => current - selectedChip
      );

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    const max = dontPassBet * 6;

    if (dontPassOddsBet + selectedChip > max) {
      setMessage(
        `Maximum Don't Pass lay is $${money(max)}.`
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setDontPassOddsBet(
      (current) => current + selectedChip
    );

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function placeNumberBet(number: number) {
    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    const total =
      placeBets[number] + selectedChip;

    setPlaceBets((current) => ({
      ...current,
      [number]: total,
    }));

    setBankroll(
      (current) => current - selectedChip
    );

    setMessage(
      `Place ${number} is now $${money(total)}.`
    );
  }

  function removeNumberBet(number: number) {
    if (selectedChip > placeBets[number]) {
      setMessage("Selected chip is larger than the bet.");
      return;
    }

    setPlaceBets((current) => ({
      ...current,
      [number]:
        current[number] - selectedChip,
    }));

    setBankroll(
      (current) => current + selectedChip
    );
  }

  function calculatePlaceProfit(
    number: number,
    bet: number
  ) {
    if (number === 4 || number === 10) {
      return casinoPayout((bet * 9) / 5);
    }

    if (number === 5 || number === 9) {
      return casinoPayout((bet * 7) / 5);
    }

    return casinoPayout((bet * 7) / 6);
  }

  function resolvePlaceBet(total: number) {
    const bet = placeBets[total];

    if (!bet) return null;

    const profit =
      calculatePlaceProfit(total, bet);

    setBankroll(
      (current) => current + profit
    );

    return `Place ${total} wins $${money(
      profit
    )}. Bet stays up.`;
  }

  function clearPlaceBets() {
    const lost =
      Object.values(placeBets).reduce(
        (sum, value) => sum + value,
        0
      );

    setPlaceBets(emptyNumberBets());

    return lost;
  }

  function handleFieldBet() {
    if (removeMode) {
      if (selectedChip > fieldBet) {
        setMessage("Not enough Field bet to remove.");
        return;
      }

      setFieldBet(
        (current) => current - selectedChip
      );

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setFieldBet(
      (current) => current + selectedChip
    );

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function resolveField(total: number) {
    if (!fieldBet) return null;

    let profit = 0;

    if (total === 2) {
      profit = fieldBet * 2;
    } else if (total === 12) {
      profit = fieldBet * 3;
    } else if (
      [3, 4, 9, 10, 11].includes(total)
    ) {
      profit = fieldBet;
    }

    if (profit > 0) {
      setBankroll(
        (current) =>
          current + fieldBet + profit
      );

      const result =
        `Field wins $${money(profit)}.`;

      setFieldBet(0);

      return result;
    }

    const lost = fieldBet;

    setFieldBet(0);

    return `Field loses $${money(lost)}.`;
  }

  function handleComeBet() {
    if (point === null) {
      setMessage(
        "Come bets require the table point to be ON."
      );
      return;
    }

    if (removeMode) {
      if (selectedChip > activeComeBet) {
        setMessage("Not enough active Come bet.");
        return;
      }

      setActiveComeBet(
        (current) => current - selectedChip
      );

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setActiveComeBet(
      (current) => current + selectedChip
    );

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function handleDontComeBet() {
    if (point === null) {
      setMessage(
        "Don't Come requires the table point to be ON."
      );
      return;
    }

    if (removeMode) {
      if (selectedChip > activeDontComeBet) {
        setMessage("Not enough active Don't Come bet.");
        return;
      }

      setActiveDontComeBet(
        (current) => current - selectedChip
      );

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setActiveDontComeBet(
      (current) => current + selectedChip
    );

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function handleComeOdds(number: number) {
    const flatBet = comeBets[number];

    if (!flatBet) {
      setMessage(`No Come bet on ${number}.`);
      return;
    }

    if (removeMode) {
      if (selectedChip > comeOdds[number]) {
        setMessage("Not enough Come odds to remove.");
        return;
      }

      setComeOdds((current) => ({
        ...current,
        [number]:
          current[number] - selectedChip,
      }));

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    const max =
      flatBet *
      getPassOddsMultiplier(number);

    if (
      comeOdds[number] + selectedChip >
      max
    ) {
      setMessage(
        `Maximum Come odds on ${number} is $${money(
          max
        )}.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setComeOdds((current) => ({
      ...current,
      [number]:
        current[number] + selectedChip,
    }));

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function handleDontComeOdds(number: number) {
    const flatBet =
      dontComeBets[number];

    if (!flatBet) {
      setMessage(
        `No Don't Come bet behind ${number}.`
      );
      return;
    }

    if (removeMode) {
      if (
        selectedChip >
        dontComeOdds[number]
      ) {
        setMessage(
          "Not enough Don't Come lay odds to remove."
        );

        return;
      }

      setDontComeOdds((current) => ({
        ...current,
        [number]:
          current[number] - selectedChip,
      }));

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    const max = flatBet * 6;

    if (
      dontComeOdds[number] +
        selectedChip >
      max
    ) {
      setMessage(
        `Maximum Don't Come lay on ${number} is $${money(
          max
        )}.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setDontComeOdds((current) => ({
      ...current,
      [number]:
        current[number] + selectedChip,
    }));

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function handleHardway(number: number) {
    if (removeMode) {
      if (
        selectedChip > hardways[number]
      ) {
        setMessage("Not enough Hardway bet to remove.");
        return;
      }

      setHardways((current) => ({
        ...current,
        [number]:
          current[number] - selectedChip,
      }));

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setHardways((current) => ({
      ...current,
      [number]:
        current[number] + selectedChip,
    }));

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function resolveHardways(
    first: number,
    second: number,
    total: number
  ) {
    const messages: string[] = [];
    const next = { ...hardways };

    if (total === 7) {
      const lost =
        Object.values(next).reduce(
          (sum, value) => sum + value,
          0
        );

      if (lost > 0) {
        messages.push(
          `Hardways lose $${money(lost)}.`
        );
      }

      setHardways(emptyHardways());

      return messages;
    }

    if (!hardwayNumbers.includes(total)) {
      return messages;
    }

    const bet = next[total];

    if (!bet) return messages;

    if (first === second) {
      const multiplier =
        total === 4 || total === 10
          ? 7
          : 9;

      const profit =
        casinoPayout(
          bet * multiplier
        );

      setBankroll(
        (current) => current + profit
      );

      messages.push(
        `Hard ${total} wins $${money(
          profit
        )}. Bet stays up.`
      );
    } else {
      messages.push(
        `Easy ${total}. Hard ${total} loses $${money(
          bet
        )}.`
      );

      next[total] = 0;

      setHardways(next);
    }

    return messages;
  }

  function handlePropBet(
    currentBet: number,
    setter: React.Dispatch<
      React.SetStateAction<number>
    >,
    name: string
  ) {
    if (removeMode) {
      if (selectedChip > currentBet) {
        setMessage(
          `Not enough ${name} bet to remove.`
        );

        return;
      }

      setter(
        (current) =>
          current - selectedChip
      );

      setBankroll(
        (current) => current + selectedChip
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll.");
      return;
    }

    setter(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) => current - selectedChip
    );
  }

  function resolvePropBets(total: number) {
    const messages: string[] = [];

    if (anySevenBet > 0) {
      if (total === 7) {
        const profit =
          anySevenBet * 4;

        setBankroll(
          (current) =>
            current +
            anySevenBet +
            profit
        );

        messages.push(
          `Any 7 wins $${money(
            profit
          )}.`
        );
      } else {
        messages.push(
          `Any 7 loses $${money(
            anySevenBet
          )}.`
        );
      }

      setAnySevenBet(0);
    }

    if (anyCrapsBet > 0) {
      if ([2, 3, 12].includes(total)) {
        const profit =
          anyCrapsBet * 7;

        setBankroll(
          (current) =>
            current +
            anyCrapsBet +
            profit
        );

        messages.push(
          `Any Craps wins $${money(
            profit
          )}.`
        );
      } else {
        messages.push(
          `Any Craps loses $${money(
            anyCrapsBet
          )}.`
        );
      }

      setAnyCrapsBet(0);
    }

    if (yoBet > 0) {
      if (total === 11) {
        const profit =
          yoBet * 15;

        setBankroll(
          (current) =>
            current +
            yoBet +
            profit
        );

        messages.push(
          `Yo 11 wins $${money(
            profit
          )}.`
        );
      } else {
        messages.push(
          `Yo 11 loses $${money(
            yoBet
          )}.`
        );
      }

      setYoBet(0);
    }

    if (hornBet > 0) {
      if ([2, 3, 11, 12].includes(total)) {
        const unit =
          hornBet / 4;

        const multiplier =
          total === 2 || total === 12
            ? 30
            : 15;

        const winningReturn =
          unit +
          unit * multiplier;

        const losingPortion =
          unit * 3;

        const netProfit =
          casinoPayout(
            winningReturn -
            losingPortion
          );

        setBankroll(
          (current) =>
            current +
            hornBet +
            netProfit
        );

        messages.push(
          `Horn hits ${total}. Net profit $${money(
            netProfit
          )}.`
        );
      } else {
        messages.push(
          `Horn loses $${money(
            hornBet
          )}.`
        );
      }

      setHornBet(0);
    }

    return messages;
  }

  function resolveComeBets(total: number) {
    const messages: string[] = [];

    const nextCome = {
      ...comeBets,
    };

    const nextOdds = {
      ...comeOdds,
    };

    if (total === 7) {
      let lost = 0;

      for (const number of pointNumbers) {
        lost +=
          nextCome[number] +
          nextOdds[number];

        nextCome[number] = 0;
        nextOdds[number] = 0;
      }

      if (lost > 0) {
        messages.push(
          `Come bets and odds lose $${money(
            lost
          )}.`
        );
      }
    } else if (
      pointNumbers.includes(total) &&
      nextCome[total] > 0
    ) {
      const flat =
        nextCome[total];

      const odds =
        nextOdds[total];

      let returned =
        flat * 2;

      let oddsProfit = 0;

      if (odds > 0) {
        oddsProfit =
          calculatePassOddsProfit(
            total,
            odds
          );

        returned +=
          odds + oddsProfit;
      }

      setBankroll(
        (current) => current + returned
      );

      messages.push(
        `Come ${total} wins $${money(
          flat
        )}` +
          (odds
            ? ` + $${money(
                oddsProfit
              )} odds.`
            : ".")
      );

      nextCome[total] = 0;
      nextOdds[total] = 0;
    }

    if (activeComeBet > 0) {
      const bet =
        activeComeBet;

      if (total === 7 || total === 11) {
        setBankroll(
          (current) =>
            current + bet * 2
        );

        messages.push(
          `Come wins $${money(bet)}.`
        );

        setActiveComeBet(0);
      } else if (
        [2, 3, 12].includes(total)
      ) {
        messages.push(
          `Come loses $${money(bet)}.`
        );

        setActiveComeBet(0);
      } else if (
        pointNumbers.includes(total)
      ) {
        nextCome[total] += bet;

        messages.push(
          `$${money(
            bet
          )} Come moves to ${total}.`
        );

        setActiveComeBet(0);
      }
    }

    setComeBets(nextCome);
    setComeOdds(nextOdds);

    return messages;
  }

  function resolveDontComeBets(total: number) {
    const messages: string[] = [];

    const nextDC = {
      ...dontComeBets,
    };

    const nextOdds = {
      ...dontComeOdds,
    };

    if (total === 7) {
      for (const number of pointNumbers) {
        const flat =
          nextDC[number];

        const lay =
          nextOdds[number];

        if (flat > 0) {
          let returned =
            flat * 2;

          let layProfit = 0;

          if (lay > 0) {
            layProfit =
              calculateLayOddsProfit(
                number,
                lay
              );

            returned +=
              lay + layProfit;
          }

          setBankroll(
            (current) =>
              current + returned
          );

          messages.push(
            `Don't Come ${number} wins $${money(
              flat
            )}` +
              (lay
                ? ` + $${money(
                    layProfit
                  )} lay odds.`
                : ".")
          );

          nextDC[number] = 0;
          nextOdds[number] = 0;
        }
      }
    } else if (
      pointNumbers.includes(total) &&
      nextDC[total] > 0
    ) {
      const lost =
        nextDC[total] +
        nextOdds[total];

      messages.push(
        `Don't Come ${total} loses $${money(
          lost
        )}.`
      );

      nextDC[total] = 0;
      nextOdds[total] = 0;
    }

    if (activeDontComeBet > 0) {
      const bet =
        activeDontComeBet;

      if (total === 2 || total === 3) {
        setBankroll(
          (current) =>
            current + bet * 2
        );

        messages.push(
          `Don't Come wins $${money(
            bet
          )}.`
        );

        setActiveDontComeBet(0);
      } else if (
        total === 7 ||
        total === 11
      ) {
        messages.push(
          `Don't Come loses $${money(
            bet
          )}.`
        );

        setActiveDontComeBet(0);
      } else if (total === 12) {
        setBankroll(
          (current) =>
            current + bet
        );

        messages.push(
          `Don't Come bars 12. $${money(
            bet
          )} returned.`
        );

        setActiveDontComeBet(0);
      } else if (
        pointNumbers.includes(total)
      ) {
        nextDC[total] += bet;

        messages.push(
          `$${money(
            bet
          )} Don't Come moves behind ${total}.`
        );

        setActiveDontComeBet(0);
      }
    }

    setDontComeBets(nextDC);
    setDontComeOdds(nextOdds);

    return messages;
  }

  function rollDice() {
    let first: number;
    let second: number;

    if (testingMode) {
      [first, second] =
        makeDiceForTotal(forcedTotal);
    } else {
      first =
        Math.floor(Math.random() * 6) +
        1;

      second =
        Math.floor(Math.random() * 6) +
        1;
    }

    const total =
      first + second;

    setDieOne(first);
    setDieTwo(second);
    setRollTotal(total);

    const messages: string[] = [];

    const fieldMessage =
      resolveField(total);

    if (fieldMessage) {
      messages.push(fieldMessage);
    }

    messages.push(
      ...resolvePropBets(total)
    );

    messages.push(
      ...resolveHardways(
        first,
        second,
        total
      )
    );

    if (point !== null) {
      messages.push(
        ...resolveComeBets(total)
      );

      messages.push(
        ...resolveDontComeBets(total)
      );
    }

    if (point === null) {
      if (placeBetsWorking) {
        if (total === 7) {
          const placeLoss =
            clearPlaceBets();

          if (placeLoss) {
            messages.push(
              `Working Place bets lose $${money(
                placeLoss
              )}.`
            );
          }
        } else if (
          pointNumbers.includes(total)
        ) {
          const result =
            resolvePlaceBet(total);

          if (result) {
            messages.push(result);
          }
        }
      }

      if (total === 7 || total === 11) {
        messages.unshift(
          `${total} — Natural!`
        );

        if (passLineBet > 0) {
          setBankroll(
            (current) =>
              current +
              passLineBet * 2
          );

          messages.push(
            `Pass Line wins $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          messages.push(
            `Don't Pass loses $${money(
              dontPassBet
            )}.`
          );

          setDontPassBet(0);
          setDontPassOddsBet(0);
        }

        setMessage(messages.join(" "));
        return;
      }

      if (total === 2 || total === 3) {
        messages.unshift(
          `${total} — Craps.`
        );

        if (passLineBet > 0) {
          messages.push(
            `Pass Line loses $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          setBankroll(
            (current) =>
              current +
              dontPassBet * 2
          );

          messages.push(
            `Don't Pass wins $${money(
              dontPassBet
            )}.`
          );

          setDontPassBet(0);
        }

        setMessage(messages.join(" "));
        return;
      }

      if (total === 12) {
        messages.unshift("12 — Craps.");

        if (passLineBet > 0) {
          messages.push(
            `Pass Line loses $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (dontPassBet > 0) {
          setBankroll(
            (current) =>
              current + dontPassBet
          );

          messages.push(
            `Don't Pass bars 12.`
          );

          setDontPassBet(0);
        }

        setMessage(messages.join(" "));
        return;
      }

      if (
        pointNumbers.includes(total)
      ) {
        setPoint(total);

        messages.unshift(
          `Point established: ${total}.`
        );

        setMessage(messages.join(" "));
        return;
      }
    }

    if (total === 7) {
      messages.unshift(
        "7 — Seven out!"
      );

      const placeLoss =
        clearPlaceBets();

      if (placeLoss > 0) {
        messages.push(
          `Place bets lose $${money(
            placeLoss
          )}.`
        );
      }

      if (
        passLineBet +
          passOddsBet >
        0
      ) {
        messages.push(
          `Pass Line/odds lose $${money(
            passLineBet +
              passOddsBet
          )}.`
        );
      }

      if (dontPassBet > 0) {
        let returned =
          dontPassBet * 2;

        let profit = 0;

        if (dontPassOddsBet > 0) {
          profit =
            calculateLayOddsProfit(
              point,
              dontPassOddsBet
            );

          returned +=
            dontPassOddsBet +
            profit;
        }

        setBankroll(
          (current) =>
            current + returned
        );

        messages.push(
          `Don't Pass wins $${money(
            dontPassBet
          )}.`
        );

        if (profit > 0) {
          messages.push(
            `Lay odds win $${money(
              profit
            )}.`
          );
        }
      }

      setPassLineBet(0);
      setPassOddsBet(0);

      setDontPassBet(0);
      setDontPassOddsBet(0);

      setPoint(null);

      setMessage(messages.join(" "));
      return;
    }

    const placeMessage =
      resolvePlaceBet(total);

    if (placeMessage) {
      messages.push(placeMessage);
    }

    if (total === point) {
      messages.unshift(
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
            passOddsBet +
            oddsProfit;
        }

        setBankroll(
          (current) =>
            current + returned
        );

        messages.push(
          `Pass Line wins $${money(
            passLineBet
          )}.`
        );

        if (oddsProfit) {
          messages.push(
            `Pass odds win $${money(
              oddsProfit
            )}.`
          );
        }
      }

      if (
        dontPassBet +
          dontPassOddsBet >
        0
      ) {
        messages.push(
          `Don't Pass/lay odds lose $${money(
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

      setMessage(messages.join(" "));
      return;
    }

    if (messages.length === 0) {
      messages.push(
        `${total} — No decision.`
      );
    } else {
      messages.unshift(
        `${total} rolled.`
      );
    }

    setMessage(messages.join(" "));
  }

  return (
    <main className="min-h-screen bg-emerald-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
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
                {point === null ? "OFF" : point}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border-4 border-amber-700 bg-emerald-800 p-6 shadow-2xl">
          <div className="grid grid-cols-6 gap-2">
            {pointNumbers.map((number) => (
              <div
                key={number}
                className={`rounded-lg border-2 p-3 text-center ${
                  point === number
                    ? "border-amber-300 bg-amber-500 text-black"
                    : "border-white/70 bg-emerald-700"
                }`}
              >
                <button
                  onClick={() =>
                    removeMode
                      ? removeNumberBet(number)
                      : placeNumberBet(number)
                  }
                  className="w-full"
                >
                  <span className="text-3xl font-bold">
                    {number}
                  </span>

                  <span className="block text-xs">
                    PLACE
                  </span>

                  {placeBets[number] > 0 && (
                    <span className="mt-1 block rounded-full bg-white px-2 py-1 text-xs text-black">
                      ${money(placeBets[number])}
                    </span>
                  )}
                </button>

                {comeBets[number] > 0 && (
                  <div className="mt-2 border-t border-white/30 pt-2 text-xs">
                    <div>
                      COME ${money(comeBets[number])}
                    </div>

                    <button
                      onClick={() => handleComeOdds(number)}
                      className="mt-1 rounded bg-blue-800 px-2 py-1 text-white"
                    >
                      ODDS ${money(comeOdds[number])}
                    </button>
                  </div>
                )}

                {dontComeBets[number] > 0 && (
                  <div className="mt-2 border-t border-white/30 pt-2 text-xs">
                    <div>
                      DC ${money(dontComeBets[number])}
                    </div>

                    <button
                      onClick={() => handleDontComeOdds(number)}
                      className="mt-1 rounded bg-red-900 px-2 py-1 text-white"
                    >
                      LAY ${money(dontComeOdds[number])}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleComeBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-5 text-3xl font-bold"
          >
            COME

            {activeComeBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                ${money(activeComeBet)}
              </span>
            )}
          </button>

          <button
            onClick={handleFieldBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-4 text-2xl font-bold"
          >
            FIELD — 2 • 3 • 4 • 9 • 10 • 11 • 12

            {fieldBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                ${money(fieldBet)}
              </span>
            )}
          </button>

          <button
            onClick={handleDontComeBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-4 text-xl font-bold"
          >
            DON&apos;T COME — BAR 12

            {activeDontComeBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                ${money(activeDontComeBet)}
              </span>
            )}
          </button>

          <button
            onClick={handleDontPassBet}
            className="mt-3 w-full rounded-lg border-2 border-white/70 p-4 text-xl font-bold"
          >
            DON&apos;T PASS — BAR 12

            {dontPassBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                ${money(dontPassBet)}
              </span>
            )}
          </button>

          {point !== null && dontPassBet > 0 && (
            <button
              onClick={handleDontPassOdds}
              className="mt-3 w-full rounded-lg border-2 border-red-300 bg-red-900/60 p-3 font-bold"
            >
              DON&apos;T PASS LAY ODDS — $
              {money(dontPassOddsBet)}
            </button>
          )}

          <button
            onClick={handlePassLineBet}
            className="mt-3 w-full rounded-lg border-2 border-white bg-emerald-700 p-5 text-2xl font-bold"
          >
            PASS LINE

            {passLineBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                ${money(passLineBet)}
              </span>
            )}
          </button>

          {point !== null && passLineBet > 0 && (
            <button
              onClick={handlePassOdds}
              className="mt-3 w-full rounded-lg border-2 border-amber-300 bg-amber-500 p-3 font-bold text-black"
            >
              PASS ODDS — ${money(passOddsBet)}
            </button>
          )}

          <div className="mt-4 grid grid-cols-4 gap-2">
            {hardwayNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handleHardway(number)}
                className="rounded-lg border border-white/60 bg-emerald-900 p-3 font-bold"
              >
                HARD {number}

                {hardways[number] > 0 && (
                  <span className="ml-2">
                    ${money(hardways[number])}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-white/30 bg-emerald-950/50 p-4">
            <p className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-emerald-200">
              Proposition Bets
            </p>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <button
                onClick={() =>
                  handlePropBet(
                    anySevenBet,
                    setAnySevenBet,
                    "Any 7"
                  )
                }
                className="rounded-lg border border-white/60 p-3 font-bold"
              >
                ANY 7
                <span className="block text-xs">
                  Pays 4:1
                </span>

                {anySevenBet > 0 && (
                  <span>
                    ${money(anySevenBet)}
                  </span>
                )}
              </button>

              <button
                onClick={() =>
                  handlePropBet(
                    anyCrapsBet,
                    setAnyCrapsBet,
                    "Any Craps"
                  )
                }
                className="rounded-lg border border-white/60 p-3 font-bold"
              >
                ANY CRAPS
                <span className="block text-xs">
                  2 • 3 • 12 — 7:1
                </span>

                {anyCrapsBet > 0 && (
                  <span>
                    ${money(anyCrapsBet)}
                  </span>
                )}
              </button>

              <button
                onClick={() =>
                  handlePropBet(
                    yoBet,
                    setYoBet,
                    "Yo 11"
                  )
                }
                className="rounded-lg border border-white/60 p-3 font-bold"
              >
                YO 11
                <span className="block text-xs">
                  Pays 15:1
                </span>

                {yoBet > 0 && (
                  <span>
                    ${money(yoBet)}
                  </span>
                )}
              </button>

              <button
                onClick={() =>
                  handlePropBet(
                    hornBet,
                    setHornBet,
                    "Horn"
                  )
                }
                className="rounded-lg border border-white/60 p-3 font-bold"
              >
                HORN
                <span className="block text-xs">
                  2 • 3 • 11 • 12
                </span>

                {hornBet > 0 && (
                  <span>
                    ${money(hornBet)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            onClick={() =>
              setPlaceBetsWorking(
                (current) => !current
              )
            }
            className={`rounded-lg px-5 py-3 font-bold ${
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
            className="rounded-lg border border-red-400 px-5 py-3 font-bold text-red-200"
          >
            RESET TABLE
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <span className="text-sm uppercase text-emerald-200">
            Select Chip
          </span>

          {chipValues.map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedChip(chip)}
              className={`flex h-16 w-16 items-center justify-center rounded-full border-4 font-bold shadow-lg ${
                selectedChip === chip
                  ? "border-amber-400 bg-amber-100 text-black"
                  : "border-dashed border-white bg-white text-black"
              }`}
            >
              ${chip}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => setRemoveMode(false)}
            className={`rounded-lg px-6 py-2 font-bold ${
              !removeMode
                ? "bg-amber-500 text-black"
                : "border border-white/50"
            }`}
          >
            ADD BET
          </button>

          <button
            onClick={() => setRemoveMode(true)}
            className={`rounded-lg px-6 py-2 font-bold ${
              removeMode
                ? "bg-red-600"
                : "border border-white/50"
            }`}
          >
            REMOVE BET
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-purple-400/50 bg-purple-950/40 p-4 text-center">
          <button
            onClick={() =>
              setTestingMode(
                (current) => !current
              )
            }
            className="rounded-lg border border-purple-300 px-5 py-2 font-bold"
          >
            TEST MODE:{" "}
            {testingMode ? "ON" : "OFF"}
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
                    Number(event.target.value)
                  )
                }
                className="rounded bg-white px-3 py-2 text-black"
              >
                {Array.from(
                  { length: 11 },
                  (_, index) => index + 2
                ).map((number) => (
                  <option
                    key={number}
                    value={number}
                  >
                    {number}
                  </option>
                ))}
              </select>

              {hardwayNumbers.includes(forcedTotal) && (
                <label className="ml-4">
                  <input
                    type="checkbox"
                    checked={forceHardway}
                    onChange={(event) =>
                      setForceHardway(
                        event.target.checked
                      )
                    }
                    className="mr-2"
                  />

                  Force Hardway
                </label>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="mb-2 text-7xl">
            {diceFaces[dieOne - 1]}{" "}
            {diceFaces[dieTwo - 1]}
          </div>

          <p className="text-2xl font-bold">
            You rolled {rollTotal}
          </p>

          <p className="mx-auto mb-4 mt-2 min-h-7 max-w-5xl text-lg text-amber-300">
            {message}
          </p>

          <button
            onClick={rollDice}
            className="rounded-xl bg-amber-500 px-12 py-4 text-xl font-bold text-black shadow-lg"
          >
            ROLL DICE
          </button>
        </div>
      </div>
    </main>
  );
}