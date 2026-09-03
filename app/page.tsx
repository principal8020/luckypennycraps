import Link from "next/link";

const features = [
  {
    eyebrow: "PLAY",
    title: "Play on a full craps table",
    body: "Place bets, take odds, roll the dice, and follow the action on a casino-style table built for learning.",
    href: "/table",
    cta: "Open the Table",
  },
  {
    eyebrow: "PRACTICE",
    title: "Control the situation",
    body: "Use Practice Mode to choose totals, exact dice combinations, points, and common scenarios so you can rehearse what happens next.",
    href: "/table",
    cta: "Try Practice Mode",
  },
  {
    eyebrow: "LEARN",
    title: "Learn a betting strategy",
    body: "Strategy Mode coaches you through systems like 3-Point Molly, 3-Point Dolly, Iron Cross, Place 6 & 8, and more.",
    href: "/strategies",
    cta: "Explore Strategies",
  },
];

const highlights = [
  "3-4-5× Pass and Come odds",
  "Don't Pass and Don't Come lay odds",
  "Place, Field, Hardways, Horn and Hop bets",
  "Roll history and distribution analytics",
  "Shooter and hand statistics",
  "Scenario Trainer and guided Strategy Mode",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <section className="border-b border-emerald-900/80 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.10),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,.08),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-300/70 bg-amber-300/10 shadow-[inset_0_0_0_3px_rgba(251,191,36,.07)]">
                <span className="font-serif text-[15px] font-black tracking-[-0.08em] text-amber-200">
                  LP
                </span>
                <span className="absolute bottom-[5px] text-[5px] font-black uppercase tracking-[0.18em] text-emerald-400">
                  craps
                </span>
              </div>

              <div>
                <div className="text-xl font-black sm:text-2xl">
                  Lucky Penny Craps
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.26em] text-emerald-400">
                  Practice • Play • Learn
                </div>
              </div>
            </div>

            <nav className="hidden items-center gap-5 text-sm font-bold text-emerald-100/80 md:flex">
              <Link className="hover:text-white" href="/how-to-play">
                How to Play
              </Link>
              <Link className="hover:text-white" href="/strategies">
                Strategies
              </Link>
              <Link className="hover:text-white" href="/about">
                About
              </Link>
            </nav>

            <Link
              href="/table"
              className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-black text-black shadow-lg transition hover:bg-amber-300"
            >
              Play Now
            </Link>
          </header>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-emerald-700/70 bg-emerald-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
            Free craps simulator & learning tool
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
            Learn craps by
            <span className="text-amber-300"> actually playing it.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-emerald-50/70 sm:text-lg">
            Lucky Penny combines a playable craps table with guided practice,
            strategy coaching, and roll analytics. Learn what each bet does,
            practice common situations, and build confidence before you step
            up to a real table.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/table"
              className="rounded-xl bg-amber-400 px-6 py-3.5 text-base font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Start Playing
            </Link>
            <Link
              href="/how-to-play"
              className="rounded-xl border border-emerald-600/70 bg-emerald-950/30 px-6 py-3.5 text-base font-black text-emerald-100 transition hover:border-emerald-400"
            >
              New to Craps?
            </Link>
          </div>

          <p className="mt-4 text-[10px] font-bold text-emerald-700">
            Practice credits only. No real-money wagering or cash prizes.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-700/50 bg-[#087348] p-3 shadow-[0_24px_70px_rgba(0,0,0,.45)]">
          <div className="rounded-2xl border-[7px] border-[#6c3b12] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.04),transparent_25%),#087348] p-4 sm:p-5">
            <div className="mb-4 overflow-hidden rounded-2xl border border-white/15 bg-black/20 px-4 py-3">
              <img
                src="/lucky-penny-dogs-logo.png"
                alt="Lucky and Penny, the Lucky Penny Craps mascots"
                className="mx-auto max-h-[170px] w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,.35)]"
              />
              <div className="mt-1 text-center text-[8px] font-black uppercase tracking-[0.18em] text-emerald-200/70">
                Lucky + Penny • the mascots behind the name
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1">
              {[4, 5, 6, 8, 9, 10].map((number) => (
                <div
                  key={number}
                  className="rounded border border-white/50 bg-black/5 py-3 text-center"
                >
                  <div className="text-xl font-black sm:text-2xl">{number}</div>
                  <div className="mt-1 text-[6px] font-black uppercase tracking-[0.1em] text-emerald-100/70">
                    Place
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-1 rounded border border-white/60 py-4 text-center font-serif text-3xl text-red-300 sm:text-4xl">
              COME
            </div>

            <div className="mt-1 rounded-[28px] border-2 border-white/70 py-3 text-center text-xl font-black tracking-[0.12em] sm:text-2xl">
              PASS LINE
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-3">
              <div className="flex gap-2">
                <span className="h-9 w-9 rounded-full border-4 border-dashed border-white bg-red-600" />
                <span className="h-9 w-9 rounded-full border-4 border-dashed border-white bg-emerald-700" />
                <span className="h-9 w-9 rounded-full border-4 border-dashed border-white bg-zinc-950" />
              </div>
              <div className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-black text-black">
                ROLL DICE
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-900/70 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:px-8 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.eyebrow}
              className="rounded-2xl border border-emerald-900/80 bg-emerald-950/20 p-5"
            >
              <div className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
                {feature.eyebrow}
              </div>
              <h2 className="mt-2 text-xl font-black">{feature.title}</h2>
              <p className="mt-3 min-h-[72px] text-sm font-medium leading-6 text-emerald-50/60">
                {feature.body}
              </p>
              <Link
                href={feature.href}
                className="mt-4 inline-block text-sm font-black text-emerald-300 hover:text-white"
              >
                {feature.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Built for repetition
            </div>
            <h2 className="mt-2 text-3xl font-black">
              More than a dice roller.
            </h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-emerald-50/65">
              Lucky Penny is designed around the questions new and improving
              craps players actually have: Where does this bet go? What does it
              pay? What happens on the next roll? How does a strategy progress?
              Practice those answers on the table instead of memorizing them
              from a diagram.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-3 rounded-xl border border-emerald-900/70 bg-black/20 px-4 py-3 text-sm font-bold text-emerald-100/80"
              >
                <span className="text-amber-300">◆</span>
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-emerald-900/70 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-emerald-100/45 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-black text-emerald-100/75">
              Lucky Penny Craps
            </div>
            <div className="mt-1">
              Educational practice experience. Practice credits have no cash
              value.
            </div>
          </div>

          <div className="flex flex-wrap gap-4 font-bold">
            <Link href="/how-to-play" className="hover:text-white">
              How to Play
            </Link>
            <Link href="/strategies" className="hover:text-white">
              Strategies
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
