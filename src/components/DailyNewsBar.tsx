"use client";

import { Play, Radio, ExternalLink } from "lucide-react";
import { PLAYLIST_URL, CHANNEL_NAME, type YouTubeVideo } from "@/lib/api";

interface DailyNewsBarProps {
  latestVideo: YouTubeVideo | null;
}

export default function DailyNewsBar({ latestVideo }: DailyNewsBarProps) {
  return (
    <div className="w-full bg-[var(--surface)]  border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        {/* Channel branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-[var(--accent)]" />
            <span className="text-xs font-black text-white uppercase tracking-widest">
              {CHANNEL_NAME}
            </span>
          </div>
          <span className="hidden sm:block text-[var(--border-light)]">|</span>
          <span className="hidden sm:block text-xs text-[var(--text-secondary)] font-medium">
            Daily AI News
          </span>
        </div>

        {/* Latest video */}
        <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 sm:min-w-0 justify-center order-last sm:order-none">
          <Play size={10} className="text-[#ff0050] shrink-0" fill="currentColor" />
          {latestVideo ? (
            <a
              href={`https://www.youtube.com/watch?v=${latestVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--foreground)] sm:truncate hover:text-[var(--accent)] transition-colors font-medium"
            >
              {latestVideo.title}
            </a>
          ) : (
            <span className="text-xs text-[var(--muted)] sm:truncate">
              Loading latest video...
            </span>
          )}
        </div>

        {/* Watch link */}
        <a
          href={PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent)] hover:text-white transition-colors shrink-0 uppercase tracking-widest"
        >
          Watch
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
