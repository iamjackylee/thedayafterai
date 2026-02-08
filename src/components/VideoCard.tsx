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
      className={`group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow block ${
        featured ? "col-span-full" : ""
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden ${
          featured ? "h-56 md:h-72" : "h-40"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">
          YouTube
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4
          className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {video.title}
        </h4>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-gray-400 text-xs">
            {formatDate(video.publishedAt)}
          </span>
          {video.channelTitle && (
            <>
              <span className="text-gray-300 text-xs">|</span>
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
