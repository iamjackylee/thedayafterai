"use client";

import { Play } from "lucide-react";
import type { YouTubeVideo } from "@/lib/api";

interface VideoCardProps {
  video: YouTubeVideo;
  index: number;
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

export default function VideoCard({ video }: VideoCardProps) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all block"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[var(--accent)] text-white text-[9px] font-bold uppercase tracking-wider">
          YouTube
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-xs font-bold text-white group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          {video.title}
        </h4>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[var(--text-secondary)] text-[10px]">
            {formatDate(video.publishedAt)}
          </span>
          {video.channelTitle && (
            <>
              <span className="text-[var(--border-light)] text-[10px]">|</span>
              <span className="text-[var(--muted)] text-[10px] truncate">
                {video.channelTitle}
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
