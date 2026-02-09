"use client";

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
  featured = false,
}: VideoCardProps) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group bg-[#141414] overflow-hidden border border-[#2a2a2a] hover:border-[#444] transition-all block ${
        featured ? "col-span-full" : ""
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden ${
          featured ? "aspect-[16/7]" : "aspect-video"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#e63946] flex items-center justify-center shadow-lg group-hover:bg-[#d62839] transition-colors">
            <Play size={22} className="text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider">
          YouTube
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4
          className={`font-bold text-white group-hover:text-[#e63946] transition-colors line-clamp-2 ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {video.title}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-600 text-xs">
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
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </a>
  );
}
