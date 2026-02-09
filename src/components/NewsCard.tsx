"use client";

import { ExternalLink, Clock } from "lucide-react";
import type { NewsArticle } from "@/lib/api";
import { getTopicLabel, getTopicColor } from "@/lib/topics";

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
  const topicLabel = getTopicLabel(article.topic);
  const topicColor = getTopicColor(article.topic);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all block card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {topicLabel && (
          <div
            className="absolute top-0 left-0 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
            style={{ backgroundColor: topicColor, color: "#000" }}
          >
            {topicLabel}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[var(--muted)] text-xs leading-relaxed mb-3 line-clamp-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Clock size={10} />
            <span>{formatDate(article.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="truncate max-w-[100px]">{article.source}</span>
            <ExternalLink size={10} />
          </div>
        </div>
      </div>
    </a>
  );
}
