// Data service: loads pre-fetched JSON first, falls back to live RSS feeds

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

interface PrefetchedData {
  fetchedAt: string;
  playlistUrl: string;
  news: NewsArticle[];
  channelVideos: YouTubeVideo[];
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

    // Check if data is fresh (less than 2 hours old)
    const fetchedAt = new Date(data.fetchedAt).getTime();
    const age = Date.now() - fetchedAt;
    if (age > 2 * 60 * 60 * 1000) {
      console.log("Pre-fetched data is stale, will try live feed");
      return data;
    }

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

export async function fetchCustomSections(): Promise<CustomSection[]> {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const res = await fetch(`${basePath}/data/custom-articles.json`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sections || [];
  } catch {
    return [];
  }
}

// ─── CORS Proxy (fallback for live fetching) ──────────────────────

const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const res = await fetchWithTimeout(proxy(url));
      if (res.ok) return await res.text();
    } catch {
      // try next proxy
    }
  }
  throw new Error(`All proxies failed for: ${url}`);
}

// ─── XML Parser Helper ────────────────────────────────────────────

function parseXML(text: string): Document {
  return new DOMParser().parseFromString(text, "text/xml");
}

function getTextContent(el: Element, tag: string): string {
  return el.getElementsByTagName(tag)[0]?.textContent?.trim() || "";
}

// ─── Google News RSS (100% free, no key) ──────────────────────────

const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search";

export async function fetchNews(
  topicKeywords: string[] = [],
  freeTextQuery = "",
  maxResults = 500
): Promise<NewsArticle[]> {
  // Try pre-fetched data first
  const prefetched = await loadPrefetched();
  if (prefetched && prefetched.news.length > 0) {
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

  // Fall back to live RSS fetch
  try {
    let q = "artificial intelligence";
    if (freeTextQuery.trim()) {
      q = `AI ${freeTextQuery.trim()}`;
    } else if (topicKeywords.length > 0) {
      q = `AI (${topicKeywords.slice(0, 4).join(" OR ")})`;
    }

    const rssUrl = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
    const xml = await fetchWithProxy(rssUrl);
    const doc = parseXML(xml);
    const items = doc.getElementsByTagName("item");

    const articles: NewsArticle[] = [];
    const len = Math.min(items.length, maxResults);

    for (let i = 0; i < len; i++) {
      const item = items[i];
      const title = getTextContent(item, "title");
      const link = getTextContent(item, "link");
      const pubDate = getTextContent(item, "pubDate");
      const source = getTextContent(item, "source");
      const description = getTextContent(item, "description");
      const summary = description.replace(/<[^>]*>/g, "").trim();

      const rawTopic = matchTopic(
        title + " " + summary,
        topicKeywords.map((k) => k.toLowerCase())
      );

      articles.push({
        id: `gn-${i}-${Date.now()}`,
        title,
        summary: summary || title,
        topic: TOPIC_GROUP_MAP[rawTopic] || rawTopic,
        source: source || "Google News",
        date: pubDate,
        imageUrl: placeholderImage(i),
        url: link,
      });
    }

    return articles;
  } catch (err) {
    console.error("Google News RSS fetch failed:", err);
    return [];
  }
}

// ─── YouTube RSS (100% free, no key) ──────────────────────────────

const PLAYLIST_ID = "PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";
const CHANNEL_ID = "UCwHJaEBaaSQPFHLUiMjHTtg";
const YOUTUBE_PLAYLIST_RSS = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const YOUTUBE_CHANNEL_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function parseYouTubeEntries(xml: string, maxResults: number): YouTubeVideo[] {
  const doc = parseXML(xml);
  const entries = doc.getElementsByTagName("entry");
  const channelTitle =
    doc.getElementsByTagName("title")[0]?.textContent || "TheDayAfterAI";

  const videos: YouTubeVideo[] = [];
  const len = Math.min(entries.length, maxResults);

  for (let i = 0; i < len; i++) {
    const entry = entries[i];
    const videoId =
      entry.getElementsByTagName("yt:videoId")[0]?.textContent || "";
    const title = getTextContent(entry, "title");
    const published = getTextContent(entry, "published");
    const mediaGroup = entry.getElementsByTagName("media:group")[0];
    const description = mediaGroup
      ? mediaGroup.getElementsByTagName("media:description")[0]
          ?.textContent || ""
      : "";
    const thumbnail = mediaGroup
      ? mediaGroup
          .getElementsByTagName("media:thumbnail")[0]
          ?.getAttribute("url") || ""
      : "";

    videos.push({
      id: videoId,
      videoId,
      title,
      thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: published,
      description,
      channelTitle,
    });
  }

  return videos;
}

export async function fetchChannelVideos(
  maxResults = 15
): Promise<YouTubeVideo[]> {
  // Try pre-fetched data first
  const prefetched = await loadPrefetched();
  if (prefetched && prefetched.channelVideos.length > 0) {
    return prefetched.channelVideos.slice(0, maxResults);
  }

  // Try playlist RSS first (user's specific AI news playlist)
  try {
    const xml = await fetchWithProxy(YOUTUBE_PLAYLIST_RSS);
    const videos = parseYouTubeEntries(xml, maxResults);
    if (videos.length > 0) return videos;
  } catch {
    console.warn("Playlist RSS fetch failed, trying channel RSS...");
  }

  // Fall back to channel RSS
  try {
    const xml = await fetchWithProxy(YOUTUBE_CHANNEL_RSS);
    return parseYouTubeEntries(xml, maxResults);
  } catch (err) {
    console.error("YouTube RSS fetch failed:", err);
    return [];
  }
}

/** Search YouTube for AI news videos — uses RSS search workaround */
export async function searchYouTubeVideos(
  query: string,
  maxResults = 9
): Promise<YouTubeVideo[]> {
  try {
    const q = `AI ${query} site:youtube.com`;
    const rssUrl = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
    const xml = await fetchWithProxy(rssUrl);
    const doc = parseXML(xml);
    const items = doc.getElementsByTagName("item");

    const videos: YouTubeVideo[] = [];
    const len = Math.min(items.length, maxResults);

    for (let i = 0; i < len; i++) {
      const item = items[i];
      const title = getTextContent(item, "title");
      const link = getTextContent(item, "link");
      const pubDate = getTextContent(item, "pubDate");
      const source = getTextContent(item, "source");

      const videoIdMatch = link.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (!videoIdMatch) continue;

      const videoId = videoIdMatch[1];
      videos.push({
        id: videoId,
        videoId,
        title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt: pubDate,
        description: "",
        channelTitle: source || "YouTube",
      });
    }

    return videos;
  } catch (err) {
    console.error("YouTube search failed:", err);
    return [];
  }
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

function placeholderImage(index: number): string {
  const images = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
  ];
  return images[index % images.length];
}

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
