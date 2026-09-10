"use client";

import { useState } from "react";
import {
  calculatePassOddsProfit,
  getPassOddsMultiplier,
  passOddsLabel,
} from "../../table/crapsRules";

const points = [4, 5, 6, 8, 9, 10] as const;
const quickBets = [5, 10, 15, 25];

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function OddsCalculator() {
  const [point, setPoint] = useState<(typeof points)[number]>(6);
  const [flatBetInput, setFlatBetInput] = useState("10");

  const parsedFlatBet = Number(flatBetInput);
  const flatBet =
    Number.isInteger(parsedFlatBet) && parsedFlatBet >= 1 && parsedFlatBet <= 1000
      ? parsedFlatBet
      : 0;
  const multiplier = getPassOddsMultiplier(point);
  const maxOdds = flatBet * multiplier;
  const oddsProfit = calculatePassOddsProfit(point, maxOdds);
  const totalAtRisk = flatBet + maxOdds;
  const totalProfit = flatBet + oddsProfit;
  const totalReturned = totalAtRisk + totalProfit;

  return (
    <section
      aria-labelledby="odds-calculator-title"
      className="mx-auto -mt-1 max-w-5xl px-5 sm:px-8"
    >
      <div className="overflow-hidden rounded-3xl border border-amber-300/55 bg-[#071b15] shadow-[0_24px_80px_rgba(0,0,0,.35)]">
        <div className="border-b border-emerald-800/70 bg-[linear-gradient(120deg,rgba(245,158,11,.12),rgba(16,185,129,.08))] p-5 sm:p-7">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
            Interactive tool
          </div>
          <h2 id="odds-calculator-title" className="mt-2 text-3xl font-black sm:text-4xl">
            3-4-5x Odds Calculator
          </h2>
          <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-emerald-50/65">
            Choose the point and enter your Pass Line wager. The calculator shows the maximum odds, payout, and total money involved if the point repeats before 7.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <fieldset>
              <legend className="text-sm font-black uppercase tracking-[0.12em] text-emerald-300">
                1. Choose the point
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {points.map((number) => (
                  <button
                    key={number}
                    type="button"
                    aria-pressed={point === number}
                    onClick={() => setPoint(number)}
                    className={`min-h-12 rounded-xl border px-3 py-2 text-lg font-black transition ${
                      point === number
                        ? "border-amber-200 bg-amber-400 text-black shadow-[0_0_24px_rgba(251,191,36,.18)]"
                        : "border-emerald-800 bg-emerald-950/35 text-emerald-100 hover:border-emerald-500"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="flat-bet" className="text-sm font-black uppercase tracking-[0.12em] text-emerald-300">
                2. Enter your Pass Line bet
              </label>
              <div className="mt-3 flex items-center rounded-xl border border-emerald-700/70 bg-black/25 px-4 focus-within:border-amber-300">
                <span className="text-xl font-black text-amber-300">$</span>
                <input
                  id="flat-bet"
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  inputMode="numeric"
                  value={flatBetInput}
                  onChange={(event) => setFlatBetInput(event.target.value)}
                  className="min-h-14 w-full bg-transparent px-3 text-2xl font-black text-white outline-none"
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Common Pass Line bet amounts">
                {quickBets.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFlatBetInput(String(amount))}
                    className="min-h-10 rounded-lg border border-emerald-900 bg-black/20 text-sm font-black text-emerald-100 hover:border-emerald-500"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              {flatBet === 0 ? (
                <p className="mt-3 text-sm font-bold text-red-300">
                  Enter a whole-dollar Pass Line wager between $1 and $1,000.
                </p>
              ) : null}
            </div>
          </div>

          <div aria-live="polite" className="rounded-2xl border border-emerald-700/60 bg-emerald-950/30 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.12em] text-emerald-400">
                  Point {point}
                </div>
                <div className="mt-1 text-2xl font-black">Maximum odds result</div>
              </div>
              <div className="rounded-full border border-amber-500/60 bg-amber-950/25 px-3 py-1.5 text-sm font-black text-amber-200">
                {multiplier}x max • Pays {passOddsLabel(point)}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ResultCard label="Maximum odds bet" value={dollars.format(maxOdds)} tone="amber" />
              <ResultCard label="Odds profit" value={dollars.format(oddsProfit)} tone="emerald" />
              <ResultCard label="Total at risk" value={dollars.format(totalAtRisk)} tone="plain" />
              <ResultCard label="Total profit if point hits" value={dollars.format(totalProfit)} tone="emerald" />
            </div>

            <div className="mt-4 rounded-xl border border-emerald-800/70 bg-black/20 p-4">
              <div className="text-sm font-black text-white">If the point repeats</div>
              <p className="mt-2 text-base font-medium leading-7 text-emerald-50/65">
                Your {dollars.format(flatBet)} Pass Line bet wins {dollars.format(flatBet)}, and your {dollars.format(maxOdds)} odds bet wins {dollars.format(oddsProfit)}. You receive {dollars.format(totalReturned)} back, including your original wagers.
              </p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-cyan-800/50 bg-cyan-950/15 px-4 py-3">
                <div className="text-xs font-black uppercase tracking-[0.1em] text-cyan-300">Odds house edge</div>
                <div className="mt-1 text-2xl font-black text-white">0%</div>
              </div>
              <div className="rounded-xl border border-cyan-800/50 bg-cyan-950/15 px-4 py-3">
                <div className="text-xs font-black uppercase tracking-[0.1em] text-cyan-300">Pass Line house edge</div>
                <div className="mt-1 text-2xl font-black text-white">About 1.41%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "emerald" | "plain";
}) {
  const color =
    tone === "amber"
      ? "text-amber-200"
      : tone === "emerald"
        ? "text-emerald-200"
        : "text-white";

  return (
    <div className="rounded-xl border border-emerald-900/80 bg-black/25 p-4">
      <div className="text-xs font-black uppercase tracking-[0.1em] text-emerald-50/45">{label}</div>
      <div className={`mt-1 text-2xl font-black ${color}`}>{value}</div>
    </div>
  );
}
