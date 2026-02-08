import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Day After AI - Your AI News Hub",
  description:
    "Discover the latest AI news tailored to your interests. From science breakthroughs to creative AI, stay informed about the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#030014] text-white">{children}</body>
    </html>
  );
}
