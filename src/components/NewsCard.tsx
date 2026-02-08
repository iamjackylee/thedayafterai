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
      className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow block"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {topic && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-semibold text-white bg-blue-600">
            {topic.icon} {topic.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{formatDate(article.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">{article.source}</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </div>
    </a>
  );
}
