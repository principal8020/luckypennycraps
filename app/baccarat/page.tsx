import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { BaccaratTable } from "./BaccaratTable";

export const metadata: Metadata = {
  title: "Free Baccarat Practice Table",
  description:
    "Play free practice Baccarat with standard Punto Banco drawing rules, Player, Banker, Tie, and Dragon Bonus bets, plus Learn Mode, scoreboards, and hand history.",
  alternates: { canonical: "/baccarat" },
};

export default function BaccaratPage() {
  return (
    <main className="baccarat-page min-h-screen bg-[#020e0a] text-white">
      <SiteHeader active="baccarat" compact wide />
      <div className="mx-auto max-w-[1500px] px-1.5 py-4 sm:px-4 sm:py-6">
        <BaccaratTable />
      </div>
    </main>
  );
}
