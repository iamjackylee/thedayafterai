import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | TheDayAfterAI News",
  description:
    "TheDayAfterAI is an AI-powered news channel delivering daily AI news videos, AI-driven market insights, and curated headlines from across the web.",
};

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navigation bar */}
      <nav className="border-b border-[var(--border)] sticky top-0 z-50 bg-[var(--background)]/90 backdrop-blur-md">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to News
          </Link>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/tdai-letter-logo.png"
              alt="TheDayAfterAI logo"
              width={56}
              height={56}
              className="rounded-lg"
            />
            <h1
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              TheDayAfterAI News
            </h1>
          </div>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-[700px]">
            Your premier AI-powered news channel — delivering daily video summaries
            of the most important AI developments, AI-driven stock market insights,
            and curated headlines from publishers around the world.
          </p>
        </header>

        {/* What We Do */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            What We Do
          </h2>

          <div className="grid gap-6 md:gap-8">
            {/* Card 1 — Daily AI News Videos */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                Daily AI News Video Summaries
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every day, we hand-pick the most significant AI stories from trusted
                sources across the web. Our AI-powered production pipeline then
                transforms these curated articles into concise, engaging video
                summaries published on our{" "}
                <a
                  href="https://www.youtube.com/@TheDayAfterAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  YouTube channel
                </a>
                . The result: stay informed on everything happening in AI in just a
                few minutes a day — no doomscrolling required.
              </p>
            </div>

            {/* Card 2 — AI Market Insights */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                Daily AI Market Insights
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Each day we task AI with forecasting the next-day price movement of
                a single US stock — a different ticker every day — and publish the
                prediction alongside the actual outcome. The series is an ongoing
                experiment to test how accurately AI can predict the stock market,
                tracked transparently so viewers can judge the results for
                themselves.
              </p>
            </div>

            {/* Card 3 — News Hub */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                Curated AI News Hub
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Beyond our own video content, TheDayAfterAI serves as a central hub
                for the latest AI news from a wide range of publishers and sources.
                We aggregate headlines with images and external links so you can
                explore stories in full on their original sites. Think of it as your
                one-stop dashboard for everything happening in artificial
                intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Mission
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Artificial intelligence is reshaping every aspect of our world — from
            technology and business to art, healthcare, and governance. Our mission
            is to make the fast-moving world of AI accessible to everyone. Whether
            you are a developer, investor, policymaker, or simply curious, we aim to
            keep you informed with accurate, timely, and easy-to-digest content
            powered by the very technology we cover.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            How It Works
          </h2>
          <ol className="space-y-4 text-[var(--text-secondary)] leading-relaxed list-decimal list-inside">
            <li>
              <span className="text-white font-semibold">Curate</span> — We
              manually select the day&apos;s most noteworthy AI stories from
              reputable sources.
            </li>
            <li>
              <span className="text-white font-semibold">Summarise</span> — AI
              technology condenses and scripts each story into a clear, concise
              narrative.
            </li>
            <li>
              <span className="text-white font-semibold">Produce</span> — The
              scripts are transformed into polished video segments with visuals and
              voiceover.
            </li>
            <li>
              <span className="text-white font-semibold">Publish</span> — Videos
              go live on YouTube and our website daily, alongside curated headlines
              from other publishers.
            </li>
          </ol>
        </section>

        {/* Connect */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Connect With Us
          </h2>
          <ul className="space-y-3 text-[var(--text-secondary)]">
            <li>
              YouTube:{" "}
              <a
                href="https://www.youtube.com/@TheDayAfterAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                @TheDayAfterAI
              </a>
            </li>
            <li>
              Facebook:{" "}
              <a
                href="https://www.facebook.com/thedayafterai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                TheDayAfterAI
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/company/thedayafterai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                TheDayAfterAI
              </a>
            </li>
          </ul>
        </section>

        {/* Footer note */}
        <footer className="border-t border-[var(--border)] pt-8 text-xs text-[var(--muted)]">
          <p>
            Copyright &copy; 2024-{new Date().getFullYear()} TheDayAfterAI News.
            All Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
