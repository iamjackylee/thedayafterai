import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title:
    "Editorial Independence and Ethics Policy — TheDayAfterAI News",
  description:
    "Read the TheDayAfterAI Editorial Independence and Ethics Policy covering our commitment to transparency, accuracy, AI disclosure, source protection, and responsible journalism.",
};

export default function EthicsPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Editorial Independence and Ethics Policy
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Last updated: February 13, 2026
          </p>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Preamble */}
          <p>
            This Editorial Independence and Ethics Policy (&ldquo;Policy&rdquo;)
            sets out the editorial principles and ethical standards that govern
            the content published on{" "}
            <strong className="text-white">TheDayAfterAI</strong>{" "}
            (&ldquo;we&rdquo;, &ldquo;our&rdquo; or &ldquo;us&rdquo;) at
            thedayafterai.com (&ldquo;Website&rdquo;). It should be read
            together with our{" "}
            <Link
              href="/terms"
              className="text-[var(--accent)] hover:underline"
            >
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/privacy"
              className="text-[var(--accent)] hover:underline"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/disclaimer"
              className="text-[var(--accent)] hover:underline"
            >
              Disclaimer
            </Link>
            . To the extent of any inconsistency between this Policy and
            the Terms of Service, the Terms of Service prevail.
          </p>
          <p>
            <strong className="text-white">TheDayAfterAI</strong> is a project
            developed and operated by{" "}
            <strong className="text-white">
              Jacky Lee Visionary Creations
            </strong>{" "}
            (
            <a
              href="https://jackylee.art"
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              jackylee.art
            </a>
            ). We are committed to producing and curating AI news content that
            is transparent, accurate, fair, and independent. Our editorial
            values are embodied in the letters of our name:{" "}
            <strong className="text-white">T</strong>ransparency,{" "}
            <strong className="text-white">D</strong>edication,{" "}
            <strong className="text-white">A</strong>ccountability,{" "}
            <strong className="text-white">A</strong>daptability, and{" "}
            <strong className="text-white">I</strong>nclusivity.
          </p>

          {/* 1. Editorial Independence */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              1. Editorial Independence
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              1.1 Independence from Commercial Interests
            </h3>
            <p>
              Our editorial content is produced independently of any advertiser,
              sponsor, investor, or other commercial interest. No third party
              may influence, direct, or approve our editorial decisions or
              content prior to publication. Advertising revenue and sponsorship
              arrangements do not affect what stories we cover or how we cover
              them.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              1.2 Separation of Editorial and Commercial Functions
            </h3>
            <p>
              We maintain a strict separation between our editorial and
              commercial functions. Editorial staff are not involved in
              advertising sales, and advertising or commercial staff have no
              authority over editorial content. Where content is sponsored or
              commercially supported, it will be clearly labelled in accordance
              with Section&nbsp;7 of this Policy.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              1.3 Political and Institutional Independence
            </h3>
            <p>
              TheDayAfterAI does not endorse or oppose any political party,
              candidate, or government institution. Our coverage of governance
              and politics is driven solely by editorial merit and public
              interest.
            </p>
          </section>

          {/* 2. AI-Assisted Content — Transparency and Disclosure */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              2. AI-Assisted Content — Transparency and Disclosure
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.1 How We Use AI
            </h3>
            <p className="mb-3">
              TheDayAfterAI uses artificial intelligence systems across our
              three content areas:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">AI News Briefing</strong> — AI
                curators scan and aggregate news across specific AI domains. An
                AI reporter synthesises this information into clear, engaging
                summaries using machine learning and natural language
                processing. Human editors review all AI-generated output before
                publication to ensure accuracy, relevance, and quality.
              </li>
              <li>
                <strong className="text-white">AI Market Insights</strong> — AI
                forecasts the next-day price direction of a single U.S.-listed
                stock each day. This is an experimental feature published for
                educational and entertainment purposes only. It does not
                constitute financial product advice. See our{" "}
                <Link
                  href="/disclaimer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Disclaimer
                </Link>{" "}
                (Section&nbsp;4) for full details.
              </li>
              <li>
                <strong className="text-white">AI News Hub</strong> — AI
                assists in the curation and categorisation of headlines from
                publishers worldwide. Human editors supervise the selection and
                presentation.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.2 Disclosure Standards
            </h3>
            <p className="mb-3">
              We are committed to transparency about our use of AI. Our
              disclosure standards include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Clearly identifying content that is generated or substantially
                assisted by AI systems.
              </li>
              <li>
                Disclosing the role of AI in our editorial workflow on our{" "}
                <Link
                  href="/info"
                  className="text-[var(--accent)] hover:underline"
                >
                  About Us
                </Link>{" "}
                page and in these policies.
              </li>
              <li>
                Acknowledging the limitations of AI, including the risk of
                inaccuracies, omissions, and hallucinations (plausible but
                factually incorrect outputs).
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.3 Human Oversight
            </h3>
            <p>
              All AI-generated content is subject to human editorial review
              before publication. Human editors are responsible for verifying
              facts, checking for bias, ensuring fair representation, and making
              final publication decisions. AI systems support and augment our
              editorial process; they do not replace human editorial judgment.
            </p>
          </section>

          {/* 3. Accuracy and Corrections */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              3. Accuracy and Corrections
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.1 Commitment to Accuracy
            </h3>
            <p>
              We are dedicated to publishing content that is accurate, fair, and
              balanced. We take reasonable steps to verify the accuracy of
              information before publication, including cross-referencing
              multiple sources where practicable. We do not knowingly publish
              false or misleading information.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.2 Corrections Policy
            </h3>
            <p className="mb-3">
              When we become aware of a material error in published content, we
              will:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Correct the error as promptly as practicable.
              </li>
              <li>
                Clearly note the correction on the relevant content with the
                date of correction, so that readers are aware the content has
                been amended.
              </li>
              <li>
                Where the error is significant and may have caused readers to
                form a materially different understanding, publish a correction
                notice.
              </li>
            </ul>
            <p className="mt-3">
              This corrections policy is consistent with the principles of the
              defence of qualified privilege and the public interest defence
              under the{" "}
              <em>Defamation Act 2005</em> (ACT), which recognise timely and
              genuine corrections as evidence of responsible publication.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.3 Right of Reply
            </h3>
            <p>
              Where our content makes a serious allegation against a named
              individual or organisation, we will endeavour to seek a response
              from the relevant party before publication. Where a response is
              not obtained before publication, we will offer a reasonable
              opportunity for the party to respond after publication and will
              publish a fair summary of any substantive response received.
            </p>
          </section>

          {/* 4. Fairness, Impartiality, and Diversity */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              4. Fairness, Impartiality, and Diversity
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.1 Fair Reporting
            </h3>
            <p>
              We present information fairly and without distortion. Where a
              story involves competing viewpoints, we endeavour to represent
              them equitably. Headlines accurately reflect the substance of the
              content they introduce.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.2 Inclusivity
            </h3>
            <p>
              We value diverse perspectives and foster an inclusive editorial
              approach. Our content aims to reflect the multifaceted nature of
              AI advancements and their global impact, with a particular
              connection to communities in Australia and Hong Kong.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.3 AI Bias Awareness
            </h3>
            <p>
              We acknowledge that AI systems may reflect or amplify biases
              present in their training data. Our human editors actively review
              AI-generated content for potential bias, including cultural,
              gender, racial, or ideological bias, and take steps to address any
              bias identified before publication.
            </p>
          </section>

          {/* 5. Conflicts of Interest */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              5. Conflicts of Interest
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.1 Disclosure of Interests
            </h3>
            <p>
              All editorial team members are required to disclose any financial,
              personal, or professional interests that could reasonably be
              perceived as influencing their editorial judgment. Where a
              conflict of interest is identified, the affected person will be
              excluded from editorial decisions relating to the relevant
              content.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.2 No Dealing in Forecasted Securities
            </h3>
            <p>
              TheDayAfterAI does not trade in, hold positions in, or receive any
              benefit from the securities it forecasts or references in the AI
              Market Insights feature. No director, employee, or agent of
              TheDayAfterAI is authorised to trade on the basis of forecasts
              published on this Website. This prohibition extends to family
              members and close associates of editorial staff to the extent
              that they have advance knowledge of unpublished forecasts.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.3 Gifts and Hospitality
            </h3>
            <p>
              Editorial staff may not accept gifts, hospitality, or other
              benefits from any person or organisation that could reasonably be
              perceived as an attempt to influence editorial content. Token
              gifts of nominal value (under AUD&nbsp;50) that are customary in
              the industry may be accepted but must be disclosed.
            </p>
          </section>

          {/* 6. Source Protection and Confidentiality */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. Source Protection and Confidentiality
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              6.1 Protection of Sources
            </h3>
            <p>
              We protect the identity of confidential sources. Where individuals
              contact us as journalistic sources or provide information on a
              confidential or anonymous basis, we treat their contact details
              and identifying information as sensitive. We do not disclose the
              identities of confidential sources unless legally required to do
              so.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              6.2 Legal Protections
            </h3>
            <p>
              Where applicable, we rely on the journalist privilege under
              section&nbsp;126K of the <em>Evidence Act 1995</em> (Cth) to
              protect the identity of our confidential sources. Access to source
              information is restricted to authorised editorial team members and
              is used only for editorial purposes consistent with this Policy.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              6.3 Data Handling
            </h3>
            <p>
              Information received from confidential sources is handled in
              accordance with our{" "}
              <Link
                href="/privacy"
                className="text-[var(--accent)] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              (Section&nbsp;2.5) and the{" "}
              <em>Privacy Act 1988</em> (Cth).
            </p>
          </section>

          {/* 7. Advertising, Sponsored Content, and Commercial Relationships */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Advertising, Sponsored Content, and Commercial Relationships
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.1 Clear Labelling
            </h3>
            <p>
              All advertising, sponsored content, and commercially supported
              material will be clearly and prominently labelled as such (for
              example, &ldquo;Sponsored&rdquo;, &ldquo;Advertisement&rdquo;, or
              &ldquo;Paid Partnership&rdquo;) so that readers can easily
              distinguish it from independent editorial content. This is
              consistent with our obligations under section&nbsp;18 of the{" "}
              <em>Competition and Consumer Act 2010</em> (Cth) (prohibition on
              misleading or deceptive conduct) and the AANA Code of Ethics.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.2 No Misleading Native Advertising
            </h3>
            <p>
              We do not publish native advertising (advertising designed to
              resemble editorial content) without clear and prominent
              disclosure. Sponsored content must not be presented in a manner
              that could mislead readers into believing it is independent
              editorial content.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.3 Affiliate Links
            </h3>
            <p>
              Where our content includes affiliate links or referral
              arrangements from which we may earn a commission, we will disclose
              this to readers.
            </p>
          </section>

          {/* 8. Copyright, Fair Dealing, and Attribution */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              8. Copyright, Fair Dealing, and Attribution
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.1 Respect for Intellectual Property
            </h3>
            <p>
              We respect the intellectual property rights of others. When we
              curate content from third-party sources, we provide appropriate
              attribution, including links to the original content whenever
              possible. We do not claim ownership of third-party content.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.2 Fair Dealing
            </h3>
            <p>
              Where we reproduce or reference copyrighted material, we do so in
              reliance on the fair dealing exceptions under the{" "}
              <em>Copyright Act 1968</em> (Cth), in particular section&nbsp;42
              (fair dealing for the purpose of reporting news) and
              section&nbsp;41 (fair dealing for the purpose of criticism or
              review). Where our audience extends to other jurisdictions, we
              also rely on equivalent fair use or fair dealing provisions under
              applicable international copyright laws. For full details, see
              our{" "}
              <Link
                href="/disclaimer"
                className="text-[var(--accent)] hover:underline"
              >
                Disclaimer
              </Link>{" "}
              (Section&nbsp;7).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.3 Takedown Requests
            </h3>
            <p>
              If you believe that your copyrighted work has been used on this
              Website in a way that constitutes copyright infringement, please
              contact us immediately. We will investigate and, where
              appropriate, remove or disable access to the material in question
              in accordance with the <em>Copyright Act 1968</em> (Cth). See
              our{" "}
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              (Section&nbsp;5.4) for the information we require in a copyright
              notice.
            </p>
          </section>

          {/* 9. Financial Content Safeguards */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              9. Financial Content Safeguards
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.1 General Information Only
            </h3>
            <p>
              All financial content on this Website, including the AI Market
              Insights feature, is general information only. It does not
              constitute financial product advice — whether general or
              personal — within the meaning of section&nbsp;766B of the{" "}
              <em>Corporations Act 2001</em> (Cth). TheDayAfterAI does not hold
              an Australian Financial Services Licence (AFSL) and is not
              authorised to provide financial services. For the full financial
              information disclaimer, see our{" "}
              <Link
                href="/disclaimer"
                className="text-[var(--accent)] hover:underline"
              >
                Disclaimer
              </Link>{" "}
              (Section&nbsp;4).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.2 Editorial Safeguards for Financial Content
            </h3>
            <p className="mb-3">
              To ensure that our financial content is not, and cannot reasonably
              be construed as, financial product advice, we implement the
              following editorial safeguards:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                All financial content is reviewed by a human editor to confirm
                it is factual and does not contain language that could be
                construed as a recommendation to buy, sell, or hold any
                financial product.
              </li>
              <li>
                Each piece of financial content carries a prominent disclaimer
                stating that it is general information only and not financial
                advice.
              </li>
              <li>
                Past performance disclaimers accompany all content that
                references forecast accuracy or historical data.
              </li>
              <li>
                Readers are directed to seek independent professional advice
                from an appropriately licensed adviser.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.3 Regulatory Compliance
            </h3>
            <p>
              We monitor our obligations under the{" "}
              <em>Corporations Act 2001</em> (Cth), the{" "}
              <em>ASIC Act 2001</em> (Cth), and ASIC regulatory guidance
              (including ASIC Regulatory Guide&nbsp;234) to ensure that our
              financial content does not inadvertently cross the boundary from
              general information into financial product advice. We will seek
              legal advice if there is any doubt about the characterisation of
              particular content.
            </p>
          </section>

          {/* 10. Privacy and Data Ethics */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              10. Privacy and Data Ethics
            </h2>
            <p>
              We are committed to handling personal information in accordance
              with the <em>Privacy Act 1988</em> (Cth) and the Australian
              Privacy Principles. Our editorial practices respect the privacy
              and dignity of individuals. We will not publish private
              information about individuals unless doing so is in the public
              interest and the public interest outweighs the individual&apos;s
              right to privacy. For full details of how we handle your personal
              information, see our{" "}
              <Link
                href="/privacy"
                className="text-[var(--accent)] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          {/* 11. Complaints and Feedback */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              11. Complaints and Feedback
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              11.1 Editorial Complaints
            </h3>
            <p className="mb-3">
              If you believe that any content published on this Website breaches
              this Policy, is inaccurate, unfair, or otherwise raises an
              editorial concern, you may lodge a complaint by contacting us
              at{" "}
              <a
                href="mailto:info@thedayafterai.com"
                className="text-[var(--accent)] hover:underline"
              >
                info@thedayafterai.com
              </a>
              . Your complaint should include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                A description of the content you are complaining about,
                including the URL or headline.
              </li>
              <li>
                The specific provision of this Policy you believe has been
                breached.
              </li>
              <li>
                An explanation of why you believe the content is in breach.
              </li>
              <li>Your contact details for our response.</li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              11.2 Complaint Handling
            </h3>
            <p>
              We will acknowledge receipt of your complaint within 7&nbsp;days
              and endeavour to provide a substantive response within
              30&nbsp;days. Where a complaint is upheld, we will take
              appropriate action, which may include issuing a correction,
              updating or removing the content, or publishing a clarification.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              11.3 External Recourse
            </h3>
            <p>
              If you are not satisfied with our response to your complaint, you
              may refer the matter to the Australian Communications and Media
              Authority (ACMA) or, in relation to privacy matters, the Office
              of the Australian Information Commissioner (OAIC) at{" "}
              <a
                href="https://www.oaic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                www.oaic.gov.au
              </a>
              .
            </p>
          </section>

          {/* 12. Defamation and Legal Risk */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              12. Defamation and Legal Risk
            </h2>
            <p>
              All content is reviewed for potential defamation risk before
              publication. We are guided by the uniform defamation legislation
              (including the <em>Defamation Act 2005</em> (ACT) and equivalent
              State and Territory legislation as amended), including the
              defences of justification (substantial truth), fair comment on
              matters of public interest, qualified privilege, and the public
              interest defence introduced by the 2021 amendments. Our
              corrections policy (Section&nbsp;3.2) is designed to support the
              responsible publication standards required for these defences.
            </p>
          </section>

          {/* 13. Review and Updates */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              13. Review and Updates
            </h2>
            <p>
              This Policy is reviewed at least annually and updated as necessary
              to reflect changes in editorial practices, technology, or
              applicable law. Any changes will be effective immediately upon
              posting the revised Policy on this page and updating the
              &ldquo;Last updated&rdquo; date above. Where we make material
              changes to this Policy (for example, changes to our AI disclosure
              standards or editorial safeguards), we will use reasonable efforts
              to notify you — for example, by posting a prominent notice on our
              Website. We encourage you to review this Policy periodically.
            </p>
          </section>

          {/* 14. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              14. Governing Law
            </h2>
            <p>
              This Policy is governed by and construed in accordance with the
              laws of the Australian Capital Territory and the Commonwealth of
              Australia, without regard to conflict of law provisions. You
              irrevocably submit to the non-exclusive jurisdiction of the courts
              of the Australian Capital Territory and any courts entitled to
              hear appeals therefrom.
            </p>
          </section>

          {/* 15. Severability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              15. Severability
            </h2>
            <p>
              If any provision of this Policy is held to be invalid, unlawful,
              or unenforceable by a court of competent jurisdiction, that
              provision shall be severed and the remaining provisions shall
              continue in full force and effect. Where possible, the invalid
              provision shall be interpreted in a manner consistent with
              applicable law to reflect its original intent.
            </p>
          </section>

          {/* 16. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              16. Contact Us
            </h2>
            <p>
              If you have any questions about this Policy, please email us
              at{" "}
              <a
                href="mailto:info@thedayafterai.com"
                className="text-[var(--accent)] hover:underline"
              >
                info@thedayafterai.com
              </a>{" "}
              or{" "}
              <a
                href="https://www.thedayafterai.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                contact us
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
