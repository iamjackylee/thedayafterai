"use client";

import { motion } from "framer-motion";
import { Youtube, ExternalLink, Bell } from "lucide-react";
import { DAILY_CHANNEL_VIDEOS, CHANNEL_URL, CHANNEL_NAME } from "@/lib/youtube";
import VideoCard from "./VideoCard";

export default function ChannelSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-950/30 via-black/40 to-purple-950/30 backdrop-blur-xl p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <Youtube size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{CHANNEL_NAME}</h2>
            <p className="text-sm text-gray-400">
              Daily AI News &amp; Analysis
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
          >
            <Bell size={14} />
            Subscribe
          </a>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/25 text-gray-300 hover:text-white text-sm font-medium transition-all"
          >
            Visit Channel
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DAILY_CHANNEL_VIDEOS.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} featured={i === 0} />
        ))}
      </div>

      {/* Decorative gradient */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
    </motion.section>
  );
}
