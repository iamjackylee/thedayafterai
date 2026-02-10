"use client";

import { ExternalLink, Clock } from "lucide-react";
import type { NewsArticle } from "@/lib/api";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
  topicColor?: string;
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

export default function NewsCard({ article, topicColor }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all block card-hover"
      style={{ ["--card-accent" as string]: topicColor || "var(--accent)" }}
    >
      {/* Image with gradient fallback for broken/missing images */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-white leading-snug mb-2 transition-colors line-clamp-2">
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
