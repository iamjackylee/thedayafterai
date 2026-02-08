"use client";

import { motion } from "framer-motion";
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

export default function NewsCard({ article, index }: NewsCardProps) {
  const topic = TOPICS.find((t) => t.id === article.topic);

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:border-white/[0.15] transition-all duration-500 block"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {topic && (
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-md"
            style={{ backgroundColor: `${topic.color}cc` }}
          >
            {topic.icon} {topic.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{formatDate(article.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{article.source}</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: topic
            ? `radial-gradient(ellipse at 50% 0%, ${topic.color}08 0%, transparent 60%)`
            : undefined,
        }}
      />
    </motion.a>
  );
}
