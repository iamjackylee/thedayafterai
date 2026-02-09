"use client";

import { Youtube, ExternalLink, Bell, Loader2 } from "lucide-react";
import { CHANNEL_URL, CHANNEL_NAME, type YouTubeVideo } from "@/lib/api";
import VideoCard from "./VideoCard";

interface ChannelSectionProps {
  videos: YouTubeVideo[];
  loading: boolean;
}

export default function ChannelSection({ videos, loading }: ChannelSectionProps) {
  return (
    <section className="bg-[#141414] border border-[#2a2a2a] p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#e63946] flex items-center justify-center">
            <Youtube size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{CHANNEL_NAME}</h2>
            <p className="text-sm text-gray-500">
              Daily AI News &amp; Analysis
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#e63946] hover:bg-[#d62839] text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Bell size={14} />
            Subscribe
          </a>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] hover:border-gray-500 text-gray-400 hover:text-white text-sm font-medium transition-all"
          >
            Visit Channel
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Videos grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#e63946] animate-spin" />
          <span className="ml-3 text-gray-500 text-sm">
            Loading latest videos...
          </span>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              featured={i === 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm mb-2">
            No videos loaded yet.
          </p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#e63946] hover:text-[#d62839] transition-colors"
          >
            Visit the channel on YouTube &rarr;
          </a>
        </div>
      )}
    </section>
  );
}
