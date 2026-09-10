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
