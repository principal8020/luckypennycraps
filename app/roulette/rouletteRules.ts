export type RoulettePocket = "0" | "00" | `${number}`;

export type RouletteSelection =
  | { kind: "straight"; pocket: RoulettePocket }
  | { kind: "split"; pockets: [RoulettePocket, RoulettePocket] }
  | {
      kind: "corner";
      pockets: [RoulettePocket, RoulettePocket, RoulettePocket, RoulettePocket];
    }
  | { kind: "color"; color: "red" | "black" }
  | { kind: "parity"; parity: "even" | "odd" }
  | { kind: "range"; range: "low" | "high" }
  | { kind: "dozen"; dozen: 1 | 2 | 3 }
  | { kind: "column"; column: 1 | 2 | 3 };

export type RouletteBet = {
  selection: RouletteSelection;
  amount: number;
};

export type WinningRouletteBet = RouletteBet & {
  label: string;
  profit: number;
  returnAmount: number;
};

export type RouletteSettlement = {
  totalStake: number;
  grossReturn: number;
  net: number;
  winningBets: WinningRouletteBet[];
};

export const AMERICAN_WHEEL: RoulettePocket[] = [
  "0",
  "28",
  "9",
  "26",
  "30",
  "11",
  "7",
  "20",
  "32",
  "17",
  "5",
  "22",
  "34",
  "15",
  "3",
  "24",
  "36",
  "13",
  "1",
  "00",
  "27",
  "10",
  "25",
  "29",
  "12",
  "8",
  "19",
  "31",
  "18",
  "6",
  "21",
  "33",
  "16",
  "4",
  "23",
  "35",
  "14",
  "2",
];

const redNumbers = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18,
  19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

function numericPocket(pocket: RoulettePocket) {
  if (pocket === "00") return null;
  const value = Number(pocket);
  return value === 0 ? null : value;
}

export function pocketColor(pocket: RoulettePocket) {
  const value = numericPocket(pocket);
  if (value === null) return "green" as const;
  return redNumbers.has(value) ? ("red" as const) : ("black" as const);
}

export function selectionKey(selection: RouletteSelection) {
  switch (selection.kind) {
    case "straight":
      return `straight:${selection.pocket}`;
    case "split":
      return `split:${selection.pockets.join(":")}`;
    case "corner":
      return `corner:${selection.pockets.join(":")}`;
    case "color":
      return `color:${selection.color}`;
    case "parity":
      return `parity:${selection.parity}`;
    case "range":
      return `range:${selection.range}`;
    case "dozen":
      return `dozen:${selection.dozen}`;
    case "column":
      return `column:${selection.column}`;
  }
}

export function selectionLabel(selection: RouletteSelection) {
  switch (selection.kind) {
    case "straight":
      return `Straight ${selection.pocket}`;
    case "split":
      return `Split ${selection.pockets.join(" / ")}`;
    case "corner":
      return `Corner ${selection.pockets.join(" / ")}`;
    case "color":
      return selection.color === "red" ? "Red" : "Black";
    case "parity":
      return selection.parity === "even" ? "Even" : "Odd";
    case "range":
      return selection.range === "low" ? "1 to 18" : "19 to 36";
    case "dozen":
      return `${selection.dozen}${selection.dozen === 1 ? "st" : selection.dozen === 2 ? "nd" : "rd"} 12`;
    case "column":
      return `Column ${selection.column}`;
  }
}

export function payoutOdds(selection: RouletteSelection) {
  if (selection.kind === "straight") return 35;
  if (selection.kind === "split") return 17;
  if (selection.kind === "corner") return 8;
  if (selection.kind === "dozen" || selection.kind === "column") return 2;
  return 1;
}

export function selectionWins(
  selection: RouletteSelection,
  outcome: RoulettePocket
) {
  if (selection.kind === "straight") {
    return selection.pocket === outcome;
  }

  if (selection.kind === "split" || selection.kind === "corner") {
    return selection.pockets.includes(outcome);
  }

  const value = numericPocket(outcome);
  if (value === null) return false;

  switch (selection.kind) {
    case "color":
      return pocketColor(outcome) === selection.color;
    case "parity":
      return selection.parity === "even"
        ? value % 2 === 0
        : value % 2 === 1;
    case "range":
      return selection.range === "low" ? value <= 18 : value >= 19;
    case "dozen":
      return Math.ceil(value / 12) === selection.dozen;
    case "column":
      return ((value - 1) % 3) + 1 === selection.column;
  }
}

export function settleRouletteBets(
  bets: RouletteBet[],
  outcome: RoulettePocket
): RouletteSettlement {
  let totalStake = 0;
  let grossReturn = 0;
  const winningBets: WinningRouletteBet[] = [];

  for (const bet of bets) {
    totalStake += bet.amount;
    if (!selectionWins(bet.selection, outcome)) continue;

    const profit = bet.amount * payoutOdds(bet.selection);
    const returnAmount = bet.amount + profit;
    grossReturn += returnAmount;
    winningBets.push({
      ...bet,
      label: selectionLabel(bet.selection),
      profit,
      returnAmount,
    });
  }

  return {
    totalStake,
    grossReturn,
    net: grossReturn - totalStake,
    winningBets,
  };
}

export function randomRoulettePocket(): RoulettePocket {
  const range = 2 ** 32;
  const limit = range - (range % AMERICAN_WHEEL.length);
  const buffer = new Uint32Array(1);
  let value = limit;

  while (value >= limit) {
    globalThis.crypto.getRandomValues(buffer);
    value = buffer[0];
  }

  return AMERICAN_WHEEL[value % AMERICAN_WHEEL.length];
}
