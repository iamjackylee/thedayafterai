"use client";

import type { ReactNode } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface SiteHeaderProps {
  /** Optional elements rendered on the right side of the brand bar (e.g. search) */
  children?: ReactNode;
  /** Optional bar rendered below the brand bar (e.g. topic navigation) */
  bottomBar?: ReactNode;
}

export default function SiteHeader({ children, bottomBar }: SiteHeaderProps) {
  return (
    <header className="bg-black border-b border-[var(--border)] sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Brand — logo + name */}
          <a href={`${basePath}/`} className="flex items-center gap-3">
            <img
              src={`${basePath}/tdai-letter-logo.png`}
              alt="TDAI"
              className="h-8 tdai-hue opacity-90"
            />
            <span
              className="text-xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              TheDayAfterAI News
            </span>
          </a>
          {children}
        </div>
      </div>
      {bottomBar}
    </header>
  );
}
