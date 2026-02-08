"use client";

import { Play, Radio, ExternalLink } from "lucide-react";
import { CHANNEL_URL, CHANNEL_NAME, type YouTubeVideo } from "@/lib/api";

interface DailyNewsBarProps {
  latestVideo: YouTubeVideo | null;
}

export default function DailyNewsBar({ latestVideo }: DailyNewsBarProps) {
  return (
    <div className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        {/* Channel branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio size={16} className="text-red-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-semibold">
              {CHANNEL_NAME}
            </span>
          </div>
          <span className="hidden sm:block text-gray-500">|</span>
          <span className="hidden sm:block text-sm text-gray-400">
            Daily AI News
          </span>
        </div>

        {/* Latest video */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
          <Play size={12} className="text-red-400 shrink-0" fill="currentColor" />
          {latestVideo ? (
            <a
              href={`https://www.youtube.com/watch?v=${latestVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-300 truncate hover:text-white transition-colors"
            >
              {latestVideo.title}
            </a>
          ) : (
            <span className="text-sm text-gray-500 truncate">
              Loading latest video...
            </span>
          )}
        </div>

        {/* Watch link */}
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors shrink-0"
        >
          Watch on YouTube
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
