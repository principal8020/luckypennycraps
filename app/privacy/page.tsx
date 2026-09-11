import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Lucky Penny Gaming.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f6f2e8] text-[#17392b]">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-800">
          Privacy
        </div>

        <h1 className="mt-4 text-4xl font-black text-[#0d3525] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Last updated September 10, 2026
        </p>

        <div className="mt-8 space-y-5">
          <section className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.05)] sm:p-6">
            <h2 className="text-xl font-black text-amber-700">
              What Lucky Penny Gaming is
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              Lucky Penny Gaming is an educational practice experience for casino
              games. It uses practice credits only and does not accept real-money
              wagers, deposits, or cash-out requests.
            </p>
          </section>

          <section className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.05)] sm:p-6">
            <h2 className="text-xl font-black text-[#123b2a]">Information you choose to provide</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              The Feedback & Suggestions page lets you provide a message and,
              optionally, an email address if you want a reply. At this stage,
              submitting feedback opens your device&apos;s email application with
              the information filled in. Lucky Penny Gaming does not require an
              account to use the site or submit feedback.
            </p>
          </section>

          <section className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.05)] sm:p-6">
            <h2 className="text-xl font-black text-[#123b2a]">Technical information</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              Like most websites, the hosting and infrastructure services used to
              operate Lucky Penny Gaming may process limited technical information
              such as IP address, browser type, device information, request logs,
              and similar security or performance data.
            </p>
          </section>

          <section className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.05)] sm:p-6">
            <h2 className="text-xl font-black text-[#123b2a]">Cookies, analytics, and advertising</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              Lucky Penny Gaming uses Vercel Web Analytics to understand site
              traffic, including pages viewed, referring sites, general device
              and browser information, and approximate geographic information.
              We also use Vercel Speed Insights to measure page performance and
              Core Web Vitals. We use this information to improve the site and
              do not use it to identify individual visitors.
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              Lucky Penny Gaming does not currently use advertising cookies or
              sell personal information. If advertising, accounts, payments, or
              other features materially change how information is collected or
              used, this policy will be updated.
            </p>
          </section>

          <section className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.05)] sm:p-6">
            <h2 className="text-xl font-black text-[#123b2a]">Children</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              Lucky Penny Gaming is intended as a casino-game education and
              practice product, not a real-money gambling service. The site is not
              designed to knowingly collect personal information from children.
            </p>
          </section>

          <section className="rounded-2xl border border-[#c6d4ca] bg-white p-5 shadow-[0_8px_24px_rgba(20,60,43,.05)] sm:p-6">
            <h2 className="text-xl font-black text-[#123b2a]">Questions or privacy requests</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
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
