import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Us | TheDayAfterAI News",
  description:
    "TheDayAfterAI is an AI-powered news channel delivering AI news briefings, market insights, and headlines from across the web.",
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
            Building a Better World — One Step at a Time
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            TheDayAfterAI News is an AI-powered news channel delivering daily
            video briefings on the most important developments in artificial
            intelligence—alongside market-focused experiments and a curated news
            hub linking to publishers worldwide.
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
                Every day, we hand-pick the most significant AI stories from
                reputable sources across the web. Our AI-assisted workflow
                transforms these articles into short, engaging video summaries
                published on our{" "}
                <a
                  href="https://www.youtube.com/@TheDayAfterAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  YouTube channel
                </a>
                —so you can stay informed in minutes without doomscrolling.
              </p>
            </div>

            {/* Card 2 — AI Market Insights */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                AI Market Insights
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We run a daily, transparent experiment: AI forecasts the next-day
                price direction of one U.S. stock (a different ticker each day),
                and we publish the prediction next to the real outcome so viewers
                can judge performance over time. This series is educational and
                experimental in nature and is not financial advice.
              </p>
            </div>

            {/* Card 3 — News Hub */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                AI News Hub
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Beyond our own videos, TheDayAfterAI also serves as a central
                dashboard for AI headlines from a wide range of publishers. We
                curate links to original articles so you can explore the full
                stories directly on the source sites.
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
            Our publishing workflow blends AI efficiency with human oversight:
          </p>
          <ol className="space-y-4 text-[var(--text-secondary)] leading-relaxed list-decimal list-inside">
            <li>
              <span className="text-white font-semibold">Curate</span> — We
              manually select the day&apos;s most important AI stories from
              trusted sources.
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
              editors check for clarity, accuracy, and relevance before release.
            </li>
            <li>
              <span className="text-white font-semibold">Publish</span> —
              Content goes live on YouTube and our website daily, alongside
              curated external headlines.
            </li>
          </ol>
        </section>

        {/* ── Narrative: Origin & Name ─────────────────────────────── */}

        {/* Our Story */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Story
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              In early 2023, generative AI accelerated rapidly—unlocking new
              possibilities while also raising real concerns about ethics, bias,
              and misuse. The public conversation often swings between fear and
              hype.
            </p>
            <p>
              TheDayAfterAI News exists to bring balance and clarity. We curate
              content that highlights both risks and breakthroughs, helping
              audiences understand what matters, what&apos;s changing, and what it
              could mean next. We aim to support informed discussion and
              responsible innovation by showing how AI can be used
              thoughtfully—and where caution is warranted.
            </p>
            <p>
              TheDayAfterAI News launched on April 3, 2024, and we remain
              committed to accurate, digestible reporting as the technology
              evolves.
            </p>
          </div>
        </section>

        {/* Why "TheDayAfterAI" */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Why &ldquo;TheDayAfterAI&rdquo;?
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Our name reflects a forward-looking mindset:
          </p>
          <ul className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
            <li>
              <strong className="text-white">Forward-thinking</strong> — We look
              beyond today&apos;s headlines to what happens next.
            </li>
            <li>
              <strong className="text-white">Proactive engagement</strong> — We
              encourage audiences to prepare for AI&apos;s real-world impact.
            </li>
            <li>
              <strong className="text-white">Impactful curation</strong> —
              Better decisions start with better information.
            </li>
            <li>
              <strong className="text-white">Commitment to change</strong> — We
              promote ethical, constructive adoption of AI.
            </li>
          </ul>
        </section>

        {/* ── Categories ─────────────────────────────────────────── */}

        {/* What We Cover */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            What We Cover
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            Our coverage spans 11 categories organised into three pillars,
            capturing AI&apos;s impact across technology, society, and culture.
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

        {/* ── Aspirational: Mission / Vision / Values ──────────────── */}

        {/* Our Mission */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Mission
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            To curate and present accurate, engaging, and thought-provoking AI
            coverage—helping developers, investors, policymakers, creators, and
            curious minds stay ahead in a fast-moving world.
          </p>
        </section>

        {/* Our Vision */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Vision
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            To become a leading AI news destination that fosters informed
            discussion and supports responsible innovation.
          </p>
        </section>

        {/* Our Values */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Values
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            Each letter in TDAAI represents a core principle that defines who we
            are and how we operate.
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

        {/* ── People & Contact ─────────────────────────────────────── */}

        {/* Who We Are */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Who We Are
          </h2>
          <div className="space-y-6">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              TheDayAfterAI News is developed under{" "}
              <strong className="text-white">Jacky Lee Visionary Creations</strong>—a
              multidisciplinary platform bridging technology, creativity, and
              community.
            </p>

            {/* Founder card */}
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-4">
                Founded by Jacky Lee
              </h3>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  Jacky Lee is a Hongkonger and{" "}
                  <a
                    href="https://jackylee.art"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    award-winning visual artist
                  </a>{" "}
                  based in Canberra, Australia. He is also a Chartered Building
                  Engineer and Chartered Building Surveyor (RICS, CABE), with
                  over two decades of professional experience in Hong
                  Kong&apos;s construction industry.
                </p>
                <p>
                  As a photographer, he is a National Geographic Photo Contest
                  champion and published author, and has been invited as a
                  course tutor and guest speaker at the University of Hong Kong.
                  He also serves as a photography advisor to the Hong Kong
                  Biodiversity Museum and regularly judges international photo
                  competitions.
                </p>
                <p>
                  Under Jacky Lee Visionary Creations, he leads multiple ventures
                  including TheDayAfterAI News, Canberra Drone Building
                  Inspection &amp; Consultancy, and Physiognomy.AI—combining
                  engineering discipline, creative practice, and a practical
                  interest in AI to build tools and content that inform, inspire,
                  and serve communities.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
