"use client";

import Link from "next/link";

type SiteSection =
  | "home"
  | "craps"
  | "blackjack"
  | "roulette"
  | "baccarat"
  | "learn"
  | "feedback"
  | "about";

type SiteHeaderProps = {
  active?: SiteSection;
  compact?: boolean;
  wide?: boolean;
};

const navigation: Array<{
  label: string;
  href: string;
  section: SiteSection;
}> = [
  { label: "Games", href: "/#games", section: "home" },
  { label: "Craps", href: "/table", section: "craps" },
  { label: "Blackjack", href: "/blackjack", section: "blackjack" },
  { label: "Roulette", href: "/roulette", section: "roulette" },
  { label: "Baccarat", href: "/baccarat", section: "baccarat" },
  { label: "Guides", href: "/guides", section: "learn" },
  { label: "Feedback", href: "/feedback", section: "feedback" },
  { label: "About", href: "/about", section: "about" },
];

function NavigationLinks({ active, mobile = false }: { active?: SiteSection; mobile?: boolean }) {
  return navigation.map((item) => {
    const current = active === item.section;

    return (
      <Link
        key={item.section}
        href={item.href}
        aria-current={current ? "page" : undefined}
        onClick={
          mobile
            ? (event) => event.currentTarget.closest("details")?.removeAttribute("open")
            : undefined
        }
        className={`rounded-lg font-bold transition ${
          mobile ? "block px-4 py-3 text-base" : "px-3 py-2 text-sm"
        } ${
          current
            ? "bg-amber-400 text-black shadow-sm"
            : "text-emerald-100/75 hover:bg-emerald-950/70 hover:text-white"
        }`}
      >
        {item.label}
      </Link>
    );
  });
}

export function SiteHeader({ active, compact = false, wide = false }: SiteHeaderProps) {
  return (
    <header className="relative z-[120] border-b border-emerald-900/80 bg-[#020e0a]/95 text-white backdrop-blur">
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 ${
          wide ? "max-w-[1500px]" : "max-w-7xl"
        } ${compact ? "py-2" : "py-3"}`}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Lucky Penny Gaming home">
          <div
            className={`relative flex shrink-0 items-center justify-center rounded-full border-2 border-amber-300/70 bg-amber-300/10 shadow-[inset_0_0_0_3px_rgba(251,191,36,.07)] ${
              compact ? "h-10 w-10" : "h-11 w-11"
            }`}
          >
            <span className="font-serif text-sm font-black tracking-[-0.08em] text-amber-200">
              LP
            </span>
            <span className="absolute bottom-[4px] text-[5px] font-black uppercase tracking-[0.16em] text-emerald-400">
              gaming
            </span>
          </div>

          <div className="min-w-0">
            <div className={`truncate font-black ${compact ? "text-lg" : "text-lg sm:text-xl"}`}>
              Lucky Penny Gaming
            </div>
            <div className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 sm:text-xs">
              Practice • Play • Learn
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          <NavigationLinks active={active} />
        </nav>

        <details className="group relative lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-emerald-700/70 bg-emerald-950/40 px-3 py-2 text-sm font-black text-emerald-100 transition hover:border-emerald-400 [&::-webkit-details-marker]:hidden">
            <span>Menu</span>
            <span aria-hidden="true" className="text-lg leading-none group-open:hidden">☰</span>
            <span aria-hidden="true" className="hidden text-lg leading-none group-open:inline">×</span>
          </summary>
          <nav
            className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-emerald-700/70 bg-[#03130e] p-2 shadow-[0_20px_55px_rgba(0,0,0,.65)]"
            aria-label="Mobile navigation"
          >
            <NavigationLinks active={active} mobile />
          </nav>
        </details>
      </div>
    </header>
  );
}
