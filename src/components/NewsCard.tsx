"use client";

import { ExternalLink, Clock } from "lucide-react";
import type { NewsArticle } from "@/lib/api";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
  topicColor?: string;
}

const TOPIC_FALLBACK_IMAGES: Record<string, string> = {
  "ai-academy": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&auto=format",
  "business-economy": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&auto=format",
  "chatbot-development": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
  "digital-security": "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop&auto=format",
  "environment-science": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&auto=format",
  "governance-politics": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop&auto=format",
  "health-style": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&auto=format",
  "musical-art": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop&auto=format",
  "technology-innovation": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format",
  "unmanned-aircraft": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop&auto=format",
  "visual-art-photography": "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop&auto=format",
};

function getFallbackImage(topic: string): string {
  return TOPIC_FALLBACK_IMAGES[topic] || TOPIC_FALLBACK_IMAGES["technology-innovation"];
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

/** Resolve image URL — local screenshot paths need the basePath prefix */
function resolveImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  // Local screenshot paths stored as "data/screenshots/xxx.jpg"
  if (imageUrl.startsWith("data/")) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return `${basePath}/${imageUrl}`;
  }
  return imageUrl;
}

export default function NewsCard({ article, topicColor }: NewsCardProps) {
  const fallbackImg = getFallbackImage(article.topic);
  const imgSrc = resolveImageUrl(article.imageUrl) || fallbackImg;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all flex flex-col h-full card-hover"
      style={{ ["--card-accent" as string]: topicColor || "var(--accent)" }}
    >
      {/* Image with topic-appropriate fallback for broken/missing images */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <img
          src={imgSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src !== fallbackImg) { img.src = fallbackImg; }
            else { img.style.display = "none"; }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content — flex-1 fills remaining height, footer pushed to bottom */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-white leading-snug mb-2 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[var(--muted)] text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mt-auto">
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
