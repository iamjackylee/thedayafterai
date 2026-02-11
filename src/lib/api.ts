// Data service: loads all data from pre-fetched static JSON files.
//
// The backend prefetch script (scripts/fetch-news.js) keeps data fresh:
//   - 11 news categories: one category every 10 min (~110 min full cycle)
//   - YouTube channel videos: every 15 min
//   - TDAAI blog articles: every 15 min
//   - AI Market Insight articles: every 15 min
//
// The frontend reads ONLY from these static files for instant loading.

import { TOPIC_GROUP_MAP } from "@/lib/topics";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  topic: string;
  source: string;
  date: string;
  imageUrl: string;
  url: string;
}

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  channelTitle: string;
}

export interface TdaaiArticle {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  url: string;
  source: string;
}

interface PrefetchedData {
  fetchedAt: string;
  playlistUrl: string;
  news: NewsArticle[];
  channelVideos: YouTubeVideo[];
  tdaaiArticles?: TdaaiArticle[];
}

// ─── Pre-fetched data loader ──────────────────────────────────────

let _prefetchedCache: PrefetchedData | null = null;

async function loadPrefetched(): Promise<PrefetchedData | null> {
  if (_prefetchedCache) return _prefetchedCache;

  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const res = await fetch(`${basePath}/data/prefetched.json`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();

    _prefetchedCache = data;
    return data;
  } catch {
    return null;
  }
}

// ─── Custom articles (your own editorial content) ───────────────

export interface CustomArticle {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  url: string;
  source: string;
}

export interface CustomSection {
  id: string;
  title: string;
  color: string;
  articles: CustomArticle[];
}

interface CustomSectionConfig {
  id: string;
  title: string;
  color: string;
  pageUrl?: string;
  categoryFilter?: string;
  articles: CustomArticle[];
}

/** Load custom sections (e.g. AI Market Insight) from pre-fetched static JSON.
 *  The prefetch script (fetch-news.js) refreshes custom-articles.json every
 *  15 minutes via the Squarespace JSON API, so the frontend just reads the
 *  already-fetched data for instant loading. */
export async function fetchCustomSections(): Promise<CustomSection[]> {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const res = await fetch(`${basePath}/data/custom-articles.json`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const configs: CustomSectionConfig[] = data.sections || [];

    return configs.map((config) => ({
      id: config.id,
      title: config.title,
      color: config.color,
      articles: config.articles || [],
    }));
  } catch {
    return [];
  }
}

// ─── News articles (11 categories) ──────────────────────────────

/** Load news articles from pre-fetched data (prefetched.json).
 *  The prefetch script refreshes one category every 10 min (11 categories =
 *  ~110 min full cycle). Each article already has its resolved URL + image. */
export async function fetchNews(
  topicKeywords: string[] = [],
  freeTextQuery = "",
  maxResults = 500
): Promise<NewsArticle[]> {
  const prefetched = await loadPrefetched();
  if (!prefetched || prefetched.news.length === 0) return [];

  let articles = prefetched.news;
  // Normalize topics to group IDs
  articles = articles.map((a) => ({
    ...a,
    topic: TOPIC_GROUP_MAP[a.topic] || a.topic,
  }));
  // Filter by topics/query if specified
  if (freeTextQuery.trim()) {
    const q = freeTextQuery.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }
  if (topicKeywords.length > 0) {
    const topicIds = topicKeywords.map((k) => k.toLowerCase());
    const filtered = articles.filter((a) => {
      const text = (a.title + " " + a.summary).toLowerCase();
      return topicIds.some((t) => text.includes(t));
    });
    if (filtered.length > 0) articles = filtered;
  }
  return articles.slice(0, maxResults);
}

// ─── YouTube channel videos ──────────────────────────────────────

/** Load YouTube videos from pre-fetched data (prefetched.json).
 *  The prefetch script refreshes YouTube every 15 min via RSS.
 *  Thumbnails are already included in the prefetched data. */
export async function fetchChannelVideos(
  maxResults = 15
): Promise<YouTubeVideo[]> {
  const prefetched = await loadPrefetched();
  if (prefetched && prefetched.channelVideos.length > 0) {
    return prefetched.channelVideos.slice(0, maxResults);
  }
  return [];
}

// ─── TheDayAfterAI.com blog articles ────────────────────────────

/** Load TheDayAfterAI.com blog articles from pre-fetched data (prefetched.json).
 *  The prefetch script refreshes TDAAI RSS every 15 min. */
export async function fetchTdaaiArticles(): Promise<TdaaiArticle[]> {
  const prefetched = await loadPrefetched();
  if (prefetched && prefetched.tdaaiArticles && prefetched.tdaaiArticles.length > 0) {
    return prefetched.tdaaiArticles;
  }
  return [];
}

// ─── Helpers ──────────────────────────────────────────────────────

function matchTopic(text: string, selectedTopics: string[]): string {
  const lower = text.toLowerCase();
  for (const topic of selectedTopics) {
    const keywords = topicSearchTerms[topic];
    if (keywords && keywords.some((kw) => lower.includes(kw))) {
      return topic;
    }
  }
  for (const [topic, keywords] of Object.entries(topicSearchTerms)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return topic;
    }
  }
  return "technology-innovation";
}

// Merged topic search terms for the 11 grouped categories
const topicSearchTerms: Record<string, string[]> = {
  "ai-academy": ["university", "education", "student", "academic", "research", "school", "learning", "curriculum", "professor", "degree"],
  "business-economy": ["business", "company", "startup", "enterprise", "market", "invest", "funding", "revenue", "economy", "economic", "gdp", "trade", "finance", "stock", "inflation", "banking"],
  "chatbot-development": ["chatbot", "chat bot", "conversational", "gpt", "llm", "language model", "claude", "gemini", "openai"],
  "digital-security": ["security", "cyber", "hack", "privacy", "encryption", "malware", "threat", "breach", "firewall"],
  "environment-science": ["environment", "climate", "carbon", "green", "sustainable", "emission", "pollution", "renewable", "science", "scientific", "discovery", "physics", "biology", "chemistry", "experiment", "quantum"],
  "governance-politics": ["governance", "regulation", "policy", "compliance", "framework", "standard", "guideline", "law", "politic", "government", "election", "congress", "senate", "legislation", "democrat", "republican"],
  "health-style": ["health", "medical", "hospital", "patient", "disease", "drug", "diagnos", "treatment", "clinical", "fashion", "style", "design", "trend", "luxury", "brand", "wear", "clothing"],
  "musical-art": ["music", "song", "album", "artist", "concert", "spotify", "audio", "sound", "compose", "melody", "symphony"],
  "technology-innovation": ["tech", "software", "hardware", "chip", "processor", "computing", "digital", "device", "innovation", "breakthrough", "frontier", "novel", "pioneer", "revolutio", "transform", "disrupt"],
  "unmanned-aircraft": ["drone", "uav", "unmanned", "aerial", "quadcopter", "flying", "flight"],
  "visual-art-photography": ["art", "painting", "gallery", "museum", "creative", "artwork", "exhibition", "visual", "photo", "camera", "image", "portrait", "landscape", "shoot", "lens", "exposure", "sensor", "megapixel", "dslr", "mirrorless"],
};

export const topicToSearchQuery: Record<string, string> = {
  "ai-academy": "education university learning",
  "business-economy": "business economy finance startup",
  "chatbot-development": "chatbot LLM GPT",
  "digital-security": "cybersecurity privacy",
  "environment-science": "climate environment science research",
  "governance-politics": "AI regulation governance politics",
  "health-style": "health medical fashion",
  "musical-art": "music audio",
  "technology-innovation": "technology innovation breakthrough",
  "unmanned-aircraft": "drone UAV",
  "visual-art-photography": "art photography creative",
};

export function sortByDateDesc<T extends { date?: string; publishedAt?: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const da = new Date(a.date || a.publishedAt || 0).getTime();
    const db = new Date(b.date || b.publishedAt || 0).getTime();
    return db - da;
  });
}

// ─── Channel constants ────────────────────────────────────────────

export const CHANNEL_URL = "https://www.youtube.com/@thedayafterai";
export const PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";
export const CHANNEL_NAME = "TheDayAfterAI";
