"use client";

import type { MouseEvent } from "react";
import { BetChip, MiniDie } from "./TablePieces";

type NumberBets = Record<number, number>;
type HopBets = Record<string, number>;
type BetClick = (event: MouseEvent<HTMLButtonElement>) => void;

type CenterActionProps = {
  hardwaysWorking: boolean;
  onToggleHardways: () => void;
  hardways: NumberBets;
  onHardway: (event: MouseEvent<HTMLButtonElement>, number: number) => void;
  flashClass: (area: "hardway" | "prop", key: string) => string;

  twoBet: number;
  threeBet: number;
  yoBet: number;
  twelveBet: number;
  anyCrapsBet: number;
  anySevenBet: number;
  ceBet: number;
  worldBet: number;
  hornHigh2Bet: number;
  hornHigh3Bet: number;
  hornHigh11Bet: number;
  hornHigh12Bet: number;
  hornBet: number;

  onTwoBet: BetClick;
  onThreeBet: BetClick;
  onYoBet: BetClick;
  onTwelveBet: BetClick;
  onAnyCrapsBet: BetClick;
  onAnySevenBet: BetClick;
  onCeBet: BetClick;
  onWorldBet: BetClick;
  onHornHigh2Bet: BetClick;
  onHornHigh3Bet: BetClick;
  onHornHigh11Bet: BetClick;
  onHornHigh12Bet: BetClick;
  onHornBet: BetClick;

  hopBetsOpen: boolean;
  onToggleHopBets: () => void;
  totalHopBets: number;
  hopBets: HopBets;
  selectedChip: number;
  onHopBet: (
    event: MouseEvent<HTMLButtonElement>,
    first: number,
    second: number
  ) => void;
};

const hardwayNumbers = [4, 6, 8, 10];

const hardHopPairs: Array<[number, number]> = [
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
];

const easyHopPairs: Array<[number, number]> = [
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 5],
  [4, 6],
];

function hopKey(first: number, second: number) {
  const low = Math.min(first, second);
  const high = Math.max(first, second);
  return `${low}-${high}`;
}

function money(amount: number) {
  return Math.floor(amount).toLocaleString();
}

export function CenterAction({
  hardwaysWorking,
  onToggleHardways,
  hardways,
  onHardway,
  flashClass,
  twoBet,
  threeBet,
  yoBet,
  twelveBet,
  anyCrapsBet,
  anySevenBet,
  ceBet,
  worldBet,
  hornHigh2Bet,
  hornHigh3Bet,
  hornHigh11Bet,
  hornHigh12Bet,
  hornBet,
  onTwoBet,
  onThreeBet,
  onYoBet,
  onTwelveBet,
  onAnyCrapsBet,
  onAnySevenBet,
  onCeBet,
  onWorldBet,
  onHornHigh2Bet,
  onHornHigh3Bet,
  onHornHigh11Bet,
  onHornHigh12Bet,
  onHornBet,
  hopBetsOpen,
  onToggleHopBets,
  totalHopBets,
  hopBets,
  selectedChip,
  onHopBet,
}: CenterActionProps) {
  const hornHighBets = [
    { label: "HORN HIGH 2", bet: hornHigh2Bet, onClick: onHornHigh2Bet, key: "horn-high-2" },
    { label: "HORN HIGH 3", bet: hornHigh3Bet, onClick: onHornHigh3Bet, key: "horn-high-3" },
    { label: "HORN HIGH 11", bet: hornHigh11Bet, onClick: onHornHigh11Bet, key: "horn-high-11" },
    { label: "HORN HIGH 12", bet: hornHigh12Bet, onClick: onHornHigh12Bet, key: "horn-high-12" },
  ];

  return (
    <div className="min-w-0 self-start">
      <div className="border border-white/55 bg-black/[0.055] p-1.5">
        <div className="mb-1.5 border-b border-white/15 pb-1 text-center text-[8px] font-black uppercase tracking-[0.22em] text-emerald-100/65">
          Center Action
        </div>
        <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-white/15 pb-1.5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100">
              Hardways
            </p>
            <p className="text-[7px] text-emerald-100/60">
              follows the puck by default • tap anytime to override
            </p>
          </div>

          <button
            onClick={onToggleHardways}
            className={`min-w-[100px] rounded border px-2 py-1.5 text-[9px] font-black shadow-sm transition ${
              hardwaysWorking
                ? "border-emerald-200 bg-emerald-400 text-emerald-950 shadow-emerald-300/20"
                : "border-red-500/80 bg-zinc-950 text-red-200"
            }`}
          >
            HARDWAY {hardwaysWorking ? "ON" : "OFF"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-[3px]">
          {hardwayNumbers.map((number) => {
            const dieValue = number / 2;
            return (
              <button
                key={number}
                onClick={(event) => onHardway(event, number)}
                className={`relative min-h-[66px] border border-white/45 bg-black/[0.025] p-1.5 text-center font-black hover:bg-white/[0.035] ${flashClass("hardway", String(number))}`}
              >
                <div className="text-[9px] uppercase tracking-[0.14em] text-emerald-50/85">
                  HARD {number}
                </div>
                <div className="my-1 flex items-center justify-center gap-2">
                  <MiniDie value={dieValue} large />
                  <MiniDie value={dieValue} large />
                </div>
                <div className="text-[9px] font-black text-emerald-100/80">
                  {number === 4 || number === 10 ? "7 TO 1" : "9 TO 1"}
                </div>
                <div className="absolute bottom-1 right-1">
                  <BetChip amount={hardways[number]} compact />
                </div>
              </button>
            );
          })}
        </div>

        <div className="my-1 border-t border-white/15 pt-1 text-center text-[9px] font-black uppercase tracking-[0.22em] text-emerald-100/80">
          One Roll
        </div>

        <div className="grid grid-cols-4 gap-[3px]">
          <button onClick={onTwoBet} className={`relative min-h-[68px] border border-white/45 bg-black/[0.03] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "2")}`}>
            <div className="text-[11px] text-red-100">2</div>
            <div className="my-0.5 flex items-center justify-center gap-1"><MiniDie value={1} /><MiniDie value={1} /></div>
            <div className="text-[9px] font-black">30 TO 1</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={twoBet} compact /></div>
          </button>

          <button onClick={onThreeBet} className={`relative min-h-[68px] border border-white/45 bg-black/[0.03] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "3")}`}>
            <div className="text-[11px] text-red-100">3</div>
            <div className="my-0.5 flex items-center justify-center gap-1"><MiniDie value={1} /><MiniDie value={2} /></div>
            <div className="text-[9px] font-black">15 TO 1</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={threeBet} compact /></div>
          </button>

          <button onClick={onYoBet} className={`relative min-h-[68px] border border-white/45 bg-black/[0.03] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "yo")}`}>
            <div className="text-[10px] text-red-100">YO 11</div>
            <div className="my-0.5 flex items-center justify-center gap-1"><MiniDie value={5} /><MiniDie value={6} /></div>
            <div className="text-[9px] font-black">15 TO 1</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={yoBet} compact /></div>
          </button>

          <button onClick={onTwelveBet} className={`relative min-h-[68px] border border-white/45 bg-black/[0.03] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "12")}`}>
            <div className="text-[11px] text-red-100">12</div>
            <div className="my-0.5 flex items-center justify-center gap-1"><MiniDie value={6} /><MiniDie value={6} /></div>
            <div className="text-[9px] font-black">30 TO 1</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={twelveBet} compact /></div>
          </button>
        </div>

        <div className="mt-[3px] grid grid-cols-4 gap-[3px]">
          <button onClick={onAnyCrapsBet} title="Any Craps: wins on 2, 3, or 12. Pays 7 to 1." className={`relative min-h-[70px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "any-craps")}`}>
            <div className="text-[10px] text-red-100">ANY CRAPS</div>
            <div className="mt-0.5 text-[9px] font-black tracking-[0.08em]">2 • 3 • 12</div>
            <div className="text-[9px] font-black">7 TO 1</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={anyCrapsBet} compact /></div>
          </button>

          <button onClick={onAnySevenBet} title="Any Seven: wins on any 7. Pays 4 to 1." className={`relative min-h-[70px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "any-seven")}`}>
            <div className="text-[10px] text-red-100">ANY SEVEN</div>
            <div className="mt-2 text-[10px] font-black">4 TO 1</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={anySevenBet} compact /></div>
          </button>

          <button onClick={onCeBet} title="C & E: half the wager on Any Craps and half on Yo 11. A winning side pays while the other half loses." className={`relative min-h-[70px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "ce")}`}>
            <div className="text-[11px] text-amber-100">C &amp; E</div>
            <div className="mt-1 text-[8px] font-bold">CRAPS • 11</div>
            <div className="text-[7px] text-emerald-100/65">combo</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={ceBet} compact /></div>
          </button>

          <button onClick={onWorldBet} title="World: five equal units on 2, 3, 7, 11, and 12. A 7 is an overall push with standard proposition payouts." className={`relative min-h-[70px] border border-white/45 bg-black/[0.02] p-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "world")}`}>
            <div className="text-[11px] text-amber-100">WORLD</div>
            <div className="mt-1 text-[8px] font-bold">2 • 3 • 7 • 11 • 12</div>
            <div className="text-[7px] text-emerald-100/65">5-part combo</div>
            <div className="absolute bottom-1 right-1"><BetChip amount={worldBet} compact /></div>
          </button>
        </div>

        <div className="mt-[3px] grid grid-cols-4 gap-[3px]">
          {hornHighBets.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              title={`${item.label}: five-unit Horn bet with two units on the named number and one unit on each other Horn number.`}
              className={`relative min-h-[54px] border border-teal-300/35 bg-teal-950/25 px-1 py-1.5 text-center font-black hover:bg-teal-950/45 ${flashClass("prop", item.key)}`}
            >
              <div className="text-[8px] leading-tight text-teal-50">{item.label}</div>
              <div className="mt-1 text-[6px] text-teal-200/65">5-unit combo</div>
              <div className="absolute bottom-1 right-1"><BetChip amount={item.bet} compact /></div>
            </button>
          ))}
        </div>

        <button onClick={onHornBet} title="Horn: four equal units on 2, 3, 11, and 12." className={`relative mt-[3px] min-h-[42px] w-full border border-white/45 bg-black/[0.02] px-2 py-1 text-center font-black hover:bg-white/[0.04] ${flashClass("prop", "horn")}`}>
          <span className="text-[10px]">HORN</span>
          <span className="ml-2 text-[8px] font-black tracking-[0.05em]">2 • 3 • 11 • 12</span>
          <span className="ml-2 text-[7px] text-emerald-100/60">4-part combo</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2"><BetChip amount={hornBet} compact /></span>
        </button>

        <p className="mt-1 text-center text-[7px] font-bold uppercase tracking-[0.06em] text-emerald-100/50">
          Winners stay up • losers come down • hover a combo bet for details
        </p>
      </div>

      <div className="mt-1 border border-amber-200/30 bg-black/[0.06] p-1.5">
        <button onClick={onToggleHopBets} className="flex w-full items-center justify-between gap-2 border-b border-white/10 pb-1.5 text-left">
          <span>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-amber-100">Hop Bets</span>
            <span className="block text-[7px] text-amber-100/55">one-roll wagers • winners stay up</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded border border-amber-700/50 bg-amber-950/25 px-2 py-1 text-[8px] font-black text-amber-200">${money(totalHopBets)} UP</span>
            <span className="text-[10px] font-black text-amber-200">{hopBetsOpen ? "−" : "+"}</span>
          </span>
        </button>

        {hopBetsOpen && (
          <div className="mt-1.5 max-h-[340px] overflow-y-auto pr-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-[0.16em] text-red-200">Hard Hops</span>
              <span className="text-[7px] font-black text-red-300/70">30 TO 1</span>
            </div>

            <div className="grid grid-cols-4 gap-[3px]">
              {hardHopPairs.map(([first, second]) => {
                const key = hopKey(first, second);
                const currentBet = hopBets[key] ?? 0;
                const previewBet = currentBet > 0 ? currentBet : selectedChip;
                return (
                  <button
                    key={key}
                    onClick={(event) => onHopBet(event, first, second)}
                    title={`Hop ${key}: pays 30 to 1. ${currentBet > 0 ? `Current bet $${money(currentBet)}; profit if hit $${money(currentBet * 30)}.` : `A $${money(selectedChip)} bet would profit $${money(previewBet * 30)}.`} Winning Hop bets stay up.`}
                    className={`relative min-h-[52px] border border-red-300/35 bg-red-950/15 p-1 text-center font-black transition hover:bg-red-950/35 ${flashClass("prop", `hop-${key}`)}`}
                  >
                    <div className="flex items-center justify-center gap-1"><MiniDie value={first} /><MiniDie value={second} /></div>
                    <div className="mt-1 text-[8px] text-red-100">{key}</div>
                    <div className="text-[7px] text-red-200/70">30:1</div>
                    <span className="absolute bottom-1 right-1"><BetChip amount={currentBet} compact /></span>
                  </button>
                );
              })}
            </div>

            <div className="mb-1 mt-2 flex items-center justify-between border-t border-white/10 pt-1.5">
              <span className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-200">Easy Hops</span>
              <span className="text-[7px] font-black text-amber-300/70">15 TO 1</span>
            </div>

            <div className="grid grid-cols-3 gap-[3px]">
              {easyHopPairs.map(([first, second]) => {
                const key = hopKey(first, second);
                const currentBet = hopBets[key] ?? 0;
                const previewBet = currentBet > 0 ? currentBet : selectedChip;
                return (
                  <button
                    key={key}
                    onClick={(event) => onHopBet(event, first, second)}
                    title={`Hop ${key}: pays 15 to 1. ${currentBet > 0 ? `Current bet $${money(currentBet)}; profit if hit $${money(currentBet * 15)}.` : `A $${money(selectedChip)} bet would profit $${money(previewBet * 15)}.`} Winning Hop bets stay up.`}
                    className={`relative min-h-[52px] border border-amber-200/25 bg-amber-950/10 p-1 text-center font-black transition hover:bg-amber-950/30 ${flashClass("prop", `hop-${key}`)}`}
                  >
                    <div className="flex items-center justify-center gap-1"><MiniDie value={first} /><MiniDie value={second} /></div>
                    <div className="mt-1 text-[8px] text-amber-100">{key}</div>
                    <div className="text-[7px] text-amber-200/70">15:1</div>
                    <span className="absolute bottom-1 right-1"><BetChip amount={currentBet} compact /></span>
                  </button>
                );
              })}
            </div>

            <p className="mt-1.5 text-center text-[6px] font-bold uppercase tracking-[0.06em] text-amber-100/45">
              Exact dice combination • 2 / 3 / Yo 11 / 12 use the One Roll boxes above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
