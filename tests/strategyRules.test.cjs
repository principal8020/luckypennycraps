const test = require("node:test");
const assert = require("node:assert/strict");

const strategy = require("../.rules-test/strategyRules.js");

function emptyNumberBets() {
  return { 4: 0, 5: 0, 6: 0, 8: 0, 9: 0, 10: 0 };
}

function state(overrides = {}) {
  return {
    point: null,
    passLineBet: 0,
    passOddsBet: 0,
    dontPassBet: 0,
    dontPassOddsBet: 0,
    activeComeBet: 0,
    comeBets: emptyNumberBets(),
    comeOdds: emptyNumberBets(),
    activeDontComeBet: 0,
    dontComeBets: emptyNumberBets(),
    dontComeOdds: emptyNumberBets(),
    placeBets: emptyNumberBets(),
    fieldBet: 0,
    ...overrides,
  };
}

test("Place 6 & 8 uses $6 targets on a $5 table", () => {
  const rec = strategy.recommendationFor("place-6-8", state({ point: 6 }), 5);
  assert.equal(rec.action, "Add $6 to PLACE 6.");
});

test("Place 6 & 8 uses $12 targets on a $10 table", () => {
  const rec = strategy.recommendationFor("place-6-8", state({ point: 6 }), 10);
  assert.equal(rec.action, "Add $12 to PLACE 6.");
});

test("Place 6 & 8 uses $30 targets on a $25 table", () => {
  const rec = strategy.recommendationFor("place-6-8", state({ point: 6 }), 25);
  assert.equal(rec.action, "Add $30 to PLACE 6.");
});

test("Place 6 & 8 advances from 6 to 8", () => {
  const bets = emptyNumberBets();
  bets[6] = 12;
  const rec = strategy.recommendationFor("place-6-8", state({ point: 6, placeBets: bets }), 10);
  assert.equal(rec.action, "Add $12 to PLACE 8.");
});

test("Place 6 & 8 holds when both targets are complete", () => {
  const bets = emptyNumberBets();
  bets[6] = 12;
  bets[8] = 12;
  const rec = strategy.recommendationFor("place-6-8", state({ point: 6, placeBets: bets }), 10);
  assert.equal(rec.action, "HOLD and roll with Place 6 and 8 working.");
});

test("Inside Numbers uses table minimum on 5/9 and proper 6/8 sizing", () => {
  const rec = strategy.recommendationFor("inside", state({ point: 6 }), 10);
  assert.equal(rec.action, "Add $10 to PLACE 5.");
  assert.match(rec.status, /5: \$10, 6: \$12, 8: \$12, 9: \$10/);
});

test("Iron Cross uses $10/$12/$12 plus a $10 Field on a $10 table", () => {
  const rec = strategy.recommendationFor("iron-cross", state({ point: 6 }), 10);
  assert.equal(rec.action, "Add $10 to PLACE 5.");
  assert.match(rec.status, /5: \$10, 6\/8: \$12, Field: \$10/);
});

test("Iron Cross asks for the Field after Place 5/6/8 are complete", () => {
  const bets = emptyNumberBets();
  bets[5] = 10;
  bets[6] = 12;
  bets[8] = 12;
  const rec = strategy.recommendationFor("iron-cross", state({ point: 6, placeBets: bets }), 10);
  assert.equal(rec.action, "Add $10 to the FIELD.");
});

test("Place strategies wait for a point before building", () => {
  const rec = strategy.recommendationFor("inside", state(), 25);
  assert.equal(rec.action, "ROLL until a box-number point is established.");
});

test("3-Point Molly begins with the table-minimum Pass Line bet", () => {
  const rec = strategy.recommendationFor("three-point-molly", state(), 10);
  assert.equal(rec.action, "Bet $10 on PASS LINE.");
});

test("3-Point Molly fills maximum Pass odds before adding Come", () => {
  const rec = strategy.recommendationFor(
    "three-point-molly",
    state({ point: 6, passLineBet: 10, passOddsBet: 0 }),
    10
  );
  assert.equal(rec.action, "Add $50 more PASS ODDS.");
});

test("3-Point Molly asks for Come after Pass odds are full", () => {
  const rec = strategy.recommendationFor(
    "three-point-molly",
    state({ point: 6, passLineBet: 10, passOddsBet: 50 }),
    10
  );
  assert.equal(rec.action, "Bet $10 in COME.");
});

test("3-Point Molly fills traveled Come odds before building another point", () => {
  const comeBets = emptyNumberBets();
  const comeOdds = emptyNumberBets();
  comeBets[8] = 10;
  const rec = strategy.recommendationFor(
    "three-point-molly",
    state({ point: 6, passLineBet: 10, passOddsBet: 50, comeBets, comeOdds }),
    10
  );
  assert.equal(rec.action, "Add $50 more COME ODDS on 8.");
});

test("3-Point Molly stops at three contract numbers", () => {
  const comeBets = emptyNumberBets();
  const comeOdds = emptyNumberBets();
  comeBets[5] = 10;
  comeBets[8] = 10;
  comeOdds[5] = 40;
  comeOdds[8] = 50;
  const rec = strategy.recommendationFor(
    "three-point-molly",
    state({ point: 6, passLineBet: 10, passOddsBet: 50, comeBets, comeOdds }),
    10
  );
  assert.equal(rec.action, "HOLD and roll. Do not add a fourth contract number.");
});

test("3-Point Dolly begins with the table-minimum Don't Pass bet", () => {
  const rec = strategy.recommendationFor("three-point-dolly", state(), 25);
  assert.equal(rec.action, "Bet $25 on DON'T PASS.");
});

test("3-Point Dolly fills lay odds before adding Don't Come", () => {
  const rec = strategy.recommendationFor(
    "three-point-dolly",
    state({ point: 5, dontPassBet: 10, dontPassOddsBet: 0 }),
    10
  );
  assert.equal(rec.action, "Add $60 more DON'T PASS LAY ODDS.");
});

test("3-Point Dolly asks for Don't Come after lay odds are full", () => {
  const rec = strategy.recommendationFor(
    "three-point-dolly",
    state({ point: 5, dontPassBet: 10, dontPassOddsBet: 60 }),
    10
  );
  assert.equal(rec.action, "Bet $10 in DON'T COME.");
});

test("3-Point Dolly stops at three dark-side contract numbers", () => {
  const dontComeBets = emptyNumberBets();
  const dontComeOdds = emptyNumberBets();
  dontComeBets[4] = 10;
  dontComeBets[9] = 10;
  dontComeOdds[4] = 60;
  dontComeOdds[9] = 60;
  const rec = strategy.recommendationFor(
    "three-point-dolly",
    state({ point: 5, dontPassBet: 10, dontPassOddsBet: 60, dontComeBets, dontComeOdds }),
    10
  );
  assert.equal(rec.action, "HOLD and roll. Do not add a fourth contract number.");
});

test("Pass Line + Max Odds starts at the selected table minimum", () => {
  const rec = strategy.recommendationFor("pass-max-odds", state(), 25);
  assert.equal(rec.action, "Bet $25 on PASS LINE.");
});

test("Don't Pass + Lay Odds starts at the selected table minimum", () => {
  const rec = strategy.recommendationFor("dont-pass-lay-odds", state(), 10);
  assert.equal(rec.action, "Bet $10 on DON'T PASS.");
});
