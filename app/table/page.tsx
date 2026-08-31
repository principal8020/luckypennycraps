"use client";

import Link from "next/link";
import { useState } from "react";

const STARTING_BANKROLL = 5000;

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const pointNumbers = [4, 5, 6, 8, 9, 10];
const hardwayNumbers = [4, 6, 8, 10];
const chipValues = [1, 5, 10, 25, 100, 500];

type NumberBets = {
  [key: number]: number;
};

type RollHistoryItem = {
  first: number;
  second: number;
  total: number;
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

function BetChip({
  amount,
  dark = false,
}: {
  amount: number;
  dark?: boolean;
}) {
  if (amount <= 0) return null;

  return (
    <span
      className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border-4 border-dashed px-2 text-xs font-black shadow-lg ${
        dark
          ? "border-red-200 bg-red-800 text-white"
          : "border-white bg-amber-100 text-black"
      }`}
    >
      ${money(amount)}
    </span>
  );
}

export default function TablePage() {
  const [dieOne, setDieOne] = useState(1);
  const [dieTwo, setDieTwo] = useState(1);
  const [rollTotal, setRollTotal] = useState(2);

  const [rollHistory, setRollHistory] =
    useState<RollHistoryItem[]>([]);
  const [rollCount, setRollCount] = useState(0);

  const [point, setPoint] =
    useState<number | null>(null);

  const [message, setMessage] = useState(
    "Place your bets for the come-out roll."
  );

  const [bankroll, setBankroll] =
    useState(STARTING_BANKROLL);

  const [selectedChip, setSelectedChip] =
    useState(25);

  const [removeMode, setRemoveMode] =
    useState(false);

  const [placeBetsWorking, setPlaceBetsWorking] =
    useState(false);

  const [testingMode, setTestingMode] =
    useState(false);

  const [forcedTotal, setForcedTotal] =
    useState(7);

  const [forceHardway, setForceHardway] =
    useState(false);

  const [passLineBet, setPassLineBet] =
    useState(0);

  const [passOddsBet, setPassOddsBet] =
    useState(0);

  const [dontPassBet, setDontPassBet] =
    useState(0);

  const [dontPassOddsBet, setDontPassOddsBet] =
    useState(0);

  const [fieldBet, setFieldBet] =
    useState(0);

  const [activeComeBet, setActiveComeBet] =
    useState(0);

  const [comeBets, setComeBets] =
    useState<NumberBets>(emptyNumberBets());

  const [comeOdds, setComeOdds] =
    useState<NumberBets>(emptyNumberBets());

  const [
    activeDontComeBet,
    setActiveDontComeBet,
  ] = useState(0);

  const [dontComeBets, setDontComeBets] =
    useState<NumberBets>(emptyNumberBets());

  const [dontComeOdds, setDontComeOdds] =
    useState<NumberBets>(emptyNumberBets());

  const [placeBets, setPlaceBets] =
    useState<NumberBets>(emptyNumberBets());

  const [hardways, setHardways] =
    useState<NumberBets>(emptyHardways());

  const [anySevenBet, setAnySevenBet] =
    useState(0);

  const [anyCrapsBet, setAnyCrapsBet] =
    useState(0);

  const [yoBet, setYoBet] =
    useState(0);

  const [hornBet, setHornBet] =
    useState(0);

  /*
    REMOVE HELPERS
  */

  function wantsRemove(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    return removeMode || Boolean(event?.shiftKey);
  }

  function amountToRemove(currentBet: number) {
    return Math.min(selectedChip, currentBet);
  }

  /*
    SESSION STATS
  */

  const totalPlaceBets =
    Object.values(placeBets).reduce(
      (sum, bet) => sum + bet,
      0
    );

  const totalComeBets =
    Object.values(comeBets).reduce(
      (sum, bet) => sum + bet,
      0
    );

  const totalComeOdds =
    Object.values(comeOdds).reduce(
      (sum, bet) => sum + bet,
      0
    );

  const totalDontComeBets =
    Object.values(dontComeBets).reduce(
      (sum, bet) => sum + bet,
      0
    );

  const totalDontComeOdds =
    Object.values(dontComeOdds).reduce(
      (sum, bet) => sum + bet,
      0
    );

  const totalHardways =
    Object.values(hardways).reduce(
      (sum, bet) => sum + bet,
      0
    );

  const totalOnTable =
    passLineBet +
    passOddsBet +
    dontPassBet +
    dontPassOddsBet +
    fieldBet +
    activeComeBet +
    activeDontComeBet +
    totalPlaceBets +
    totalComeBets +
    totalComeOdds +
    totalDontComeBets +
    totalDontComeOdds +
    totalHardways +
    anySevenBet +
    anyCrapsBet +
    yoBet +
    hornBet;

  const sessionValue =
    bankroll + totalOnTable;

  const sessionPL =
    sessionValue - STARTING_BANKROLL;

  /*
    RESET
  */

  function resetTable() {
    setDieOne(1);
    setDieTwo(1);
    setRollTotal(2);

    setRollHistory([]);
    setRollCount(0);

    setPoint(null);

    setMessage(
      "Table reset. Place your bets for the come-out roll."
    );

    setBankroll(STARTING_BANKROLL);
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

  /*
    DICE
  */

  function makeDiceForTotal(total: number) {
    if (
      forceHardway &&
      hardwayNumbers.includes(total)
    ) {
      const die = total / 2;

      return [die, die];
    }

    const combinations: number[][] = [];

    for (
      let first = 1;
      first <= 6;
      first++
    ) {
      for (
        let second = 1;
        second <= 6;
        second++
      ) {
        if (first + second === total) {
          combinations.push([
            first,
            second,
          ]);
        }
      }
    }

    return combinations[
      Math.floor(
        Math.random() *
          combinations.length
      )
    ];
  }

  /*
    ODDS MATH
  */

  function getPassOddsMultiplier(
    number: number
  ) {
    if (
      number === 4 ||
      number === 10
    ) {
      return 3;
    }

    if (
      number === 5 ||
      number === 9
    ) {
      return 4;
    }

    return 5;
  }

  function calculatePassOddsProfit(
    number: number,
    bet: number
  ) {
    if (
      number === 4 ||
      number === 10
    ) {
      return casinoPayout(
        bet * 2
      );
    }

    if (
      number === 5 ||
      number === 9
    ) {
      return casinoPayout(
        bet * 1.5
      );
    }

    return casinoPayout(
      bet * 1.2
    );
  }

  function calculateLayOddsProfit(
    number: number,
    bet: number
  ) {
    if (
      number === 4 ||
      number === 10
    ) {
      return casinoPayout(
        bet / 2
      );
    }

    if (
      number === 5 ||
      number === 9
    ) {
      return casinoPayout(
        (bet * 2) / 3
      );
    }

    return casinoPayout(
      (bet * 5) / 6
    );
  }

  /*
    PASS LINE
  */

  function handlePassLineBet(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    const removing =
      wantsRemove(event);

    if (removing) {
      if (passLineBet === 0) {
        setMessage(
          "There is no Pass Line bet to remove."
        );
        return;
      }

      if (point !== null) {
        setMessage(
          "Pass Line is a contract bet and cannot be removed after the point is established."
        );
        return;
      }

      const amount =
        amountToRemove(passLineBet);

      setPassLineBet(
        (current) =>
          current - amount
      );

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Pass Line.`
      );

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
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setPassLineBet(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );

    setMessage(
      `Added $${selectedChip} to Pass Line.`
    );
  }

  function handlePassOdds(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    if (
      point === null ||
      passLineBet === 0
    ) {
      setMessage(
        "Pass odds require a Pass Line bet and a point."
      );
      return;
    }

    const removing =
      wantsRemove(event);

    if (removing) {
      if (passOddsBet === 0) {
        setMessage(
          "There are no Pass odds to remove."
        );
        return;
      }

      const amount =
        amountToRemove(passOddsBet);

      setPassOddsBet(
        (current) =>
          current - amount
      );

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Pass odds.`
      );

      return;
    }

    const max =
      passLineBet *
      getPassOddsMultiplier(point);

    if (
      passOddsBet +
        selectedChip >
      max
    ) {
      setMessage(
        `Maximum Pass odds is $${money(
          max
        )}.`
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setPassOddsBet(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );

    setMessage(
      `Pass odds are now $${money(
        passOddsBet +
          selectedChip
      )}.`
    );
  }

  /*
    DON'T PASS
  */

  function handleDontPassBet(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    const removing =
      wantsRemove(event);

    if (removing) {
      if (dontPassBet === 0) {
        setMessage(
          "There is no Don't Pass bet to remove."
        );
        return;
      }

      const amount =
        amountToRemove(
          dontPassBet
        );

      const newBet =
        dontPassBet - amount;

      if (
        dontPassOddsBet >
        newBet * 6
      ) {
        setMessage(
          "Reduce your Don't Pass lay odds before reducing the flat bet."
        );
        return;
      }

      setDontPassBet(newBet);

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Don't Pass.`
      );

      return;
    }

    if (point !== null) {
      setMessage(
        "New Don't Pass bets require the point to be OFF."
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
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setDontPassBet(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );

    setMessage(
      `Added $${selectedChip} to Don't Pass.`
    );
  }

  function handleDontPassOdds(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    if (
      point === null ||
      dontPassBet === 0
    ) {
      setMessage(
        "Don't Pass lay odds require a point."
      );
      return;
    }

    const removing =
      wantsRemove(event);

    if (removing) {
      if (
        dontPassOddsBet === 0
      ) {
        setMessage(
          "There are no Don't Pass lay odds to remove."
        );
        return;
      }

      const amount =
        amountToRemove(
          dontPassOddsBet
        );

      setDontPassOddsBet(
        (current) =>
          current - amount
      );

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Don't Pass lay odds.`
      );

      return;
    }

    const max =
      dontPassBet * 6;

    if (
      dontPassOddsBet +
        selectedChip >
      max
    ) {
      setMessage(
        `Maximum Don't Pass lay is $${money(
          max
        )}.`
      );
      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setDontPassOddsBet(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  /*
    PLACE BETS
  */

  function handleNumberBet(
    event: React.MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    const removing =
      wantsRemove(event);

    if (removing) {
      const currentBet =
        placeBets[number];

      if (currentBet === 0) {
        setMessage(
          `There is no Place ${number} bet to remove.`
        );
        return;
      }

      const amount =
        amountToRemove(currentBet);

      setPlaceBets(
        (current) => ({
          ...current,
          [number]:
            current[number] -
            amount,
        })
      );

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Place ${number}.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    const total =
      placeBets[number] +
      selectedChip;

    setPlaceBets(
      (current) => ({
        ...current,
        [number]: total,
      })
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );

    setMessage(
      `Place ${number} is now $${money(
        total
      )}.`
    );
  }

  function calculatePlaceProfit(
    number: number,
    bet: number
  ) {
    if (
      number === 4 ||
      number === 10
    ) {
      return casinoPayout(
        (bet * 9) / 5
      );
    }

    if (
      number === 5 ||
      number === 9
    ) {
      return casinoPayout(
        (bet * 7) / 5
      );
    }

    return casinoPayout(
      (bet * 7) / 6
    );
  }

  function resolvePlaceBet(
    total: number
  ) {
    const bet =
      placeBets[total];

    if (!bet) return null;

    const profit =
      calculatePlaceProfit(
        total,
        bet
      );

    setBankroll(
      (current) =>
        current + profit
    );

    return `Place ${total} wins $${money(
      profit
    )}. Bet stays up.`;
  }

  function clearPlaceBets() {
    const lost =
      Object.values(
        placeBets
      ).reduce(
        (sum, value) =>
          sum + value,
        0
      );

    setPlaceBets(
      emptyNumberBets()
    );

    return lost;
  }

  /*
    FIELD
  */

  function handleFieldBet(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    const removing =
      wantsRemove(event);

    if (removing) {
      if (fieldBet === 0) {
        setMessage(
          "There is no Field bet to remove."
        );
        return;
      }

      const amount =
        amountToRemove(
          fieldBet
        );

      setFieldBet(
        (current) =>
          current - amount
      );

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Field.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setFieldBet(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  function resolveField(
    total: number
  ) {
    if (!fieldBet) {
      return null;
    }

    let profit = 0;

    if (total === 2) {
      profit =
        fieldBet * 2;
    } else if (total === 12) {
      profit =
        fieldBet * 3;
    } else if (
      [3, 4, 9, 10, 11].includes(
        total
      )
    ) {
      profit =
        fieldBet;
    }

    if (profit > 0) {
      setBankroll(
        (current) =>
          current +
          fieldBet +
          profit
      );

      const result =
        `Field wins $${money(
          profit
        )}.`;

      setFieldBet(0);

      return result;
    }

    const lost =
      fieldBet;

    setFieldBet(0);

    return `Field loses $${money(
      lost
    )}.`;
  }

  /*
    COME
  */

  function handleComeBet(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    if (point === null) {
      setMessage(
        "Come bets require the table point to be ON."
      );
      return;
    }

    const removing =
      wantsRemove(event);

    if (removing) {
      if (
        activeComeBet === 0
      ) {
        setMessage(
          "There is no active Come bet to remove."
        );
        return;
      }

      const amount =
        amountToRemove(
          activeComeBet
        );

      setActiveComeBet(
        (current) =>
          current - amount
      );

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Come.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setActiveComeBet(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  function handleDontComeBet(
    event?: React.MouseEvent<HTMLButtonElement>
  ) {
    if (point === null) {
      setMessage(
        "Don't Come requires the table point to be ON."
      );
      return;
    }

    const removing =
      wantsRemove(event);

    if (removing) {
      if (
        activeDontComeBet === 0
      ) {
        setMessage(
          "There is no active Don't Come bet to remove."
        );
        return;
      }

      const amount =
        amountToRemove(
          activeDontComeBet
        );

      setActiveDontComeBet(
        (current) =>
          current - amount
      );

      setBankroll(
        (current) =>
          current + amount
      );

      setMessage(
        `Removed $${money(
          amount
        )} from Don't Come.`
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setActiveDontComeBet(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  /*
    COME ODDS
  */

  function handleComeOdds(
    event: React.MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    const flatBet =
      comeBets[number];

    if (!flatBet) {
      setMessage(
        `No Come bet on ${number}.`
      );
      return;
    }

    const removing =
      wantsRemove(event);

    if (removing) {
      const currentBet =
        comeOdds[number];

      if (currentBet === 0) {
        setMessage(
          `There are no Come odds on ${number}.`
        );
        return;
      }

      const amount =
        amountToRemove(
          currentBet
        );

      setComeOdds(
        (current) => ({
          ...current,
          [number]:
            current[number] -
            amount,
        })
      );

      setBankroll(
        (current) =>
          current + amount
      );

      return;
    }

    const max =
      flatBet *
      getPassOddsMultiplier(
        number
      );

    if (
      comeOdds[number] +
        selectedChip >
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
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setComeOdds(
      (current) => ({
        ...current,
        [number]:
          current[number] +
          selectedChip,
      })
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  /*
    DON'T COME ODDS
  */

  function handleDontComeOdds(
    event: React.MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    const flatBet =
      dontComeBets[number];

    if (!flatBet) {
      setMessage(
        `No Don't Come bet behind ${number}.`
      );
      return;
    }

    const removing =
      wantsRemove(event);

    if (removing) {
      const currentBet =
        dontComeOdds[number];

      if (currentBet === 0) {
        setMessage(
          `There are no Don't Come lay odds behind ${number}.`
        );
        return;
      }

      const amount =
        amountToRemove(
          currentBet
        );

      setDontComeOdds(
        (current) => ({
          ...current,
          [number]:
            current[number] -
            amount,
        })
      );

      setBankroll(
        (current) =>
          current + amount
      );

      return;
    }

    const max =
      flatBet * 6;

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
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setDontComeOdds(
      (current) => ({
        ...current,
        [number]:
          current[number] +
          selectedChip,
      })
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  /*
    HARDWAYS
  */

  function handleHardway(
    event: React.MouseEvent<HTMLButtonElement>,
    number: number
  ) {
    const removing =
      wantsRemove(event);

    if (removing) {
      const currentBet =
        hardways[number];

      if (currentBet === 0) {
        setMessage(
          `There is no Hard ${number} bet to remove.`
        );
        return;
      }

      const amount =
        amountToRemove(
          currentBet
        );

      setHardways(
        (current) => ({
          ...current,
          [number]:
            current[number] -
            amount,
        })
      );

      setBankroll(
        (current) =>
          current + amount
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setHardways(
      (current) => ({
        ...current,
        [number]:
          current[number] +
          selectedChip,
      })
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  function resolveHardways(
    first: number,
    second: number,
    total: number
  ) {
    const messages: string[] =
      [];

    const next = {
      ...hardways,
    };

    if (total === 7) {
      const lost =
        Object.values(
          next
        ).reduce(
          (sum, value) =>
            sum + value,
          0
        );

      if (lost > 0) {
        messages.push(
          `Hardways lose $${money(
            lost
          )}.`
        );
      }

      setHardways(
        emptyHardways()
      );

      return messages;
    }

    if (
      !hardwayNumbers.includes(
        total
      )
    ) {
      return messages;
    }

    const bet =
      next[total];

    if (!bet) {
      return messages;
    }

    if (first === second) {
      const multiplier =
        total === 4 ||
        total === 10
          ? 7
          : 9;

      const profit =
        casinoPayout(
          bet * multiplier
        );

      setBankroll(
        (current) =>
          current + profit
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

  /*
    PROPS
  */

  function handlePropBet(
    event: React.MouseEvent<HTMLButtonElement>,
    currentBet: number,
    setter: React.Dispatch<
      React.SetStateAction<number>
    >,
    name: string
  ) {
    const removing =
      wantsRemove(event);

    if (removing) {
      if (currentBet === 0) {
        setMessage(
          `There is no ${name} bet to remove.`
        );
        return;
      }

      const amount =
        amountToRemove(
          currentBet
        );

      setter(
        (current) =>
          current - amount
      );

      setBankroll(
        (current) =>
          current + amount
      );

      return;
    }

    if (selectedChip > bankroll) {
      setMessage(
        "Not enough bankroll."
      );
      return;
    }

    setter(
      (current) =>
        current + selectedChip
    );

    setBankroll(
      (current) =>
        current - selectedChip
    );
  }

  function resolvePropBets(
    total: number
  ) {
    const messages: string[] =
      [];

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
      if (
        [2, 3, 12].includes(
          total
        )
      ) {
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
      if (
        [2, 3, 11, 12].includes(
          total
        )
      ) {
        const unit =
          hornBet / 4;

        const multiplier =
          total === 2 ||
          total === 12
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

  /*
    COME RESOLUTION
  */

  function resolveComeBets(
    total: number
  ) {
    const messages: string[] =
      [];

    const nextCome = {
      ...comeBets,
    };

    const nextOdds = {
      ...comeOdds,
    };

    if (total === 7) {
      let lost = 0;

      for (
        const number of pointNumbers
      ) {
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
      pointNumbers.includes(
        total
      ) &&
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
          odds +
          oddsProfit;
      }

      setBankroll(
        (current) =>
          current + returned
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

    if (
      activeComeBet > 0
    ) {
      const bet =
        activeComeBet;

      if (
        total === 7 ||
        total === 11
      ) {
        setBankroll(
          (current) =>
            current +
            bet * 2
        );

        messages.push(
          `Come wins $${money(
            bet
          )}.`
        );

        setActiveComeBet(0);
      } else if (
        [2, 3, 12].includes(
          total
        )
      ) {
        messages.push(
          `Come loses $${money(
            bet
          )}.`
        );

        setActiveComeBet(0);
      } else if (
        pointNumbers.includes(
          total
        )
      ) {
        nextCome[total] +=
          bet;

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

  function resolveDontComeBets(
    total: number
  ) {
    const messages: string[] =
      [];

    const nextDC = {
      ...dontComeBets,
    };

    const nextOdds = {
      ...dontComeOdds,
    };

    if (total === 7) {
      for (
        const number of pointNumbers
      ) {
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
              lay +
              layProfit;
          }

          setBankroll(
            (current) =>
              current +
              returned
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
      pointNumbers.includes(
        total
      ) &&
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

    if (
      activeDontComeBet > 0
    ) {
      const bet =
        activeDontComeBet;

      if (
        total === 2 ||
        total === 3
      ) {
        setBankroll(
          (current) =>
            current +
            bet * 2
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
      } else if (
        total === 12
      ) {
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
        pointNumbers.includes(
          total
        )
      ) {
        nextDC[total] +=
          bet;

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

  /*
    ROLL
  */

  function rollDice() {
    let first: number;
    let second: number;

    if (testingMode) {
      [first, second] =
        makeDiceForTotal(
          forcedTotal
        );
    } else {
      first =
        Math.floor(
          Math.random() * 6
        ) + 1;

      second =
        Math.floor(
          Math.random() * 6
        ) + 1;
    }

    const total =
      first + second;

    setDieOne(first);
    setDieTwo(second);
    setRollTotal(total);

    setRollCount(
      (current) =>
        current + 1
    );

    setRollHistory(
      (current) => [
        {
          first,
          second,
          total,
        },
        ...current,
      ].slice(0, 12)
    );

    const messages: string[] =
      [];

    const fieldMessage =
      resolveField(total);

    if (fieldMessage) {
      messages.push(
        fieldMessage
      );
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
        ...resolveComeBets(
          total
        )
      );

      messages.push(
        ...resolveDontComeBets(
          total
        )
      );
    }

    /*
      COME OUT
    */

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
          pointNumbers.includes(
            total
          )
        ) {
          const result =
            resolvePlaceBet(
              total
            );

          if (result) {
            messages.push(
              result
            );
          }
        }
      }

      if (
        total === 7 ||
        total === 11
      ) {
        messages.unshift(
          `${total} — Natural!`
        );

        if (
          passLineBet > 0
        ) {
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

        if (
          dontPassBet > 0
        ) {
          messages.push(
            `Don't Pass loses $${money(
              dontPassBet
            )}.`
          );

          setDontPassBet(0);
          setDontPassOddsBet(0);
        }

        setMessage(
          messages.join(" ")
        );

        return;
      }

      if (
        total === 2 ||
        total === 3
      ) {
        messages.unshift(
          `${total} — Craps.`
        );

        if (
          passLineBet > 0
        ) {
          messages.push(
            `Pass Line loses $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (
          dontPassBet > 0
        ) {
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

        setMessage(
          messages.join(" ")
        );

        return;
      }

      if (total === 12) {
        messages.unshift(
          "12 — Craps."
        );

        if (
          passLineBet > 0
        ) {
          messages.push(
            `Pass Line loses $${money(
              passLineBet
            )}.`
          );

          setPassLineBet(0);
          setPassOddsBet(0);
        }

        if (
          dontPassBet > 0
        ) {
          setBankroll(
            (current) =>
              current +
              dontPassBet
          );

          messages.push(
            "Don't Pass bars 12."
          );

          setDontPassBet(0);
        }

        setMessage(
          messages.join(" ")
        );

        return;
      }

      if (
        pointNumbers.includes(
          total
        )
      ) {
        setPoint(total);

        messages.unshift(
          `Point established: ${total}.`
        );

        setMessage(
          messages.join(" ")
        );

        return;
      }
    }

    /*
      SEVEN OUT
    */

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

      if (
        dontPassBet > 0
      ) {
        let returned =
          dontPassBet * 2;

        let profit = 0;

        if (
          dontPassOddsBet > 0
        ) {
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
            current +
            returned
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

      setMessage(
        messages.join(" ")
      );

      return;
    }

    /*
      PLACE HIT
    */

    const placeMessage =
      resolvePlaceBet(total);

    if (placeMessage) {
      messages.push(
        placeMessage
      );
    }

    /*
      POINT MADE
    */

    if (total === point) {
      messages.unshift(
        `${total} — Point made!`
      );

      if (
        passLineBet > 0
      ) {
        let returned =
          passLineBet * 2;

        let oddsProfit = 0;

        if (
          passOddsBet > 0
        ) {
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
            current +
            returned
        );

        messages.push(
          `Pass Line wins $${money(
            passLineBet
          )}.`
        );

        if (
          oddsProfit
        ) {
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

      setMessage(
        messages.join(" ")
      );

      return;
    }

    if (
      messages.length === 0
    ) {
      messages.push(
        `${total} — No decision.`
      );
    } else {
      messages.unshift(
        `${total} rolled.`
      );
    }

    setMessage(
      messages.join(" ")
    );
  }

  return (
    <main className="min-h-screen bg-[#061a14] px-3 py-4 text-white sm:px-5">
      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-800 bg-black/20 px-5 py-4">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">
              🎲 Lucky Penny Craps
            </h1>

            <p className="text-xs font-semibold text-emerald-300">
              Practice • Play • Learn
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-right">
            <Link
              href="/"
              className="text-sm text-emerald-300 underline"
            >
              Home
            </Link>

            <Stat
              label="Bankroll"
              value={`$${money(bankroll)}`}
            />

            <Stat
              label="On Table"
              value={`$${money(totalOnTable)}`}
            />

            <Stat
              label="Session P/L"
              value={`${sessionPL > 0 ? "+" : ""}$${money(
                sessionPL
              )}`}
              positive={sessionPL > 0}
              negative={sessionPL < 0}
            />

            <Stat
              label="Rolls"
              value={`${rollCount}`}
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-[34px] border-[7px] border-amber-800 bg-[#087642] shadow-2xl">
          <div className="border-4 border-amber-950/30 p-3 sm:p-5">

            {/* NUMBERS */}

            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {pointNumbers.map(
                (number) => (
                  <div
                    key={number}
                    className={`relative min-h-32 rounded-xl border-2 p-3 text-center ${
                      point === number
                        ? "border-yellow-300 bg-emerald-600"
                        : "border-white/70 bg-emerald-700/50"
                    }`}
                  >
                    {point ===
                      number && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border-4 border-black bg-white px-3 py-1 text-xs font-black text-black shadow-xl">
                        ON
                      </div>
                    )}

                    <button
                      onClick={(
                        event
                      ) =>
                        handleNumberBet(
                          event,
                          number
                        )
                      }
                      className="w-full"
                    >
                      <span className="block text-4xl font-black">
                        {number}
                      </span>

                      <span className="block text-[10px] font-black tracking-widest text-emerald-100">
                        PLACE
                      </span>

                      <div className="mt-2 flex justify-center">
                        <BetChip
                          amount={
                            placeBets[
                              number
                            ]
                          }
                        />
                      </div>
                    </button>

                    {comeBets[
                      number
                    ] > 0 && (
                      <div className="mt-2 border-t border-white/30 pt-2 text-xs">
                        <div className="font-bold">
                          COME $
                          {money(
                            comeBets[
                              number
                            ]
                          )}
                        </div>

                        <button
                          onClick={(
                            event
                          ) =>
                            handleComeOdds(
                              event,
                              number
                            )
                          }
                          className="mt-1 rounded bg-blue-900 px-2 py-1 text-[10px] font-black"
                        >
                          ODDS $
                          {money(
                            comeOdds[
                              number
                            ]
                          )}
                        </button>
                      </div>
                    )}

                    {dontComeBets[
                      number
                    ] > 0 && (
                      <div className="mt-2 border-t border-white/30 pt-2 text-xs">
                        <div className="font-bold text-red-100">
                          DC $
                          {money(
                            dontComeBets[
                              number
                            ]
                          )}
                        </div>

                        <button
                          onClick={(
                            event
                          ) =>
                            handleDontComeOdds(
                              event,
                              number
                            )
                          }
                          className="mt-1 rounded bg-red-950 px-2 py-1 text-[10px] font-black"
                        >
                          LAY $
                          {money(
                            dontComeOdds[
                              number
                            ]
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* MAIN LOWER TABLE */}

            <div className="mt-3 grid gap-3 xl:grid-cols-[2fr_1fr]">

              {/* LEFT */}

              <div>
                <button
                  onClick={
                    handleComeBet
                  }
                  className="relative min-h-24 w-full rounded-xl border-2 border-white/80 bg-emerald-700/30 text-4xl font-black tracking-widest hover:bg-emerald-600"
                >
                  COME

                  <span className="absolute right-5 top-1/2 -translate-y-1/2">
                    <BetChip
                      amount={
                        activeComeBet
                      }
                    />
                  </span>
                </button>

                <button
                  onClick={
                    handleFieldBet
                  }
                  className="relative mt-3 w-full rounded-xl border-2 border-white/80 bg-emerald-700/30 px-3 py-5 font-black hover:bg-emerald-600"
                >
                  <span className="text-3xl">
                    FIELD
                  </span>

                  <span className="ml-5 text-base tracking-widest text-emerald-100">
                    2 • 3 • 4 • 9 •
                    10 • 11 • 12
                  </span>

                  <span className="absolute right-5 top-1/2 -translate-y-1/2">
                    <BetChip
                      amount={
                        fieldBet
                      }
                    />
                  </span>
                </button>

                <button
                  onClick={
                    handleDontComeBet
                  }
                  className="relative mt-3 w-full rounded-xl border-2 border-white/70 bg-emerald-950/20 py-4 text-xl font-black tracking-wider"
                >
                  DON&apos;T COME —
                  BAR 12

                  <span className="absolute right-5 top-1/2 -translate-y-1/2">
                    <BetChip
                      amount={
                        activeDontComeBet
                      }
                      dark
                    />
                  </span>
                </button>

                <button
                  onClick={
                    handleDontPassBet
                  }
                  className="relative mt-3 w-full rounded-xl border-2 border-white/70 bg-emerald-950/20 py-4 text-xl font-black tracking-wider"
                >
                  DON&apos;T PASS —
                  BAR 12

                  <span className="absolute right-5 top-1/2 -translate-y-1/2">
                    <BetChip
                      amount={
                        dontPassBet
                      }
                      dark
                    />
                  </span>
                </button>

                {point !== null &&
                  dontPassBet >
                    0 && (
                    <button
                      onClick={
                        handleDontPassOdds
                      }
                      className="mt-2 w-full rounded-lg border border-red-300 bg-red-950/60 p-3 text-sm font-black"
                    >
                      DON&apos;T PASS
                      LAY ODDS — $
                      {money(
                        dontPassOddsBet
                      )}
                    </button>
                  )}

                <button
                  onClick={
                    handlePassLineBet
                  }
                  className="relative mt-3 w-full rounded-xl border-4 border-white bg-emerald-600 py-5 text-3xl font-black tracking-widest"
                >
                  PASS LINE

                  <span className="absolute right-5 top-1/2 -translate-y-1/2">
                    <BetChip
                      amount={
                        passLineBet
                      }
                    />
                  </span>
                </button>

                {point !== null &&
                  passLineBet >
                    0 && (
                    <button
                      onClick={
                        handlePassOdds
                      }
                      className="mt-2 w-full rounded-lg border border-yellow-300 bg-yellow-400 p-3 text-sm font-black text-black"
                    >
                      PASS ODDS — $
                      {money(
                        passOddsBet
                      )}
                    </button>
                  )}
              </div>

              {/* CENTER ACTION */}

              <div className="rounded-xl border-2 border-white/40 bg-[#075f38] p-3">
                <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.3em] text-emerald-100">
                  Center Action
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {hardwayNumbers.map(
                    (number) => (
                      <button
                        key={
                          number
                        }
                        onClick={(
                          event
                        ) =>
                          handleHardway(
                            event,
                            number
                          )
                        }
                        className="rounded-lg border border-white/60 bg-emerald-950/40 p-3 font-black"
                      >
                        HARD {number}

                        <span className="mt-1 block text-[9px] text-emerald-200">
                          {number ===
                            4 ||
                          number ===
                            10
                            ? "7:1"
                            : "9:1"}
                        </span>

                        <div className="mt-1 flex justify-center">
                          <BetChip
                            amount={
                              hardways[
                                number
                              ]
                            }
                          />
                        </div>
                      </button>
                    )
                  )}

                  <button
                    onClick={(
                      event
                    ) =>
                      handlePropBet(
                        event,
                        anySevenBet,
                        setAnySevenBet,
                        "Any 7"
                      )
                    }
                    className="rounded-lg border border-white/60 p-3 font-black"
                  >
                    ANY 7
                    <span className="block text-[9px]">
                      4:1
                    </span>

                    <div className="mt-1 flex justify-center">
                      <BetChip
                        amount={
                          anySevenBet
                        }
                      />
                    </div>
                  </button>

                  <button
                    onClick={(
                      event
                    ) =>
                      handlePropBet(
                        event,
                        anyCrapsBet,
                        setAnyCrapsBet,
                        "Any Craps"
                      )
                    }
                    className="rounded-lg border border-white/60 p-3 font-black"
                  >
                    ANY CRAPS
                    <span className="block text-[9px]">
                      2 • 3 • 12
                    </span>

                    <div className="mt-1 flex justify-center">
                      <BetChip
                        amount={
                          anyCrapsBet
                        }
                      />
                    </div>
                  </button>

                  <button
                    onClick={(
                      event
                    ) =>
                      handlePropBet(
                        event,
                        yoBet,
                        setYoBet,
                        "Yo 11"
                      )
                    }
                    className="rounded-lg border border-white/60 p-3 font-black"
                  >
                    YO 11
                    <span className="block text-[9px]">
                      15:1
                    </span>

                    <div className="mt-1 flex justify-center">
                      <BetChip
                        amount={
                          yoBet
                        }
                      />
                    </div>
                  </button>

                  <button
                    onClick={(
                      event
                    ) =>
                      handlePropBet(
                        event,
                        hornBet,
                        setHornBet,
                        "Horn"
                      )
                    }
                    className="rounded-lg border border-white/60 p-3 font-black"
                  >
                    HORN
                    <span className="block text-[9px]">
                      2 • 3 • 11 •
                      12
                    </span>

                    <div className="mt-1 flex justify-center">
                      <BetChip
                        amount={
                          hornBet
                        }
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DICE + HISTORY */}

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_330px]">
          <div className="rounded-2xl border border-emerald-700 bg-black/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Dealer
            </p>

            <p className="mt-2 min-h-12 text-lg font-semibold text-amber-200">
              {message}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-5">
              <div className="text-7xl">
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

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Last Roll
                </p>

                <p className="text-4xl font-black">
                  {rollTotal}
                </p>
              </div>

              <button
                onClick={rollDice}
                className="rounded-xl bg-amber-400 px-10 py-4 text-xl font-black text-black shadow-lg transition hover:scale-105 hover:bg-amber-300"
              >
                ROLL DICE
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-700 bg-black/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Recent Rolls
            </p>

            {rollHistory.length ===
            0 ? (
              <p className="mt-4 text-sm text-emerald-300">
                No rolls yet.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {rollHistory.map(
                  (
                    roll,
                    index
                  ) => (
                    <div
                      key={`${roll.first}-${roll.second}-${index}`}
                      className={`rounded-lg border p-2 text-center ${
                        roll.total ===
                        7
                          ? "border-red-400 bg-red-950/50"
                          : "border-emerald-700 bg-emerald-950/50"
                      }`}
                    >
                      <div className="text-xl">
                        {
                          diceFaces[
                            roll.first -
                              1
                          ]
                        }
                        {
                          diceFaces[
                            roll.second -
                              1
                          ]
                        }
                      </div>

                      <div className="text-sm font-black">
                        {
                          roll.total
                        }
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* CONTROL RAIL */}

        <div className="mt-4 rounded-2xl border border-emerald-800 bg-black/20 p-4">
          <div className="flex flex-wrap items-center justify-center gap-3">

            <button
              onClick={() =>
                setRemoveMode(
                  false
                )
              }
              className={`rounded-lg px-5 py-2 font-black ${
                !removeMode
                  ? "bg-amber-400 text-black"
                  : "border border-white/40"
              }`}
            >
              ADD BET
            </button>

            <button
              onClick={() =>
                setRemoveMode(
                  true
                )
              }
              className={`rounded-lg px-5 py-2 font-black ${
                removeMode
                  ? "bg-red-600"
                  : "border border-white/40"
              }`}
            >
              REMOVE BET
            </button>

            <button
              onClick={() =>
                setPlaceBetsWorking(
                  (current) =>
                    !current
                )
              }
              className={`rounded-lg px-5 py-2 text-sm font-black ${
                placeBetsWorking
                  ? "bg-amber-400 text-black"
                  : "border border-emerald-500"
              }`}
            >
              PLACE BETS:{" "}
              {placeBetsWorking
                ? "WORKING"
                : "OFF ON COME-OUT"}
            </button>

            <button
              onClick={
                resetTable
              }
              className="rounded-lg border border-red-400 px-5 py-2 text-sm font-black text-red-200"
            >
              RESET TABLE
            </button>
          </div>

          <p className="mt-3 text-center text-xs font-bold text-emerald-300">
            Tip: Hold{" "}
            <span className="rounded border border-white/30 bg-black/30 px-2 py-1 text-white">
              SHIFT
            </span>{" "}
            and click any removable bet
            to take chips down.
          </p>

          {/* CHIPS */}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="mr-2 text-xs font-black uppercase tracking-widest text-emerald-300">
              Chip
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
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-4 font-black shadow-lg transition hover:scale-110 ${
                    selectedChip ===
                    chip
                      ? "border-yellow-300 bg-amber-100 text-black ring-4 ring-yellow-300/30"
                      : "border-dashed border-white bg-white text-black"
                  }`}
                >
                  ${chip}
                </button>
              )
            )}
          </div>
        </div>

        {/* TEST MODE */}

        <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-purple-500/40 bg-purple-950/20 p-4 text-center">
          <button
            onClick={() =>
              setTestingMode(
                (current) =>
                  !current
              )
            }
            className={`rounded-lg px-5 py-2 text-sm font-black ${
              testingMode
                ? "bg-purple-500"
                : "border border-purple-400"
            }`}
          >
            TEST MODE:{" "}
            {testingMode
              ? "ON"
              : "OFF"}
          </button>

          {testingMode && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <label className="font-bold">
                Force Roll
              </label>

              <select
                value={
                  forcedTotal
                }
                onChange={(
                  event
                ) =>
                  setForcedTotal(
                    Number(
                      event
                        .target
                        .value
                    )
                  )
                }
                className="rounded-lg bg-white px-4 py-2 font-bold text-black"
              >
                {Array.from(
                  {
                    length: 11,
                  },
                  (
                    _,
                    index
                  ) =>
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

              {hardwayNumbers.includes(
                forcedTotal
              ) && (
                <label className="flex items-center gap-2 font-bold">
                  <input
                    type="checkbox"
                    checked={
                      forceHardway
                    }
                    onChange={(
                      event
                    ) =>
                      setForceHardway(
                        event
                          .target
                          .checked
                      )
                    }
                  />

                  Force Hardway
                </label>
              )}
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-emerald-500">
          Practice credits have no
          cash value.
        </p>
      </div>
    </main>
  );
}

/*
  SMALL DISPLAY COMPONENT
*/

function Stat({
  label,
  value,
  positive = false,
  negative = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400">
        {label}
      </p>

      <p
        className={`text-lg font-black ${
          positive
            ? "text-emerald-300"
            : negative
              ? "text-red-300"
              : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}