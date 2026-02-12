"use client";

import { Facebook, Youtube, Linkedin } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";

interface SiteFooterProps {
  /** When provided, category links become buttons that call this instead of
   *  anchor-navigating to the landing page. Used on the landing page itself. */
  onScrollToSection?: (id: string) => void;
}

export default function SiteFooter({ onScrollToSection }: SiteFooterProps) {
  const CategoryLink = ({
    id,
    label,
  }: {
    id: string;
    label: string;
  }) => {
    if (onScrollToSection) {
      return (
        <button
          onClick={() => onScrollToSection(id)}
          className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          {label}
        </button>
      );
    }
    return (
      <a
        href={`${basePath}/`}
        className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
      >
        {label}
      </a>
    );
  };

  return (
    <footer className="border-t border-[var(--border)] mt-2">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        {/* Top section: Brand + Category columns */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Brand column */}
          <div className="lg:w-[38%] lg:pr-8 lg:border-r lg:border-[var(--border)]">
            <h2
              className="text-lg font-extrabold text-white tracking-tight mb-4"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              TheDayAfterAI News
            </h2>
            <div className="flex items-center gap-4 mb-5">
              <a
                href="https://www.facebook.com/thedayafterai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/thedayafterai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--muted)] mb-4">
              <a
                href={`${basePath}/info`}
                className="hover:text-[var(--accent)] transition-colors"
              >
                About Us
              </a>
              <span>|</span>
              <a
                href={`${basePath}/terms`}
                className="hover:text-[var(--accent)] transition-colors"
              >
                Terms of Service
              </a>
              <span>|</span>
              <a
                href="https://www.thedayafterai.com/disclaimer"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Disclaimer
              </a>
              <span>|</span>
              <a
                href="https://www.thedayafterai.com/ethics-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Ethics Policy
              </a>
              <span>|</span>
              <a
                href="https://www.thedayafterai.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Privacy Policy
              </a>
              <span>|</span>
              <a
                href="https://www.thedayafterai.com/licensing"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Licensing Terms
              </a>
              <span>|</span>
              <a
                href="https://www.thedayafterai.com/advertise"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Advertise with Us
              </a>
            </div>
            <p className="text-xs text-[var(--text-secondary)] italic">
              Copyright &copy; 2024-{new Date().getFullYear()} TheDayAfterAI
              News. All Rights Reserved.
            </p>
          </div>

          {/* Category columns */}
          <div className="lg:flex-1 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            {/* Tech Frontiers */}
            <div>
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Tech Frontiers
              </h3>
              <ul className="space-y-1 text-[13px]">
                <li>
                  <CategoryLink id="ai-academy" label="AI Academy" />
                </li>
                <li>
                  <CategoryLink
                    id="chatbot-development"
                    label="Chatbot Development"
                  />
                </li>
                <li>
                  <CategoryLink
                    id="technology-innovation"
                    label="Technology & Innovation"
                  />
                </li>
                <li>
                  <CategoryLink
                    id="unmanned-aircraft"
                    label="Unmanned Aircraft"
                  />
                </li>
              </ul>
            </div>

            {/* Global Dynamics */}
            <div>
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Global Dynamics
              </h3>
              <ul className="space-y-1 text-[13px]">
                <li>
                  <CategoryLink
                    id="business-economy"
                    label="Business & Economy"
                  />
                </li>
                <li>
                  <CategoryLink
                    id="digital-security"
                    label="Digital Security"
                  />
                </li>
                <li>
                  <CategoryLink
                    id="environment-science"
                    label="Environment & Science"
                  />
                </li>
                <li>
                  <CategoryLink
                    id="governance-politics"
                    label="Governance & Politics"
                  />
                </li>
              </ul>
            </div>

            {/* Arts & Culture */}
            <div>
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Arts & Culture
              </h3>
              <ul className="space-y-1 text-[13px]">
                <li>
                  <CategoryLink id="health-style" label="Health & Style" />
                </li>
                <li>
                  <CategoryLink id="musical-art" label="Musical Art" />
                </li>
                <li>
                  <CategoryLink
                    id="visual-art-photography"
                    label="Visual Art & Photography"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acknowledgment of Country */}
        <div className="border-t border-[var(--border)] pt-6">
          <h4 className="text-sm font-bold text-white mb-2">
            Acknowledgment of Country
          </h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            TheDayAfterAI respectfully acknowledges the Ngunnawal people of the
            Australian Capital Territory as the Traditional Custodians of the
            land on which we operate. We pay our respects to their Elders past,
            present, and emerging, and extend that respect to all Aboriginal and
            Torres Strait Islander peoples. This acknowledgment honours the
            enduring connection of Indigenous Australians to their land and
            culture.{" "}
            <a
              href="https://www.reconciliation.org.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--accent)] transition-colors"
            >
              Learn more
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
