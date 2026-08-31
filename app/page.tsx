import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-emerald-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-6xl">🎲 🎲</div>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Lucky Penny Craps
        </h1>

        <p className="mt-4 text-xl text-emerald-100">
          Practice. Play. Learn.
        </p>

        <div className="mt-10 rounded-2xl border border-emerald-700 bg-emerald-900/60 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-widest text-emerald-200">
            Practice Bankroll
          </p>

          <p className="mt-2 text-5xl font-bold">$5,000</p>

          <Link
            href="/table"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-lg font-bold text-emerald-950 transition hover:scale-105"
          >
            Enter Table
          </Link>
        </div>

        <p className="mt-10 max-w-xl text-sm text-emerald-200">
          A craps practice and strategy-testing experience. Practice credits
          have no cash value.
        </p>
      </div>
    </main>
  );
}