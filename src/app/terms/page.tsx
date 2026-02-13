import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service | User Agreement — TheDayAfterAI News",
  description:
    "Review the terms and conditions governing your use of the TheDayAfterAI website, including our AI news videos, market insights, and curated news hub.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--muted)]">Last updated: February 13, 2025</p>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Preamble */}
          <p>
            Welcome to <strong className="text-white">TheDayAfterAI</strong> (&ldquo;we&rdquo;,
            &ldquo;our&rdquo; or &ldquo;us&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;)
            govern your access to and use of{" "}
            <a
              href="https://thedayafterai.com"
              className="text-[var(--accent)] hover:underline"
            >
              thedayafterai.com
            </a>{" "}
            (&ldquo;Website&rdquo;), including our daily AI news video briefings, AI market insight
            experiments, and curated news hub. By accessing or using our Website, you agree to comply
            with and be bound by these Terms and our{" "}
            <Link href="/privacy" className="text-[var(--accent)] hover:underline">
              Privacy Policy
            </Link>
            . If you do not agree, please do not use the Website.
          </p>

          {/* 1. About the Service */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              1. About the Service
            </h2>
            <p>
              <strong className="text-white">TheDayAfterAI</strong> is an independent AI news channel
              that operates in three areas:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>
                <strong className="text-white">AI News Briefing</strong> — daily video summaries of
                the most significant AI stories, published on our YouTube channel.
              </li>
              <li>
                <strong className="text-white">AI Market Insights</strong> — a daily experiment in
                which AI forecasts the next-day price direction of a single U.S. stock. Results are
                published openly. This is educational and experimental only—not financial advice.
              </li>
              <li>
                <strong className="text-white">AI News Hub</strong> — a curated dashboard of AI
                headlines linking to original articles from publishers worldwide. We do not claim
                ownership of third-party content.
              </li>
            </ul>
          </section>

          {/* 2. User Responsibilities */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              2. User Responsibilities
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">2.1 Lawful Use</h3>
            <p>
              You agree to use the Website only for lawful purposes and in a manner that does not
              infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of
              the Website.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">2.2 Prohibited Conduct</h3>
            <p>
              You are prohibited from posting, transmitting, or distributing any unlawful,
              threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or
              profane material. You must not engage in any activity that could damage, disable,
              overburden, or impair the Website. Additionally, you are prohibited from copying,
              sharing, or distributing any content from third-party sources without obtaining the
              necessary permissions or rights. Unauthorized use of copyrighted material is strictly
              forbidden and may result in legal action.
            </p>
          </section>

          {/* 3. Content Ownership and Use */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              3. Content Ownership and Use
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">3.1 Ownership</h3>
            <p>
              All content on the Website, including curated articles, video summaries, market
              insight reports, and links to third-party content, is either owned by{" "}
              <strong className="text-white">TheDayAfterAI</strong> or used under license, fair use
              principles, or with permission from the respective content owners. All trademarks,
              service marks, and logos remain the property of their respective owners. This content
              is protected by international copyright and intellectual property laws, including the
              Copyright Act 1968 (Cth) of Australia.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">3.2 Permitted Use</h3>
            <p>
              You are authorized to access and use the content on the Website for personal,
              non-commercial purposes only. This includes reading articles, watching video
              summaries, viewing market insights, sharing content via personal social media
              accounts, and downloading materials for personal reference. Any other use, including
              but not limited to reproduction, modification, distribution, or republication of the
              content for commercial purposes, without our prior written consent, is strictly
              prohibited. Users are responsible for ensuring that their use of any third-party
              content complies with applicable copyright laws and the terms set forth by the
              original content providers.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">3.3 Commercial Use</h3>
            <p>
              Commercial entities or individuals seeking to use our content for marketing or other
              commercial purposes must obtain explicit written permission from{" "}
              <strong className="text-white">TheDayAfterAI</strong>. Please contact us with details
              of your intended use. Approval will be granted based on the scope and nature of the
              intended use and may involve a licensing fee. Any commercial use of third-party
              content requires direct permission from the original content owners.{" "}
              <strong className="text-white">TheDayAfterAI</strong> cannot grant permissions for
              content it does not own.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.4 Copyright Infringement
            </h3>
            <p className="mb-3">
              <strong className="text-white">TheDayAfterAI</strong> respects the intellectual
              property rights of others and expects users to do the same. If you believe that any
              content on our website infringes upon your copyright, please notify us by providing
              the following information:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>A description of the copyrighted work that you claim has been infringed.</li>
              <li>
                A description of where the infringing content is located on the Website.
              </li>
              <li>
                Your contact information, including address, telephone number, and email address.
              </li>
              <li>
                A statement by you that you have a good faith belief that the use of the material
                is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                A statement that the information in your notice is accurate, and under penalty of
                perjury, that you are authorized to act on behalf of the owner.
              </li>
            </ul>
            <p className="mt-3">
              Upon receipt of a valid notice,{" "}
              <strong className="text-white">TheDayAfterAI</strong> will take appropriate action,
              which may include removing or disabling access to the infringing material in
              accordance with the Australian Copyright Act 1968 (Cth).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.5 Prohibition of Unauthorized Commercial Exploitation
            </h3>
            <p>
              Users may not exploit any content from the Website for commercial purposes without
              obtaining explicit written permission from{" "}
              <strong className="text-white">TheDayAfterAI</strong>. This includes, but is not
              limited to, using content in advertisements, promotional materials, or any for-profit
              endeavors.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.6 User-Generated Content
            </h3>
            <p className="mb-3">By submitting content to the Website:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                You represent and warrant that you own or have the necessary licenses, rights,
                consents, and permissions to publish the content you submit;
              </li>
              <li>
                You grant <strong className="text-white">TheDayAfterAI</strong> a non-exclusive,
                royalty-free, worldwide, perpetual license to use, reproduce, modify, adapt,
                publish, translate, distribute, perform, and display such content in any media or
                distribution methods now known or later developed; and
              </li>
              <li>
                You retain ownership of your content, as the case may be, but agree that{" "}
                <strong className="text-white">TheDayAfterAI</strong> has the right to use it as
                described.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.7 Third-Party Links and Content
            </h3>
            <p>
              We provide links to third-party websites solely for your convenience.{" "}
              <strong className="text-white">TheDayAfterAI</strong> does not endorse or assume
              responsibility for any content, information, or services available on third-party
              websites. When accessing external links, you are subject to the terms and policies of
              those websites. We recommend that you review their terms and privacy policies before
              engaging with their content.
            </p>
          </section>

          {/* 4. Accountability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              4. Accountability
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.1 User Responsibility
            </h3>
            <p>
              You are solely responsible for ensuring that any information you provide on the
              Website is accurate, does not contain misleading information, and fully complies with
              all applicable laws and regulations. This includes, but is not limited to, the
              submission of articles, comments, images, graphics, and any other content. Users must
              not submit content that infringes upon the copyrights of third parties. By submitting
              content, you affirm that you have the necessary rights and permissions.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.2 Prohibited Content
            </h3>
            <p className="mb-3">You agree not to submit any content that:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Is false, misleading, or deceptive;</li>
              <li>Infringes upon the intellectual property rights of others;</li>
              <li>Contains defamatory, libelous, or slanderous statements;</li>
              <li>
                Promotes hate speech, violence, or discrimination against individuals or groups; or
              </li>
              <li>Violates any local, national, or international laws.</li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">4.3 Enforcement</h3>
            <p className="mb-3">We reserve the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Remove or modify any content that violates these terms;</li>
              <li>
                Suspend or terminate your access without prior notice if you engage in prohibited
                activities; and
              </li>
              <li>Report any unlawful activities to the appropriate authorities.</li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.4 Reporting Violations
            </h3>
            <p>
              If you encounter content that you believe violates these terms, please report it to
              us. We will review the reported content and take appropriate action in a timely
              manner.
            </p>
          </section>

          {/* 5. Privacy Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              5. Privacy Policy
            </h2>
            <p>
              Please review our{" "}
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">
                Privacy Policy
              </Link>
              , which also governs your use of the Website, to understand how we collect, use,
              disclose, and safeguard your information. The Privacy Policy is incorporated into
              these Terms by reference and forms an integral part of your agreement with{" "}
              <strong className="text-white">TheDayAfterAI</strong>.
            </p>
          </section>

          {/* 6. Modification of Terms */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. Modification of Terms
            </h2>
            <p>
              We reserve the right to make changes to our Website, policies, and these Terms of
              Service at any time. If these Terms are changed, we will post the revised Terms on
              the Website. Your continued use of the Website following the posting of changes
              constitutes your acceptance of such changes.
            </p>
          </section>

          {/* 7. Termination */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend your access to the Website, without
              prior notice or liability, for any reason, including if you breach these Terms. Upon
              termination, your right to use the Website will immediately cease.
            </p>
          </section>

          {/* 8. Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              8. Disclaimer
            </h2>
            <p>
              <strong className="text-white">TheDayAfterAI</strong> provides the Website and its
              content on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We curate
              content from various external sources and do not guarantee the accuracy, completeness,
              or validity of any information presented. The opinions expressed in the curated
              content are those of the original authors and do not necessarily reflect the views of{" "}
              <strong className="text-white">TheDayAfterAI</strong>.
            </p>
            <p className="mt-4">
              Our AI Market Insights feature is an experimental series in which AI forecasts the
              next-day price direction of a single U.S. stock each day. This content is provided
              solely for informational and educational purposes. It does not constitute financial
              advice, investment recommendations, or a solicitation to buy or sell any securities.
              You should not rely on any forecast provided on this Website when making investment
              decisions. Always consult a qualified financial adviser before making any investment.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              9. Limitation of Liability
            </h2>
            <p className="mb-3">
              To the fullest extent permitted by applicable law,{" "}
              <strong className="text-white">TheDayAfterAI</strong> shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of
              profits, revenues, data, or use, whether incurred directly or indirectly, arising
              from:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Your access to or use of, or inability to access or use, the Website;
              </li>
              <li>
                Any conduct or content of any third party on the Website, including without
                limitation, any defamatory, offensive, or illegal conduct of other users or third
                parties;
              </li>
              <li>Any content obtained from the Website; or</li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or content.
              </li>
            </ul>
            <p className="mt-3">
              In no event shall <strong className="text-white">TheDayAfterAI</strong>&apos;s total
              liability to you for all damages, losses, and causes of action exceed the amount you
              have paid, if any, for accessing the Website.{" "}
              <strong className="text-white">TheDayAfterAI</strong> is not liable for any errors or
              omissions in the curated content, nor for any loss or damage of any kind incurred as
              a result of the use of any content posted, transmitted, or otherwise made available
              via the Website. This includes, without limitation, any financial losses arising from
              reliance on AI-generated market insights or stock forecasts.
            </p>
          </section>

          {/* 10. Indemnification */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              10. Indemnification
            </h2>
            <p className="mb-3">
              You agree to indemnify, defend, and hold harmless{" "}
              <strong className="text-white">TheDayAfterAI</strong>, its affiliates, officers,
              directors, employees, and agents from and against any and all claims, damages,
              obligations, losses, liabilities, costs, or debt, and expenses (including but not
              limited to attorney&apos;s fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your use of and access to the Website;</li>
              <li>Your violation of any term of these Terms of Service;</li>
              <li>
                Your violation of any third-party right, including without limitation any copyright,
                property, or privacy right; or
              </li>
              <li>Any claim that your content caused damage to a third party.</li>
            </ul>
          </section>

          {/* 11. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              11. Governing Law
            </h2>
            <p>
              These Terms of Service and any disputes arising out of or related to them or your use
              of the Website shall be governed by and construed in accordance with the laws of the
              Australian Capital Territory (ACT), without regard to its conflict of law provisions.
            </p>
          </section>

          {/* 12. Dispute Resolution */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              12. Dispute Resolution
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.1 Arbitration Agreement
            </h3>
            <p>
              Any dispute, claim, or controversy arising out of or relating to these Terms of
              Service or your use of the Website, including the determination of the scope or
              applicability of this agreement to arbitrate, shall be resolved exclusively by binding
              arbitration administered by the Australian Centre for International Commercial
              Arbitration (ACICA) in accordance with its ACICA Arbitration Rules.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.2 Location and Language
            </h3>
            <p>
              The arbitration shall take place in Canberra, ACT, and shall be conducted in English.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.3 Class Action Waiver
            </h3>
            <p>
              You agree that any arbitration shall be conducted solely on an individual basis and
              not as a class, consolidated, or representative action. You further agree that you
              will not participate in any class action or representative proceeding against{" "}
              <strong className="text-white">TheDayAfterAI</strong>.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.4 Waiver of Rights
            </h3>
            <p>
              By agreeing to arbitration, you and{" "}
              <strong className="text-white">TheDayAfterAI</strong> waive the right to a trial by
              jury and the right to participate in a class action.
            </p>
          </section>

          {/* 13. Severability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              13. Severability
            </h2>
            <p>
              If any provision of these Terms of Service is held to be invalid or unenforceable by
              a court, the remaining provisions of these Terms shall remain in full force and
              effect.
            </p>
          </section>

          {/* 14. Entire Agreement */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              14. Entire Agreement
            </h2>
            <p>
              These Terms of Service constitute the entire agreement between you and{" "}
              <strong className="text-white">TheDayAfterAI</strong> regarding your use of the
              Website and supersede all prior agreements and understandings, whether written or
              oral.
            </p>
          </section>

          {/* 15. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              15. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please email us at{" "}
              <a
                href="mailto:info@thedayafterai.com"
                className="text-[var(--accent)] hover:underline"
              >
                info@thedayafterai.com
              </a>
              .
            </p>
          </section>
        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
