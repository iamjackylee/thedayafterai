"use client";

import { motion } from "framer-motion";
import { Play, Radio, ExternalLink } from "lucide-react";
import { DAILY_CHANNEL_VIDEOS, CHANNEL_URL, CHANNEL_NAME } from "@/lib/youtube";

export default function DailyNewsBar() {
  const latest = DAILY_CHANNEL_VIDEOS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border-b border-purple-500/20 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Channel branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio size={18} className="text-red-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide">
              {CHANNEL_NAME}
            </span>
          </div>
          <span className="hidden sm:block text-purple-300/60">|</span>
          <span className="hidden sm:block text-sm text-purple-200/70">
            Daily AI News
          </span>
        </div>

        {/* Latest video */}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-center">
          <Play size={14} className="text-red-400 shrink-0" fill="currentColor" />
          <span className="text-sm text-gray-200 truncate">{latest.title}</span>
        </div>

        {/* Watch link */}
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-purple-100 transition-colors shrink-0"
        >
          Watch on YouTube
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}
