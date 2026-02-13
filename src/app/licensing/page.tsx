import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title:
    "Licensing Terms for Articles and Images — TheDayAfterAI News",
  description:
    "Discover licensing options for using articles and images from TheDayAfterAI. Explore Standard, Small Business, Professional, and Enterprise licences tailored to your needs.",
};

export default function LicensingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Licensing Terms for Articles and Images
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Last updated: February 13, 2026
          </p>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Preamble */}
          <p>
            These Licensing Terms (&ldquo;Licensing Terms&rdquo;) govern the
            purchase and use of articles and images
            (&ldquo;Content&rdquo;) provided by{" "}
            <strong className="text-white">TheDayAfterAI</strong>{" "}
            (&ldquo;we&rdquo;, &ldquo;our&rdquo; or &ldquo;us&rdquo;) at
            thedayafterai.com (&ldquo;Website&rdquo;). By purchasing and
            using our Content, you (&ldquo;Licensee&rdquo;) agree to be
            bound by these Licensing Terms. These Licensing Terms should be
            read together with our{" "}
            <Link
              href="/terms"
              className="text-[var(--accent)] hover:underline"
            >
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/disclaimer"
              className="text-[var(--accent)] hover:underline"
            >
              Disclaimer
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
              href="/ethics-policy"
              className="text-[var(--accent)] hover:underline"
            >
              Editorial Independence and Ethics Policy
            </Link>
            . To the extent of any inconsistency between these Licensing
            Terms and the{" "}
            <Link
              href="/terms"
              className="text-[var(--accent)] hover:underline"
            >
              Terms of Service
            </Link>
            , these Licensing Terms prevail with respect to the licensed
            Content.
          </p>
          <p>
            These Licensing Terms take effect on the date you first
            purchase Content under them (&ldquo;Effective Date&rdquo;).
            For Content purchased prior to the &ldquo;Last updated&rdquo;
            date shown above, the licensing terms agreed upon at the time
            of purchase continue to apply to that Content.
          </p>

          {/* 1. Description */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              1. Description of Content
            </h2>
            <p>
              <strong className="text-white">TheDayAfterAI</strong> offers
              licences for the use of its proprietary articles and images
              (collectively, &ldquo;Content&rdquo;). These licences cater
              to a wide range of applications, from personal projects to
              large-scale commercial endeavours. All Content remains the
              intellectual property of TheDayAfterAI unless expressly
              stated otherwise.
            </p>
          </section>

          {/* 2. Licensing Tiers */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              2. Licensing Tiers
            </h2>
            <p className="mb-4">
              Revenue thresholds below are stated in United States Dollars
              (USD) for international comparability. You must select the
              tier that corresponds to your (or your organisation&apos;s)
              annual gross revenue at the time of purchase.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.1 Standard Licence (Quantity:&nbsp;1)
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Eligibility:</strong>{" "}
                Individuals and companies with annual revenue less than
                USD&nbsp;100,000.
              </li>
              <li>
                <strong className="text-white">Permitted Uses:</strong>{" "}
                Use in marketing materials, business presentations,
                internal communications, and personal projects.
              </li>
              <li>
                <strong className="text-white">Restrictions:</strong>{" "}
                Redistribution, resale, or modification of the Content is
                prohibited unless explicitly permitted in writing.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.2 Small Business Licence (Quantity:&nbsp;20)
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Eligibility:</strong>{" "}
                Companies with annual revenue between USD&nbsp;100,000 and
                USD&nbsp;1&nbsp;million.
              </li>
              <li>
                <strong className="text-white">Permitted Uses:</strong>{" "}
                All uses under the Standard Licence, plus use in multiple
                projects, limited redistribution, and non-exclusive
                commercial purposes.
              </li>
              <li>
                <strong className="text-white">Restrictions:</strong>{" "}
                Redistribution limited to specified projects; resale
                prohibited.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.3 Professional Licence (Quantity:&nbsp;50)
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Eligibility:</strong>{" "}
                Companies with annual revenue between
                USD&nbsp;1&nbsp;million and USD&nbsp;10&nbsp;million.
              </li>
              <li>
                <strong className="text-white">Permitted Uses:</strong>{" "}
                All uses under the Small Business Licence, plus
                modification of Content, inclusion in commercial products,
                and broader distribution rights.
              </li>
              <li>
                <strong className="text-white">Restrictions:</strong>{" "}
                Redistribution and resale allowed only within the scope of
                the licence; sublicensing prohibited without prior written
                consent.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.4 Enterprise Licence (Quantity:&nbsp;99)
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Eligibility:</strong>{" "}
                Companies with annual revenue exceeding
                USD&nbsp;10&nbsp;million.
              </li>
              <li>
                <strong className="text-white">Permitted Uses:</strong>{" "}
                All uses under the Professional Licence, plus exclusive
                rights to the specific Content items purchased (see
                Section&nbsp;3.2), unlimited redistribution, and priority
                support services.
              </li>
              <li>
                <strong className="text-white">Restrictions:</strong>{" "}
                Sublicensing prohibited unless explicitly granted in
                writing.
              </li>
            </ul>
          </section>

          {/* 3. Grant of Licence */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              3. Grant of Licence
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.1 Non-Exclusive Licence
            </h3>
            <p>
              Subject to these Licensing Terms,{" "}
              <strong className="text-white">TheDayAfterAI</strong> grants
              the Licensee a non-exclusive, non-transferable, revocable
              licence to use the Content as specified under the selected
              Licensing Tier. The licence is granted for the territory
              worldwide and for the duration specified in Section&nbsp;8,
              unless terminated earlier.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.2 Enterprise Exclusivity
            </h3>
            <p>
              Notwithstanding Section&nbsp;3.1, where a Licensee purchases
              an Enterprise Licence (Section&nbsp;2.4), TheDayAfterAI
              grants an exclusive right to use the specific Content items
              covered by that purchase. This means TheDayAfterAI will not
              licence the same specific Content items to another party
              for the duration of the Enterprise Licence. The exclusivity
              applies only to the specific Content items purchased under
              the Enterprise Licence and does not extend to other Content
              on the Website.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.3 Intellectual Property Ownership
            </h3>
            <p>
              All intellectual property rights in the Content, including
              copyright, remain with{" "}
              <strong className="text-white">TheDayAfterAI</strong> (or
              its licensors, where applicable). Nothing in these Licensing
              Terms transfers ownership of any intellectual property to the
              Licensee. The licence granted is a licence to use, not a sale
              or assignment of, the Content.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.4 Moral Rights
            </h3>
            <p>
              The authors of the Content retain their moral rights under
              Part&nbsp;IX of the <em>Copyright Act 1968</em> (Cth),
              including the right of attribution and the right of integrity.
              You must not falsely attribute authorship of the Content to
              any person other than the original author, and you must not
              subject the Content to derogatory treatment (as defined in
              section&nbsp;195AI of the Act).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.5 Attribution
            </h3>
            <p>
              Unless otherwise agreed in writing, you must provide
              attribution to{" "}
              <strong className="text-white">TheDayAfterAI</strong> when
              using any licensed Content. Attribution must include, at a
              minimum, the credit line: &ldquo;Source: TheDayAfterAI
              (thedayafterai.com)&rdquo;, displayed in a manner that is
              reasonably prominent in the context of the use.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.6 No Assignment or Sublicensing
            </h3>
            <p>
              You may not assign, transfer, sublicense, or otherwise deal
              with any of your rights or obligations under these Licensing
              Terms without the prior written consent of TheDayAfterAI.
              Any purported assignment or transfer without such consent is
              void.
            </p>
          </section>

          {/* 4. How to Purchase */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              4. How to Purchase
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.1 Determine Eligibility
            </h3>
            <p>
              Assess your (or your organisation&apos;s) annual gross
              revenue to identify the appropriate Licensing Tier. You
              represent and warrant that the tier you select accurately
              reflects your revenue at the time of purchase. TheDayAfterAI
              reserves the right to request reasonable evidence of revenue
              to verify tier eligibility (see Section&nbsp;7).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.2 Select Licensing Tier and Complete Payment
            </h3>
            <p>
              Enter the corresponding quantity on the purchasing page that
              matches your selected Licensing Tier and complete your
              purchase securely through our payment processor.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.3 Pricing and GST
            </h3>
            <p>
              All prices displayed on the Website are in the currency
              stated at the point of sale. Where the supply is connected
              with Australia and subject to the{" "}
              <em>A New Tax System (Goods and Services Tax) Act 1999</em>{" "}
              (Cth), the price is inclusive of GST unless otherwise stated.
              A tax invoice will be provided upon request.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.4 Refunds
            </h3>
            <p>
              Due to the digital nature of the Content, refunds are
              generally not available once the Content has been delivered
              or accessed. This does not affect your rights under the
              Australian Consumer Law — see our{" "}
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              (Section&nbsp;10.3) for our ACL notice, including your
              statutory rights in relation to Non-Excludable Guarantees.
            </p>
          </section>

          {/* 5. Acceptance of Terms */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              5. Acceptance of Licensing Terms
            </h2>
            <p>
              By purchasing and using the Content, you acknowledge and
              agree to be bound by these Licensing Terms. It is your
              responsibility to select the correct Licensing Tier and to
              comply with all applicable terms and restrictions. If you do
              not agree to these Licensing Terms, do not purchase or use
              the Content.
            </p>
          </section>

          {/* 6. Licence Restrictions */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. Licence Restrictions
            </h2>
            <p className="mb-3">
              In addition to the tier-specific restrictions set out in
              Section&nbsp;2, the following general restrictions apply to
              all Licensing Tiers:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                You must not use the Content in any manner that is
                unlawful, defamatory, obscene, or that infringes the
                rights of any third party.
              </li>
              <li>
                You must not use the Content in a way that competes
                directly with TheDayAfterAI&apos;s own publication or
                licensing of the Content.
              </li>
              <li>
                You must not remove, obscure, or alter any copyright
                notice, watermark, or attribution on or in the Content.
              </li>
              <li>
                You must not use the Content to train, fine-tune, or
                develop any artificial intelligence or machine learning
                model without the prior written consent of TheDayAfterAI.
              </li>
              <li>
                You must comply with all applicable laws and regulations in
                the use of the Content, including the{" "}
                <em>Copyright Act 1968</em> (Cth) and the{" "}
                <em>Competition and Consumer Act 2010</em> (Cth).
              </li>
            </ul>
          </section>

          {/* 7. Compliance and Audit */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Compliance and Audit
            </h2>
            <p>
              TheDayAfterAI reserves the right to request reasonable
              evidence from the Licensee to verify compliance with these
              Licensing Terms, including evidence of the Licensee&apos;s
              annual revenue for the purposes of confirming tier
              eligibility. The Licensee agrees to cooperate in good faith
              with any such request. TheDayAfterAI reserves the right to
              terminate the licence and pursue legal remedies in the event
              of misuse or breach of these Licensing Terms.
            </p>
          </section>

          {/* 8. Term and Termination */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              8. Term and Termination
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.1 Duration
            </h3>
            <p>
              The licence granted under these Licensing Terms is perpetual
              (subject to termination under Section&nbsp;8.2) from the
              Effective Date.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.2 Termination for Breach
            </h3>
            <p>
              TheDayAfterAI may terminate the licence immediately by
              written notice if the Licensee breaches any term of these
              Licensing Terms and, where the breach is capable of remedy,
              fails to remedy it within 14&nbsp;days of receiving notice
              of the breach.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.3 Effect of Termination
            </h3>
            <p>
              Upon termination, the Licensee must cease all use of the
              Content and, at TheDayAfterAI&apos;s election, either
              return or destroy all copies of the Content in the
              Licensee&apos;s possession or control. TheDayAfterAI may
              request written certification of destruction. Sections&nbsp;3.3
              (Intellectual Property Ownership), 3.4 (Moral Rights), 9
              (Warranties and Liability), and 10 (Indemnification) survive
              termination.
            </p>
          </section>

          {/* 9. Warranties and Liability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              9. Warranties and Liability
            </h2>
            <p>
              The warranty exclusions, Australian Consumer Law notice
              (including Non-Excludable Guarantees), and limitation of
              liability set out in our{" "}
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              (Sections&nbsp;10 and&nbsp;11) apply to Content licensed
              under these Licensing Terms as if set out in full here.
              Without limiting those provisions, TheDayAfterAI does not
              warrant that:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>
                the Content will be fit for any particular purpose of the
                Licensee;
              </li>
              <li>
                the use of the Content will not infringe the rights of any
                third party (the Licensee is responsible for ensuring that
                its use of the Content complies with applicable laws); or
              </li>
              <li>
                the Content will be free from errors, omissions, or
                inaccuracies — see our{" "}
                <Link
                  href="/disclaimer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Disclaimer
                </Link>{" "}
                (Section&nbsp;3) regarding AI-generated content.
              </li>
            </ul>
          </section>

          {/* 10. Indemnification */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              10. Indemnification
            </h2>
            <p>
              The Licensee agrees to indemnify, defend, and hold harmless
              TheDayAfterAI from and against any claims, damages, losses,
              or expenses (including reasonable legal fees) arising from or
              in connection with:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>
                the Licensee&apos;s use of the Content outside the scope
                of the licence granted under these Licensing Terms;
              </li>
              <li>
                the Licensee&apos;s breach of any term of these Licensing
                Terms; or
              </li>
              <li>
                any claim by a third party arising from the Licensee&apos;s
                use of the Content.
              </li>
            </ul>
            <p className="mt-3">
              This is in addition to the general indemnification
              obligations set out in our{" "}
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              (Section&nbsp;12).
            </p>
          </section>

          {/* 11. Changes to These Licensing Terms */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              11. Changes to These Licensing Terms
            </h2>
            <p>
              We may update these Licensing Terms from time to time. Any
              changes will be effective immediately upon posting the
              revised Licensing Terms on this page and updating the
              &ldquo;Last updated&rdquo; date above. Changes apply only
              to Content purchased after the date of the change; Content
              already licensed under a previous version of these Licensing
              Terms continues to be governed by the version in effect at
              the time of purchase. Where we make material changes (for
              example, changes to pricing, tier structure, or licence
              scope), we will use reasonable efforts to notify you — for
              example, by posting a prominent notice on our Website. We
              encourage you to review these Licensing Terms periodically.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              12. Governing Law
            </h2>
            <p>
              These Licensing Terms are governed by and construed in
              accordance with the laws of the Australian Capital Territory
              and the Commonwealth of Australia, without regard to conflict
              of law provisions. You irrevocably submit to the
              non-exclusive jurisdiction of the courts of the Australian
              Capital Territory and any courts entitled to hear appeals
              therefrom.
            </p>
          </section>

          {/* 13. Severability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              13. Severability
            </h2>
            <p>
              If any provision of these Licensing Terms is held to be
              invalid, unlawful, or unenforceable by a court of competent
              jurisdiction, that provision shall be severed and the
              remaining provisions shall continue in full force and effect.
              Where possible, the invalid provision shall be interpreted in
              a manner consistent with applicable law to reflect its
              original intent.
            </p>
          </section>

          {/* 14. Entire Agreement */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              14. Entire Agreement
            </h2>
            <p>
              These Licensing Terms, together with our{" "}
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                href="/disclaimer"
                className="text-[var(--accent)] hover:underline"
              >
                Disclaimer
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
                href="/ethics-policy"
                className="text-[var(--accent)] hover:underline"
              >
                Editorial Independence and Ethics Policy
              </Link>
              , constitute the entire agreement between you and
              TheDayAfterAI regarding the licensing of Content and
              supersede all prior or contemporaneous understandings
              specific to such Content.
            </p>
          </section>

          {/* 15. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              15. Contact Us
            </h2>
            <p>
              For assistance in determining the appropriate Licensing Tier
              or for any enquiries regarding these Licensing Terms, please
              email us at{" "}
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
