"use client";

export type LearnLessonId = "pass-line" | "place-68" | "come";

export type LearnLessonStep =
  | "pass-place"
  | "pass-come-out"
  | "pass-point"
  | "pass-odds"
  | "pass-resolve"
  | "pass-complete"
  | "place-6"
  | "place-8"
  | "place-explain"
  | "place-roll-6"
  | "place-roll-8"
  | "place-seven"
  | "place-complete"
  | "come-place"
  | "come-roll-travel"
  | "come-travel"
  | "come-odds"
  | "come-resolve"
  | "come-complete";

type LearnModeProps = {
  active: boolean;
  lesson: LearnLessonId;
  step: LearnLessonStep;
  point: number | null;
  onStartPassLine: () => void;
  onStartPlace68: () => void;
  onStartCome: () => void;
  onContinue: () => void;
  onRestart: () => void;
  onExit: () => void;
};

type LessonCopy = {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
};

const lessonMeta: Record<
  LearnLessonId,
  { title: string; steps: LearnLessonStep[] }
> = {
  "pass-line": {
    title: "Pass Line Basics",
    steps: [
      "pass-place",
      "pass-come-out",
      "pass-point",
      "pass-odds",
      "pass-resolve",
      "pass-complete",
    ],
  },
  "place-68": {
    title: "Place 6 & 8",
    steps: [
      "place-6",
      "place-8",
      "place-explain",
      "place-roll-6",
      "place-roll-8",
      "place-seven",
      "place-complete",
    ],
  },
  come: {
    title: "Come Bet Basics",
    steps: [
      "come-place",
      "come-roll-travel",
      "come-travel",
      "come-odds",
      "come-resolve",
      "come-complete",
    ],
  },
};

const copy: Record<LearnLessonStep, LessonCopy> = {
  "pass-place": {
    eyebrow: "STEP 1 OF 6",
    title: "Place $5 on the Pass Line",
    body:
      "The Pass Line is the classic right-side contract bet. On the come-out roll, 7 or 11 wins; 2, 3, or 12 loses. Lucky Penny has selected a $5 chip for you.",
    action: "YOUR TURN → Click PASS LINE",
  },
  "pass-come-out": {
    eyebrow: "STEP 2 OF 6",
    title: "Make the come-out roll",
    body:
      "A 4, 5, 6, 8, 9, or 10 establishes the point. For this guided lesson, Lucky Penny will give you a 6 so you can see the point cycle clearly.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "pass-point": {
    eyebrow: "STEP 3 OF 6",
    title: "The puck is ON",
    body:
      "The 6 is now the point. Your Pass Line bet wins if 6 rolls again before a 7. Notice the puck moved from OFF to the 6.",
    action: "READ THIS → Then click CONTINUE",
  },
  "pass-odds": {
    eyebrow: "STEP 4 OF 6",
    title: "Add $5 in Pass Line odds",
    body:
      "Odds sit behind your Pass Line bet after a point is established. They pay at true odds and add no additional house edge. We will use $5 for this first lesson.",
    action: "YOUR TURN → Click + PASS ODDS",
  },
  "pass-resolve": {
    eyebrow: "STEP 5 OF 6",
    title: "Roll for the point",
    body:
      "Now you want the 6 before a 7. Lucky Penny will roll a 6 again so you can see a winning Pass Line and odds payout.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "pass-complete": {
    eyebrow: "STEP 6 OF 6",
    title: "Pass Line lesson complete",
    body:
      "You just completed the full Pass Line cycle: come-out roll → point established → odds added → point made. Try it again until the sequence feels natural.",
    action: "LESSON COMPLETE",
  },
  "place-6": {
    eyebrow: "STEP 1 OF 7",
    title: "Build $6 on Place 6",
    body:
      "Place 6 pays 7:6, so $6 is the proper starting amount at a $5 table. Lucky Penny selected $5 first; after you place it, the chip automatically switches to $1 for the final dollar.",
    action: "YOUR TURN → Build PLACE 6 to $6",
  },
  "place-8": {
    eyebrow: "STEP 2 OF 7",
    title: "Build $6 on Place 8",
    body:
      "Place 8 has the same 7:6 payout and the same proper $6 starting amount. Build it the same way: $5 first, then $1.",
    action: "YOUR TURN → Build PLACE 8 to $6",
  },
  "place-explain": {
    eyebrow: "STEP 3 OF 7",
    title: "Both Place bets are working",
    body:
      "For this lesson the point is 5, so the puck is ON and your Place 6 and Place 8 are active. A $6 win pays $7 profit and the original wager stays up. A 7 loses both bets.",
    action: "READ THIS → Then click CONTINUE",
  },
  "place-roll-6": {
    eyebrow: "STEP 4 OF 7",
    title: "Watch Place 6 pay",
    body:
      "Lucky Penny will roll a 6. Your $6 Place 6 should win $7 in profit and remain on the table for the next roll.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "place-roll-8": {
    eyebrow: "STEP 5 OF 7",
    title: "Now watch Place 8 pay",
    body:
      "Next Lucky Penny will roll an 8. Your $6 Place 8 should also win $7 in profit and stay up.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "place-seven": {
    eyebrow: "STEP 6 OF 7",
    title: "See what a 7 does",
    body:
      "Place bets stay up through wins, but a 7 while the puck is ON ends the hand and removes both Place wagers. Lucky Penny will roll a 7 now.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "place-complete": {
    eyebrow: "STEP 7 OF 7",
    title: "Place 6 & 8 lesson complete",
    body:
      "You built proper $6 wagers, watched both numbers pay 7:6, saw the bets stay up after wins, and then saw a seven-out remove them. That is the core Place 6 & 8 cycle.",
    action: "LESSON COMPLETE",
  },
  "come-place": {
    eyebrow: "STEP 1 OF 6",
    title: "Place $5 in the Come",
    body:
      "A Come bet is like starting a new Pass Line bet while the table already has a point. For this lesson the table point is 6, so the Come area is available now.",
    action: "YOUR TURN → Click COME",
  },
  "come-roll-travel": {
    eyebrow: "STEP 2 OF 6",
    title: "Roll to give the Come bet its number",
    body:
      "On its first roll, a Come bet wins on 7 or 11, loses on 2, 3, or 12, and travels to 4, 5, 6, 8, 9, or 10. Lucky Penny will roll an 8 so you can watch it travel.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "come-travel": {
    eyebrow: "STEP 3 OF 6",
    title: "Your Come bet traveled to 8",
    body:
      "The table point is still 6, but your Come bet now has its own number: 8. From here, the Come 8 wins if an 8 rolls before a 7. This is why Come bets can build several independent contract numbers.",
    action: "READ THIS → Then click CONTINUE",
  },
  "come-odds": {
    eyebrow: "STEP 4 OF 6",
    title: "Add $5 in Come odds on 8",
    body:
      "Once a Come bet travels, you can add odds behind it just like Pass Line odds. The odds pay true odds and add no additional house edge.",
    action: "YOUR TURN → Click + ODDS beside COME 8",
  },
  "come-resolve": {
    eyebrow: "STEP 5 OF 6",
    title: "Roll the Come number again",
    body:
      "Now you want 8 before 7 for this Come contract. Lucky Penny will roll an 8 so you can see the flat Come bet and its odds resolve together.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "come-complete": {
    eyebrow: "STEP 6 OF 6",
    title: "Come Bet lesson complete",
    body:
      "You placed a Come bet while the puck was ON, watched it travel to 8, added true odds, and then won when 8 repeated before 7. You can repeat this process to build multiple Come numbers.",
    action: "LESSON COMPLETE",
  },
};

export function LearnMode({
  active,
  lesson,
  step,
  point,
  onStartPassLine,
  onStartPlace68,
  onStartCome,
  onContinue,
  onRestart,
  onExit,
}: LearnModeProps) {
  if (!active) {
    return (
      <section className="mt-2 rounded-xl border border-violet-800/70 bg-violet-950/15 px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onStartPassLine}
              className="rounded-lg bg-violet-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-violet-300"
            >
              Pass Line Basics
            </button>
            <button
              onClick={onStartPlace68}
              className="rounded-lg border border-cyan-400/60 bg-cyan-950/40 px-4 py-3 text-sm font-black text-cyan-100 shadow-lg hover:bg-cyan-900/50"
            >
              Place 6 & 8
            </button>
            <button
              onClick={onStartCome}
              className="rounded-lg border border-amber-400/60 bg-amber-950/30 px-4 py-3 text-sm font-black text-amber-100 shadow-lg hover:bg-amber-900/40"
            >
              Come Bet Basics
            </button>
          </div>
        </div>
      </section>
    );
  }

  const current = copy[step];
  const meta = lessonMeta[lesson];
  const stepIndex = meta.steps.indexOf(step) + 1;
  const isExplanation =
    step === "pass-point" ||
    step === "place-explain" ||
    step === "come-travel";
  const isComplete =
    step === "pass-complete" ||
    step === "place-complete" ||
    step === "come-complete";

  return (
    <section className="mt-2 overflow-hidden rounded-xl border-2 border-violet-400/70 bg-[linear-gradient(135deg,rgba(76,29,149,.32),rgba(3,19,14,.96))] shadow-[0_0_26px_rgba(167,139,250,.16)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-400/20 bg-violet-950/35 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-violet-400 px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-slate-950">
            Learn Mode
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.12em] text-violet-200">
            {meta.title}
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
          <h3 className="mt-1 text-xl font-black text-white">{current.title}</h3>
          <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-violet-50/70">
            {current.body}
          </p>

          {isExplanation && point !== null && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-950/35 px-3 py-2 text-[10px] font-black text-cyan-100">
              {step === "come-travel"
                ? `TABLE POINT ${point} • COME NUMBER 8`
                : `PUCK ON → POINT ${point}`}
            </div>
          )}

          <div className="mt-3 text-[10px] font-black uppercase tracking-[0.09em] text-amber-300">
            {current.action}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isExplanation && (
            <button
              onClick={onContinue}
              className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg"
            >
              Continue
            </button>
          )}

          {isComplete && (
            <button
              onClick={onRestart}
              className="rounded-lg bg-amber-400 px-5 py-3 text-sm font-black text-black shadow-lg"
            >
              Try Again
            </button>
          )}

          <div className="hidden min-w-[86px] text-center lg:block">
            <div className="text-3xl font-black text-violet-300">
              {stepIndex}/{meta.steps.length}
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
