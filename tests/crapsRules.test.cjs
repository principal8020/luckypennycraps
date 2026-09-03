const test = require("node:test");
const assert = require("node:assert/strict");

const rules = require("../.rules-test/crapsRules.js");

test("3-4-5x Pass/Come odds maximum multipliers", () => {
  assert.equal(rules.getPassOddsMultiplier(4), 3);
  assert.equal(rules.getPassOddsMultiplier(10), 3);
  assert.equal(rules.getPassOddsMultiplier(5), 4);
  assert.equal(rules.getPassOddsMultiplier(9), 4);
  assert.equal(rules.getPassOddsMultiplier(6), 5);
  assert.equal(rules.getPassOddsMultiplier(8), 5);
});

test("Pass/Come true odds payouts and rounding", () => {
  assert.equal(rules.calculatePassOddsProfit(4, 25), 50);
  assert.equal(rules.calculatePassOddsProfit(5, 25), 37);
  assert.equal(rules.calculatePassOddsProfit(6, 25), 30);
});

test("Don't Pass / Don't Come lay odds payouts and rounding", () => {
  assert.equal(rules.calculateLayOddsProfit(4, 25), 12);
  assert.equal(rules.calculateLayOddsProfit(5, 25), 16);
  assert.equal(rules.calculateLayOddsProfit(6, 25), 20);
});

test("number Lay bets apply the existing 5% win commission", () => {
  assert.equal(rules.calculateNumberLayNetProfit(4, 60), 28);
  assert.equal(rules.calculateNumberLayNetProfit(5, 60), 38);
  assert.equal(rules.calculateNumberLayNetProfit(6, 60), 47);
});

test("Place bet payouts round down", () => {
  assert.equal(rules.calculatePlaceProfit(4, 25), 45);
  assert.equal(rules.calculatePlaceProfit(5, 25), 35);
  assert.equal(rules.calculatePlaceProfit(6, 25), 29);
  assert.equal(rules.calculatePlaceProfit(8, 30), 35);
});

test("Place table maximums", () => {
  assert.equal(rules.getPlaceBetMax(4), 1000);
  assert.equal(rules.getPlaceBetMax(5), 1000);
  assert.equal(rules.getPlaceBetMax(6), 1200);
  assert.equal(rules.getPlaceBetMax(8), 1200);
  assert.equal(rules.getPlaceBetMax(9), 1000);
  assert.equal(rules.getPlaceBetMax(10), 1000);
});

test("Field payout schedule used by Lucky Penny", () => {
  assert.equal(rules.calculateFieldProfit(2, 25), 50);
  assert.equal(rules.calculateFieldProfit(12, 25), 75);
  assert.equal(rules.calculateFieldProfit(3, 25), 25);
  assert.equal(rules.calculateFieldProfit(4, 25), 25);
  assert.equal(rules.calculateFieldProfit(9, 25), 25);
  assert.equal(rules.calculateFieldProfit(10, 25), 25);
  assert.equal(rules.calculateFieldProfit(11, 25), 25);
  assert.equal(rules.calculateFieldProfit(5, 25), 0);
  assert.equal(rules.calculateFieldProfit(7, 25), 0);
});

test("Hardway payouts", () => {
  assert.equal(rules.calculateHardwayProfit(4, 5), 35);
  assert.equal(rules.calculateHardwayProfit(10, 5), 35);
  assert.equal(rules.calculateHardwayProfit(6, 5), 45);
  assert.equal(rules.calculateHardwayProfit(8, 5), 45);
});

test("Hop payouts", () => {
  assert.equal(rules.calculateHopProfit(3, 3, 5), 150);
  assert.equal(rules.calculateHopProfit(3, 4, 5), 75);
});

test("Quick Bet proper 6/8 sizing", () => {
  assert.equal(rules.properSixEightAmount(5), 6);
  assert.equal(rules.properSixEightAmount(10), 12);
  assert.equal(rules.properSixEightAmount(25), 30);
});

test("$5-base Quick Bets", () => {
  const inside = rules.buildInsideTarget(5);
  const across = rules.buildAcrossTarget(5);
  const iron = rules.buildIronCrossTarget(5);

  assert.deepEqual(inside, { 4: 0, 5: 5, 6: 6, 8: 6, 9: 5, 10: 0 });
  assert.deepEqual(across, { 4: 5, 5: 5, 6: 6, 8: 6, 9: 5, 10: 5 });
  assert.deepEqual(iron, { 4: 0, 5: 10, 6: 12, 8: 12, 9: 0, 10: 0 });

  assert.equal(Object.values(inside).reduce((a, b) => a + b, 0), 22);
  assert.equal(Object.values(across).reduce((a, b) => a + b, 0), 32);
  assert.equal(Object.values(iron).reduce((a, b) => a + b, 0) + 5, 39);
});

test("$10-base Quick Bets", () => {
  const inside = rules.buildInsideTarget(10);
  const across = rules.buildAcrossTarget(10);
  const iron = rules.buildIronCrossTarget(10);

  assert.equal(Object.values(inside).reduce((a, b) => a + b, 0), 44);
  assert.equal(Object.values(across).reduce((a, b) => a + b, 0), 64);
  assert.equal(Object.values(iron).reduce((a, b) => a + b, 0) + 10, 78);
});

test("smart max additions fill the remaining room instead of rejecting", () => {
  assert.equal(rules.calculateCappedAdd(100, 0, 75, 500), 75);
  assert.equal(rules.calculateCappedAdd(100, 50, 75, 500), 25);
  assert.equal(rules.calculateCappedAdd(100, 0, 75, 13), 13);
  assert.equal(rules.calculateCappedAdd(25, 75, 75, 500), 0);
});

test("World bet net-profit helper preserves current table convention", () => {
  assert.equal(rules.resolveWorldNetProfit(2, 5), 26);
  assert.equal(rules.resolveWorldNetProfit(3, 5), 11);
  assert.equal(rules.resolveWorldNetProfit(7, 5), 0);
  assert.equal(rules.resolveWorldNetProfit(8, 5), -1);
});

test("C & E net-profit helper preserves current table convention", () => {
  assert.equal(rules.resolveCeNetProfit(2, 2), 6);
  assert.equal(rules.resolveCeNetProfit(3, 2), 6);
  assert.equal(rules.resolveCeNetProfit(12, 2), 6);
  assert.equal(rules.resolveCeNetProfit(11, 2), 14);
  assert.equal(rules.resolveCeNetProfit(8, 2), -1);
});

test("Horn High helper", () => {
  assert.equal(rules.resolveHornHighNetProfit(2, 5, 2), 57);
  assert.equal(rules.resolveHornHighNetProfit(3, 5, 2), 11);
  assert.equal(rules.resolveHornHighNetProfit(12, 5, 2), 26);
  assert.equal(rules.resolveHornHighNetProfit(8, 5, 2), -1);
});

test("odds labels", () => {
  assert.equal(rules.passOddsLabel(4), "2:1");
  assert.equal(rules.passOddsLabel(5), "3:2");
  assert.equal(rules.passOddsLabel(6), "6:5");
  assert.equal(rules.layOddsLabel(4), "1:2");
  assert.equal(rules.layOddsLabel(5), "2:3");
  assert.equal(rules.layOddsLabel(6), "5:6");
  assert.equal(rules.placeOddsLabel(4), "9:5");
  assert.equal(rules.placeOddsLabel(5), "7:5");
  assert.equal(rules.placeOddsLabel(6), "7:6");
});

test("Pass Line come-out outcomes", () => {
  assert.equal(rules.resolvePassLineComeOut(7), "win");
  assert.equal(rules.resolvePassLineComeOut(11), "win");
  assert.equal(rules.resolvePassLineComeOut(2), "lose");
  assert.equal(rules.resolvePassLineComeOut(3), "lose");
  assert.equal(rules.resolvePassLineComeOut(12), "lose");
  for (const point of [4, 5, 6, 8, 9, 10]) {
    assert.equal(rules.resolvePassLineComeOut(point), "point");
  }
});

test("Don't Pass come-out outcomes", () => {
  assert.equal(rules.resolveDontPassComeOut(2), "win");
  assert.equal(rules.resolveDontPassComeOut(3), "win");
  assert.equal(rules.resolveDontPassComeOut(12), "push");
  assert.equal(rules.resolveDontPassComeOut(7), "lose");
  assert.equal(rules.resolveDontPassComeOut(11), "lose");
  for (const point of [4, 5, 6, 8, 9, 10]) {
    assert.equal(rules.resolveDontPassComeOut(point), "point");
  }
});

test("traveled Come flat bet works on a come-out winner while Come odds are off", () => {
  const result = rules.resolveTraveledComeBet(6, 6, 25, 50, false);
  assert.equal(result.result, "win");
  assert.equal(result.flatProfit, 25);
  assert.equal(result.oddsProfit, 0);
  assert.equal(result.oddsReturned, 50);
  assert.equal(result.bankrollReturn, 100);
});

test("traveled Come flat bet loses on come-out 7 while Come odds are returned", () => {
  const result = rules.resolveTraveledComeBet(7, 6, 25, 50, false);
  assert.equal(result.result, "loss");
  assert.equal(result.amountLost, 25);
  assert.equal(result.oddsReturned, 50);
  assert.equal(result.bankrollReturn, 50);
});

test("traveled Don't Come flat bet wins on come-out 7 while lay odds are off", () => {
  const result = rules.resolveTraveledDontComeBet(7, 6, 25, 150, false);
  assert.equal(result.result, "win");
  assert.equal(result.flatProfit, 25);
  assert.equal(result.oddsProfit, 0);
  assert.equal(result.oddsReturned, 150);
  assert.equal(result.bankrollReturn, 200);
});

test("traveled Don't Come flat bet loses if its number repeats on the come-out while lay odds are returned", () => {
  const result = rules.resolveTraveledDontComeBet(6, 6, 25, 150, false);
  assert.equal(result.result, "loss");
  assert.equal(result.amountLost, 25);
  assert.equal(result.oddsReturned, 150);
  assert.equal(result.bankrollReturn, 150);
});

test("BETS OFF disables Place bets while a point is on", () => {
  assert.equal(rules.isBetWorking("place", false, true, false), false);
});

test("BETS ON keeps Place bets working while a point is on", () => {
  assert.equal(rules.isBetWorking("place", true, true, false), true);
});

test("Place bets on the come-out still respect the separate Place Working toggle", () => {
  assert.equal(rules.isBetWorking("place", true, false, false), false);
  assert.equal(rules.isBetWorking("place", true, false, true), true);
});

test("BETS OFF disables Lay bets and odds", () => {
  assert.equal(rules.isBetWorking("lay", false, true, false), false);
  assert.equal(rules.isBetWorking("odds", false, true, false), false);
});

test("contract flat bets, one-roll bets and hardways ignore the global BETS toggle", () => {
  assert.equal(rules.isBetWorking("contractFlat", false, true, false), true);
  assert.equal(rules.isBetWorking("oneRoll", false, false, false), true);
  assert.equal(rules.isBetWorking("hardway", false, true, false), true);
});

test("BETS ON enables Lay bets and odds", () => {
  assert.equal(rules.isBetWorking("lay", true, true, false), true);
  assert.equal(rules.isBetWorking("odds", true, true, false), true);
});

test("roll net measures equity change rather than gross bankroll movement", () => {
  assert.equal(rules.calculateRollNet(5000, 5035), 35);
  assert.equal(rules.calculateRollNet(5000, 4975), -25);
});

test("roll net is zero when a wager only moves between bankroll and table", () => {
  assert.equal(rules.calculateRollNet(5000, 5000), 0);
});

