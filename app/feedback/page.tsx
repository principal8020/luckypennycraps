"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const feedbackTypes = [
  "Suggestion",
  "Bug Report",
  "Game Request",
  "Question",
  "Other",
];

const games = ["General", "Craps", "Blackjack", "Roulette", "Baccarat"];

export default function FeedbackPage() {
  const [type, setType] = useState("Suggestion");
  const [game, setGame] = useState("General");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `Lucky Penny Gaming Feedback — ${type} — ${game}`;
    const body = [
      `Feedback type: ${type}`,
      `Game: ${game}`,
      email ? `Reply-to email: ${email}` : "Reply-to email: not provided",
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:feedback@luckypennygaming.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="min-h-screen bg-[#03130e] text-white">
      <header className="border-b border-emerald-900/80 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-sm font-black text-emerald-300 hover:text-white"
          >
            ← Lucky Penny Gaming
          </Link>
          <Link
            href="/table"
            className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-black text-black"
          >
            Play Craps
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-16">
        <div>
          <div className="inline-flex rounded-full border border-emerald-700/70 bg-emerald-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
            Feedback & Suggestions
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            Help shape what Lucky Penny Gaming becomes next.
          </h1>
          <p className="mt-5 text-base font-medium leading-7 text-emerald-50/65">
            Found something confusing? Have an idea for a better table layout?
            Want us to build a specific casino game or lesson? Send it our way.
            Real player feedback helps decide what gets improved and built next.
          </p>

          <div className="mt-7 space-y-3">
            {[
              ["Bug reports", "Tell us what happened and what you expected instead."],
              ["Feature ideas", "Suggest controls, lessons, statistics, or table improvements."],
              ["Game requests", "Tell us which casino game you want Lucky Penny to build next."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-emerald-900/70 bg-black/20 px-4 py-3"
              >
                <div className="font-black text-amber-300">{title}</div>
                <div className="mt-1 text-sm font-medium leading-6 text-emerald-50/55">
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submitFeedback}
          className="rounded-3xl border border-emerald-800/70 bg-black/25 p-5 shadow-[0_24px_70px_rgba(0,0,0,.35)] sm:p-7"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
                Type
              </span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-emerald-800/70 bg-[#061b14] px-3 py-3 text-sm font-bold text-white outline-none focus:border-emerald-400"
              >
                {feedbackTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
                Game
              </span>
              <select
                value={game}
                onChange={(event) => setGame(event.target.value)}
                className="mt-2 w-full rounded-xl border border-emerald-800/70 bg-[#061b14] px-3 py-3 text-sm font-bold text-white outline-none focus:border-emerald-400"
              >
                {games.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
              Your feedback
            </span>
            <textarea
              required
              minLength={8}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us what you noticed, what you would change, or what you want us to build..."
              className="mt-2 min-h-[190px] w-full resize-y rounded-xl border border-emerald-800/70 bg-[#061b14] px-4 py-3 text-sm font-medium leading-6 text-white outline-none placeholder:text-emerald-100/25 focus:border-emerald-400"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
              Email — optional
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Only if you want a reply"
              className="mt-2 w-full rounded-xl border border-emerald-800/70 bg-[#061b14] px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-emerald-100/25 focus:border-emerald-400"
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-medium leading-5 text-emerald-100/40">
              No account required. Your email is optional and is only included if
              you want us to be able to reply.
            </p>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-black text-black shadow-lg transition hover:bg-amber-300"
            >
              Send Feedback
            </button>
          </div>

          <p className="mt-4 border-t border-white/10 pt-4 text-[10px] leading-5 text-emerald-100/35">
            Submitting opens your device&apos;s email app with the feedback filled
            in. We&apos;ll connect this form to direct in-site submission before a
            wider public launch.
          </p>
        </form>
      </section>
    </main>
  );
}
