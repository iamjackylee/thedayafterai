import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Advertise with Us | Reach Your Audience — TheDayAfterAI News",
  description:
    "Explore advertising opportunities on TheDayAfterAI — banner ads, sidebar ads, sponsored content, video advertising, and custom solutions to reach AI enthusiasts and decision-makers.",
};

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Advertise with Us
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Last updated: February 13, 2026
          </p>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Preamble */}
          <p>
            At{" "}
            <strong className="text-white">TheDayAfterAI News</strong>, we
            offer a range of advertising opportunities designed to connect
            you with our engaged audience of artificial intelligence
            enthusiasts, professionals, and decision-makers. Whether you
            aim to promote your products, services, or enhance brand
            awareness, our platform provides effective solutions tailored
            to your marketing objectives.
          </p>
          <p>
            All advertising on this Website is subject to these terms, our{" "}
            <Link
              href="/terms"
              className="text-[var(--accent)] hover:underline"
            >
              Terms of Service
            </Link>
            , and our{" "}
            <Link
              href="/ethics-policy"
              className="text-[var(--accent)] hover:underline"
            >
              Ethics Policy
            </Link>{" "}
            (Section&nbsp;7 — Advertising, Sponsored Content, and
            Commercial Relationships). To the extent of any inconsistency
            between this page and the Terms of Service, the Terms of
            Service prevail.
          </p>

          {/* 1. Why Advertise with Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              1. Why Advertise with Us
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Targeted Audience:</strong>{" "}
                Reach a dedicated community interested in the latest
                developments and trends in artificial intelligence.
              </li>
              <li>
                <strong className="text-white">High Engagement:</strong>{" "}
                Benefit from our high-quality editorial content and loyal
                readership, ensuring your message resonates with an
                invested audience.
              </li>
              <li>
                <strong className="text-white">
                  Flexible Advertising Options:
                </strong>{" "}
                Choose from banner ads, sidebar placements, sponsored
                content, video advertising, and fully custom solutions.
              </li>
              <li>
                <strong className="text-white">
                  Competitive Pricing:
                </strong>{" "}
                Achieve excellent value for your advertising investment
                with transparent, competitive rates.
              </li>
              <li>
                <strong className="text-white">Custom Solutions:</strong>{" "}
                Receive tailored advertising packages designed to meet your
                specific requirements and marketing goals.
              </li>
            </ul>
          </section>

          {/* 2. Our Audience */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              2. Our Audience
            </h2>
            <p className="mb-3">
              TheDayAfterAI reaches a global readership with a strong
              presence in Australia, Hong Kong, and English-speaking
              markets worldwide. Our audience includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                AI researchers, engineers, and data scientists
              </li>
              <li>
                Technology executives and decision-makers
              </li>
              <li>
                Start-up founders and venture capital professionals
              </li>
              <li>
                Students and educators in STEM fields
              </li>
              <li>
                General technology enthusiasts and early adopters
              </li>
            </ul>
            <p className="mt-3">
              For detailed audience demographics, traffic data, and a
              downloadable media kit, please{" "}
              <Link
                href="/contact"
                className="text-[var(--accent)] hover:underline"
              >
                contact our advertising team
              </Link>
              .
            </p>
          </section>

          {/* 3. Advertising Opportunities */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              3. Advertising Opportunities
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.1 Banner Ads
            </h3>
            <p className="mb-3">
              Prominently display your brand with our banner ad
              placements. We offer six ad boxes at the top of our main page
              and six ad spaces at the top of 11 subpages across different
              news categories, providing prime real estate for maximum
              exposure. Your ad will appear across all 12 pages (main page
              and subpages).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2 mb-2">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 pr-4 text-white font-semibold">
                      Placement
                    </th>
                    <th className="text-right py-2 pl-4 text-white font-semibold">
                      Monthly Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">1 Box</td>
                    <td className="py-2 pl-4 text-right">AU$100</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">1 Ad across 2 Boxes</td>
                    <td className="py-2 pl-4 text-right">AU$180</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">1 Ad across 3 Boxes</td>
                    <td className="py-2 pl-4 text-right">AU$240</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      Full Banner (6 Boxes)
                    </td>
                    <td className="py-2 pl-4 text-right">AU$390</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.2 Sidebar Ads
            </h3>
            <p>
              Achieve continuous visibility as users navigate our content.
              Sidebar ads are available on our article pages, giving your
              brand exposure in the latest 30 articles across all news
              categories.
            </p>
            <p className="mt-2">
              <strong className="text-white">Pricing:</strong>{" "}
              AU$100 per box per month.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.3 Sponsored Content
            </h3>
            <p>
              Engage our audience with sponsored articles seamlessly
              integrated into our editorial flow. All sponsored content is
              clearly labelled in accordance with our{" "}
              <Link
                href="/ethics-policy"
                className="text-[var(--accent)] hover:underline"
              >
                Ethics Policy
              </Link>{" "}
              (Section&nbsp;7) and section&nbsp;18 of the{" "}
              <em>Competition and Consumer Act 2010</em> (Cth). Sponsored
              content will also be featured on all our social media
              channels on the date of posting and highlighted in our
              featured news segment.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-3 mb-2">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 pr-4 text-white font-semibold">
                      Type
                    </th>
                    <th className="text-right py-2 pl-4 text-white font-semibold">
                      Starting From
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      Provided Articles
                    </td>
                    <td className="py-2 pl-4 text-right">AU$800</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      Interviews and Features
                    </td>
                    <td className="py-2 pl-4 text-right">AU$1,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm">
              Sponsored articles are subject to editorial review by our
              team to ensure quality, accuracy, and alignment with our
              editorial standards. Typical review turnaround is
              5–7&nbsp;business days from submission of the final
              creative.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.4 Video Advertising
            </h3>
            <p>
              Capture attention with video ads embedded within our video
              content. Opt for embedded video ads on the main page or
              subpages to maximise visibility.
            </p>
            <p className="mt-2">
              <strong className="text-white">Pricing:</strong>{" "}
              AU$200 per month.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.5 Custom Advertising Solutions
            </h3>
            <p>
              We offer bespoke advertising solutions tailored to your
              specific needs — including multi-channel campaigns, event
              sponsorships, and long-term partnership arrangements.
              Contact us to discuss custom packages that align with your
              marketing goals.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.6 Campaign Duration and Discounts
            </h3>
            <p className="mb-3">
              All rates above are for monthly campaigns. Discounted rates
              are available for longer commitments:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Quarterly</strong>{" "}
                (3&nbsp;months): 10% discount on the applicable monthly
                rate.
              </li>
              <li>
                <strong className="text-white">Annual</strong>{" "}
                (12&nbsp;months): 20% discount on the applicable monthly
                rate.
              </li>
            </ul>
            <p className="mt-2 text-sm">
              Discounts apply to standard rate card pricing. Custom
              solutions and sponsored content are quoted individually.
            </p>
          </section>

          {/* 4. Ad Specifications */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              4. Ad Specifications
            </h2>
            <p className="mb-3">
              Please ensure your ad creative meets the following
              specifications. Ads that do not meet these requirements may
              be returned for revision.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2 mb-2">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 pr-4 text-white font-semibold">
                      Format
                    </th>
                    <th className="text-left py-2 px-4 text-white font-semibold">
                      Dimensions
                    </th>
                    <th className="text-left py-2 px-4 text-white font-semibold">
                      File Types
                    </th>
                    <th className="text-left py-2 pl-4 text-white font-semibold">
                      Max Size
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">Banner (1&nbsp;Box)</td>
                    <td className="py-2 px-4">300 &times; 250 px</td>
                    <td className="py-2 px-4">JPG, PNG, GIF, SVG</td>
                    <td className="py-2 pl-4">150 KB</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      Banner (2&nbsp;Boxes)
                    </td>
                    <td className="py-2 px-4">600 &times; 250 px</td>
                    <td className="py-2 px-4">JPG, PNG, GIF, SVG</td>
                    <td className="py-2 pl-4">200 KB</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      Banner (3&nbsp;Boxes)
                    </td>
                    <td className="py-2 px-4">900 &times; 250 px</td>
                    <td className="py-2 px-4">JPG, PNG, GIF, SVG</td>
                    <td className="py-2 pl-4">250 KB</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      Full Banner (6&nbsp;Boxes)
                    </td>
                    <td className="py-2 px-4">1800 &times; 250 px</td>
                    <td className="py-2 px-4">JPG, PNG, GIF, SVG</td>
                    <td className="py-2 pl-4">350 KB</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">Sidebar</td>
                    <td className="py-2 px-4">300 &times; 250 px</td>
                    <td className="py-2 px-4">JPG, PNG, GIF, SVG</td>
                    <td className="py-2 pl-4">150 KB</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">Video</td>
                    <td className="py-2 px-4">16:9 aspect ratio</td>
                    <td className="py-2 px-4">MP4, WebM</td>
                    <td className="py-2 pl-4">15 MB (max 30s)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm">
              Animated GIFs must loop no more than 3 times and must not
              contain flashing elements that could trigger photosensitive
              conditions. All creatives must include a clickable
              destination URL.
            </p>
          </section>

          {/* 5. Advertising Policies */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              5. Advertising Policies
            </h2>
            <p className="mb-3">
              To maintain the integrity and quality of our content, we
              adhere to strict advertising policies consistent with the{" "}
              <a
                href="https://aana.com.au/self-regulation/codes-guidelines/code-of-ethics/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                AANA Code of Ethics
              </a>
              , section&nbsp;18 of the{" "}
              <em>Competition and Consumer Act 2010</em> (Cth)
              (prohibition on misleading or deceptive conduct), and our{" "}
              <Link
                href="/ethics-policy"
                className="text-[var(--accent)] hover:underline"
              >
                Ethics Policy
              </Link>{" "}
              (Section&nbsp;7).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.1 Prohibited Content
            </h3>
            <p className="mb-2">
              The following content will not be accepted:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Illegal products or services under Australian or
                applicable international law.
              </li>
              <li>
                Offensive, inappropriate, or discriminatory material,
                including material that contravenes the{" "}
                <em>Racial Discrimination Act 1975</em> (Cth) or
                equivalent legislation.
              </li>
              <li>
                Misleading or deceptive advertisements, including
                unsubstantiated claims.
              </li>
              <li>
                Content that violates intellectual property rights.
              </li>
              <li>
                Financial product advertising that may breach the{" "}
                <em>Corporations Act 2001</em> (Cth) or ASIC regulatory
                guidance, including advertisements that could be construed
                as financial product advice without an appropriate AFSL.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.2 Quality Standards
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                All advertisements must be professional, accurate, and
                free from material errors.
              </li>
              <li>
                Visual and audio elements must be of high quality and
                appropriate for our audience.
              </li>
              <li>
                Advertisements must not autoplay audio, use deceptive
                close buttons, or employ other dark patterns.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.3 Approval Process
            </h3>
            <p>
              All advertisements are subject to review and approval by our
              advertising team before publication. We reserve the right to
              reject or request modifications to any advertisement that
              does not comply with our policies, at our sole discretion.
              Rejection of an advertisement does not obligate TheDayAfterAI
              to provide reasons beyond a reference to the relevant policy
              provision.
            </p>
          </section>

          {/* 6. How to Get Started */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. How to Get Started
            </h2>
            <p className="mb-4">
              To start advertising with{" "}
              <strong className="text-white">TheDayAfterAI</strong>,
              follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong className="text-white">Contact Us</strong> —
                Reach out to our advertising team via our{" "}
                <Link
                  href="/contact"
                  className="text-[var(--accent)] hover:underline"
                >
                  contact page
                </Link>{" "}
                with your enquiry, including your target audience, budget,
                and preferred ad format.
              </li>
              <li>
                <strong className="text-white">
                  Discuss Your Needs
                </strong>{" "}
                — Our team will discuss your marketing objectives and
                recommend suitable advertising options tailored to your
                goals.
              </li>
              <li>
                <strong className="text-white">Agree on Terms</strong> —
                We will provide a proposal outlining the ad format,
                placement, duration, and pricing. A formal advertising
                agreement will be provided for campaigns over AU$500.
              </li>
              <li>
                <strong className="text-white">
                  Submit Your Creative
                </strong>{" "}
                — Once terms are agreed, submit your ad creative following
                the specifications in Section&nbsp;4. Our team will review
                and approve your advertisement, typically within
                3–5&nbsp;business days.
              </li>
              <li>
                <strong className="text-white">Go Live</strong> — Your
                campaign goes live on the agreed start date. We will
                provide a campaign summary report at the end of each
                billing period, including impressions served and
                click-through data where available.
              </li>
            </ol>
          </section>

          {/* 7. Advertiser Terms */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Advertiser Terms
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.1 Payment
            </h3>
            <p>
              Payment is due in advance of the campaign start date unless
              otherwise agreed in writing. We accept payment via bank
              transfer or our payment processor. All invoices are payable
              within 14&nbsp;days of issue.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.2 GST
            </h3>
            <p>
              All prices are quoted in Australian Dollars (AUD) and are
              inclusive of GST where the supply is subject to the{" "}
              <em>
                A New Tax System (Goods and Services Tax) Act 1999
              </em>{" "}
              (Cth). A tax invoice will be provided with each payment.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.3 Cancellation
            </h3>
            <p>
              Campaigns may be cancelled with at least 14&nbsp;days
              written notice before the next billing period. Campaigns
              cancelled after the billing period has commenced are
              non-refundable for that period. Sponsored content that has
              already been published cannot be retracted, though the
              sponsorship label will remain.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.4 Content Ownership and Licence
            </h3>
            <p>
              You retain ownership of all ad creative you provide to us.
              By submitting ad creative, you grant TheDayAfterAI a
              non-exclusive, royalty-free licence to display, reproduce,
              and distribute the creative for the purpose of fulfilling
              the advertising campaign. You represent and warrant that
              your ad creative does not infringe the intellectual property
              or other rights of any third party.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.5 Advertiser Representations
            </h3>
            <p className="mb-3">
              By placing an advertisement with TheDayAfterAI, you
              represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                the ad creative complies with all applicable laws and
                regulations, including the{" "}
                <em>Competition and Consumer Act 2010</em> (Cth) and the
                AANA Code of Ethics;
              </li>
              <li>
                you have all necessary rights, licences, and permissions
                to use the content in the advertisement; and
              </li>
              <li>
                the advertisement is not false, misleading, or deceptive.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.6 Indemnification
            </h3>
            <p>
              You agree to indemnify, defend, and hold harmless
              TheDayAfterAI from any claims, damages, or expenses arising
              from your advertisement, including any claim that the
              advertisement infringes the rights of a third party or
              breaches applicable law. This is in addition to the general
              indemnification obligations in our{" "}
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              (Section&nbsp;12).
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.7 Liability
            </h3>
            <p>
              The warranty exclusions, Australian Consumer Law notice, and
              limitation of liability set out in our{" "}
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              (Sections&nbsp;10 and&nbsp;11) apply to advertising services
              provided under this page. TheDayAfterAI does not guarantee
              any specific level of impressions, clicks, or conversions.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.8 Pricing Changes
            </h3>
            <p>
              The rates published on this page are current as of the
              &ldquo;Last updated&rdquo; date above. We reserve the right
              to change our pricing at any time. Any price change will not
              affect campaigns that have already been confirmed and paid
              for.
            </p>
          </section>

          {/* 8. Privacy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              8. Privacy
            </h2>
            <p>
              Any personal information you provide in connection with an
              advertising enquiry or campaign will be handled in
              accordance with our{" "}
              <Link
                href="/privacy"
                className="text-[var(--accent)] hover:underline"
              >
                Privacy Policy
              </Link>
              , the <em>Privacy Act 1988</em> (Cth), and the Australian
              Privacy Principles. We do not share advertiser contact
              details with third parties except as required to fulfil the
              advertising service (for example, with our payment
              processor).
            </p>
          </section>

          {/* 9. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              9. Contact Us
            </h2>
            <p>
              We&apos;re excited to partner with you. To explore
              advertising opportunities or request a media kit, please{" "}
              <Link
                href="/contact"
                className="text-[var(--accent)] hover:underline"
              >
                contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
