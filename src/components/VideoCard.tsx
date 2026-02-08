"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { YouTubeVideo } from "@/lib/api";

interface VideoCardProps {
  video: YouTubeVideo;
  index: number;
  featured?: boolean;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function VideoCard({
  video,
  index,
  featured = false,
}: VideoCardProps) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

  return (
    <motion.a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className={`group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:border-purple-500/30 transition-all duration-500 cursor-pointer block ${
        featured ? "col-span-full" : ""
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden ${
          featured ? "h-64 md:h-80" : "h-44"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:bg-red-500 transition-colors"
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-red-600/90 text-white text-xs font-bold backdrop-blur-sm">
          YouTube
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4
          className={`font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 ${
            featured ? "text-lg" : "text-sm"
          }`}
        >
          {video.title}
        </h4>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-gray-500 text-xs">
            {formatDate(video.publishedAt)}
          </span>
          {video.channelTitle && (
            <>
              <span className="text-gray-700 text-xs">|</span>
              <span className="text-gray-500 text-xs truncate">
                {video.channelTitle}
              </span>
            </>
          )}
        </div>
        {featured && video.description && (
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </motion.a>
  );
}
