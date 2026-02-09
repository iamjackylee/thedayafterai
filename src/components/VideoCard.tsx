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
      className="group bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all block card-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Play button - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-[#ff0050] flex items-center justify-center shadow-xl">
            <Play size={22} className="text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-0 right-0 px-2 py-1 bg-[#ff0050] text-white text-[9px] font-black uppercase tracking-widest">
          YT
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-xs font-bold text-white group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
          {video.title}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[var(--text-secondary)] text-[10px] font-medium">
            {formatDate(video.publishedAt)}
          </span>
          {video.channelTitle && (
            <>
              <span className="text-[var(--border-light)]">|</span>
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
