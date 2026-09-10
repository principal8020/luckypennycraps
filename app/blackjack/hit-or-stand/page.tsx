import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "When to Hit or Stand in Blackjack",
  description:
    "Learn when to hit or stand in blackjack with simple rules for hard hands, soft hands, and the dealer's up-card.",
  alternates: { canonical: "/blackjack/hit-or-stand" },
  openGraph: {
    type: "article",
    title: "When to Hit or Stand in Blackjack",
    description:
      "A plain-English decision guide for the most common and most uncomfortable blackjack hands.",
    url: "/blackjack/hit-or-stand",
    publishedTime: "2026-09-10",
    modifiedTime: "2026-09-10",
  },
};

const hardHandRules = [
  ["17 or more", "Stand", "Stand", "You already have a strong total. Do not improve it into a bust."],
  ["13–16", "Stand", "Hit", "Stand against 2–6; hit when the dealer shows 7 through ace."],
  ["12", "Hit on 2–3; stand on 4–6", "Hit", "Twelve is where the neat shortcut gets one small, irritating footnote."],
  ["11 or less", "Hit*", "Hit*", "You cannot bust with one additional card. Check for a double first."],
];

const examples = [
  {
    player: "10 + 6",
    dealer: "6",
    action: "Stand",
    explanation: "The dealer is vulnerable. Let the dealer draw into the danger instead of volunteering your 16.",
    tone: "emerald",
  },
  {
    player: "10 + 6",
    dealer: "10",
    action: "Hit",
    explanation: "Sixteen is ugly, but standing against a strong dealer card is usually the slower route to the same bad news.",
    tone: "sky",
  },
  {
    player: "10 + 2",
    dealer: "3",
    action: "Hit",
    explanation: "Dealer 3 is not weak enough to make standing on 12 the preferred play.",
    tone: "sky",
  },
  {
    player: "10 + 2",
    dealer: "4",
    action: "Stand",
    explanation: "Dealer 4 is a meaningful bust card. Step away from the Hit button and let events unfold.",
    tone: "emerald",
  },
  {
    player: "A + 7",
    dealer: "8",
    action: "Stand",
    explanation: "Soft 18 is respectable against an 8. Respectable is allowed to stop talking.",
    tone: "emerald",
  },
  {
    player: "A + 7",
    dealer: "9",
    action: "Hit",
    explanation: "Soft 18 needs help against a 9, and the ace means one more card cannot immediately bust the hand.",
    tone: "sky",
  },
];

export default function HitOrStandPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "When to Hit or Stand in Blackjack",
    description:
      "A practical guide to hit-or-stand decisions for hard hands, soft hands, and different dealer up-cards.",
    datePublished: "2026-09-10",
    dateModified: "2026-09-10",
    mainEntityOfPage: "https://luckypennygaming.com/blackjack/hit-or-stand",
    author: {
      "@type": "Organization",
      name: "Lucky Penny Gaming",
      url: "https://luckypennygaming.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Lucky Penny Gaming",
      url: "https://luckypennygaming.com",
    },
  };

  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <SiteHeader active="learn" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        <header className="border-b border-emerald-900/70 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,.12),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(245,158,11,.09),transparent_28%)]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
            <Link href="/guides" className="text-xs font-black text-emerald-300 hover:text-white">
              ← All guides
            </Link>
            <div className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              Blackjack • Hit or Stand • 7 minute read
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.08] sm:text-6xl">
              When to hit or stand in blackjack: the uncomfortable art of doing less
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-emerald-50/70">
              Blackjack frequently asks you to choose between taking a card that might ruin everything and doing nothing while the dealer ruins everything professionally. Here is how to make the better choice.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-emerald-200/55">
              <span>Published September 10, 2026</span>
              <span>•</span>
              <span>6 decks • Dealer stands on soft 17 • No surrender</span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <section className="rounded-2xl border border-amber-800/60 bg-amber-950/15 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">
                The useful shortcut
              </div>
              <p className="mt-3 text-base font-bold leading-7 text-amber-50/80">
                With a hard hand, generally stand on 12–16 when the dealer shows 2–6, and hit when the dealer shows 7 through ace. The main exception: hit 12 against a dealer 2 or 3. Stand on hard 17 or more. Hit hard 8 or less.
              </p>
            </section>

            <section className="mt-9">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
                Step one
              </div>
              <h2 className="mt-2 text-3xl font-black">Read the dealer before judging your own hand</h2>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/70">
                The same player total can require opposite decisions because the dealer&apos;s visible card changes the problem. You are not asking, “Is 16 good?” It is not. You are asking whether drawing is better than letting the dealer finish with the advantage already showing.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/25 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.12em] text-emerald-300">Dealer shows 2–6</div>
                  <h3 className="mt-2 text-xl font-black">Make the dealer draw</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
                    These are the dealer&apos;s weaker up-cards. Standing on many stiff hands works because the dealer must keep drawing to at least 17 and may bust along the way.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-700/60 bg-sky-950/20 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.12em] text-sky-300">Dealer shows 7–A</div>
                  <h3 className="mt-2 text-xl font-black">Assume you need improvement</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-sky-50/65">
                    These cards frequently lead to strong dealer totals. Standing on a weak hand may feel safe, but “safe” and “likely to win” are not roommates.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">Hard-hand hit or stand chart</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/60">
                A hard hand has no ace currently counted as 11. Use this quick table when splitting or doubling is not the better first choice.
              </p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-emerald-900/80">
                <table className="w-full min-w-[720px] border-collapse bg-[#04140f] text-left text-sm">
                  <thead>
                    <tr className="border-b border-emerald-900/80 bg-emerald-950/45">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">Your total</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">Dealer 2–6</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">Dealer 7–A</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hardHandRules.map(([total, weak, strong, why]) => (
                      <tr key={total} className="border-b border-emerald-950 last:border-b-0">
                        <th className="whitespace-nowrap px-4 py-4 font-black text-white">{total}</th>
                        <td className="px-4 py-4 font-black text-emerald-200">{weak}</td>
                        <td className="px-4 py-4 font-black text-sky-200">{strong}</td>
                        <td className="px-4 py-4 font-medium leading-6 text-emerald-50/60">{why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs font-medium leading-5 text-emerald-50/45">
                *Hard 9, 10, and 11 have common doubling opportunities. Check the complete basic strategy chart before settling for a regular hit.
              </p>
            </section>

            <section className="mt-9 rounded-2xl border border-red-900/60 bg-red-950/10 p-5 sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-300">The hand everyone argues with</div>
              <h2 className="mt-2 text-3xl font-black">What should you do with 16?</h2>
              <p className="mt-4 text-base font-medium leading-7 text-red-50/70">
                On the Lucky Penny table, stand on hard 16 against dealer 2–6 and hit against dealer 7 through ace. Against a 10, hitting feels awful because it often ends immediately. Standing feels calmer, but usually leaves you waiting for a stronger dealer hand to finish the paperwork.
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-red-100/60">
                Two important detours: split a pair of eights, and remember that a casino offering late surrender may change the recommendation. Lucky Penny currently does not offer surrender.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">Soft hands get their own rules</h2>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/70">
                A soft hand contains an ace counted as 11. Because that ace can fall back to 1, you can often hit without immediately busting. Soft 18 is the hand to remember: double against dealer 3–6 when allowed, stand against 2, 7, or 8, and hit against 9, 10, or ace.
              </p>
              <p className="mt-3 text-base font-medium leading-7 text-emerald-50/70">
                Soft 19 or better stands. Soft 17 or less generally hits unless the full chart identifies a doubling opportunity. The ace is a safety net, not a decorative accessory.
              </p>
            </section>

            <section className="mt-9">
              <h2 className="text-3xl font-black">Six decisions in the wild</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {examples.map((example) => (
                  <div key={`${example.player}-${example.dealer}`} className="rounded-2xl border border-emerald-900/75 bg-black/20 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.12em] text-emerald-400">You vs. dealer</div>
                        <div className="mt-1 text-lg font-black">{example.player} vs. {example.dealer}</div>
                      </div>
                      <span className={`rounded-lg px-3 py-2 text-xs font-black uppercase ${example.tone === "emerald" ? "bg-emerald-400/15 text-emerald-200" : "bg-sky-400/15 text-sky-200"}`}>
                        {example.action}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/60">{example.explanation}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-9 rounded-2xl border border-cyan-900/70 bg-cyan-950/10 p-5 sm:p-6">
              <h2 className="text-2xl font-black">Three mistakes that look reasonable</h2>
              <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-cyan-50/70">
                <li><strong className="text-white">Playing only your total:</strong> A 15 against dealer 6 is not the same problem as 15 against dealer 10.</li>
                <li><strong className="text-white">Refusing to risk a bust:</strong> Sometimes hitting loses quickly while standing loses politely. Quickly can still be the better decision.</li>
                <li><strong className="text-white">Ignoring pairs and doubles:</strong> Before choosing hit or stand, confirm that split or double is not the preferred play.</li>
              </ul>
            </section>

            <section className="mt-10 rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-300/15 to-emerald-900/20 p-6 text-center sm:p-8">
              <h2 className="text-3xl font-black">Practice before the decision has a drink minimum</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-emerald-50/70">
                Open the free table and turn on Strategy Coach. It highlights the recommended action and explains why, which is more useful than memorizing a chart and immediately forgetting where 12 goes.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/blackjack" className="rounded-xl bg-amber-400 px-6 py-3.5 font-black text-black shadow-lg hover:bg-amber-300">
                  Practice Blackjack Free
                </Link>
                <Link href="/blackjack/basic-strategy" className="rounded-xl border border-emerald-600/70 bg-emerald-950/25 px-6 py-3.5 font-black text-emerald-100 hover:border-emerald-400">
                  View the Full Strategy Chart
                </Link>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-emerald-900/80 bg-black/25 p-5 lg:sticky lg:top-5">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">Remember this</div>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-emerald-50/65">
              <li>Stand on hard 17+</li>
              <li>Stand on 13–16 vs. 2–6</li>
              <li>Stand on 12 vs. 4–6</li>
              <li>Hit stiff hands vs. 7–A</li>
              <li>Check split and double first</li>
            </ul>
            <div className="mt-6 border-t border-emerald-900/70 pt-5">
              <p className="text-xs font-medium leading-5 text-emerald-50/45">
                Strategy reduces decision errors; it does not guarantee a winning session. Practice credits only. No real-money wagering or cash prizes.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
