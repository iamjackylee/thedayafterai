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
            Your premier AI-powered news channel — delivering video summaries
            of the most important AI developments, stock market insights,
            and headlines from publishers around the world.
          </p>
        </header>

        {/* ── Concrete: What / How / Categories ────────────────────── */}

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
                AI Market Insights
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
                AI News Hub
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

        {/* How It Works */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            How It Works
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            At TheDayAfterAI News, our content is created through a collaborative
            effort between AI systems and human editors. AI curators scan and aggregate
            news across specific AI domains. AI then synthesises this information into
            clear, engaging narratives. Human editors review the work to ensure
            accuracy, relevance, and quality before publication. This blend of AI
            precision and human oversight delivers reliable, up-to-date AI news.
          </p>
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

        {/* What We Cover */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            What We Cover
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            Our news hub spans 11 categories organised into three pillars,
            capturing the full breadth of AI&apos;s influence on the world.
          </p>
          <div className="grid gap-6 md:gap-8">
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">Tech Frontiers</h3>
              <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
                <li><strong className="text-white">AI Academy</strong> — Tutorials, courses, and educational resources for learning AI.</li>
                <li><strong className="text-white">Chatbot Development</strong> — Advances in conversational AI, LLMs, and agent frameworks.</li>
                <li><strong className="text-white">Technology &amp; Innovation</strong> — Cutting-edge research, product launches, and industry breakthroughs.</li>
                <li><strong className="text-white">Unmanned Aircraft</strong> — AI-powered drones, autonomous flight, and aerial intelligence.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">Global Dynamics</h3>
              <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
                <li><strong className="text-white">Business &amp; Economy</strong> — AI&apos;s impact on markets, enterprise adoption, and economic trends.</li>
                <li><strong className="text-white">Digital Security</strong> — Cybersecurity, AI-driven threats, and defence technologies.</li>
                <li><strong className="text-white">Environment &amp; Science</strong> — Climate tech, sustainability, and scientific discovery powered by AI.</li>
                <li><strong className="text-white">Governance &amp; Politics</strong> — AI regulation, policy debates, and geopolitical implications.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-3">Arts &amp; Culture</h3>
              <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
                <li><strong className="text-white">Health &amp; Style</strong> — AI in healthcare, wellness, fitness, and lifestyle.</li>
                <li><strong className="text-white">Musical Art</strong> — Generative music, AI composition tools, and the future of sound.</li>
                <li><strong className="text-white">Visual Art &amp; Photography</strong> — AI-generated imagery, creative tools, and the evolving art world.</li>
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
              In early 2023, the emergence of advanced generative AI models marked a
              significant leap in technological innovation. These breakthroughs
              promised to transform industries, enhance creativity, and address complex
              global challenges. However, alongside these opportunities, concerns about
              ethical implications and potential misuse began to dominate public
              discourse.
            </p>
            <p>
              At TheDayAfterAI News, we believe in presenting a comprehensive view of
              generative AI. Our mission is to bridge the gap between fear and optimism
              by curating balanced content that highlights both the challenges and the
              remarkable advancements in AI. We aim to foster informed discussions and
              support responsible innovation by showing how AI can be harnessed for
              good.
            </p>
            <p>
              TheDayAfterAI News was launched on April 3, 2024, marking the beginning
              of our journey to become your trusted curator of AI news. As generative
              AI continues to evolve, we remain committed to inspiring curiosity,
              encouraging responsible innovation, and deepening the public&apos;s
              understanding of the technology shaping our future.
            </p>
          </div>
        </section>

        {/* Why "TheDayAfterAI" */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Why &ldquo;TheDayAfterAI&rdquo;?
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Our name embodies our vision of looking beyond the present and
            anticipating the future impacts of artificial intelligence:
          </p>
          <ul className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
            <li>
              <strong className="text-white">Forward-Thinking</strong> — We explore
              not just the current state of AI but also its future developments and
              long-term implications.
            </li>
            <li>
              <strong className="text-white">Proactive Engagement</strong> — By
              focusing on &ldquo;the day after&rdquo;, we encourage our audience to
              think ahead, preparing for and shaping the evolving AI landscape
              responsibly.
            </li>
            <li>
              <strong className="text-white">Impactful Curation</strong> — We believe
              that informed discussions today will shape the innovations and ethical
              standards of tomorrow.
            </li>
            <li>
              <strong className="text-white">Commitment to Change</strong> — Our
              mission goes beyond curation; we strive to inspire and empower
              individuals to embrace AI ethically, fostering a collective effort to
              drive meaningful transformation.
            </li>
          </ul>
        </section>

        {/* ── Aspirational: Mission / Vision / Values ──────────────── */}

        {/* Our Mission */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Mission
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            At TheDayAfterAI News, our mission is to curate and present accurate,
            engaging, and thought-provoking content that keeps you informed about the
            advancements and implications of artificial intelligence. We strive to be
            your trusted source for comprehensive AI news coverage, helping you stay
            ahead of the curve in this dynamic field. Whether you are a developer,
            investor, policymaker, or simply curious, we aim to keep you informed with
            accurate, timely, and easy-to-digest content powered by the very technology
            we cover.
          </p>
        </section>

        {/* Our Vision */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Vision
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            To be the leading source of AI news, fostering informed discussions and
            driving innovation through comprehensive and reliable reporting.
          </p>
        </section>

        {/* Our Values */}
        <section className="mb-12 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[var(--accent)] pl-4">
            Our Values
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            Each letter in TDAAI represents a core principle that defines who we are
            and how we operate.
          </p>
          <div className="grid gap-4">
            {[
              {
                letter: "T",
                title: "Transparency",
                desc: "We commit to clear and honest curation, ensuring our audience knows the sources of our aggregated content.",
              },
              {
                letter: "D",
                title: "Dedication",
                desc: "Our unwavering dedication to delivering accurate and timely AI news keeps our readers informed and ahead in this rapidly evolving field.",
              },
              {
                letter: "A",
                title: "Accountability",
                desc: "We hold ourselves accountable to the highest standards of integrity, ensuring that our reporting is unbiased and reliable.",
              },
              {
                letter: "A",
                title: "Adaptability",
                desc: "In a field that changes daily, we continuously evolve our tools, methods, and coverage to stay current and relevant.",
              },
              {
                letter: "I",
                title: "Inclusivity",
                desc: "We value diverse perspectives and foster an inclusive community, ensuring that our content reflects the multifaceted nature of AI advancements and their global impact.",
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
              <strong className="text-white">Jacky Lee Visionary Creations</strong>,
              a multidisciplinary platform bridging technology, creativity, and
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
                  currently based in Canberra, Australia. A Chartered Building
                  Engineer and Chartered Building Surveyor accredited by RICS and
                  CABE, he brings over two decades of professional experience in
                  Hong Kong&apos;s construction industry to his current ventures.
                </p>
                <p>
                  As a photographer, Jacky is a National Geographic Photo Contest
                  champion, published author, and has been invited as a course
                  tutor and guest speaker at the University of Hong Kong. He
                  serves as a photography advisor at the Hong Kong Biodiversity
                  Museum and regularly judges international photo competitions.
                </p>
                <p>
                  Under Jacky Lee Visionary Creations, he leads several ventures
                  including TheDayAfterAI News, Canberra Drone Building
                  Inspection &amp; Consultancy, and Physiognomy.AI — combining
                  his engineering background, creative expertise, and passion for
                  AI to build tools that inform, inspire, and serve communities.
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
