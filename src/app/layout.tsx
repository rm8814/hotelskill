import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HotelSkill — Claude Skills for Hotels",
  description:
    "Describe a task — pricing, guest replies, OTA listings, SOPs — and get a ready-to-use Claude Skill your hotel team can install today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
