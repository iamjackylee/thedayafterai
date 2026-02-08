// Real-time API service for fetching AI news and YouTube videos
// All calls happen client-side (static export compatible)

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

// ─── YouTube Data API v3 ───────────────────────────────────────────

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const THE_DAY_AFTER_AI_CHANNEL = "thedayafterai";

function getYouTubeKey(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("YOUTUBE_API_KEY") ||
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ||
    null
  );
}

function getNewsKey(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("NEWS_API_KEY") ||
    process.env.NEXT_PUBLIC_GNEWS_API_KEY ||
    null
  );
}

/** Resolve the @thedayafterai handle to a channel ID, then fetch uploads */
export async function fetchChannelVideos(
  maxResults = 6
): Promise<YouTubeVideo[]> {
  const key = getYouTubeKey();
  if (!key) return [];

  try {
    // Step 1 – resolve handle → channelId
    const searchRes = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&q=${THE_DAY_AFTER_AI_CHANNEL}&type=channel&maxResults=1&key=${key}`
    );
    const searchData = await searchRes.json();
    const channelId = searchData.items?.[0]?.snippet?.channelId
      ?? searchData.items?.[0]?.id?.channelId;
    if (!channelId) return [];

    // Step 2 – get latest videos from this channel
    const videosRes = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}&key=${key}`
    );
    const videosData = await videosRes.json();

    return (videosData.items || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        id: item.id.videoId,
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
      })
    );
  } catch (err) {
    console.error("YouTube channel fetch failed:", err);
    return [];
  }
}

/** Search YouTube for AI news videos matching a query */
export async function searchYouTubeVideos(
  query: string,
  maxResults = 6
): Promise<YouTubeVideo[]> {
  const key = getYouTubeKey();
  if (!key) return [];

  try {
    const q = encodeURIComponent(`AI ${query} news`);
    const res = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&q=${q}&type=video&order=date&maxResults=${maxResults}&key=${key}`
    );
    const data = await res.json();

    return (data.items || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        id: item.id.videoId,
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
      })
    );
  } catch (err) {
    console.error("YouTube search failed:", err);
    return [];
  }
}

// ─── News API (GNews) ──────────────────────────────────────────────

const GNEWS_API_BASE = "https://gnews.io/api/v4";

/** Fetch real AI news articles, optionally filtered by topic keywords */
export async function fetchNews(
  topicKeywords: string[] = [],
  freeTextQuery = "",
  maxResults = 30
): Promise<NewsArticle[]> {
  const key = getNewsKey();
  if (!key) return [];

  try {
    let q = "artificial intelligence";
    if (freeTextQuery.trim()) {
      q = `AI ${freeTextQuery.trim()}`;
    } else if (topicKeywords.length > 0) {
      q = `AI ${topicKeywords.slice(0, 3).join(" OR ")}`;
    }

    const params = new URLSearchParams({
      q,
      lang: "en",
      max: String(Math.min(maxResults, 100)),
      sortby: "publishedAt",
      apikey: key,
    });

    const res = await fetch(`${GNEWS_API_BASE}/search?${params}`);
    const data = await res.json();

    return (data.articles || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (article: any, i: number) => ({
        id: `gnews-${i}-${Date.now()}`,
        title: article.title,
        summary: article.description || article.content || "",
        topic: matchTopic(article.title + " " + article.description, topicKeywords),
        source: article.source?.name || "Unknown",
        date: article.publishedAt,
        imageUrl: article.image || placeholderImage(i),
        url: article.url,
      })
    );
  } catch (err) {
    console.error("News fetch failed:", err);
    return [];
  }
}

// ─── Helpers ───────────────────────────────────────────────────────

/** Try to match a news article to one of the user's selected topics */
function matchTopic(text: string, selectedTopics: string[]): string {
  const lower = text.toLowerCase();
  for (const topic of selectedTopics) {
    const keywords = topicSearchTerms[topic];
    if (keywords && keywords.some((kw) => lower.includes(kw))) {
      return topic;
    }
  }
  // Fallback: try all topics
  for (const [topic, keywords] of Object.entries(topicSearchTerms)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return topic;
    }
  }
  return "technology"; // default bucket
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

/** Map topic ids to more specific search terms for the APIs */
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

/** Sort any array with a date field, newest first */
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

// ─── API key management ────────────────────────────────────────────

export function hasApiKeys(): { youtube: boolean; news: boolean } {
  return {
    youtube: !!getYouTubeKey(),
    news: !!getNewsKey(),
  };
}

export function saveApiKeys(youtube?: string, news?: string) {
  if (youtube !== undefined) localStorage.setItem("YOUTUBE_API_KEY", youtube);
  if (news !== undefined) localStorage.setItem("NEWS_API_KEY", news);
}

export function clearApiKeys() {
  localStorage.removeItem("YOUTUBE_API_KEY");
  localStorage.removeItem("NEWS_API_KEY");
}
