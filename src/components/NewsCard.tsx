"use client";

import { ExternalLink, Clock } from "lucide-react";
import type { NewsArticle } from "@/lib/api";
import { TOPICS } from "@/lib/topics";

interface NewsCardProps {
  article: NewsArticle;
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

export default function NewsCard({ article }: NewsCardProps) {
  const topic = TOPICS.find((t) => t.id === article.topic);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[#141414] overflow-hidden border border-[#2a2a2a] hover:border-[#444] transition-all block"
    >
      {/* Image — 3:2 aspect ratio */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {topic && (
          <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white bg-[#e63946] uppercase tracking-wider">
            {topic.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-[#e63946] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{formatDate(article.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span>{article.source}</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </div>
    </a>
  );
}
