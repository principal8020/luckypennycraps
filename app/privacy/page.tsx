import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <header className="border-b border-emerald-900/80 bg-black/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-sm font-black text-emerald-300 hover:text-white"
          >
            ← Lucky Penny Gaming
          </Link>
          <Link
            href="/feedback"
            className="rounded-lg border border-emerald-700/70 px-4 py-2.5 text-sm font-black text-emerald-200 hover:border-emerald-400"
          >
            Feedback
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="inline-flex rounded-full border border-emerald-700/70 bg-emerald-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
          Privacy
        </div>

        <h1 className="mt-4 text-4xl font-black sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm font-medium text-emerald-100/45">
          Last updated September 8, 2026
        </p>

        <div className="mt-8 space-y-5">
          <section className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5 sm:p-6">
            <h2 className="text-xl font-black text-amber-300">
              What Lucky Penny Gaming is
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
              Lucky Penny Gaming is an educational practice experience for casino
              games. It uses practice credits only and does not accept real-money
              wagers, deposits, or cash-out requests.
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5 sm:p-6">
            <h2 className="text-xl font-black">Information you choose to provide</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
              The Feedback & Suggestions page lets you provide a message and,
              optionally, an email address if you want a reply. At this stage,
              submitting feedback opens your device&apos;s email application with
              the information filled in. Lucky Penny Gaming does not require an
              account to use the site or submit feedback.
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5 sm:p-6">
            <h2 className="text-xl font-black">Technical information</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
              Like most websites, the hosting and infrastructure services used to
              operate Lucky Penny Gaming may process limited technical information
              such as IP address, browser type, device information, request logs,
              and similar security or performance data.
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5 sm:p-6">
            <h2 className="text-xl font-black">Cookies, analytics, and advertising</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
              Lucky Penny Gaming is still in development. If we add analytics,
              advertising, accounts, payments, or other features that materially
              change how information is collected or used, this policy will be
              updated before those features are broadly launched.
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5 sm:p-6">
            <h2 className="text-xl font-black">Children</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
              Lucky Penny Gaming is intended as a casino-game education and
              practice product, not a real-money gambling service. The site is not
              designed to knowingly collect personal information from children.
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-900/80 bg-black/25 p-5 sm:p-6">
            <h2 className="text-xl font-black">Questions or privacy requests</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/65">
              If you have a privacy question, use the Feedback & Suggestions page
              and choose Question. If you include an email address, we can reply.
            </p>
            <Link
              href="/feedback"
              className="mt-4 inline-block rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black"
            >
              Contact Lucky Penny Gaming
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
