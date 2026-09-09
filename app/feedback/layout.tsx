import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Send a suggestion, report a bug, or request a new Lucky Penny Gaming feature.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackLayout({ children }: { children: ReactNode }) {
  return children;
}
