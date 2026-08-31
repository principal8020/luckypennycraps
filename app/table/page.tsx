"use client";

import { useState } from "react";

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const pointNumbers = [4, 5, 6, 8, 9, 10];
const chipValues = [1, 5, 10, 25, 100, 500];

type PlaceBets = {
  [key: number]: number;
};

export default function TablePage() {
  const [dieOne, setDieOne] = useState(1);
  const [dieTwo, setDieTwo] = useState(1);
  const [rollTotal, setRollTotal] = useState(2);

  const [point, setPoint] = useState<number | null>(null);
  const [message, setMessage] = useState("Come-out roll");

  const [bankroll, setBankroll] = useState(5000);
  const [selectedChip, setSelectedChip] = useState(25);
  const [removeMode, setRemoveMode] = useState(false);

  const [passLineBet, setPassLineBet] = useState(0);
  const [oddsBet, setOddsBet] = useState(0);

  const [placeBets, setPlaceBets] = useState<PlaceBets>({
    4: 0,
    5: 0,
    6: 0,
    8: 0,
    9: 0,
    10: 0,
  });

  function getOddsMultiplier(currentPoint: number) {
    if (currentPoint === 4 || currentPoint === 10) return 3;
    if (currentPoint === 5 || currentPoint === 9) return 4;
    return 5;
  }

  function getMaxOdds() {
    if (point === null) return 0;
    return passLineBet * getOddsMultiplier(point);
  }

  function placePassLineBet() {
    if (point !== null) {
      setMessage("Pass Line bets can only be added while the point is OFF.");
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll for that chip.");
      return;
    }

    setPassLineBet((currentBet) => currentBet + selectedChip);
    setBankroll((currentBankroll) => currentBankroll - selectedChip);

    setMessage(`Added $${selectedChip} to the Pass Line.`);
  }

  function placeOddsBet() {
    if (point === null) {
      setMessage("Odds are only available after a point is established.");
      return;
    }

    if (passLineBet === 0) {
      setMessage("You need a Pass Line bet before taking odds.");
      return;
    }

    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll for that chip.");
      return;
    }

    const maxOdds = getMaxOdds();

    if (oddsBet + selectedChip > maxOdds) {
      setMessage(`Maximum odds for point ${point} is $${maxOdds}.`);
      return;
    }

    setOddsBet((currentOdds) => currentOdds + selectedChip);
    setBankroll((currentBankroll) => currentBankroll - selectedChip);

    setMessage(`Added $${selectedChip} in odds behind the Pass Line.`);
  }

  function placeNumberBet(number: number) {
    if (selectedChip > bankroll) {
      setMessage("Not enough bankroll for that chip.");
      return;
    }

    const newTotal = placeBets[number] + selectedChip;

    setPlaceBets((currentBets) => ({
      ...currentBets,
      [number]: newTotal,
    }));

    setBankroll((currentBankroll) => currentBankroll - selectedChip);

    if ((number === 6 || number === 8) && newTotal % 6 !== 0) {
      setMessage(
        `Place ${number} is currently $${newTotal}. Add chips until the total is a multiple of $6.`
      );
    } else if (
      (number === 4 || number === 5 || number === 9 || number === 10) &&
      newTotal % 5 !== 0
    ) {
      setMessage(
        `Place ${number} is currently $${newTotal}. Add chips until the total is a multiple of $5.`
      );
    } else {
      setMessage(`Place ${number} is now $${newTotal}.`);
    }
  }

  function removeNumberBet(number: number) {
    const currentBet = placeBets[number];

    if (currentBet === 0) {
      setMessage(`There is no Place ${number} bet to remove.`);
      return;
    }

    if (selectedChip > currentBet) {
      setMessage(
        `You only have $${currentBet} on Place ${number}. Select a smaller chip.`
      );
      return;
    }

    setPlaceBets((currentBets) => ({
      ...currentBets,
      [number]: currentBets[number] - selectedChip,
    }));

    setBankroll((currentBankroll) => currentBankroll + selectedChip);

    setMessage(`Removed $${selectedChip} from Place ${number}.`);
  }

  function calculateOddsProfit(currentPoint: number, bet: number) {
    if (currentPoint === 4 || currentPoint === 10) {
      return bet * 2;
    }

    if (currentPoint === 5 || currentPoint === 9) {
      return bet * 1.5;
    }

    return bet * 1.2;
  }

  function calculatePlaceProfit(number: number, bet: number) {
    if (number === 4 || number === 10) {
      return (bet / 5) * 9;
    }

    if (number === 5 || number === 9) {
      return (bet / 5) * 7;
    }

    return (bet / 6) * 7;
  }

  function winPassLine(label: string, madePoint?: number) {
    let amountReturned = 0;

    if (passLineBet > 0) {
      amountReturned += passLineBet * 2;
    }

    if (oddsBet > 0 && madePoint !== undefined) {
      const oddsProfit = calculateOddsProfit(madePoint, oddsBet);
      amountReturned += oddsBet + oddsProfit;
    }

    if (amountReturned > 0) {
      setBankroll((currentBankroll) => currentBankroll + amountReturned);

      const passProfit = passLineBet;

      const oddsProfit =
        oddsBet > 0 && madePoint !== undefined
          ? calculateOddsProfit(madePoint, oddsBet)
          : 0;

      setMessage(
        `${label} Pass Line wins $${passProfit}` +
          (oddsBet > 0 ? ` and Odds win $${oddsProfit}.` : ".")
      );
    } else {
      setMessage(label);
    }

    setPassLineBet(0);
    setOddsBet(0);
  }

  function losePassLine(label: string) {
    if (passLineBet > 0 || oddsBet > 0) {
      const totalLost = passLineBet + oddsBet;
      setMessage(`${label} Total lost: $${totalLost}.`);
    } else {
      setMessage(label);
    }

    setPassLineBet(0);
    setOddsBet(0);
  }

  function resolvePlaceBet(total: number) {
    const activeBet = placeBets[total];

    if (!activeBet || activeBet === 0) {
      return null;
    }

    const profit = calculatePlaceProfit(total, activeBet);

    setBankroll((currentBankroll) => currentBankroll + profit);

    return `Place ${total} wins $${profit}. Bet stays up.`;
  }

  function clearAllPlaceBets() {
    const totalPlaceLoss = Object.values(placeBets).reduce(
      (sum, bet) => sum + bet,
      0
    );

    setPlaceBets({
      4: 0,
      5: 0,
      6: 0,
      8: 0,
      9: 0,
      10: 0,
    });

    return totalPlaceLoss;
  }

  function rollDice() {
    const invalidPlaceBet = pointNumbers.find((number) => {
      const bet = placeBets[number];

      if (bet === 0) return false;

      if (number === 6 || number === 8) {
        return bet % 6 !== 0;
      }

      return bet % 5 !== 0;
    });

    if (invalidPlaceBet !== undefined) {
      setMessage(`Fix your Place ${invalidPlaceBet} bet before rolling.`);
      return;
    }

    const first = Math.floor(Math.random() * 6) + 1;
    const second = Math.floor(Math.random() * 6) + 1;
    const total = first + second;

    setDieOne(first);
    setDieTwo(second);
    setRollTotal(total);

    if (point === null) {
      if (total === 7 || total === 11) {
        winPassLine(`${total} — Natural!`);
      } else if (total === 2 || total === 3 || total === 12) {
        losePassLine(`${total} — Craps.`);
      } else if (pointNumbers.includes(total)) {
        setPoint(total);
        setMessage(`Point established: ${total}`);
      }

      return;
    }

    if (total === 7) {
      const placeLoss = clearAllPlaceBets();
      const passLoss = passLineBet + oddsBet;

      setPassLineBet(0);
      setOddsBet(0);
      setPoint(null);

      const totalLost = passLoss + placeLoss;

      setMessage(
        totalLost > 0
          ? `7 — Seven out! Total lost: $${totalLost}.`
          : "7 — Seven out!"
      );

      return;
    }

    const placeMessage = resolvePlaceBet(total);

    if (total === point) {
      const madePoint = point;

      let amountReturned = 0;

      if (passLineBet > 0) {
        amountReturned += passLineBet * 2;
      }

      if (oddsBet > 0) {
        const oddsProfit = calculateOddsProfit(madePoint, oddsBet);
        amountReturned += oddsBet + oddsProfit;
      }

      if (amountReturned > 0) {
        setBankroll((currentBankroll) => currentBankroll + amountReturned);
      }

      const passProfit = passLineBet;
      const oddsProfit =
        oddsBet > 0 ? calculateOddsProfit(madePoint, oddsBet) : 0;

      setPassLineBet(0);
      setOddsBet(0);
      setPoint(null);

      const passMessage =
        passLineBet > 0
          ? `${total} — Point made! Pass Line wins $${passProfit}` +
            (oddsBet > 0 ? ` and Odds win $${oddsProfit}.` : ".")
          : `${total} — Point made!`;

      setMessage(
        placeMessage ? `${passMessage} ${placeMessage}` : passMessage
      );

      return;
    }

    if (placeMessage) {
      setMessage(placeMessage);
    } else {
      setMessage(`${total} — No decision.`);
    }
  }

  return (
    <main className="min-h-screen bg-emerald-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🎲 Lucky Penny Craps</h1>
            <p className="text-sm text-emerald-200">Practice Table</p>
          </div>

          <div className="flex gap-8 text-right">
            <div>
              <p className="text-xs uppercase text-emerald-300">Bankroll</p>
              <p className="text-2xl font-bold">
                ${bankroll.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-emerald-300">Point</p>
              <p className="text-2xl font-bold">
                {point === null ? "OFF" : point}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border-4 border-amber-700 bg-emerald-800 p-6 shadow-2xl">
          <div className="grid grid-cols-6 gap-2">
            {pointNumbers.map((number) => (
              <button
                key={number}
                onClick={() =>
                  removeMode ? removeNumberBet(number) : placeNumberBet(number)
                }
                className={`rounded-lg border-2 p-6 text-3xl font-bold ${
                  point === number
                    ? "border-amber-300 bg-amber-500 text-black"
                    : "border-white/70 bg-emerald-700 hover:bg-emerald-600"
                }`}
              >
                {number}

                <span className="mt-1 block text-xs font-normal">PLACE</span>

                {placeBets[number] > 0 && (
                  <span className="mt-2 block rounded-full bg-white px-2 py-1 text-sm text-black">
                    ${placeBets[number]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button className="mt-3 w-full rounded-lg border-2 border-white/70 p-7 text-3xl font-bold hover:bg-emerald-700">
            COME
          </button>

          <button className="mt-3 w-full rounded-lg border-2 border-white/70 p-5 text-2xl font-bold hover:bg-emerald-700">
            FIELD
            <span className="ml-5 text-lg">
              2 • 3 • 4 • 9 • 10 • 11 • 12
            </span>
          </button>

          <button className="mt-3 w-full rounded-lg border-2 border-white/70 p-4 text-xl font-bold hover:bg-emerald-700">
            DON&apos;T PASS BAR
          </button>

          <button
            onClick={placePassLineBet}
            className="mt-3 w-full rounded-lg border-2 border-white bg-emerald-700 p-5 text-2xl font-bold hover:bg-emerald-600"
          >
            PASS LINE

            {passLineBet > 0 && (
              <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                ${passLineBet}
              </span>
            )}
          </button>

          {point !== null && passLineBet > 0 && (
            <button
              onClick={placeOddsBet}
              className="mt-3 w-full rounded-lg border-2 border-amber-300 bg-amber-500 p-4 text-xl font-bold text-black hover:bg-amber-400"
            >
              PASS LINE ODDS

              {oddsBet > 0 && (
                <span className="ml-4 rounded-full bg-white px-3 py-1 text-base text-black">
                  ${oddsBet}
                </span>
              )}

              <span className="ml-4 text-sm">Max ${getMaxOdds()}</span>
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <span className="mr-2 text-sm uppercase text-emerald-200">
            Select Chip
          </span>

          {chipValues.map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedChip(chip)}
              className={`flex h-16 w-16 items-center justify-center rounded-full border-4 font-bold shadow-lg transition hover:scale-110 ${
                selectedChip === chip
                  ? "border-amber-400 bg-amber-100 text-black"
                  : "border-dashed border-white bg-white text-black"
              }`}
            >
              ${chip}
            </button>
          ))}
        </div>

        <p className="mt-3 text-center text-sm text-emerald-200">
          Selected chip: ${selectedChip}
        </p>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => setRemoveMode(false)}
            className={`rounded-lg px-6 py-2 font-bold ${
              !removeMode
                ? "bg-amber-500 text-black"
                : "border border-white/50 text-white"
            }`}
          >
            ADD BET
          </button>

          <button
            onClick={() => setRemoveMode(true)}
            className={`rounded-lg px-6 py-2 font-bold ${
              removeMode
                ? "bg-red-600 text-white"
                : "border border-white/50 text-white"
            }`}
          >
            REMOVE BET
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="mb-2 text-7xl">
            {diceFaces[dieOne - 1]} {diceFaces[dieTwo - 1]}
          </div>

          <p className="text-2xl font-bold">You rolled {rollTotal}</p>

          <p className="mb-4 mt-2 min-h-7 text-lg text-amber-300">
            {message}
          </p>

          <button
            onClick={rollDice}
            className="rounded-xl bg-amber-500 px-12 py-4 text-xl font-bold text-black shadow-lg hover:bg-amber-400"
          >
            ROLL DICE
          </button>

          <p className="mt-3 text-sm text-emerald-200">
            Select a chip, place your bets, then roll.
          </p>
        </div>
      </div>
    </main>
  );
}