"use client";

import { useState } from "react";
import { ExternalLink, Clock, Newspaper } from "lucide-react";
import { decodeEntities, type NewsArticle } from "@/lib/api";

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

/** Resolve image URL — local paths (downloads, screenshots, curated fallbacks) need the basePath prefix */
function resolveImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  // Local paths: "data/images/...", "data/screenshots/...", "images/news/..."
  if (imageUrl.startsWith("data/") || imageUrl.startsWith("images/")) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return `${basePath}/${imageUrl}`;
  }
  return imageUrl;
}

/** Topic-based curated fallback images — used when the primary image fails to load.
 *  Maps each topic to a representative image from public/images/news/. */
const TOPIC_FALLBACK: Record<string, string> = {
  "ai-academy":
    "images/news/ai-academy-machine-learning-education-open-book-holographic-brain-data-analytics-dashboard-charts-knowledge-base-digital-learning-neural-network-research-insights-visualization.webp",
  "business-economy":
    "images/news/ai-stock-market-prediction-neural-network-brain-candlestick-chart-algorithmic-trading-quant-finance-machine-learning-signal-analysis-bullish-trend-price-action-technical-analysis-trading-bot-data-visualization-financial-forecast.webp",
  "chatbot-development":
    "images/news/ai-chatbot-conversation-colorful-speech-bubbles-messaging-dialogue-natural-language-processing-customer-support-live-chat-communication-platform-social-media-comments-interaction-feedback-community-discussion-forum-3d-illustration.webp",
  "digital-security":
    "images/news/cybersecurity-data-center-protection-secure-cloud-infrastructure-server-racks-city-skyline-digital-shield-dome-network-security-lock-icons-encryption-firewall-zero-trust-threat-defense-critical-it-systems-privacy-protection.webp",
  "environment-science":
    "images/news/planet-earth-global-data-ocean-waves-digital-grid-climate-science-simulation-geospatial-analytics-world-technology-network-astronomy-space-background-environmental-monitoring-climate-change-visualization-futuristic-illustration.webp",
  "governance-politics":
    "images/news/government-courthouse-parliament-building-silhouette-scales-of-justice-digital-law-ai-regulation-tech-policy-governance-cybersecurity-circuit-board-network-legal-system-justice-balance.webp",
  "health-style":
    "images/news/smartphone-stethoscope-digital-healthcare-telemedicine-mobile-health-app-remote-diagnostics-medical-checkup-health-monitoring-clinic-on-phone-doctor-consultation-ehealth-mhealth-patient-care-health-technology-ui-mockup.webp",
  "musical-art":
    "images/news/ai-voice-assistant-speech-to-text-microphone-audio-waveform-transcription-chat-message-multimodal-media-upload-podcast-recording-voice-recognition-natural-language-processing-voice-chat-interface-dictation-communication-technology-illustration.webp",
  "technology-innovation":
    "images/news/robotic-arms-automated-data-center-server-racks-ai-compute-cluster-cloud-computing-gpu-infrastructure-industrial-robotics-machine-learning-automation-network-cabling-digital-factory-technology-3d-isometric-illustration.webp",
  "unmanned-aircraft":
    "images/news/unmanned-aircraft-drone-swarm-network-control-map-radar-sensor-nodes-target-tracking-surveillance-reconnaissance-flight-paths-airspace-monitoring-command-and-control-c2-geospatial-visualization-military-aviation-strategy-situational-awareness.webp",
  "visual-art-photography":
    "images/news/fashion-design-mannequin-dress-form-tailor-dummy-ai-neural-network-overlay-monochrome-minimal-collage-blank-photo-frames-mockup-template-creative-layout-editorial-design-studio-apparel-patternmaking-visualization-modern-3d-illustration.webp",
};

export default function NewsCard({ article, topicColor }: NewsCardProps) {
  const imgSrc = resolveImageUrl(article.imageUrl);
  const [imgFailed, setImgFailed] = useState(false);
  const fallbackSrc = resolveImageUrl(TOPIC_FALLBACK[article.topic] || "");
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const showFallback = !imgSrc || imgFailed;
  const showNameCard = showFallback && (!fallbackSrc || fallbackFailed);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all flex flex-col h-full card-hover"
      style={{ ["--card-accent" as string]: topicColor || "var(--accent)" }}
    >
      {/* Image — primary → topic fallback → name card */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        {imgSrc && !imgFailed && (
          <img
            src={imgSrc}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        )}
        {showFallback && fallbackSrc && !fallbackFailed && (
          <img
            src={fallbackSrc}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFallbackFailed(true)}
          />
        )}
        {showNameCard && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
            <Newspaper size={28} className="text-white/25" />
            <span className="text-white/40 text-xs text-center truncate max-w-full">
              {article.source}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content — flex-1 fills remaining height, footer pushed to bottom */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-white leading-snug mb-2 transition-colors line-clamp-2">
          {decodeEntities(article.title)}
        </h3>
        <p className="text-[var(--muted)] text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
          {decodeEntities(article.summary)}
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
