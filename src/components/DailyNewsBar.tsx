"use client";

import { Play, Radio, ExternalLink } from "lucide-react";
import { CHANNEL_URL, CHANNEL_NAME, type YouTubeVideo } from "@/lib/api";

interface DailyNewsBarProps {
  latestVideo: YouTubeVideo | null;
}

export default function DailyNewsBar({ latestVideo }: DailyNewsBarProps) {
  return (
    <div className="w-full bg-[#e63946]">
      <div className="max-w-[1800px] mx-auto px-[4vw] py-2 flex items-center justify-between gap-4 flex-wrap">
        {/* Channel branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-white/80" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {CHANNEL_NAME}
            </span>
          </div>
          <span className="hidden sm:block text-white/50">|</span>
          <span className="hidden sm:block text-sm text-white/80">
            Daily AI News
          </span>
        </div>

        {/* Latest video */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
          <Play size={12} className="text-white/80 shrink-0" fill="currentColor" />
          {latestVideo ? (
            <a
              href={`https://www.youtube.com/watch?v=${latestVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/90 truncate hover:text-white transition-colors"
            >
              {latestVideo.title}
            </a>
          ) : (
            <span className="text-sm text-white/60 truncate">
              Loading latest video...
            </span>
          )}
        </div>

        {/* Watch link */}
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors shrink-0 uppercase tracking-wider"
        >
          Watch on YouTube
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
