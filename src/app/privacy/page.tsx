import type { Metadata } from "next";
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
          <p className="text-sm text-[var(--muted)]">Last updated: December 5, 2025</p>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Preamble */}
          <p>
            Welcome to <strong className="text-white">TheDayAfterAI</strong> (&ldquo;we&rdquo;,
            &ldquo;our&rdquo; or &ldquo;us&rdquo;). We curate artificial intelligence news from
            various sources and present it on thedayafterai.com (&ldquo;Website&rdquo;). This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you interact with our curated content and services. Please read this policy
            carefully. By accessing or using our Website, you agree to the terms outlined in this
            Privacy Policy.
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

            <h3 className="text-base font-semibold text-white mt-6 mb-2">1.2 Non-Personal Information</h3>
            <p className="mb-3">
              We may collect non-personally identifiable information (&ldquo;Non-Personal
              Information&rdquo;) about you whenever you interact with our Website. This may include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Usage Data:</strong> Information about how you use our
                Website, such as pages visited, time spent on pages, and navigation paths.
              </li>
              <li>
                <strong className="text-white">Device Information:</strong> Information about the
                device you use to access our Website, including IP address, browser type, operating
                system, and device identifiers.
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
                <strong className="text-white">Personalized Advertising:</strong> To display
                personalized advertisements based on your interests and browsing behavior.
              </li>
              <li>
                <strong className="text-white">Third-Party Advertising Partners:</strong> We may
                share limited information with third-party advertising partners, who may use cookies
                and similar technologies to collect or receive information from our Website and
                elsewhere on the internet to provide measurement services and targeted ads. We
                encourage you to review the privacy policies of these third parties.
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
                required to do so.
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
                Website.
              </li>
              <li>
                <strong className="text-white">Email Service Providers:</strong> To manage our email
                communications.
              </li>
              <li>
                <strong className="text-white">Analytics Providers:</strong>
                <ul className="list-disc list-inside space-y-1 ml-6 mt-1">
                  <li>
                    <strong className="text-white">Google Analytics:</strong> We use Google Analytics
                    to understand how our Website is used. Google Analytics may collect information
                    about your use of the Website, including your IP address. For more information on
                    how Google collects and processes data, please visit Google&apos;s Privacy Policy.
                  </li>
                  <li>
                    <strong className="text-white">Squarespace Analytics:</strong> We use Squarespace
                    Analytics to monitor and analyze the performance and usage of our Website.
                    Squarespace Analytics may collect information such as your IP address, browser
                    type, device information, and browsing behavior.
                  </li>
                </ul>
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              3.2 For Business Transfers
            </h3>
            <p>
              In the event of a merger, acquisition, or sale of all or a portion of our assets, your
              information may be transferred as part of the transaction.
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
              We may use web beacons, pixel tags, and similar technologies to monitor and analyze
              the usage of our Website and to deliver targeted advertisements. Additionally, we use
              Google Analytics to understand how our Website is used. We also use Squarespace
              Analytics to monitor and analyze the performance and usage of our Website. Please note
              that third-party content providers may also use cookies and tracking technologies on
              our Website over which we have no control. We encourage you to review the privacy
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
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              6. Data Retention
            </h2>
            <p>
              We retain your Personal Information only for as long as necessary to fulfill the
              purposes outlined in this Privacy Policy, unless a longer retention period is required
              or permitted by law. When your information is no longer needed, we will securely delete
              or anonymize it.
            </p>
          </section>

          {/* 7. Your Rights and Choices */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              7. Your Rights and Choices
            </h2>
            <p className="mb-4">
              Depending on your jurisdiction, you may have the following rights regarding your
              Personal Information:
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.1 Access and Correction</h3>
            <p>
              You can access and update your Personal Information by logging into your account or
              contacting us directly.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.2 Data Portability</h3>
            <p>
              You may have the right to receive a copy of your Personal Information in a structured,
              machine-readable format.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.3 Deletion</h3>
            <p>
              You may request the deletion of your Personal Information, subject to certain
              exceptions.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.4 Opt-Out</h3>
            <p>
              You can opt out of receiving promotional communications by following the unsubscribe
              instructions included in such emails or by contacting us directly.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">7.5 Do Not Track</h3>
            <p>
              Our Website does not respond to &ldquo;Do Not Track&rdquo; signals. However, you can
              manage your tracking preferences through your browser settings. Please be aware that
              third-party sites linked from our Website may also not honour &ldquo;Do Not
              Track&rdquo; signals.
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
              8.2 Data Processing by Squarespace
            </h3>
            <p>
              Our Website is hosted on the Squarespace platform, which processes data on our behalf.
              While we strive to ensure that your Personal Information is handled in compliance with
              GDPR, certain aspects of data processing are managed by Squarespace.
            </p>

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
              <a
                href="https://www.thedayafterai.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                contact us
              </a>
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
              9.2 Data Processing by Squarespace
            </h3>
            <p>
              Our Website is hosted on the Squarespace platform, which processes data on our behalf.
              Some aspects of data processing are managed by Squarespace.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.3 Specific CCPA Rights
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
              9.4 How to Exercise Your CCPA Rights
            </h3>
            <p>
              To exercise any of these rights, please{" "}
              <a
                href="https://www.thedayafterai.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                contact us
              </a>
              . We may need to verify your identity before processing your request, which may
              require you to provide additional information.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">9.5 Authorized Agents</h3>
            <p>
              You may designate an authorized agent to make a request on your behalf. The authorized
              agent must have written permission to act on your behalf, and we may require you to
              verify your identity directly with us.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              9.6 Minors Under 16 Years of Age
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
              information promptly.
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
              the country in which you are resident. These countries may have data protection laws
              that differ from those of your country.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.2 Data Processing by Squarespace
            </h3>
            <p>
              Our Website is hosted on the Squarespace platform, which may use servers located in
              the United States and other countries. Squarespace processes data on our behalf, and
              we rely on them to implement appropriate safeguards to protect your Personal
              Information in compliance with applicable data protection laws.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              12.3 User Consent to Data Transfers
            </h3>
            <p>
              By using our Website and providing your information, you consent to the transfer of
              your Personal Information to our servers and facilities, which may be located outside
              your country of residence. We take reasonable steps to ensure that your data is treated
              securely and in accordance with this Privacy Policy.
            </p>
          </section>

          {/* 13. Changes to This Privacy Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              13. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be effective
              immediately upon posting the revised policy on our Website. We encourage you to review
              this Privacy Policy periodically to stay informed about how we are protecting your
              information.
            </p>
          </section>

          {/* 14. Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              14. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices,
              please{" "}
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
