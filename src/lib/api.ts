// Real-time data service using FREE RSS feeds (no API keys needed)
// Google News RSS + YouTube RSS — all fetched client-side via CORS proxy

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

// ─── CORS Proxy ────────────────────────────────────────────────────
// Needed because RSS feeds don't set CORS headers for browsers

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

// ─── XML Parser Helper ─────────────────────────────────────────────

function parseXML(text: string): Document {
  return new DOMParser().parseFromString(text, "text/xml");
}

function getTextContent(el: Element, tag: string): string {
  return el.getElementsByTagName(tag)[0]?.textContent?.trim() || "";
}

// ─── Google News RSS (100% free, no key) ───────────────────────────

const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search";

export async function fetchNews(
  topicKeywords: string[] = [],
  freeTextQuery = "",
  maxResults = 30
): Promise<NewsArticle[]> {
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

      // Strip HTML tags from description
      const summary = description.replace(/<[^>]*>/g, "").trim();

      articles.push({
        id: `gn-${i}-${Date.now()}`,
        title,
        summary: summary || title,
        topic: matchTopic(
          title + " " + summary,
          topicKeywords.map((k) => k.toLowerCase())
        ),
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

// ─── YouTube RSS (100% free, no key) ───────────────────────────────

// The Day After AI channel ID (resolved from @thedayafterai)
const CHANNEL_ID = "UCwHJaEBaaSQPFHLUiMjHTtg";
const YOUTUBE_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export async function fetchChannelVideos(
  maxResults = 6
): Promise<YouTubeVideo[]> {
  try {
    const xml = await fetchWithProxy(YOUTUBE_RSS);
    const doc = parseXML(xml);
    const entries = doc.getElementsByTagName("entry");
    const channelTitle =
      doc.getElementsByTagName("title")[0]?.textContent || "The Day After AI";

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
    // YouTube doesn't have an official search RSS, so we use Google's
    // YouTube-specific search via Google News video results or a
    // site-restricted search
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

      // Extract video ID from YouTube URLs
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

// ─── Helpers ───────────────────────────────────────────────────────

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
  return "technology";
}

const topicSearchTerms: Record<string, string[]> = {
  academy: ["university", "education", "student", "academic", "research", "school", "learning", "curriculum"],
  business: ["business", "company", "startup", "enterprise", "market", "invest", "funding", "revenue"],
  economy: ["economy", "economic", "gdp", "trade", "finance", "stock", "inflation", "banking"],
  "chatbot-development": ["chatbot", "chat bot", "conversational", "gpt", "llm", "language model", "claude", "gemini"],
  "digital-security": ["security", "cyber", "hack", "privacy", "encryption", "malware", "threat", "breach"],
  environment: ["environment", "climate", "carbon", "green", "sustainable", "emission", "pollution", "renewable"],
  science: ["science", "scientific", "discovery", "physics", "biology", "chemistry", "experiment", "quantum"],
  governance: ["governance", "regulation", "policy", "compliance", "framework", "standard", "guideline", "law"],
  politics: ["politic", "government", "election", "congress", "senate", "legislation", "democrat", "republican"],
  health: ["health", "medical", "hospital", "patient", "disease", "drug", "diagnos", "treatment", "clinical"],
  style: ["fashion", "style", "design", "trend", "luxury", "brand", "wear", "clothing"],
  music: ["music", "song", "album", "artist", "concert", "spotify", "audio", "sound", "compose"],
  art: ["art", "painting", "gallery", "museum", "creative", "artwork", "exhibition", "visual"],
  photography: ["photo", "camera", "image", "portrait", "landscape", "shoot", "lens", "exposure"],
  cameras: ["camera", "lens", "sensor", "megapixel", "video record", "dslr", "mirrorless", "surveillance"],
  technology: ["tech", "software", "hardware", "chip", "processor", "computing", "digital", "device"],
  innovation: ["innovation", "breakthrough", "frontier", "novel", "pioneer", "revolutio", "transform", "disrupt"],
  drone: ["drone", "uav", "unmanned", "aerial", "quadcopter", "flying", "flight"],
};

export const topicToSearchQuery: Record<string, string> = {
  academy: "education university",
  business: "business startup",
  economy: "economy finance",
  "chatbot-development": "chatbot LLM",
  "digital-security": "cybersecurity",
  environment: "climate environment",
  science: "science research",
  governance: "AI regulation governance",
  politics: "politics government",
  health: "health medical",
  style: "fashion style",
  music: "music",
  art: "art creative",
  photography: "photography",
  cameras: "camera",
  technology: "technology",
  innovation: "innovation breakthrough",
  drone: "drone UAV",
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

// ─── Channel constants ─────────────────────────────────────────────

export const CHANNEL_URL = "https://www.youtube.com/@thedayafterai";
export const CHANNEL_NAME = "The Day After AI";
