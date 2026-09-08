import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blackjack | Lucky Penny Gaming",
  description:
    "Practice blackjack with a casino-style table, guided learning, and strategy coaching from Lucky Penny Gaming.",
};

type Suit = "♠" | "♥" | "♦" | "♣";

type PlayingCardProps = {
  rank: string;
  suit: Suit;
  hidden?: boolean;
  tilted?: "left" | "right";
};

function PlayingCard({ rank, suit, hidden = false, tilted }: PlayingCardProps) {
  const red = suit === "♥" || suit === "♦";
  const tilt =
    tilted === "left"
      ? "-rotate-3"
      : tilted === "right"
        ? "rotate-3"
        : "";

  if (hidden) {
    return (
      <div
        className={`relative h-28 w-20 overflow-hidden rounded-lg border-2 border-white/90 bg-[#0b2f63] shadow-[0_10px_24px_rgba(0,0,0,.45)] sm:h-32 sm:w-24 ${tilt}`}
        aria-label="Face-down card"
      >
        <div className="absolute inset-1 rounded-md border border-white/50 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.12)_0px,rgba(255,255,255,.12)_3px,transparent_3px,transparent_7px)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-amber-300/70 bg-black/30 font-serif text-sm font-black text-amber-200">
            LP
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-28 w-20 rounded-lg border border-zinc-300 bg-[#fffdf6] text-zinc-950 shadow-[0_10px_24px_rgba(0,0,0,.45)] sm:h-32 sm:w-24 ${tilt}`}
    >
      <div
        className={`absolute left-2 top-1.5 text-lg font-black leading-none sm:text-xl ${
          red ? "text-red-600" : "text-zinc-950"
        }`}
      >
        <div>{rank}</div>
        <div className="mt-0.5 text-base sm:text-lg">{suit}</div>
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl ${
          red ? "text-red-600" : "text-zinc-950"
        }`}
      >
        {suit}
      </div>
      <div
        className={`absolute bottom-1.5 right-2 rotate-180 text-lg font-black leading-none sm:text-xl ${
          red ? "text-red-600" : "text-zinc-950"
        }`}
      >
        <div>{rank}</div>
        <div className="mt-0.5 text-base sm:text-lg">{suit}</div>
      </div>
    </div>
  );
}

function Chip({ value, selected = false }: { value: number; selected?: boolean }) {
  const style =
    value === 1
      ? "border-zinc-400 bg-zinc-100 text-zinc-950"
      : value === 5
        ? "border-white bg-red-600 text-white"
        : value === 25
          ? "border-white bg-emerald-700 text-white"
          : value === 100
            ? "border-white bg-zinc-950 text-white"
            : "border-white bg-purple-700 text-white";

  return (
    <div
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-dashed text-[11px] font-black shadow-lg sm:h-14 sm:w-14 sm:text-xs ${style} ${
        selected
          ? "scale-110 ring-4 ring-amber-300 ring-offset-2 ring-offset-[#061710]"
          : ""
      }`}
    >
      <span className="absolute inset-[5px] rounded-full border border-current opacity-35" />
      <span className="relative">${value}</span>
    </div>
  );
}

export default function BlackjackPage() {
  return (
    <main className="min-h-screen bg-[#020b08] text-white">
      <header className="border-b border-emerald-900/80 bg-[#020e0a]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-amber-300/70 bg-amber-300/10 shadow-[inset_0_0_0_3px_rgba(251,191,36,.07)]">
              <span className="font-serif text-[14px] font-black tracking-[-0.08em] text-amber-200">
                LP
              </span>
              <span className="absolute bottom-[4px] text-[5px] font-black uppercase tracking-[0.16em] text-emerald-400">
                gaming
              </span>
            </div>
            <div>
              <div className="text-lg font-black sm:text-xl">Lucky Penny Gaming</div>
              <div className="text-[8px] font-black uppercase tracking-[0.24em] text-emerald-400">
                Blackjack • Practice • Play • Learn
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-sm font-bold text-emerald-100/75 md:flex">
            <Link href="/" className="hover:text-white">
              Games
            </Link>
            <Link href="/table" className="hover:text-white">
              Craps
            </Link>
            <Link href="/feedback" className="hover:text-white">
              Feedback
            </Link>
          </div>

          <div className="rounded-lg border border-amber-300/50 bg-amber-300/10 px-3 py-2 text-right">
            <div className="text-[7px] font-black uppercase tracking-[0.18em] text-amber-200/70">
              Development Preview
            </div>
            <div className="text-xs font-black text-amber-100">Blackjack v1</div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-3 py-4 sm:px-5 sm:py-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
              Lucky Penny Blackjack
            </div>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">Casino table preview</h1>
            <p className="mt-1 max-w-2xl text-sm font-medium text-emerald-50/60">
              Visual shell first. Betting, dealing, hand decisions, payouts, Learn Mode, and strategy coaching will be wired in next.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["BANKROLL", "$5,000"],
              ["BET", "$25"],
              ["SESSION P/L", "$0"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="min-w-[92px] rounded-xl border border-emerald-900/80 bg-black/25 px-3 py-2"
              >
                <div className="text-[7px] font-black uppercase tracking-[0.12em] text-emerald-400">
                  {label}
                </div>
                <div className="mt-0.5 text-lg font-black">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[34px] border-[12px] border-[#5a2d0b] bg-[#075f3d] shadow-[0_26px_70px_rgba(0,0,0,.65),inset_0_0_0_3px_rgba(214,166,72,.28),inset_0_0_0_7px_rgba(45,18,4,.34)]">
          <div
            className="relative min-h-[690px] overflow-hidden border-[4px] border-[#cfbd8c]/75 bg-[#075f3d] px-3 py-4 sm:min-h-[760px] sm:px-6 sm:py-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 18%, rgba(255,255,255,.055), transparent 28%), radial-gradient(circle at 15% 85%, rgba(0,0,0,.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,.018), rgba(0,0,0,.035)), repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0px, rgba(255,255,255,.012) 1px, rgba(0,0,0,.018) 1px, rgba(0,0,0,.018) 3px)",
            }}
          >
            <div className="pointer-events-none absolute left-1/2 top-[54px] h-[510px] w-[92%] -translate-x-1/2 rounded-[50%] border-[3px] border-amber-100/70 sm:top-[66px] sm:h-[560px]" />
            <div className="pointer-events-none absolute left-1/2 top-[94px] h-[430px] w-[80%] -translate-x-1/2 rounded-[50%] border border-amber-100/25 sm:top-[112px] sm:h-[455px]" />

            <div className="relative z-10 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-100/80 sm:text-xs">
                Blackjack pays 3 to 2
              </div>
              <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-100/60 sm:text-[9px]">
                Dealer stands on soft 17 • Insurance pays 2 to 1
              </div>
            </div>

            <div className="relative z-10 mt-7 sm:mt-10">
              <div className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-emerald-200/70">
                Dealer
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
                <PlayingCard rank="10" suit="♥" tilted="left" />
                <PlayingCard rank="?" suit="♠" hidden tilted="right" />
              </div>
              <div className="mx-auto mt-3 w-fit rounded-full border border-white/15 bg-black/25 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-100/70">
                Dealer shows 10
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-8 max-w-[900px] sm:mt-10">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="hidden text-right sm:block">
                  <div className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-200/55">
                    Table minimum
                  </div>
                  <div className="text-xl font-black text-amber-100">$5</div>
                </div>

                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-amber-100/75 bg-black/10 shadow-[inset_0_0_24px_rgba(0,0,0,.2)] sm:h-28 sm:w-28">
                  <div className="absolute inset-2 rounded-full border border-amber-100/30" />
                  <div className="text-center">
                    <div className="text-[7px] font-black uppercase tracking-[0.13em] text-emerald-200/70">
                      Main Bet
                    </div>
                    <div className="mt-1 text-2xl font-black text-amber-100">$25</div>
                  </div>
                </div>

                <div className="hidden text-left sm:block">
                  <div className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-200/55">
                    Table maximum
                  </div>
                  <div className="text-xl font-black text-amber-100">$1,000</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-7 sm:mt-9">
              <div className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-emerald-200/70">
                Player • 18
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
                <PlayingCard rank="A" suit="♠" tilted="left" />
                <PlayingCard rank="7" suit="♦" tilted="right" />
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-7 max-w-[950px] rounded-2xl border border-emerald-200/25 bg-black/20 p-3 backdrop-blur-[1px] sm:mt-9 sm:p-4">
              <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <div>
                  <div className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300/70">
                    Bet chips
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Chip value={1} />
                    <Chip value={5} />
                    <Chip value={25} selected />
                    <Chip value={100} />
                    <Chip value={500} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:px-4">
                  {["HIT", "STAND", "DOUBLE", "SPLIT"].map((action) => (
                    <button
                      key={action}
                      disabled
                      className="rounded-xl border border-emerald-300/35 bg-emerald-950/55 px-4 py-3 text-xs font-black text-emerald-50/75 shadow-sm disabled:cursor-default"
                    >
                      {action}
                    </button>
                  ))}
                </div>

                <button
                  disabled
                  className="rounded-xl bg-amber-400 px-7 py-4 text-sm font-black text-black shadow-lg disabled:cursor-default"
                >
                  DEAL
                </button>
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-3 flex max-w-[950px] flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[7px] font-bold uppercase tracking-[0.11em] text-emerald-100/50 sm:text-[8px]">
              <span>6-deck shoe</span>
              <span>Double any first 2 cards</span>
              <span>Double after split</span>
              <span>Split up to 4 hands</span>
              <span>Split aces receive 1 card</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-emerald-900/80 bg-emerald-950/20 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Phase 1
            </div>
            <div className="mt-1 text-lg font-black">Core game engine</div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/60">
              Shoe, shuffle, deal, hit, stand, double, split, dealer play, blackjack payouts, bankroll, and hand results.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-900/80 bg-emerald-950/20 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Phase 2
            </div>
            <div className="mt-1 text-lg font-black">Learn Mode</div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/60">
              Guided lessons for hand values, dealer rules, hitting, standing, doubling, splitting, blackjack, and busts.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/40 bg-amber-950/10 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
              Phase 3
            </div>
            <div className="mt-1 text-lg font-black">Basic Strategy Coach</div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/60">
              Recommend the mathematically standard play, explain why, track decisions, and turn mistakes into practice scenarios.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-900/70 bg-black/25 px-4 py-3">
          <div className="text-xs font-medium text-emerald-100/55">
            Practice credits only. No real-money wagering or cash prizes.
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg border border-emerald-700/70 px-4 py-2 text-xs font-black text-emerald-100 hover:border-emerald-400"
            >
              Back to Games
            </Link>
            <Link
              href="/table"
              className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-black text-black hover:bg-amber-300"
            >
              Play Craps
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
