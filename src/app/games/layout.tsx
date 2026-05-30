import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Up Game",
  description:
    "Top up game favoritmu dengan harga termurah. Mobile Legends, Free Fire, PUBG, Valorant, Genshin Impact, dan game lainnya.",
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
