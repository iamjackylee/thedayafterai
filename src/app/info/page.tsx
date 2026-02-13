import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Us | TheDayAfterAI News",
  description:
    "TheDayAfterAI is an independent AI news channel delivering daily video briefings, market insights, and curated headlines from across the web.",
};

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Page header */}
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            About Us
          </h1>
          <p className="text-lg text-white font-semibold mb-2">
            AI moves fast. We help you keep up.
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            TheDayAfterAI News delivers daily video briefings, transparent
            market experiments, and curated headlines from publishers
            worldwide—so you can stay informed in minutes, not hours.
          </p>
        </header>

        {/* ── Concrete: What / How ───────────────────────────────── */}

        {/* What We Do */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            What We Do
          </h2>

          <div className="grid gap-6 md:gap-8">
            {/* Card 1 — AI News Briefing */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                AI News Briefing
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Each day we pick the most significant AI stories from trusted
                sources and turn them into concise video summaries on our{" "}
                <a
                  href="https://www.youtube.com/@TheDayAfterAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  YouTube channel
                </a>
                . No doomscrolling required.
              </p>
            </div>

            {/* Card 2 — AI Market Insights */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                AI Market Insights
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                A daily experiment: AI predicts the next-day price direction of
                one U.S. stock (a different ticker each day). We publish the
                forecast alongside the actual result—tracked openly so you can
                judge performance over time.
              </p>
              <p className="text-[var(--text-secondary)] text-sm mt-2 italic">
                Educational and experimental only—not financial advice.
              </p>
            </div>

            {/* Card 3 — News Hub */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                AI News Hub
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                A central dashboard of AI headlines from publishers everywhere.
                We curate and link to the original articles—we don&apos;t claim
                ownership of third-party content.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            How It Works
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            AI efficiency meets human oversight:
          </p>
          <ol className="space-y-4 text-[var(--text-secondary)] leading-relaxed list-decimal list-inside">
            <li>
              <span className="text-white font-semibold">Curate</span> — We
              select the day&apos;s most important AI stories from trusted
              sources.
            </li>
            <li>
              <span className="text-white font-semibold">Summarise</span> — AI
              condenses key points into clear, structured scripts.
            </li>
            <li>
              <span className="text-white font-semibold">Produce</span> —
              Scripts become polished video segments with visuals and voiceover.
            </li>
            <li>
              <span className="text-white font-semibold">Review</span> — Human
              editors check for clarity, accuracy, and relevance.
            </li>
            <li>
              <span className="text-white font-semibold">Publish</span> —
              Videos and curated headlines go live daily on YouTube and our
              website.
            </li>
          </ol>
        </section>

        {/* ── Categories ─────────────────────────────────────────── */}

        {/* What We Cover */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            What We Cover
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            11 categories across three pillars, covering AI&apos;s impact on
            technology, society, and culture.
          </p>
          <div className="grid gap-6 md:gap-8">
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">Tech Frontiers</h3>
              <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
                <li><strong className="text-white">AI Academy</strong> — Tutorials, courses, and learning resources.</li>
                <li><strong className="text-white">Chatbot Development</strong> — Conversational AI, LLMs, and agent frameworks.</li>
                <li><strong className="text-white">Technology &amp; Innovation</strong> — Research breakthroughs, product launches, and industry shifts.</li>
                <li><strong className="text-white">Unmanned Aircraft</strong> — AI-powered drones, autonomy, and aerial intelligence.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">Global Dynamics</h3>
              <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
                <li><strong className="text-white">Business &amp; Economy</strong> — Markets, enterprise adoption, and economic impact.</li>
                <li><strong className="text-white">Digital Security</strong> — Cybersecurity, AI-driven threats, and defence technologies.</li>
                <li><strong className="text-white">Environment &amp; Science</strong> — Climate tech, sustainability, and scientific discovery.</li>
                <li><strong className="text-white">Governance &amp; Politics</strong> — Regulation, policy debates, and geopolitics.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">Arts &amp; Culture</h3>
              <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
                <li><strong className="text-white">Health &amp; Style</strong> — Healthcare, wellness, and lifestyle applications.</li>
                <li><strong className="text-white">Musical Art</strong> — Generative music, composition tools, and the future of sound.</li>
                <li><strong className="text-white">Visual Art &amp; Photography</strong> — Creative tools, AI imagery, and evolving visual culture.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Narrative: Origin & Name ─────────────────────────────── */}

        {/* Our Story */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Story
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              When generative AI took off in 2023, public conversation swung
              between fear and hype. We wanted something in between—clear,
              balanced reporting that shows both the breakthroughs and the risks
              so people can form their own views.
            </p>
            <p>
              TheDayAfterAI News launched on{" "}
              <strong className="text-white">April 3, 2024</strong>, and
              we&apos;ve published daily ever since—committed to accurate,
              digestible coverage as the technology evolves.
            </p>
          </div>
        </section>

        {/* Why "TheDayAfterAI" */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Why &ldquo;TheDayAfterAI&rdquo;?
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Because what matters isn&apos;t only what AI does today—it&apos;s
            what happens the day after. We focus on long-term impact, not just
            headlines, and encourage preparation over reaction.
          </p>
        </section>

        {/* ── Mission & Values ──────────────────────────────────────── */}

        {/* Mission & Values — combined */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Mission &amp; Values
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            We exist to help developers, investors, policymakers, creators, and
            curious minds stay ahead of AI—through accurate, engaging,
            thought-provoking coverage. Everything we do is guided by five
            principles:
          </p>
          <div className="grid gap-4">
            {[
              {
                letter: "T",
                title: "Transparency",
                desc: "We clearly distinguish our original content from external sources we link to.",
              },
              {
                letter: "D",
                title: "Dedication",
                desc: "We publish consistently and prioritise relevance over noise.",
              },
              {
                letter: "A",
                title: "Accountability",
                desc: "We aim for accuracy, correct mistakes, and avoid misleading framing.",
              },
              {
                letter: "A",
                title: "Adaptability",
                desc: "We evolve our workflow as AI, platforms, and standards change.",
              },
              {
                letter: "I",
                title: "Inclusivity",
                desc: "We welcome diverse perspectives and global viewpoints.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="flex gap-4 items-start rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <span className="text-2xl font-extrabold text-[var(--accent)] shrink-0 w-8 text-center">
                  {v.letter}
                </span>
                <div>
                  <span className="text-white font-semibold">{v.title}</span>
                  <span className="text-[var(--text-secondary)]"> — {v.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── People ─────────────────────────────────────────────── */}

        {/* Who We Are */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Who We Are
          </h2>

          {/* Founder card */}
          <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-4">
              Founded by Jacky Lee
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              TheDayAfterAI News is a venture of{" "}
              <a
                href="https://jackyleevc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Jacky Lee Visionary Creations
              </a>
              , founded by Hongkonger and Canberra-based{" "}
              <a
                href="https://jackylee.art"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                visual artist
              </a>{" "}
              Jacky Lee—combining engineering discipline, creative practice,
              and a practical interest in AI.
            </p>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
