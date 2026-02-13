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
            &ldquo;our&rdquo; or &ldquo;us&rdquo;), a project developed and operated by{" "}
            <strong className="text-white">Jacky Lee Visionary Creations</strong> (
            <a
              href="https://jackylee.art"
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              jackylee.art
            </a>
            ). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use
            of{" "}
            <a
              href="https://thedayafterai.com"
              className="text-[var(--accent)] hover:underline"
            >
              thedayafterai.com
            </a>{" "}
            (&ldquo;Website&rdquo;), including our daily AI news video briefings, AI market insight
            experiments, and curated news hub. By accessing or using our Website, you agree to
            comply with and be bound by these Terms and our{" "}
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
              <strong className="text-white">TheDayAfterAI</strong> is an independent AI news
              channel that operates in three areas:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>
                <strong className="text-white">AI News Briefing</strong> — daily video summaries of
                the most significant AI stories, published on our YouTube channel. These summaries
                are produced using an AI-assisted workflow and reviewed by human editors before
                publication.
              </li>
              <li>
                <strong className="text-white">AI Market Insights</strong> — a daily experiment in
                which AI forecasts the next-day price direction of a single U.S.-listed stock.
                Results are published openly. This content is general information only, published
                for educational and entertainment purposes as part of an ongoing experiment. It
                does not constitute financial product advice—whether general or personal—within the
                meaning of section&nbsp;766B of the <em>Corporations Act 2001</em> (Cth), and is
                not intended to influence any person in making a decision in relation to a
                financial product. TheDayAfterAI does not hold an Australian Financial Services
                Licence (AFSL) and is not authorised to provide financial services of any kind.
              </li>
              <li>
                <strong className="text-white">AI News Hub</strong> — a curated dashboard of AI
                headlines linking to original articles from publishers worldwide. We do not claim
                ownership of third-party content. Where thumbnail images are displayed, they are
                used for the purpose of identifying and linking to the original source article and
                are attributed to the respective publishers.
              </li>
            </ul>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              2. Eligibility
            </h2>
            <p>
              You must be at least 13 years of age to access or use the Website. By using the
              Website, you represent and warrant that you meet this age requirement. If you are
              under 18, you may only use the Website with the involvement and consent of a parent
              or guardian.
            </p>
          </section>

          {/* 3. AI-Generated Content Disclosure */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              3. AI-Generated Content Disclosure
            </h2>
            <p>
              Portions of the content published on this Website—including video scripts, article
              summaries, and market forecasts—are generated or assisted by artificial intelligence
              systems. All AI-generated content is reviewed by human editors before publication;
              however, we do not guarantee the accuracy, completeness, or reliability of any
              AI-generated output. You acknowledge that AI-generated content may contain errors,
              omissions, or unintended inaccuracies, and you should independently verify any
              information before relying on it.
            </p>
          </section>

          {/* 4. User Responsibilities */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              4. User Responsibilities
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">4.1 Lawful Use</h3>
            <p>
              You agree to use the Website only for lawful purposes and in a manner that does not
              infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of
              the Website.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.2 Prohibited Conduct
            </h3>
            <p className="mb-3">You are prohibited from:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Posting, transmitting, or distributing any unlawful, threatening, libelous,
                defamatory, obscene, scandalous, inflammatory, pornographic, or profane material;
              </li>
              <li>
                Engaging in any activity that could damage, disable, overburden, or impair the
                Website;
              </li>
              <li>
                Copying, sharing, or distributing any content from third-party sources without
                obtaining the necessary permissions or rights;
              </li>
              <li>
                Using any automated system, including bots, crawlers, scrapers, or data-mining
                tools, to access, extract, index, or reproduce any content from the Website without
                our prior written consent; and
              </li>
              <li>
                Framing, mirroring, or otherwise incorporating any part of the Website into another
                website or service without our prior written consent.
              </li>
            </ul>
            <p className="mt-3">
              Unauthorized use of copyrighted material is strictly forbidden and may result in
              legal action.
            </p>
          </section>

          {/* 5. Content Ownership and Use */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              5. Content Ownership and Use
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">5.1 Ownership</h3>
            <p>
              All original content on the Website, including video summaries, article summaries,
              market insight reports, and the curated selection and arrangement of headlines, is
              owned by <strong className="text-white">TheDayAfterAI</strong> and protected by
              international copyright and intellectual property laws, including the{" "}
              <em>Copyright Act 1968</em> (Cth) of Australia. Third-party content displayed on the
              Website (including headlines, images, and trademarks) remains the property of the
              respective owners and is used under fair dealing exceptions for the purpose of
              reporting news (s&nbsp;42 of the <em>Copyright Act 1968</em>) or with permission
              from the content owners.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">5.2 Permitted Use</h3>
            <p>
              You are authorised to access and use the content on the Website for personal,
              non-commercial purposes only. This includes reading articles, watching video
              summaries, viewing market insights, sharing content via personal social media
              accounts, and downloading materials for personal reference. Any other use, including
              but not limited to reproduction, modification, distribution, or republication of the
              content for commercial purposes, without our prior written consent, is strictly
              prohibited. Users are responsible for ensuring that their use of any third-party
              content complies with applicable copyright laws and the terms set forth by the
              original content providers.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">5.3 Commercial Use</h3>
            <p>
              Commercial entities or individuals seeking to use our content for marketing or other
              commercial purposes must obtain explicit written permission from{" "}
              <strong className="text-white">TheDayAfterAI</strong>. Please contact us with
              details of your intended use. Approval will be granted based on the scope and nature
              of the intended use and may involve a licensing fee. Any commercial use of
              third-party content requires direct permission from the original content owners.{" "}
              <strong className="text-white">TheDayAfterAI</strong> cannot grant permissions for
              content it does not own.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.4 Copyright Infringement Notices
            </h3>
            <p className="mb-3">
              <strong className="text-white">TheDayAfterAI</strong> respects the intellectual
              property rights of others and expects users to do the same. If you believe that any
              content on our Website infringes upon your copyright, please notify us by providing
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
                A statement that you have a good faith belief that the use of the material is not
                authorised by the copyright owner, its agent, or the law.
              </li>
              <li>
                A statement, made under the penalties applicable under Australian law, that the
                information in your notice is accurate and that you are authorised to act on behalf
                of the copyright owner.
              </li>
            </ul>
            <p className="mt-3">
              Upon receipt of a valid notice,{" "}
              <strong className="text-white">TheDayAfterAI</strong> will take appropriate action,
              which may include removing or disabling access to the material in question, in
              accordance with the <em>Copyright Act 1968</em> (Cth).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.5 Prohibition of Unauthorized Commercial Exploitation
            </h3>
            <p>
              Users may not exploit any content from the Website for commercial purposes without
              obtaining explicit written permission from{" "}
              <strong className="text-white">TheDayAfterAI</strong>. This includes, but is not
              limited to, using content in advertisements, promotional materials, or any for-profit
              endeavors.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.6 User-Generated Content
            </h3>
            <p className="mb-3">By submitting content to the Website:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                You represent and warrant that you own or have the necessary licences, rights,
                consents, and permissions to publish the content you submit;
              </li>
              <li>
                You grant <strong className="text-white">TheDayAfterAI</strong> a non-exclusive,
                royalty-free, worldwide, perpetual licence to use, reproduce, modify, adapt,
                publish, translate, distribute, perform, and display such content in any media or
                distribution methods now known or later developed; and
              </li>
              <li>
                You retain ownership of your content but agree that{" "}
                <strong className="text-white">TheDayAfterAI</strong> has the right to use it as
                described above.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.7 Third-Party Links, Images, and Content
            </h3>
            <p>
              We provide links to third-party websites and may display thumbnail images sourced
              from those websites solely for the purpose of identifying and linking to the original
              article. <strong className="text-white">TheDayAfterAI</strong> does not endorse or
              assume responsibility for any content, information, or services available on
              third-party websites. When accessing external links, you are subject to the terms
              and policies of those websites. If you are a content owner and believe your material
              has been used beyond what is permitted by fair dealing or applicable copyright
              exceptions, please contact us and we will promptly address the matter.
            </p>
          </section>

          {/* 6. Accountability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. Accountability
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              6.1 User Responsibility
            </h3>
            <p>
              You are solely responsible for ensuring that any information you provide on the
              Website is accurate, does not contain misleading information, and fully complies with
              all applicable laws and regulations. Users must not submit content that infringes
              upon the copyrights of third parties. By submitting content, you affirm that you
              have the necessary rights and permissions.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              6.2 Prohibited Content
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

            <h3 className="text-base font-semibold text-white mt-6 mb-2">6.3 Enforcement</h3>
            <p className="mb-3">We reserve the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Remove or modify any content that violates these Terms;</li>
              <li>
                Suspend or terminate your access without prior notice if you engage in prohibited
                activities; and
              </li>
              <li>Report any unlawful activities to the appropriate authorities.</li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              6.4 Reporting Violations
            </h3>
            <p>
              If you encounter content that you believe violates these Terms, please report it to
              us at{" "}
              <a
                href="mailto:info@thedayafterai.com"
                className="text-[var(--accent)] hover:underline"
              >
                info@thedayafterai.com
              </a>
              . We will review the reported content and take appropriate action in a timely manner.
            </p>
          </section>

          {/* 7. Privacy Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Privacy Policy
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

          {/* 8. Modification of Terms */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              8. Modification of Terms
            </h2>
            <p>
              We reserve the right to make changes to our Website, policies, and these Terms at
              any time. If these Terms are materially changed, we will post the revised Terms on
              the Website and update the &ldquo;Last updated&rdquo; date above. Your continued use
              of the Website following the posting of changes constitutes your acceptance of such
              changes. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* 9. Termination */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              9. Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend your access to the Website, without
              prior notice or liability, for any reason, including if you breach these Terms. Upon
              termination, your right to use the Website will immediately cease. Sections 5
              (Content Ownership), 10 (Disclaimer), 11 (Limitation of Liability), 12
              (Indemnification), and 13 (Governing Law) shall survive any termination of these
              Terms.
            </p>
          </section>

          {/* 10. Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              10. Disclaimer
            </h2>
            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              10.1 General Disclaimer
            </h3>
            <p>
              To the maximum extent permitted by law,{" "}
              <strong className="text-white">TheDayAfterAI</strong> provides the Website and its
              content on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without
              warranties of any kind, whether express or implied, including but not limited to
              implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement. We curate content from various external sources and use
              AI-assisted workflows to produce original summaries. We do not guarantee the
              accuracy, completeness, timeliness, or validity of any information presented,
              whether original or sourced from third parties. The opinions expressed in the curated
              content are those of the original authors and do not necessarily reflect the views
              of <strong className="text-white">TheDayAfterAI</strong>.
            </p>
            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              10.2 Important Notice — AI Market Insights
            </h3>
            <p>
              Our AI Market Insights feature is an experimental series in which AI forecasts the
              next-day price direction of a single U.S.-listed stock each day. This content is{" "}
              <strong className="text-white">general information only</strong>. It is not, and is
              not intended to be, financial product advice—whether general or personal—within the
              meaning of section&nbsp;766B of the <em>Corporations Act 2001</em> (Cth). It does
              not constitute a recommendation, an offer, or a solicitation to buy, sell, or hold
              any financial product, and has not been prepared having regard to any person&apos;s
              investment objectives, financial situation, or particular needs.
            </p>
            <p className="mt-3">
              <strong className="text-white">TheDayAfterAI</strong> does not hold an Australian
              Financial Services Licence (AFSL) and is not a representative of any AFSL holder. We
              are not authorised to provide financial services under the{" "}
              <em>Corporations Act 2001</em> (Cth).
            </p>
            <p className="mt-3">
              AI-generated forecasts are the output of experimental machine-learning models. Past
              forecast accuracy is not a reliable indicator of future results. You must not rely on
              any forecast, prediction, or analysis published on this Website when making
              investment or financial decisions. Before acting on any information, you should
              obtain independent professional advice from a person who holds an appropriate AFSL
              and who has considered your personal circumstances.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              10.3 Australian Consumer Law
            </h3>
            <p>
              Certain legislation, including the Australian Consumer Law (Schedule&nbsp;2 of the{" "}
              <em>Competition and Consumer Act 2010</em> (Cth)) (&ldquo;ACL&rdquo;), may imply
              warranties, conditions, or guarantees, or impose obligations on TheDayAfterAI, that
              cannot be excluded, restricted, or modified except to a limited extent
              (&ldquo;Non-Excludable Guarantees&rdquo;). Nothing in these Terms purports to
              exclude, restrict, or modify the application of any Non-Excludable Guarantee.
            </p>
            <p className="mt-3">
              Except in relation to Non-Excludable Guarantees, all conditions, warranties, and
              guarantees that may otherwise be implied by statute, custom, or the general law are
              expressly excluded to the maximum extent permitted by law.
            </p>
            <p className="mt-3">
              Where TheDayAfterAI is permitted by law to limit its liability for breach of a
              Non-Excludable Guarantee, our liability is limited, at our option, to: (a)&nbsp;in
              the case of services, the supply of the services again or the payment of the cost of
              having the services supplied again; and (b)&nbsp;in the case of goods, the
              replacement of the goods, the supply of equivalent goods, or the payment of the cost
              of replacing the goods or acquiring equivalent goods.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              11. Limitation of Liability
            </h2>
            <p className="mb-3">
              Subject to Section&nbsp;10.3 (Australian Consumer Law), and to the fullest extent
              permitted by applicable law,{" "}
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
              <li>
                Any content obtained from the Website, including AI-generated content; or
              </li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or content.
              </li>
            </ul>
            <p className="mt-3">
              In no event shall <strong className="text-white">TheDayAfterAI</strong>&apos;s total
              liability to you for all damages, losses, and causes of action exceed the amount you
              have paid, if any, for accessing the Website.{" "}
              <strong className="text-white">TheDayAfterAI</strong> is not liable for any errors
              or omissions in content (whether human-authored or AI-generated), nor for any loss
              or damage of any kind incurred as a result of the use of any content posted,
              transmitted, or otherwise made available via the Website. This includes, without
              limitation, any financial losses arising from reliance on AI-generated market
              insights or stock forecasts.
            </p>
            <p className="mt-3">
              The limitations and exclusions in this section do not apply to liability that cannot
              be excluded or limited under the Australian Consumer Law or other applicable
              legislation. Where our liability cannot be excluded but can be limited under
              section&nbsp;64A of the ACL, the limitations set out in Section&nbsp;10.3 apply.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              12. Indemnification
            </h2>
            <p className="mb-3">
              You agree to indemnify, defend, and hold harmless{" "}
              <strong className="text-white">TheDayAfterAI</strong>, its operator ({" "}
              <a
                href="https://jackylee.art"
                className="text-[var(--accent)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jacky Lee Visionary Creations
              </a>
              ), affiliates, officers, directors, employees, and agents from and
              against any and all claims, damages, obligations, losses, liabilities, costs, or
              debt, and expenses (including but not limited to legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your use of and access to the Website;</li>
              <li>Your violation of any term of these Terms of Service;</li>
              <li>
                Your violation of any third-party right, including without limitation any
                copyright, property, or privacy right; or
              </li>
              <li>Any claim that your content caused damage to a third party.</li>
            </ul>
          </section>

          {/* 13. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              13. Governing Law
            </h2>
            <p>
              These Terms and any disputes arising out of or related to them or your use of the
              Website shall be governed by and construed in accordance with the laws of the
              Australian Capital Territory (ACT) and the Commonwealth of Australia, without regard
              to conflict of law provisions. You irrevocably submit to the non-exclusive
              jurisdiction of the courts of the ACT and any courts entitled to hear appeals
              therefrom.
            </p>
          </section>

          {/* 14. Dispute Resolution */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              14. Dispute Resolution
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              14.1 Informal Resolution
            </h3>
            <p>
              Before commencing any formal dispute resolution proceedings, you agree to first
              contact us at{" "}
              <a
                href="mailto:info@thedayafterai.com"
                className="text-[var(--accent)] hover:underline"
              >
                info@thedayafterai.com
              </a>{" "}
              and attempt to resolve the dispute informally for at least 30 days.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              14.2 Arbitration Agreement
            </h3>
            <p>
              If the dispute cannot be resolved informally, it shall be resolved exclusively by
              binding arbitration administered by the Australian Centre for International
              Commercial Arbitration (ACICA) in accordance with its ACICA Arbitration Rules. The
              arbitration shall take place in Canberra, ACT, and shall be conducted in English.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              14.3 Individual Basis
            </h3>
            <p>
              You agree that any arbitration or proceeding shall be conducted solely on an
              individual basis and not as a class, consolidated, or representative action, to the
              extent permitted by applicable law.
            </p>
          </section>

          {/* 15. Force Majeure */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              15. Force Majeure
            </h2>
            <p>
              <strong className="text-white">TheDayAfterAI</strong> shall not be liable for any
              failure or delay in performing its obligations under these Terms where such failure
              or delay results from circumstances beyond our reasonable control, including but not
              limited to natural disasters, acts of government, internet or telecommunications
              failures, power outages, pandemics, cyberattacks, or disruptions to third-party
              services on which the Website depends.
            </p>
          </section>

          {/* 16. Waiver */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              16. Waiver
            </h2>
            <p>
              No failure or delay by <strong className="text-white">TheDayAfterAI</strong> in
              exercising any right, power, or remedy under these Terms shall operate as a waiver
              of that right, power, or remedy, nor shall any single or partial exercise preclude
              any further exercise of the same or any other right.
            </p>
          </section>

          {/* 17. Severability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              17. Severability
            </h2>
            <p>
              If any provision of these Terms is held to be invalid, unlawful, or unenforceable by
              a court of competent jurisdiction, that provision shall be severed and the remaining
              provisions shall continue in full force and effect. Where possible, the invalid
              provision shall be interpreted in a manner consistent with applicable law to reflect
              the original intent of the parties.
            </p>
          </section>

          {/* 18. Entire Agreement */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              18. Entire Agreement
            </h2>
            <p>
              These Terms, together with our{" "}
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/disclaimer" className="text-[var(--accent)] hover:underline">
                Disclaimer
              </Link>
              , constitute the entire agreement between you and{" "}
              <strong className="text-white">TheDayAfterAI</strong> regarding your use of the
              Website and supersede all prior agreements and understandings, whether written or
              oral.
            </p>
          </section>

          {/* 19. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              19. Contact Us
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
