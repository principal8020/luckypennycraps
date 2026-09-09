import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free Craps Practice Table",
  description:
    "Practice craps on a free interactive table with guided lessons, realistic payouts, strategy modes, and controllable dice scenarios.",
  alternates: { canonical: "/table" },
  openGraph: {
    title: "Free Craps Practice Table",
    description:
      "Learn craps by placing bets and playing on a full interactive practice table.",
    url: "/table",
  },
};

export default function TableLayout({ children }: { children: ReactNode }) {
  return children;
}
