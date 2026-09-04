"use client";

export type PassLineLessonStep =
  | "place-pass"
  | "come-out"
  | "point-explainer"
  | "add-odds"
  | "resolve"
  | "complete";

type LearnModeProps = {
  active: boolean;
  step: PassLineLessonStep;
  point: number | null;
  onStart: () => void;
  onContinue: () => void;
  onRestart: () => void;
  onExit: () => void;
};

const stepOrder: PassLineLessonStep[] = [
  "place-pass",
  "come-out",
  "point-explainer",
  "add-odds",
  "resolve",
  "complete",
];

const copy: Record<
  PassLineLessonStep,
  { eyebrow: string; title: string; body: string; action: string }
> = {
  "place-pass": {
    eyebrow: "STEP 1 OF 6",
    title: "Place $5 on the Pass Line",
    body:
      "The Pass Line is the classic right-side contract bet. On the come-out roll, 7 or 11 wins; 2, 3, or 12 loses. Lucky Penny has selected a $5 chip for you.",
    action: "YOUR TURN → Click PASS LINE",
  },
  "come-out": {
    eyebrow: "STEP 2 OF 6",
    title: "Make the come-out roll",
    body:
      "A 4, 5, 6, 8, 9, or 10 establishes the point. For this guided lesson, Lucky Penny will give you a 6 so you can see the point cycle clearly.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "point-explainer": {
    eyebrow: "STEP 3 OF 6",
    title: "The puck is ON",
    body:
      "The 6 is now the point. Your Pass Line bet wins if 6 rolls again before a 7. Notice the puck moved from OFF to the 6.",
    action: "READ THIS → Then click CONTINUE",
  },
  "add-odds": {
    eyebrow: "STEP 4 OF 6",
    title: "Add $5 in Pass Line odds",
    body:
      "Odds sit behind your Pass Line bet after a point is established. They pay at true odds and add no additional house edge. We will use $5 for this first lesson.",
    action: "YOUR TURN → Click + PASS ODDS",
  },
  resolve: {
    eyebrow: "STEP 5 OF 6",
    title: "Roll for the point",
    body:
      "Now you want the 6 before a 7. Lucky Penny will roll a 6 again so you can see a winning Pass Line and odds payout.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  complete: {
    eyebrow: "STEP 6 OF 6",
    title: "Pass Line lesson complete",
    body:
      "You just completed the full Pass Line cycle: come-out roll → point established → odds added → point made. Try it again until the sequence feels natural.",
    action: "LESSON COMPLETE",
  },
};

export function LearnMode({
  active,
  step,
  point,
  onStart,
  onContinue,
  onRestart,
  onExit,
}: LearnModeProps) {
  if (!active) {
    return (
      <section className="mt-2 rounded-xl border border-violet-800/70 bg-violet-950/15 px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-300">
              Learn Mode
            </div>
            <h2 className="mt-1 text-xl font-black text-white">
              Learn directly on the table
            </h2>
            <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-violet-50/60">
              Lucky Penny explains each step, highlights where to click, and waits
              for you to perform the correct action before moving on.
            </p>
          </div>

          <button
            onClick={onStart}
            className="shrink-0 rounded-lg bg-violet-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-violet-300"
          >
            Start Pass Line Basics
          </button>
        </div>
      </section>
    );
  }

  const current = copy[step];
  const stepIndex = stepOrder.indexOf(step) + 1;

  return (
    <section className="mt-2 overflow-hidden rounded-xl border-2 border-violet-400/70 bg-[linear-gradient(135deg,rgba(76,29,149,.32),rgba(3,19,14,.96))] shadow-[0_0_26px_rgba(167,139,250,.16)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-400/20 bg-violet-950/35 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-violet-400 px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-slate-950">
            Learn Mode
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.12em] text-violet-200">
            Pass Line Basics
          </span>
        </div>

        <button
          onClick={onExit}
          className="rounded border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-black uppercase text-white/70 hover:text-white"
        >
          Exit Lesson
        </button>
      </div>

      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-violet-300">
            {current.eyebrow}
          </div>
          <h3 className="mt-1 text-xl font-black text-white">
            {current.title}
          </h3>
          <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-violet-50/70">
            {current.body}
          </p>

          {step === "point-explainer" && point !== null && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-950/35 px-3 py-2 text-[10px] font-black text-cyan-100">
              PUCK ON → POINT {point}
            </div>
          )}

          <div className="mt-3 text-[10px] font-black uppercase tracking-[0.09em] text-amber-300">
            {current.action}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {step === "point-explainer" && (
            <button
              onClick={onContinue}
              className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg"
            >
              Continue
            </button>
          )}

          {step === "complete" && (
            <button
              onClick={onRestart}
              className="rounded-lg bg-amber-400 px-5 py-3 text-sm font-black text-black shadow-lg"
            >
              Try Again
            </button>
          )}

          <div className="hidden min-w-[86px] text-center lg:block">
            <div className="text-3xl font-black text-violet-300">
              {stepIndex}/6
            </div>
            <div className="mt-1 text-[7px] font-black uppercase tracking-[0.1em] text-violet-400/60">
              Progress
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
