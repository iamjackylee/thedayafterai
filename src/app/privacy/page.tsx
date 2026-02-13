import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Data Protection and User Privacy — TheDayAfterAI News",
  description:
    "Learn how TheDayAfterAI protects your privacy and handles your data. Our privacy policy outlines how we collect, use, and safeguard your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--muted)]">Last updated: February 13, 2026</p>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Preamble */}
          <p>
            Welcome to <strong className="text-white">TheDayAfterAI News</strong> (&ldquo;TheDayAfterAI&rdquo;,
            &ldquo;we&rdquo;, &ldquo;our&rdquo; or &ldquo;us&rdquo;). We curate artificial intelligence news from
            various sources and present it on thedayafterai.com (&ldquo;Website&rdquo;). This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you interact with our curated content and services. It should be read together
            with our{" "}
            <Link href="/terms" className="text-[var(--accent)] hover:underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/disclaimer" className="text-[var(--accent)] hover:underline">
              Disclaimer
            </Link>
            , and{" "}
            <Link href="/ethics-policy" className="text-[var(--accent)] hover:underline">
              Editorial Independence and Ethics Policy
            </Link>
            . To the extent of any inconsistency between this Privacy Policy and the Terms of
            Service, the Terms of Service prevail. Please read this policy carefully. By accessing
            or using our Website, you agree to the terms outlined in this Privacy Policy.
          </p>
          <p>
            We are committed to managing your personal information in accordance with the{" "}
            <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles
            (&ldquo;APPs&rdquo;) contained in that Act, as well as any other applicable privacy
            legislation in the jurisdictions in which we operate or from which our Website is
            accessed.
          </p>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              1. Information We Collect
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">1.1 Personal Information</h3>
            <p className="mb-3">
              We may collect personally identifiable information (&ldquo;Personal Information&rdquo;)
              that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Register an Account:</strong> When you create an
                account on our Website, we may collect your name, email address, and other contact
                information.
              </li>
              <li>
                <strong className="text-white">Subscribe to Newsletters:</strong> When you subscribe
                to our newsletters or other communications, we may collect your email address.
              </li>
              <li>
                <strong className="text-white">Contact Us:</strong> When you contact us for support
                or inquiries, we may collect your name, email address, phone number, and other
                relevant information.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">1.2 Automatically Collected Information</h3>
            <p className="mb-3">
              We may automatically collect certain information whenever you interact with our
              Website. Some of this information (for example, IP addresses) may constitute Personal
              Information under the <em>Privacy Act 1988</em> (Cth) where it can reasonably be used
              to identify an individual. Automatically collected information may include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Usage Data:</strong> Information about how you use our
                Website, such as pages visited, time spent on pages, and navigation paths.
              </li>
              <li>
                <strong className="text-white">Device and Network Information:</strong> Information
                about the device and network you use to access our Website, including IP address,
                browser type, operating system, and device identifiers.
              </li>
              <li>
                <strong className="text-white">Cookies and Tracking Technologies:</strong>{" "}
                Information collected through cookies, web beacons, and similar technologies (see
                Section 4 for more details).
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">1.3 Third-Party Information</h3>
            <p>
              We may receive information about you from third parties, such as social media
              platforms, if you choose to link your account or interact with our Website through
              these platforms.
            </p>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect in the following ways:</p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.1 To Provide and Improve Our Services
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Account Management:</strong> To create and manage your
                account, authenticate your identity, and provide access to personalized features.
              </li>
              <li>
                <strong className="text-white">Content Delivery:</strong> To deliver curated news,
                updates, and other content tailored to your interests.
              </li>
              <li>
                <strong className="text-white">Website Improvement:</strong> To analyze usage
                patterns and improve the functionality, content, and user experience of our Website.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">2.2 Communication</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Newsletters and Updates:</strong> To send you
                newsletters, promotional materials, and other communications related to our services.
              </li>
              <li>
                <strong className="text-white">Customer Support:</strong> To respond to your
                inquiries, provide support, and address any issues you may encounter.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.3 Marketing and Advertising
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Personalised Advertising:</strong> We may display
                personalised advertisements based on your interests and browsing behaviour. You can
                opt out of personalised advertising by adjusting your cookie preferences through
                your browser settings or by using industry opt-out tools such as the Digital
                Advertising Alliance&apos;s opt-out page.
              </li>
              <li>
                <strong className="text-white">Third-Party Advertising Partners:</strong> We may
                share limited information with third-party advertising partners, who may use cookies
                and similar technologies to collect or receive information from our Website and
                elsewhere on the internet to provide measurement services and targeted ads. We
                encourage you to review the privacy policies of these third parties. We do not sell
                your Personal Information.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">2.4 Legal and Security</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Compliance:</strong> To comply with legal obligations,
                respond to lawful requests, and enforce our policies.
              </li>
              <li>
                <strong className="text-white">Security:</strong> To protect against fraud,
                unauthorized access, and other security threats.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.5 Protection of Sources and Confidential Contacts
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Where individuals contact us as journalistic sources or provide information on a
                confidential or anonymous basis, we treat their contact details and identifying
                information as sensitive.
              </li>
              <li>
                Access to such information is restricted to authorised team members and it is used
                only for editorial purposes consistent with our Editorial Independence and Ethics
                Policy. We do not disclose the identities of confidential sources unless legally
                required to do so. Where applicable, we rely on the journalist privilege under
                section&nbsp;126K of the <em>Evidence Act 1995</em> (Cth) to protect the identity
                of our confidential sources.
              </li>
            </ul>
          </section>

          {/* 3. How We Share Your Information */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              3. How We Share Your Information
            </h2>
            <p className="mb-4">We may share your information in the following circumstances:</p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.1 With Service Providers
            </h3>
            <p className="mb-3">
              We may share your information with third-party service providers who perform services
              on our behalf, such as:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Hosting Providers:</strong> To host and maintain our
                Website. Our Website is currently hosted on third-party infrastructure. The hosting
                provider may collect server logs, which can include IP addresses, request timestamps,
                and referring URLs.
              </li>
              <li>
                <strong className="text-white">Email Service Providers:</strong> To manage our email
                communications and newsletters.
              </li>
              <li>
                <strong className="text-white">Analytics Providers:</strong> We may use third-party
                analytics tools to understand how our Website is used. Where we do so, these
                providers may collect information about your use of the Website, including your IP
                address, browser type, device information, and browsing behaviour. We will update
                this section to identify specific analytics providers as and when they are adopted.
              </li>
              <li>
                <strong className="text-white">API Service Providers:</strong> We use third-party
                APIs (such as the YouTube Data API and news aggregation APIs) to deliver content on
                the Website. Your interaction with embedded content from these providers may be
                subject to their own privacy policies.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.2 For Business Transfers
            </h3>
            <p>
              In the event of a merger, acquisition, or sale of all or a portion of our assets, your
              information may be transferred as part of the transaction. Where practicable, we will
              notify you before your Personal Information is transferred and becomes subject to a
              different privacy policy.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">3.3 With Your Consent</h3>
            <p>
              We may share your information with third parties when you have given us explicit
              consent to do so.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">3.4 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid
              legal requests, such as subpoenas or court orders.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.5 Protecting Rights and Safety
            </h3>
            <p>
              We may disclose your information to protect our rights, privacy, safety, or property,
              and that of our users and the public.
            </p>
          </section>

          {/* 4. Cookies and Tracking Technologies */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              4. Cookies and Tracking Technologies
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">4.1 Cookies</h3>
            <p className="mb-3">
              Cookies are small data files stored on your device that help us provide a better user
              experience. We use cookies for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Essential Cookies:</strong> To enable core
                functionality of the Website.
              </li>
              <li>
                <strong className="text-white">Performance Cookies:</strong> To collect information
                about how visitors use the Website.
              </li>
              <li>
                <strong className="text-white">Functional Cookies:</strong> To remember your
                preferences and settings.
              </li>
              <li>
                <strong className="text-white">Advertising Cookies:</strong> To deliver personalized
                advertisements.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">4.2 Managing Cookies</h3>
            <p>
              You can control the use of cookies through your browser settings. However, disabling
              cookies may affect the functionality of our Website.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.3 Other Tracking Technologies
            </h3>
            <p>
              We may use web beacons, pixel tags, and similar technologies to monitor and analyse
              the usage of our Website. Please note that third-party content providers (including
              embedded video players and news APIs) may also use cookies and tracking technologies
              on our Website over which we have no control. We encourage you to review the privacy
              policies of these third parties.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              4.4 Third-Party Content and Embedded Features
            </h3>
            <p>
              Our Website may include embedded content (e.g., videos, images, articles) from
              third-party websites. Embedded content from other websites behaves in the same way as
              if the user has visited the other website. These websites may collect data about you,
              use cookies, embed additional third-party tracking, and monitor your interaction with
              that embedded content. We do not control these third-party technologies and recommend
              reviewing the privacy policies of any third-party providers.
            </p>
          </section>

          {/* 5. Data Security */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              5. Data Security
            </h2>
            <p className="mb-3">
              We implement appropriate technical and organizational measures to protect your
              information against unauthorized access, alteration, disclosure, or destruction. These
              measures include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Encryption:</strong> Using encryption to secure data
                transmission.
              </li>
              <li>
                <strong className="text-white">Access Controls:</strong> Restricting access to your
                information to authorized personnel only.
              </li>
            </ul>
            <p className="mt-3">
              Despite these measures, no method of transmission over the internet or electronic
              storage is 100% secure. Therefore, we cannot guarantee absolute security of your
              information.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              5.2 Data Breach Notification
            </h3>
            <p>
              In the event of an eligible data breach within the meaning of Part&nbsp;IIIC of
              the <em>Privacy Act 1988</em> (Cth) (the Notifiable Data Breaches scheme), we will
              take all steps required under that Act, including notifying affected individuals and
              the Office of the Australian Information Commissioner (OAIC) as soon as practicable.
              Where a data breach affects individuals in the European Economic Area, we will also
              comply with our notification obligations under Articles&nbsp;33 and&nbsp;34 of the
              GDPR.
            </p>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. Data Retention
            </h2>
            <p className="mb-3">
              We retain your Personal Information only for as long as necessary to fulfil the
              purposes outlined in this Privacy Policy, unless a longer retention period is required
              or permitted by law. As a general guide:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Account information</strong> — retained for the life
                of your account and for up to 12&nbsp;months after account closure, unless we are
                required by law to retain it for longer.
              </li>
              <li>
                <strong className="text-white">Contact and support enquiries</strong> — retained for
                up to 24&nbsp;months from the date of the last communication.
              </li>
              <li>
                <strong className="text-white">Server logs and analytics data</strong> — retained
                for up to 26&nbsp;months, after which they are aggregated or deleted.
              </li>
              <li>
                <strong className="text-white">Marketing and newsletter data</strong> — retained
                until you unsubscribe, after which your data will be deleted within 30&nbsp;days.
              </li>
            </ul>
            <p className="mt-3">
              When your information is no longer needed, we will securely delete or anonymise it in
              accordance with our data retention procedures.
            </p>
          </section>

          {/* 7. Your Rights and Choices */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Your Rights and Choices
            </h2>
            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.1 Rights Under the Australian Privacy Principles
            </h3>
            <p className="mb-3">
              Under the <em>Privacy Act 1988</em> (Cth) and the APPs, you have the following
              rights in relation to Personal Information we hold about you:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Access (APP&nbsp;12):</strong> You have the right to
                request access to the Personal Information we hold about you. We will respond to
                your request within a reasonable period (and in any event within 30&nbsp;days).
              </li>
              <li>
                <strong className="text-white">Correction (APP&nbsp;13):</strong> You have the right
                to request that we correct any Personal Information that is inaccurate, out of date,
                incomplete, irrelevant, or misleading.
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us using the details in Section&nbsp;16
              below. We may need to verify your identity before processing your request.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              7.2 Additional Rights
            </h3>
            <p className="mb-3">
              Depending on your jurisdiction, you may also have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Data Portability:</strong> You may have the right to
                receive a copy of your Personal Information in a structured, machine-readable format.
              </li>
              <li>
                <strong className="text-white">Deletion:</strong> You may request the deletion of
                your Personal Information, subject to certain exceptions (for example, where we are
                required by law to retain it).
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.3 Opt-Out and Consent Withdrawal</h3>
            <p>
              You can opt out of receiving promotional communications by following the unsubscribe
              instructions included in such emails or by contacting us directly. Where we process
              your Personal Information on the basis of your consent, you have the right to withdraw
              that consent at any time by contacting us. Withdrawal of consent does not affect the
              lawfulness of processing carried out before the withdrawal.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.4 Do Not Track</h3>
            <p>
              Our Website does not respond to &ldquo;Do Not Track&rdquo; signals. However, you can
              manage your tracking preferences through your browser settings. Please be aware that
              third-party sites linked from our Website may also not honour &ldquo;Do Not
              Track&rdquo; signals.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.5 Complaints</h3>
            <p>
              If you believe we have breached the APPs or mishandled your Personal Information, you
              may lodge a complaint with us using the contact details in Section&nbsp;16. We will
              acknowledge your complaint within 7&nbsp;days and endeavour to resolve it within
              30&nbsp;days. If you are not satisfied with our response, you have the right to lodge
              a complaint with the Office of the Australian Information Commissioner (OAIC) at{" "}
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

          {/* 8. GDPR Rights */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              8. Rights for European Economic Area (EEA) Residents (GDPR)
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.1 Overview of GDPR Rights
            </h3>
            <p>
              If you are a resident of the European Economic Area (EEA), you have certain data
              protection rights under the General Data Protection Regulation (GDPR). We are
              committed to helping you exercise these rights with respect to the Personal Information
              we collect and process.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.2 Lawful Basis for Processing
            </h3>
            <p className="mb-3">
              Under GDPR Article&nbsp;6, we process your Personal Information on the following
              lawful bases:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Consent</strong> — for marketing communications and
                non-essential cookies (Article&nbsp;6(1)(a)).
              </li>
              <li>
                <strong className="text-white">Legitimate Interests</strong> — for website analytics,
                fraud prevention, and improving our services, where those interests are not overridden
                by your data protection rights (Article&nbsp;6(1)(f)).
              </li>
              <li>
                <strong className="text-white">Legal Obligation</strong> — where we are required to
                process your data to comply with applicable law (Article&nbsp;6(1)(c)).
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.3 Specific GDPR Rights
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Right to Access:</strong> You have the right to
                request copies of your Personal Information that we hold.
              </li>
              <li>
                <strong className="text-white">Right to Rectification:</strong> You have the right to
                request that we correct any information you believe is inaccurate or incomplete.
              </li>
              <li>
                <strong className="text-white">Right to Erasure:</strong> You have the right to
                request that we erase your Personal Information under certain conditions.
              </li>
              <li>
                <strong className="text-white">Right to Restrict Processing:</strong> You have the
                right to request that we restrict the processing of your Personal Information under
                certain conditions.
              </li>
              <li>
                <strong className="text-white">Right to Object to Processing:</strong> You have the
                right to object to our processing of your Personal Information under certain
                conditions.
              </li>
              <li>
                <strong className="text-white">Right to Data Portability:</strong> You have the right
                to request that we transfer your data to another organization, or directly to you,
                under certain conditions.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              8.4 How to Exercise Your GDPR Rights
            </h3>
            <p>
              To exercise any of these rights, please{" "}
              <Link href="/contact" className="text-[var(--accent)] hover:underline">
                contact us
              </Link>
              . We may need to verify your identity before responding to such requests.
            </p>
          </section>

          {/* 9. CCPA Rights */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              9. Rights for California Residents (CCPA)
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.1 Overview of CCPA Rights
            </h3>
            <p>
              If you are a California resident, you have specific rights regarding your Personal
              Information under the California Consumer Privacy Act (CCPA). While we operate
              primarily in Australia, we are committed to respecting the privacy rights of all our
              users, including those in California.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.2 Specific CCPA Rights
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Right to Know:</strong> You have the right to request
                that we disclose certain information to you about our collection and use of your
                Personal Information over the past 12 months. This includes the categories of
                Personal Information collected, sources, purposes, and third parties with whom we
                share it.
              </li>
              <li>
                <strong className="text-white">Right to Delete:</strong> You have the right to
                request that we delete any Personal Information we have collected from you, subject
                to certain exceptions.
              </li>
              <li>
                <strong className="text-white">Right to Opt-Out of Sale:</strong> We do not sell
                Personal Information. If we decide to sell Personal Information in the future, we
                will update this Privacy Policy accordingly and provide you with the right to
                opt-out.
              </li>
              <li>
                <strong className="text-white">Right to Non-Discrimination:</strong> We will not
                discriminate against you for exercising any of your CCPA rights.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.3 How to Exercise Your CCPA Rights
            </h3>
            <p>
              To exercise any of these rights, please{" "}
              <Link href="/contact" className="text-[var(--accent)] hover:underline">
                contact us
              </Link>
              . We may need to verify your identity before processing your request, which may
              require you to provide additional information.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">9.4 Authorized Agents</h3>
            <p>
              You may designate an authorized agent to make a request on your behalf. The authorized
              agent must have written permission to act on your behalf, and we may require you to
              verify your identity directly with us.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.5 Minors Under 16 Years of Age
            </h3>
            <p>
              We do not knowingly collect or sell Personal Information from minors under 16 years of
              age without affirmative authorization. If you are under 16 years old, please do not
              provide any Personal Information to us. If we become aware that we have collected
              Personal Information from a minor under 16 years of age without verification of
              parental consent, we will take steps to remove that information from our servers.
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              10. Children&apos;s Privacy
            </h2>
            <p>
              Our Website is not intended for children under the age of 13. We do not knowingly
              collect Personal Information from children under 13. If we become aware that a child
              under 13 has provided us with Personal Information, we will take steps to delete such
              information promptly. Under the APPs, we treat Personal Information of children as
              sensitive where the child may not have the capacity to consent, and we will seek
              parental or guardian consent where required.
            </p>
          </section>

          {/* 11. Third-Party Links */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              11. Third-Party Links
            </h2>
            <p>
              As a news curator, we provide links to third-party websites for your convenience and
              information. Please note that when you access these links, you will be subject to the
              privacy policies and practices of those third-party sites. We are not responsible for
              the content or privacy practices of these third parties, and we encourage you to review
              their privacy policies.
            </p>
          </section>

          {/* 12. International Data Transfers */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              12. International Data Transfers
            </h2>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.1 Transfer of Personal Information
            </h3>
            <p>
              Your Personal Information may be transferred to and processed in countries other than
              the country in which you are resident, including the United States. These countries
              may have data protection laws that differ from those of your country.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.2 Safeguards for Cross-Border Transfers
            </h3>
            <p className="mb-3">
              Where your Personal Information is transferred overseas, we take reasonable steps to
              comply with:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">APP&nbsp;8</strong> — Before disclosing Personal
                Information to an overseas recipient, we take reasonable steps to ensure that the
                recipient does not breach the APPs in relation to that information.
              </li>
              <li>
                <strong className="text-white">GDPR</strong> — Where we transfer Personal
                Information of EEA residents outside the EEA, we rely on appropriate safeguards
                such as Standard Contractual Clauses (SCCs) approved by the European Commission, or
                transfers to countries that have received an adequacy decision.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.3 Hosting and Third-Party Infrastructure
            </h3>
            <p>
              Our Website is hosted on third-party infrastructure, which may use servers located in
              the United States and other countries. We require our hosting providers and service
              providers to implement appropriate technical and organisational safeguards to protect
              your Personal Information.
            </p>
          </section>

          {/* 13. Changes to This Privacy Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              13. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be effective
              immediately upon posting the revised policy on our Website and updating the
              &ldquo;Last updated&rdquo; date at the top of this page. Where we make material
              changes to this Privacy Policy (for example, changes to the types of Personal
              Information we collect or the purposes for which we use it), we will use reasonable
              efforts to notify you — for example, by posting a prominent notice on our Website or,
              where we hold your email address, by sending you an email. We encourage you to review
              this Privacy Policy periodically to stay informed about how we are protecting your
              information.
            </p>
          </section>

          {/* 14. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              14. Governing Law
            </h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of the
              Australian Capital Territory and the Commonwealth of Australia, including the{" "}
              <em>Privacy Act 1988</em> (Cth), without regard to conflict of law provisions. You
              irrevocably submit to the non-exclusive jurisdiction of the courts of the Australian
              Capital Territory and any courts entitled to hear appeals therefrom.
            </p>
          </section>

          {/* 15. Severability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              15. Severability
            </h2>
            <p>
              If any provision of this Privacy Policy is held to be invalid, unlawful, or
              unenforceable by a court of competent jurisdiction, that provision shall be severed
              and the remaining provisions shall continue in full force and effect. Where possible,
              the invalid provision shall be interpreted in a manner consistent with applicable law
              to reflect its original intent.
            </p>
          </section>

          {/* 16. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              16. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices,
              please{" "}
              <Link href="/contact" className="text-[var(--accent)] hover:underline">
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
