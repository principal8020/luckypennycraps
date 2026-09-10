const test = require("node:test");
const assert = require("node:assert/strict");

const rules = require("../.rules-test/rouletteRules.js");

test("American wheel has 38 unique pockets including 0 and 00", () => {
  assert.equal(rules.AMERICAN_WHEEL.length, 38);
  assert.equal(new Set(rules.AMERICAN_WHEEL).size, 38);
  assert.ok(rules.AMERICAN_WHEEL.includes("0"));
  assert.ok(rules.AMERICAN_WHEEL.includes("00"));
});

test("standard American roulette colors are assigned correctly", () => {
  for (const pocket of ["1", "3", "18", "19", "32", "36"]) {
    assert.equal(rules.pocketColor(pocket), "red");
  }
  for (const pocket of ["2", "4", "17", "20", "31", "35"]) {
    assert.equal(rules.pocketColor(pocket), "black");
  }
  assert.equal(rules.pocketColor("0"), "green");
  assert.equal(rules.pocketColor("00"), "green");
});

test("straight-up bets pay 35 to 1", () => {
  const bet = { kind: "straight", pocket: "17" };
  assert.equal(rules.payoutOdds(bet), 35);
  assert.equal(rules.selectionWins(bet, "17"), true);
  assert.equal(rules.selectionWins(bet, "7"), false);
});

test("adjacent-number split bets pay 17 to 1", () => {
  const horizontalSplit = { kind: "split", pockets: ["26", "29"] };
  const verticalSplit = { kind: "split", pockets: ["21", "24"] };

  assert.equal(rules.payoutOdds(horizontalSplit), 17);
  assert.equal(rules.selectionWins(horizontalSplit, "26"), true);
  assert.equal(rules.selectionWins(horizontalSplit, "29"), true);
  assert.equal(rules.selectionWins(horizontalSplit, "32"), false);
  assert.equal(rules.selectionWins(verticalSplit, "24"), true);
});

test("zero-area split bets pay 17 to 1", () => {
  const zeroSplits = [
    ["0", "00"],
    ["00", "3"],
    ["00", "2"],
    ["0", "2"],
    ["0", "1"],
  ];

  for (const pockets of zeroSplits) {
    const split = { kind: "split", pockets };
    assert.equal(rules.payoutOdds(split), 17);
    assert.equal(rules.selectionWins(split, pockets[0]), true);
    assert.equal(rules.selectionWins(split, pockets[1]), true);
  }
});

test("three-number street bets pay 11 to 1", () => {
  const streets = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["13", "14", "15"],
    ["34", "35", "36"],
  ];

  for (const pockets of streets) {
    const street = { kind: "street", pockets };
    assert.equal(rules.payoutOdds(street), 11);
    for (const pocket of pockets) {
      assert.equal(rules.selectionWins(street, pocket), true);
    }
  }

  assert.equal(
    rules.selectionWins({ kind: "street", pockets: ["1", "2", "3"] }, "4"),
    false
  );
});

test("four-number corner bets pay 8 to 1", () => {
  const corner = { kind: "corner", pockets: ["16", "17", "19", "20"] };

  assert.equal(rules.payoutOdds(corner), 8);
  for (const pocket of corner.pockets) {
    assert.equal(rules.selectionWins(corner, pocket), true);
  }
  assert.equal(rules.selectionWins(corner, "18"), false);
});

test("split examples across the first and second dozens resolve correctly", () => {
  const fourSeven = { kind: "split", pockets: ["4", "7"] };
  const thirteenSixteen = { kind: "split", pockets: ["13", "16"] };

  assert.equal(rules.selectionWins(fourSeven, "4"), true);
  assert.equal(rules.selectionWins(fourSeven, "7"), true);
  assert.equal(rules.selectionWins(thirteenSixteen, "13"), true);
  assert.equal(rules.selectionWins(thirteenSixteen, "16"), true);
});

test("outside bets exclude both zero pockets", () => {
  const selections = [
    { kind: "color", color: "red" },
    { kind: "parity", parity: "even" },
    { kind: "range", range: "low" },
    { kind: "dozen", dozen: 1 },
    { kind: "column", column: 1 },
  ];

  for (const selection of selections) {
    assert.equal(rules.selectionWins(selection, "0"), false);
    assert.equal(rules.selectionWins(selection, "00"), false);
  }
});

test("dozens and columns resolve against the standard layout", () => {
  assert.equal(rules.selectionWins({ kind: "dozen", dozen: 2 }, "24"), true);
  assert.equal(rules.selectionWins({ kind: "dozen", dozen: 2 }, "25"), false);
  assert.equal(rules.selectionWins({ kind: "column", column: 1 }, "34"), true);
  assert.equal(rules.selectionWins({ kind: "column", column: 2 }, "35"), true);
  assert.equal(rules.selectionWins({ kind: "column", column: 3 }, "36"), true);
});

test("settlement returns stakes plus profit for winning bets", () => {
  const result = rules.settleRouletteBets(
    [
      { selection: { kind: "straight", pocket: "17" }, amount: 5 },
      { selection: { kind: "color", color: "black" }, amount: 25 },
      { selection: { kind: "parity", parity: "odd" }, amount: 10 },
      { selection: { kind: "dozen", dozen: 2 }, amount: 5 },
    ],
    "17"
  );

  assert.equal(result.totalStake, 45);
  assert.equal(result.grossReturn, 265);
  assert.equal(result.net, 220);
  assert.equal(result.winningBets.length, 4);
});

test("mixed straight, split, corner, and outside bets settle together", () => {
  const result = rules.settleRouletteBets(
    [
      { selection: { kind: "straight", pocket: "20" }, amount: 1 },
      { selection: { kind: "split", pockets: ["17", "20"] }, amount: 2 },
      {
        selection: {
          kind: "corner",
          pockets: ["16", "17", "19", "20"],
        },
        amount: 5,
      },
      { selection: { kind: "color", color: "black" }, amount: 10 },
    ],
    "20"
  );

  assert.equal(result.totalStake, 18);
  assert.equal(result.grossReturn, 137);
  assert.equal(result.net, 119);
  assert.equal(result.winningBets.length, 4);
});

test("a zero result loses outside bets but can win straight-up", () => {
  const result = rules.settleRouletteBets(
    [
      { selection: { kind: "straight", pocket: "00" }, amount: 5 },
      { selection: { kind: "color", color: "black" }, amount: 25 },
    ],
    "00"
  );

  assert.equal(result.grossReturn, 180);
  assert.equal(result.net, 150);
  assert.equal(result.winningBets[0].label, "Straight 00");
});
