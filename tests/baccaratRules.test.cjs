const test = require("node:test");
const assert = require("node:assert/strict");

const rules = require("../.rules-test/baccaratRules.js");

function card(rank, id = rank, suit = "♠") {
  return { id, rank, suit };
}

test("an eight-deck Baccarat shoe contains 416 unique cards", () => {
  const shoe = rules.buildBaccaratShoe();
  assert.equal(shoe.length, 416);
  assert.equal(new Set(shoe.map((item) => item.id)).size, 416);
});

test("Baccarat card values and modulo-ten totals are correct", () => {
  assert.equal(rules.baccaratCardValue(card("A")), 1);
  assert.equal(rules.baccaratCardValue(card("9")), 9);
  for (const rank of ["10", "J", "Q", "K"]) {
    assert.equal(rules.baccaratCardValue(card(rank)), 0);
  }
  assert.equal(rules.baccaratHandTotal([card("7"), card("8")]), 5);
  assert.equal(rules.baccaratHandTotal([card("A"), card("2"), card("9")]), 2);
});

test("Player draws on 0 through 5 and stands on 6 or 7", () => {
  for (let total = 0; total <= 5; total += 1) {
    assert.equal(rules.playerShouldDraw(total), true);
  }
  assert.equal(rules.playerShouldDraw(6), false);
  assert.equal(rules.playerShouldDraw(7), false);
});

test("Banker draws on 0 through 5 when Player stands", () => {
  for (let total = 0; total <= 5; total += 1) {
    assert.equal(rules.bankerShouldDraw(total), true);
  }
  assert.equal(rules.bankerShouldDraw(6), false);
  assert.equal(rules.bankerShouldDraw(7), false);
});

test("Banker third-card table is applied exactly", () => {
  for (let playerThird = 0; playerThird <= 9; playerThird += 1) {
    const rank = playerThird === 0 ? "10" : String(playerThird);
    assert.equal(rules.bankerShouldDraw(2, card(rank)), true);
    assert.equal(rules.bankerShouldDraw(3, card(rank)), playerThird !== 8);
    assert.equal(
      rules.bankerShouldDraw(4, card(rank)),
      playerThird >= 2 && playerThird <= 7
    );
    assert.equal(
      rules.bankerShouldDraw(5, card(rank)),
      playerThird >= 4 && playerThird <= 7
    );
    assert.equal(
      rules.bankerShouldDraw(6, card(rank)),
      playerThird === 6 || playerThird === 7
    );
    assert.equal(rules.bankerShouldDraw(7, card(rank)), false);
  }
});

test("a natural 8 or 9 stops both hands", () => {
  const shoe = [
    card("9", "p1"),
    card("8", "b1"),
    card("K", "p2"),
    card("Q", "b2"),
    card("7", "unused-1"),
    card("6", "unused-2"),
  ];
  const round = rules.dealBaccaratRound(shoe);
  assert.equal(round.natural, true);
  assert.equal(round.playerCards.length, 2);
  assert.equal(round.bankerCards.length, 2);
  assert.equal(round.outcome, "player");
  assert.equal(round.remainingShoe.length, 2);
});

test("cards are dealt Player, Banker, Player, Banker before third-card rules", () => {
  const shoe = [
    card("2", "p1"),
    card("3", "b1"),
    card("3", "p2"),
    card("2", "b2"),
    card("8", "p3"),
    card("K", "unused"),
  ];
  const round = rules.dealBaccaratRound(shoe);
  assert.deepEqual(round.playerCards.map((item) => item.id), ["p1", "p2", "p3"]);
  assert.deepEqual(round.bankerCards.map((item) => item.id), ["b1", "b2"]);
  assert.equal(round.outcome, "banker");
});

test("Banker draws using Player's third-card value", () => {
  const shoe = [
    card("2", "p1"),
    card("2", "b1"),
    card("3", "p2"),
    card("2", "b2"),
    card("6", "p3"),
    card("5", "b3"),
  ];
  const round = rules.dealBaccaratRound(shoe);
  assert.equal(round.playerInitialTotal, 5);
  assert.equal(round.bankerInitialTotal, 4);
  assert.equal(round.playerCards.length, 3);
  assert.equal(round.bankerCards.length, 3);
  assert.equal(round.bankerCards[2].id, "b3");
});

test("Player wager pays 1 to 1", () => {
  const result = rules.settleBaccaratBets(
    { player: 25, banker: 0, tie: 0 },
    "player"
  );
  assert.equal(result.totalStake, 25);
  assert.equal(result.grossReturn, 50);
  assert.equal(result.net, 25);
  assert.equal(result.commission, 0);
});

test("Banker wager pays 0.95 to 1 after commission", () => {
  const result = rules.settleBaccaratBets(
    { player: 0, banker: 25, tie: 0 },
    "banker"
  );
  assert.equal(result.grossReturn, 48.75);
  assert.equal(result.net, 23.75);
  assert.equal(result.commission, 1.25);
});

test("Tie wager pays 8 to 1 while Player and Banker wagers push", () => {
  const result = rules.settleBaccaratBets(
    { player: 10, banker: 15, tie: 5 },
    "tie"
  );
  assert.equal(result.totalStake, 30);
  assert.equal(result.grossReturn, 70);
  assert.equal(result.net, 40);
  assert.deepEqual(result.pushedBets, ["player", "banker"]);
});

test("losing positions return nothing", () => {
  const result = rules.settleBaccaratBets(
    { player: 5, banker: 10, tie: 5 },
    "player"
  );
  assert.equal(result.grossReturn, 10);
  assert.equal(result.net, -10);
});
