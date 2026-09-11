import type { MetadataRoute } from "next";

const siteUrl = "https://luckypennygaming.com";
const lastModified = new Date("2026-09-11");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/blackjack", changeFrequency: "weekly", priority: 0.9 },
    { path: "/roulette", changeFrequency: "weekly", priority: 0.9 },
    {
      path: "/roulette/how-to-play",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      path: "/blackjack/basic-strategy",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      path: "/blackjack/hit-or-stand",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { path: "/table", changeFrequency: "weekly", priority: 0.9 },
    {
      path: "/craps/proper-bets",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      path: "/craps/max-odds",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { path: "/guides", changeFrequency: "weekly", priority: 0.8 },
    { path: "/how-to-play", changeFrequency: "monthly", priority: 0.8 },
    { path: "/strategies", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "yearly", priority: 0.4 },
    { path: "/feedback", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority,
  }));
}
