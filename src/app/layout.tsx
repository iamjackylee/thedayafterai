import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheDayAfterAI News: Your Premier Source for AI News and Insights",
  description:
    "The leading news channel for AI trends, insights and developments, keeping you informed on AI's impact on technology, society and the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0a] text-gray-100">{children}</body>
    </html>
  );
}
