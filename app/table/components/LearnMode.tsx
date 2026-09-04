"use client";

export type LearnLessonId =
  | "pass-line"
  | "place-68"
  | "come"
  | "dont-pass"
  | "dont-come"
  | "field"
  | "hardways";

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
  | "come-complete"
  | "dp-place"
  | "dp-bar12"
  | "dp-point-roll"
  | "dp-explain"
  | "dp-odds"
  | "dp-seven"
  | "dp-complete"
  | "dc-place"
  | "dc-roll-travel"
  | "dc-explain"
  | "dc-odds"
  | "dc-seven"
  | "dc-complete"
  | "field-place"
  | "field-even"
  | "field-two"
  | "field-twelve"
  | "field-loss"
  | "field-complete"
  | "hard-place"
  | "hard-win"
  | "hard-explain"
  | "hard-easy"
  | "hard-complete";

type LearnModeProps = {
  active: boolean;
  lesson: LearnLessonId;
  step: LearnLessonStep;
  point: number | null;
  onStartPassLine: () => void;
  onStartPlace68: () => void;
  onStartCome: () => void;
  onStartDontPass: () => void;
  onStartDontCome: () => void;
  onStartField: () => void;
  onStartHardways: () => void;
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
  "dont-pass": {
    title: "Don't Pass Basics",
    steps: [
      "dp-place",
      "dp-bar12",
      "dp-point-roll",
      "dp-explain",
      "dp-odds",
      "dp-seven",
      "dp-complete",
    ],
  },
  "dont-come": {
    title: "Don't Come Basics",
    steps: [
      "dc-place",
      "dc-roll-travel",
      "dc-explain",
      "dc-odds",
      "dc-seven",
      "dc-complete",
    ],
  },
  field: {
    title: "Field Basics",
    steps: [
      "field-place",
      "field-even",
      "field-two",
      "field-twelve",
      "field-loss",
      "field-complete",
    ],
  },
  hardways: {
    title: "Hardways Basics",
    steps: [
      "hard-place",
      "hard-win",
      "hard-explain",
      "hard-easy",
      "hard-complete",
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
  "dp-place": {
    eyebrow: "STEP 1 OF 7",
    title: "Place $5 on Don't Pass",
    body:
      "Don't Pass is the classic dark-side contract bet. On the come-out it wins on 2 or 3, loses on 7 or 11, and 12 is a push. After a point is set, you want 7 before the point repeats.",
    action: "YOUR TURN → Click DON'T PASS",
  },
  "dp-bar12": {
    eyebrow: "STEP 2 OF 7",
    title: "See why the table says BAR 12",
    body:
      "Lucky Penny will roll 12. On Don't Pass, 12 pushes: you neither win nor lose, and the original Don't Pass bet stays up for the next come-out roll.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "dp-point-roll": {
    eyebrow: "STEP 3 OF 7",
    title: "Establish a point",
    body:
      "Now Lucky Penny will roll 6. That turns the puck ON and makes 6 the table point. Your Don't Pass bet now changes its goal.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "dp-explain": {
    eyebrow: "STEP 4 OF 7",
    title: "Now you want 7 before 6",
    body:
      "Once the point is established, Don't Pass wins if a 7 appears before the point repeats. The flat Don't Pass bet is a contract bet and stays in action until one of those outcomes occurs.",
    action: "READ THIS → Then click CONTINUE",
  },
  "dp-odds": {
    eyebrow: "STEP 5 OF 7",
    title: "Build $6 in Don't Pass lay odds",
    body:
      "Dark-side odds are laid rather than taken. With point 6, laying $6 wins $5 at true odds. Add $5 first; Lucky Penny will switch you to $1 for the final dollar.",
    action: "YOUR TURN → Build LAY ODDS to $6",
  },
  "dp-seven": {
    eyebrow: "STEP 6 OF 7",
    title: "Roll the 7 before the point",
    body:
      "Lucky Penny will roll 7. Your $5 Don't Pass flat bet wins $5, and the $6 lay odds win another $5 because 7 arrived before the point 6.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "dp-complete": {
    eyebrow: "STEP 7 OF 7",
    title: "Don't Pass lesson complete",
    body:
      "You saw Bar 12 push, established a point, added proper lay odds, and then won with a seven-out. That is the basic Don't Pass cycle.",
    action: "LESSON COMPLETE",
  },
  "dc-place": {
    eyebrow: "STEP 1 OF 6",
    title: "Place $5 in Don't Come",
    body:
      "Don't Come is the dark-side counterpart to Come. It is placed while the puck is already ON and gets its own contract number on the next qualifying roll.",
    action: "YOUR TURN → Click DON'T COME",
  },
  "dc-roll-travel": {
    eyebrow: "STEP 2 OF 6",
    title: "Roll to give Don't Come a number",
    body:
      "On its first roll, Don't Come wins on 2 or 3, loses on 7 or 11, pushes on 12, and travels behind 4, 5, 6, 8, 9, or 10. Lucky Penny will roll 8.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "dc-explain": {
    eyebrow: "STEP 3 OF 6",
    title: "Your Don't Come bet is behind 8",
    body:
      "The table point remains 6, but this Don't Come bet now has its own number: 8. From here, it wins if 7 rolls before 8 and loses if 8 repeats first.",
    action: "READ THIS → Then click CONTINUE",
  },
  "dc-odds": {
    eyebrow: "STEP 4 OF 6",
    title: "Build $6 in Don't Come lay odds",
    body:
      "You can lay true odds behind a traveled Don't Come bet. Behind 8, laying $6 wins $5. Add $5 first, then $1 to reach the proper $6 amount.",
    action: "YOUR TURN → Build DC LAY ODDS to $6",
  },
  "dc-seven": {
    eyebrow: "STEP 5 OF 6",
    title: "Roll 7 before the Don't Come number",
    body:
      "Lucky Penny will roll 7. The Don't Come 8 wins because 7 arrived before 8. The table point also seven-outs at the same time.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "dc-complete": {
    eyebrow: "STEP 6 OF 6",
    title: "Don't Come lesson complete",
    body:
      "You placed Don't Come with the puck ON, watched it travel behind 8, added lay odds, and won when 7 arrived before 8.",
    action: "LESSON COMPLETE",
  },
  "field-place": {
    eyebrow: "STEP 1 OF 6",
    title: "Place $5 in the Field",
    body:
      "The Field is a one-roll bet. It wins on 2, 3, 4, 9, 10, 11, or 12 and loses on 5, 6, 7, or 8. Lucky Penny will walk through several outcomes with the same $5 wager.",
    action: "YOUR TURN → Click FIELD",
  },
  "field-even": {
    eyebrow: "STEP 2 OF 6",
    title: "See an even-money Field winner",
    body:
      "Lucky Penny will roll 9. On this table, 3, 4, 9, 10, and 11 pay even money, so a $5 Field bet wins $5 profit and stays up.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "field-two": {
    eyebrow: "STEP 3 OF 6",
    title: "See 2 pay double",
    body:
      "Next Lucky Penny will roll 2. This table pays the Field 2 at 2:1, so the $5 wager wins $10 profit and remains up.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "field-twelve": {
    eyebrow: "STEP 4 OF 6",
    title: "See 12 pay triple",
    body:
      "Now Lucky Penny will roll 12. This table pays the Field 12 at 3:1, so the same $5 wager wins $15 profit and stays up.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "field-loss": {
    eyebrow: "STEP 5 OF 6",
    title: "See a Field loser",
    body:
      "Finally Lucky Penny will roll 6. Six is not a Field number, so the $5 wager loses and comes down immediately.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "field-complete": {
    eyebrow: "STEP 6 OF 6",
    title: "Field lesson complete",
    body:
      "You saw an even-money winner, the special 2 and 12 payouts, and a losing result. Remember: the Field resolves on every single roll.",
    action: "LESSON COMPLETE",
  },
  "hard-place": {
    eyebrow: "STEP 1 OF 5",
    title: "Place $5 on Hard 6",
    body:
      "A Hard 6 wins only when 6 is rolled as a pair: 3 + 3. It loses if an easy 6 arrives first or if a 7 rolls. Hardways are working for this guided example.",
    action: "YOUR TURN → Open CENTER BETS and click HARD 6",
  },
  "hard-win": {
    eyebrow: "STEP 2 OF 5",
    title: "Roll the 6 the hard way",
    body:
      "Lucky Penny will roll 3 + 3. Hard 6 pays 9:1, so a $5 wager wins $45 profit. Like the other Hardways on Lucky Penny, the winning bet stays up.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "hard-explain": {
    eyebrow: "STEP 3 OF 5",
    title: "The Hard 6 is still working",
    body:
      "The bet stayed on the table after the win. It can win again on another 3 + 3, but an easy 6 such as 2 + 4 or 1 + 5 will knock it down. A 7 also loses it.",
    action: "READ THIS → Then click CONTINUE",
  },
  "hard-easy": {
    eyebrow: "STEP 4 OF 5",
    title: "See an easy 6 beat the Hard 6",
    body:
      "Lucky Penny will roll 2 + 4. The total is still 6, but because it is not a pair, the Hard 6 loses and comes down.",
    action: "YOUR TURN → Click ROLL DICE",
  },
  "hard-complete": {
    eyebrow: "STEP 5 OF 5",
    title: "Hardways lesson complete",
    body:
      "You saw the defining Hardway rule: the exact pair wins, while the easy version of the same total or a 7 loses the wager.",
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
  onStartDontPass,
  onStartDontCome,
  onStartField,
  onStartHardways,
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
            <button
              onClick={onStartDontPass}
              className="rounded-lg border border-rose-400/60 bg-rose-950/30 px-4 py-3 text-sm font-black text-rose-100 shadow-lg hover:bg-rose-900/40"
            >
              Don't Pass Basics
            </button>
            <button
              onClick={onStartDontCome}
              className="rounded-lg border border-red-400/60 bg-red-950/30 px-4 py-3 text-sm font-black text-red-100 shadow-lg hover:bg-red-900/40"
            >
              Don't Come Basics
            </button>
            <button
              onClick={onStartField}
              className="rounded-lg border border-yellow-400/60 bg-yellow-950/30 px-4 py-3 text-sm font-black text-yellow-100 shadow-lg hover:bg-yellow-900/40"
            >
              Field Basics
            </button>
            <button
              onClick={onStartHardways}
              className="rounded-lg border border-orange-400/60 bg-orange-950/30 px-4 py-3 text-sm font-black text-orange-100 shadow-lg hover:bg-orange-900/40"
            >
              Hardways Basics
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
    step === "come-travel" ||
    step === "dp-explain" ||
    step === "dc-explain" ||
    step === "hard-explain";
  const isComplete =
    step === "pass-complete" ||
    step === "place-complete" ||
    step === "come-complete" ||
    step === "dp-complete" ||
    step === "dc-complete" ||
    step === "field-complete" ||
    step === "hard-complete";

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
