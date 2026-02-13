import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — TheDayAfterAI News",
  description:
    "Get in touch with TheDayAfterAI News. Reach out for general enquiries, press and media requests, licensing, partnerships, advertising, or editorial feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12">
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Contact Us
          </h1>
        </header>

        <div className="prose-terms space-y-10 text-[var(--text-secondary)] leading-relaxed">
          {/* Intro */}
          <p>
            At{" "}
            <strong className="text-white">TheDayAfterAI News</strong>, we
            value your feedback, enquiries, and collaboration
            opportunities. Whether you have questions, need assistance, or
            wish to engage with us for media purposes, we&apos;re here to
            help. Please choose the category that best fits your needs and
            reach out to us using the form below.
          </p>

          {/* Contact Categories */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              How Can We Help?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  General Enquiries &amp; Feedback
                </h3>
                <p className="text-xs">
                  Questions about our content, suggestions, or general
                  feedback about TheDayAfterAI.
                </p>
              </div>
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Press &amp; Media Requests
                </h3>
                <p className="text-xs">
                  Interviews, media mentions, press releases, and journalist
                  enquiries.
                </p>
              </div>
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Permission to Use Materials
                </h3>
                <p className="text-xs">
                  Requests to licence or republish our articles and images.
                  See our{" "}
                  <Link
                    href="/licensing"
                    className="text-[var(--accent)] hover:underline"
                  >
                    Licensing Terms
                  </Link>
                  .
                </p>
              </div>
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Partnership Opportunities
                </h3>
                <p className="text-xs">
                  Collaborations, joint ventures, and strategic partnerships
                  in the AI space.
                </p>
              </div>
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Advertising
                </h3>
                <p className="text-xs">
                  Banner ads, sponsored content, and custom campaigns. See
                  our{" "}
                  <Link
                    href="/advertise"
                    className="text-[var(--accent)] hover:underline"
                  >
                    advertising options
                  </Link>
                  .
                </p>
              </div>
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Copyright &amp; Complaints
                </h3>
                <p className="text-xs">
                  Copyright concerns, editorial complaints, or corrections.
                  See our{" "}
                  <Link
                    href="/terms"
                    className="text-[var(--accent)] hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  (S5.4) and{" "}
                  <Link
                    href="/ethics-policy"
                    className="text-[var(--accent)] hover:underline"
                  >
                    Ethics Policy
                  </Link>{" "}
                  (S11).
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              Send Us a Message
            </h2>
            <ContactForm />
          </section>

          {/* Response Time */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              Response Time
            </h2>
            <p>
              We strive to respond to all enquiries within{" "}
              <strong className="text-white">1–2 business days</strong>.
              For editorial complaints, we will acknowledge receipt within
              7&nbsp;days and provide a substantive response within
              30&nbsp;days, in accordance with our{" "}
              <Link
                href="/ethics-policy"
                className="text-[var(--accent)] hover:underline"
              >
                Ethics Policy
              </Link>{" "}
              (Section&nbsp;11.2) and{" "}
              <Link
                href="/privacy"
                className="text-[var(--accent)] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              (Section&nbsp;7.5).
            </p>
          </section>

          {/* Privacy Notice */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent)] pl-4">
              Privacy Notice
            </h2>
            <p>
              Your privacy is important to us. All information provided
              through our contact channels will be handled in accordance
              with our{" "}
              <Link
                href="/privacy"
                className="text-[var(--accent)] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and the <em>Privacy Act 1988</em> (Cth). We will only use
              your contact details to respond to your enquiry and will
              retain them for up to 24&nbsp;months from the date of the
              last communication, after which they will be securely deleted
              — see our{" "}
              <Link
                href="/privacy"
                className="text-[var(--accent)] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              (Section&nbsp;6) for full retention details.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
