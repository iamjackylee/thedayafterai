import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Disclaimer | Important Legal Notices — TheDayAfterAI News",
  description:
    "Read the TheDayAfterAI disclaimer covering AI-generated content, financial information, third-party links, and Australian Consumer Law notices.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Disclaimer
          </h1>
          <p className="text-sm text-[var(--muted)]">Last updated: February 13, 2026</p>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Preamble */}
          <p>
            This Disclaimer applies to all content published on{" "}
            <strong className="text-white">TheDayAfterAI</strong> (&ldquo;we&rdquo;,
            &ldquo;our&rdquo; or &ldquo;us&rdquo;) at thedayafterai.com (&ldquo;Website&rdquo;).
            It should be read together with our{" "}
            <Link href="/terms" className="text-[var(--accent)] hover:underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-[var(--accent)] hover:underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/ethics-policy" className="text-[var(--accent)] hover:underline">
              Editorial Independence and Ethics Policy
            </Link>
            . To the extent of any inconsistency between this Disclaimer and the Terms of Service,
            the Terms of Service prevail. By accessing or using our Website, you acknowledge that
            you have read, understood, and agree to be bound by this Disclaimer.
          </p>

          {/* 1. General Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              1. General Disclaimer
            </h2>
            <p>
              The content on this Website is provided for general informational purposes only. While
              we endeavour to keep the information current and accurate, we make no representations
              or warranties of any kind—express or implied—about the completeness, accuracy,
              reliability, suitability, or availability of the Website or the information, products,
              services, or related graphics contained on the Website for any purpose.
            </p>
            <p className="mt-3">
              Any reliance you place on such information is strictly at your own risk. It is your
              responsibility to verify any information obtained from this Website before relying on
              it, especially content sourced from third-party websites. Subject to
              Section&nbsp;10 (Australian Consumer Law), and to the maximum extent permitted by
              law, we exclude all liability for any loss or damage (including, without limitation,
              indirect or consequential loss or damage, or any loss or damage whatsoever arising
              from loss of data or profits) arising out of or in connection with the use of this
              Website.
            </p>
          </section>

          {/* 2. No Professional Advice */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              2. No Professional Advice
            </h2>
            <p>
              Nothing on this Website constitutes, or is intended to constitute, professional advice
              of any kind, including but not limited to legal, financial, investment, taxation,
              accounting, medical, or technical advice. You should not act or refrain from acting on
              the basis of any content on this Website without first seeking appropriate professional
              advice from a qualified practitioner in the relevant field.
            </p>
          </section>

          {/* 3. AI-Generated Content */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              3. AI-Generated and AI-Assisted Content
            </h2>
            <p>
              Portions of this Website, including news summaries, analyses, and market forecasts,
              are produced using artificial intelligence (AI) technologies. While this content is
              reviewed by human editors before publication, AI-generated content may contain
              inaccuracies, errors, or omissions. AI systems may produce outputs that are
              incomplete, out of date, or that do not fully reflect the nuance of the underlying
              subject matter. AI systems may also produce outputs that appear plausible but are
              factually incorrect (&ldquo;hallucinations&rdquo;).
            </p>
            <p className="mt-3">
              We do not warrant or represent that any AI-generated content is accurate, complete,
              current, or free from error. You acknowledge and agree that AI-generated content is
              provided on an &ldquo;as is&rdquo; basis and should not be relied upon as the sole
              basis for any decision.
            </p>
          </section>

          {/* 4. Financial Information — AFSL/Corporations Act */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              4. Financial Information — Important Notice
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.1 General Information Only
            </h3>
            <p>
              Our <strong className="text-white">AI Market Insights</strong> feature and any other
              content on this Website that references financial products, securities, stock prices,
              or market trends is{" "}
              <strong className="text-white">general information only</strong>. It is not, and is
              not intended to be, financial product advice—whether general or personal—within the
              meaning of section&nbsp;766B of the <em>Corporations Act 2001</em> (Cth).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.2 No AFSL
            </h3>
            <p>
              <strong className="text-white">TheDayAfterAI</strong> does not hold an Australian
              Financial Services Licence (AFSL) and is not a representative of any AFSL holder. We
              are not authorised to provide financial services under the{" "}
              <em>Corporations Act 2001</em> (Cth) or any equivalent legislation in any other
              jurisdiction.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.3 Not a Recommendation
            </h3>
            <p>
              Nothing on this Website constitutes a recommendation, offer, or solicitation to buy,
              sell, or hold any financial product. Our content has not been prepared having regard to
              any person&apos;s investment objectives, financial situation, or particular needs. You
              should consider the appropriateness of any information in light of your own
              circumstances before making any investment decision.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.4 Past Performance
            </h3>
            <p>
              AI-generated forecasts are the output of experimental machine-learning models. Past
              forecast accuracy is not a reliable indicator of future results. Historical data,
              including published accuracy statistics, should not be interpreted as a guarantee or
              assurance of future performance.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.5 No Dealing
            </h3>
            <p>
              <strong className="text-white">TheDayAfterAI</strong> does not trade in, hold
              positions in, or receive any benefit from the securities it forecasts or references.
              No director, employee, or agent of TheDayAfterAI is authorised to trade on the basis
              of forecasts published on this Website. This prohibition extends to family members
              and close associates of editorial staff to the extent that they have advance
              knowledge of unpublished forecasts. See also our{" "}
              <Link href="/ethics-policy" className="text-[var(--accent)] hover:underline">
                Ethics Policy
              </Link>{" "}
              (Section&nbsp;5.2).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.6 International Investors
            </h3>
            <p>
              The AI Market Insights feature relates to U.S.-listed securities. This content may not
              be appropriate for investors in Australia or any other jurisdiction without separate
              consideration of the tax, regulatory, currency, and other implications of dealing in
              foreign securities. Nothing on this Website constitutes an offer or invitation in any
              jurisdiction where such offer or invitation is not authorised or would be unlawful.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.7 Seek Independent Advice
            </h3>
            <p>
              Before making any investment or financial decision, you should obtain independent
              professional advice from a person who holds an appropriate Australian Financial
              Services Licence (or equivalent licence in your jurisdiction) and who has considered
              your personal objectives, financial situation, and needs.
            </p>
          </section>

          {/* 5. Third-Party Content and Links */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              5. Third-Party Content and External Links
            </h2>
            <p>
              This Website curates and links to content from third-party sources. We do not control,
              endorse, or assume responsibility for the accuracy, relevance, timeliness, or
              completeness of any third-party content. The inclusion of any link does not imply our
              endorsement of the linked website or its operator.
            </p>
            <p className="mt-3">
              The opinions expressed in third-party content are those of the respective authors and
              do not necessarily reflect the views of{" "}
              <strong className="text-white">TheDayAfterAI</strong>. We are not liable for any loss
              or damage arising from your reliance on third-party content or from your use of any
              external website accessed through a link on this Website.
            </p>
            <p className="mt-3">
              Any reference on this Website to any specific commercial product, process, or service
              by trade name, trademark, manufacturer, or otherwise does not constitute or imply an
              endorsement, recommendation, or favouring by{" "}
              <strong className="text-white">TheDayAfterAI</strong>.
            </p>
            <p className="mt-3">
              When you follow a link to an external website, you leave the Website and this
              Disclaimer (together with our Terms of Service and Privacy Policy) will no longer
              apply. You access external websites entirely at your own risk.
            </p>
          </section>

          {/* 6. Views and Opinions */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. Views and Opinions
            </h2>
            <p>
              Any views or opinions expressed on this Website are those of the individual authors or
              the AI systems that produced them, and do not necessarily represent the official
              policy or position of <strong className="text-white">TheDayAfterAI</strong>, its
              affiliates, employees, or agents. We do not accept responsibility for any statements
              made, or opinions expressed, in any content published on this Website.
            </p>
          </section>

          {/* 7. Fair Use and Content Attribution */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Fair Use and Content Attribution
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.1 Fair Use Notice
            </h3>
            <p>
              This Website may contain copyrighted material, the use of which has not always been
              specifically authorised by the copyright owner. We believe this constitutes
              &ldquo;fair dealing&rdquo; for the purpose of reporting news within the meaning of
              section&nbsp;42 of the <em>Copyright Act 1968</em> (Cth), or for the purpose of
              criticism or review within the meaning of section&nbsp;41 of that Act. Where our
              audience extends to other jurisdictions, we also rely on equivalent fair use or fair
              dealing provisions under applicable international copyright laws. We make every
              effort to attribute content to its original sources.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.2 Content Attribution
            </h3>
            <p>
              We respect the intellectual property rights of others. When we curate content from
              third-party sources, we strive to provide appropriate attribution, including links to
              the original content whenever possible. If you believe that your copyrighted work has
              been used in a way that constitutes copyright infringement, please contact us
              immediately. For the information we require in a copyright infringement notice and
              our takedown procedure, see our{" "}
              <Link href="/terms" className="text-[var(--accent)] hover:underline">
                Terms of Service
              </Link>{" "}
              (Section&nbsp;5.4).
            </p>
          </section>

          {/* 8. Changes to Content */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              8. Changes to Content
            </h2>
            <p>
              We reserve the right to make additions, deletions, or modifications to the contents
              on the Website at any time without prior notice. We do not undertake any obligation to
              update the information on this Website, and information may become outdated over time.
            </p>
            <p className="mt-3">
              We may also update this Disclaimer from time to time. Any changes will be effective
              immediately upon posting the revised Disclaimer on this page. The &ldquo;Last
              updated&rdquo; date at the top of this page will be amended accordingly. Your
              continued use of the Website following the posting of changes constitutes your
              acceptance of those changes. We encourage you to review this Disclaimer periodically.
            </p>
          </section>

          {/* 9. No Warranties */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              9. No Warranties
            </h2>
            <p>
              This section supplements the warranty exclusions in our{" "}
              <Link href="/terms" className="text-[var(--accent)] hover:underline">
                Terms of Service
              </Link>{" "}
              (Section&nbsp;10.1). Without limiting that section, and without limiting any
              Non-Excludable Guarantee under the ACL, we make no warranty or representation as to
              the accuracy of any AI model, the currency of any training data used by an AI model,
              or the reliability of any AI-generated prediction, forecast, or analysis published on
              this Website.
            </p>
          </section>

          {/* 10. Australian Consumer Law */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              10. Australian Consumer Law
            </h2>
            <p>
              Nothing in this Disclaimer purports to exclude, restrict, or modify the application
              of any guarantee, condition, or warranty implied by the Australian Consumer Law
              (Schedule&nbsp;2 of the <em>Competition and Consumer Act 2010</em> (Cth))
              (&ldquo;ACL&rdquo;) that cannot be excluded, restricted, or modified
              (&ldquo;Non-Excludable Guarantees&rdquo;). For the full Australian Consumer Law
              notice, including the statutory limitation of remedies for breach of
              Non-Excludable Guarantees under section&nbsp;64A of the ACL, see our{" "}
              <Link href="/terms" className="text-[var(--accent)] hover:underline">
                Terms of Service
              </Link>{" "}
              (Section&nbsp;10.3).
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              11. Limitation of Liability
            </h2>
            <p>
              This section supplements the Limitation of Liability set out in our{" "}
              <Link href="/terms" className="text-[var(--accent)] hover:underline">
                Terms of Service
              </Link>{" "}
              (Section&nbsp;11), which applies to all use of the Website. Without limiting
              that section, and subject to Section&nbsp;10 above (Australian Consumer Law),
              TheDayAfterAI shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>
                any financial loss arising from reliance on AI-generated market insights, stock
                forecasts, or other financial information published on this Website;
              </li>
              <li>
                any loss or damage arising from your reliance on third-party content accessed
                through links on this Website; or
              </li>
              <li>
                any loss resulting from AI-generated content that is inaccurate, incomplete, or
                out of date, including hallucinations.
              </li>
            </ul>
            <p className="mt-3">
              The aggregate liability cap, ACL carve-out, and indemnification obligations set out
              in the{" "}
              <Link href="/terms" className="text-[var(--accent)] hover:underline">
                Terms of Service
              </Link>{" "}
              (Sections&nbsp;10.3, 11, and&nbsp;12) apply equally to claims arising under this
              Disclaimer.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              12. Governing Law
            </h2>
            <p>
              This Disclaimer is governed by and construed in accordance with the laws of the
              Australian Capital Territory and the Commonwealth of Australia, without regard to
              conflict of law provisions. You irrevocably submit to the non-exclusive jurisdiction
              of the courts of the Australian Capital Territory and any courts entitled to hear
              appeals therefrom.
            </p>
          </section>

          {/* 13. Severability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              13. Severability
            </h2>
            <p>
              If any provision of this Disclaimer is held to be invalid, unlawful, or unenforceable
              by a court of competent jurisdiction, that provision shall be severed and the
              remaining provisions shall continue in full force and effect. Where possible, the
              invalid provision shall be interpreted in a manner consistent with applicable law to
              reflect its original intent.
            </p>
          </section>

          {/* 14. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              14. Contact Us
            </h2>
            <p>
              If you have any questions about this Disclaimer, please email us at{" "}
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
