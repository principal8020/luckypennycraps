const test = require("node:test");
const assert = require("node:assert/strict");

const rules = require("../.rules-test/blackjackRules.js");

function card(id, rank, suit = "♠") {
  return { id, rank, suit };
}

test("6-deck blackjack shoe contains 312 unique cards", () => {
  const shoe = rules.buildShoe(6);
  assert.equal(shoe.length, 312);
  assert.equal(new Set(shoe.map((item) => item.id)).size, 312);
});

test("hand values correctly handle soft and hard aces", () => {
  assert.deepEqual(
    rules.getHandValue([card("a", "A"), card("6", "6")]),
    { total: 17, soft: true }
  );

  assert.deepEqual(
    rules.getHandValue([card("a", "A"), card("9", "9"), card("8", "8")]),
    { total: 18, soft: false }
  );

  assert.deepEqual(
    rules.getHandValue([card("a1", "A"), card("a2", "A"), card("9", "9")]),
    { total: 21, soft: true }
  );
});

test("blackjack requires exactly two cards totaling 21", () => {
  assert.equal(rules.isBlackjack([card("a", "A"), card("k", "K")]), true);
  assert.equal(
    rules.isBlackjack([card("7a", "7"), card("7b", "7"), card("7c", "7")]),
    false
  );
});

test("equal-value cards can be split, including mixed ten-value cards", () => {
  assert.equal(rules.canSplitPair([card("8a", "8"), card("8b", "8")]), true);
  assert.equal(rules.canSplitPair([card("j", "J"), card("k", "K")]), true);
  assert.equal(rules.canSplitPair([card("a", "A"), card("a2", "A")]), true);
  assert.equal(rules.canSplitPair([card("9", "9"), card("10", "10")]), false);
});

test("dealer stands on soft 17 and hits below 17", () => {
  assert.equal(rules.dealerShouldHit([card("a", "A"), card("6", "6")]), false);
  assert.equal(rules.dealerShouldHit([card("10", "10"), card("6", "6")]), true);
});

test("player blackjack pays 3 to 2", () => {
  const result = rules.resolveBlackjackRound(
    [card("a", "A"), card("k", "K")],
    [card("10", "10"), card("9", "9")],
    25
  );

  assert.equal(result.result, "blackjack");
  assert.equal(result.profit, 37.5);
  assert.equal(result.returnAmount, 62.5);
});

test("21 after a split pays even money rather than 3 to 2", () => {
  const result = rules.resolveBlackjackRound(
    [card("a", "A"), card("k", "K")],
    [card("10", "10"), card("q", "Q")],
    25,
    { blackjackEligible: false }
  );

  assert.equal(result.result, "win");
  assert.equal(result.profit, 25);
  assert.equal(result.returnAmount, 50);
});

test("matching blackjacks push", () => {
  const result = rules.resolveBlackjackRound(
    [card("a1", "A"), card("k1", "K")],
    [card("a2", "A"), card("q2", "Q")],
    25
  );

  assert.equal(result.result, "push");
  assert.equal(result.profit, 0);
  assert.equal(result.returnAmount, 25);
});

test("player bust loses immediately", () => {
  const result = rules.resolveBlackjackRound(
    [card("10", "10"), card("8", "8"), card("7", "7")],
    [card("10d", "10"), card("6d", "6")],
    25
  );

  assert.equal(result.result, "loss");
  assert.equal(result.profit, -25);
  assert.equal(result.returnAmount, 0);
});

test("dealer bust pays even money on a non-blackjack hand", () => {
  const result = rules.resolveBlackjackRound(
    [card("10", "10"), card("9", "9")],
    [card("10d", "10"), card("6d", "6"), card("8d", "8")],
    25
  );

  assert.equal(result.result, "win");
  assert.equal(result.profit, 25);
  assert.equal(result.returnAmount, 50);
});

test("higher total wins and equal totals push", () => {
  const win = rules.resolveBlackjackRound(
    [card("10", "10"), card("9", "9")],
    [card("10d", "10"), card("8d", "8")],
    25
  );
  assert.equal(win.result, "win");

  const push = rules.resolveBlackjackRound(
    [card("10p", "10"), card("8p", "8")],
    [card("10q", "10"), card("8q", "8")],
    25
  );
  assert.equal(push.result, "push");
});
