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

interface CustomSectionConfig {
  id: string;
  title: string;
  color: string;
  pageUrl?: string;
  categoryFilter?: string;
  articles: CustomArticle[];
}

/** Fetch articles from a Squarespace collection, filtered by category */
async function fetchSquarespaceCollection(
  pageUrl: string,
  categoryFilter: string
): Promise<CustomArticle[]> {
  const jsonUrl = `${pageUrl}?format=json&category=${encodeURIComponent(categoryFilter)}`;
  const text = await fetchWithProxy(jsonUrl);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = JSON.parse(text) as any;

  const items = data.items || data.collection?.items || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return items.map((item: any, i: number) => ({
    id: `sqsp-${i}-${item.id || ""}`,
    title: (item.title || "").replace(/&amp;/g, "&"),
    date: item.publishOn
      ? new Date(item.publishOn).toISOString().split("T")[0]
      : "",
    imageUrl: item.assetUrl || "",
    url: item.fullUrl
      ? `https://www.thedayafterai.com${item.fullUrl}`
      : "",
    source: "TheDayAfterAI",
  }));
}

export async function fetchCustomSections(): Promise<CustomSection[]> {
  // Load config (section metadata + fallback articles) from static JSON
  let configs: CustomSectionConfig[] = [];
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const res = await fetch(`${basePath}/data/custom-articles.json`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    configs = data.sections || [];
  } catch {
    return [];
  }

  const sections: CustomSection[] = [];

  for (const config of configs) {
    // Try dynamic fetch from Squarespace API via CORS proxy
    if (config.pageUrl && config.categoryFilter) {
      try {
        const articles = await fetchSquarespaceCollection(
          config.pageUrl,
          config.categoryFilter
        );
        if (articles.length > 0) {
          sections.push({
            id: config.id,
            title: config.title,
            color: config.color,
            articles,
          });
          continue;
        }
      } catch {
        // Dynamic fetch failed — fall through to static articles
      }
    }

    // Fall back to static articles from JSON
    sections.push({
      id: config.id,
      title: config.title,
      color: config.color,
      articles: config.articles || [],
    });
  }

  return sections;
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
      // Decode HTML entities to get raw HTML for image extraction
      const decodedDesc = description
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      const summary = decodedDesc
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      // Extract image from RSS item: media:content, enclosure, or description <img>
      let imageUrl = "";
      const mediaContent = item.getElementsByTagName("media:content")[0];
      if (mediaContent) {
        const mediaUrl = mediaContent.getAttribute("url");
        if (mediaUrl && !isGenericImage(mediaUrl)) imageUrl = mediaUrl;
      }
      if (!imageUrl) {
        const enclosure = item.getElementsByTagName("enclosure")[0];
        if (enclosure) {
          const encUrl = enclosure.getAttribute("url");
          if (encUrl && !isGenericImage(encUrl)) imageUrl = encUrl;
        }
      }
      if (!imageUrl) {
        // Google News includes publisher images in description HTML
        const imgMatch = decodedDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch?.[1] && !isGenericImage(imgMatch[1])) imageUrl = imgMatch[1];
      }

      const rawTopic = matchTopic(
        title + " " + summary,
        topicKeywords.map((k) => k.toLowerCase())
      );
      const groupedTopic = TOPIC_GROUP_MAP[rawTopic] || rawTopic;

      articles.push({
        id: `gn-${i}-${Date.now()}`,
        title,
        summary: summary || title,
        topic: groupedTopic,
        source: source || "Google News",
        date: pubDate,
        imageUrl: imageUrl || generateImageUrl(title, groupedTopic),
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

// Topic-specific fallback images from Unsplash CDN (reliable, no rate limits)
const TOPIC_FALLBACK_IMAGES: Record<string, string[]> = {
  "ai-academy": [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop&auto=format",
  ],
  "business-economy": [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop&auto=format",
  ],
  "chatbot-development": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&h=400&fit=crop&auto=format",
  ],
  "digital-security": [
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&h=400&fit=crop&auto=format",
  ],
  "environment-science": [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop&auto=format",
  ],
  "governance-politics": [
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=400&fit=crop&auto=format",
  ],
  "health-style": [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop&auto=format",
  ],
  "musical-art": [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop&auto=format",
  ],
  "technology-innovation": [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&auto=format",
  ],
  "unmanned-aircraft": [
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&h=400&fit=crop&auto=format",
  ],
  "visual-art-photography": [
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=400&fit=crop&auto=format",
  ],
};

function generateImageUrl(title: string, topic?: string): string {
  const images = TOPIC_FALLBACK_IMAGES[topic || "technology-innovation"] || TOPIC_FALLBACK_IMAGES["technology-innovation"];
  // Deterministic pick based on title hash
  const hash = title.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return images[hash % images.length];
}

/** Check if an image URL looks like a generic logo rather than article content */
function isGenericImage(url: string): boolean {
  if (!url) return true;
  // Google's image proxy (lh3.googleusercontent.com) serves real article images — allow it
  if (/lh\d\.googleusercontent\.com/i.test(url)) return false;
  return /news\.google\.com|googlenews|gstatic\.com.*\/news|\/logo|\/favicon|default[-_]?image|placeholder|\/avatar/i.test(url);
}

/** Try to extract og:image from an article URL via CORS proxy.
 *  For Google News redirect URLs, the CORS proxy may follow the redirect
 *  and return the actual article page — we filter out Google's own og:image. */
async function fetchOgImage(url: string): Promise<string> {
  if (!url) return "";
  try {
    const html = await fetchWithProxy(url);
    // If the proxy returned Google's own page (not the article), bail out
    if (url.includes("news.google.com") && !html.includes("<article") && html.includes("google.com/news")) {
      return "";
    }
    // og:image
    const ogMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );
    if (ogMatch?.[1] && !isGenericImage(ogMatch[1])) return ogMatch[1];
    // twitter:image
    const twMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );
    if (twMatch?.[1] && !isGenericImage(twMatch[1])) return twMatch[1];
    // Fallback: first content image in the page (for sites without OG tags)
    const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
    for (const m of imgMatches) {
      const src = m[1];
      if (!src || isGenericImage(src)) continue;
      // Skip tiny icons, tracking pixels, data URIs, and SVGs
      if (/\.svg|data:|1x1|pixel|spacer|blank|badge|icon|widget/i.test(src)) continue;
      // Prefer images that look like content (with reasonable path depth or CDN)
      if (/\.(jpg|jpeg|png|webp)/i.test(src) || /cdn|images|media|uploads|wp-content/i.test(src)) {
        return src;
      }
    }
  } catch {
    // ignore — OG image fetch is best-effort
  }
  return "";
}

/** Enhance articles: replace fallback placeholder images with real OG images.
 *  Tries all articles (including Google News redirects — some CORS proxies follow them). */
export async function enhanceArticleImages(
  articles: NewsArticle[],
  maxConcurrent = 5
): Promise<void> {
  const toFix = articles.filter(
    (a) => (a.imageUrl.includes("unsplash.com") || a.imageUrl.includes("pollinations.ai")) && a.url
  );
  for (let i = 0; i < toFix.length; i += maxConcurrent) {
    const batch = toFix.slice(i, i + maxConcurrent);
    await Promise.allSettled(
      batch.map(async (article) => {
        const og = await fetchOgImage(article.url);
        if (og) article.imageUrl = og;
      })
    );
  }
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

// ─── TheDayAfterAI.com articles ──────────────────────────────────

export async function fetchTdaaiArticles(): Promise<TdaaiArticle[]> {
  // Try pre-fetched data first
  const prefetched = await loadPrefetched();
  if (prefetched && prefetched.tdaaiArticles && prefetched.tdaaiArticles.length > 0) {
    return prefetched.tdaaiArticles;
  }

  // Fallback: try live RSS from thedayafterai.com (through CORS proxy)
  const rssUrls = [
    "https://www.thedayafterai.com/blog?format=rss",
    "https://thedayafterai.com/blog?format=rss",
    "https://www.thedayafterai.com/?format=rss",
  ];

  for (const rssUrl of rssUrls) {
    try {
      const xml = await fetchWithProxy(rssUrl);
      if (!xml.includes("<item>")) continue;

      const doc = parseXML(xml);
      const items = doc.getElementsByTagName("item");
      const articles: TdaaiArticle[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const title = getTextContent(item, "title");
        if (!title) continue;
        const link = getTextContent(item, "link");
        const pubDate = getTextContent(item, "pubDate");
        const description = getTextContent(item, "description")
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim();

        // Extract image from enclosure or media:content
        let imageUrl = "";
        const enclosure = item.getElementsByTagName("enclosure")[0];
        if (enclosure) imageUrl = enclosure.getAttribute("url") || "";
        if (!imageUrl) {
          const media = item.getElementsByTagName("media:content")[0];
          if (media) imageUrl = media.getAttribute("url") || "";
        }

        articles.push({
          id: `tdaai-${i}`,
          title,
          summary: description || title,
          date: pubDate,
          imageUrl,
          url: link,
          source: "TheDayAfterAI",
        });
      }

      if (articles.length > 0) return articles;
    } catch {
      // try next URL
    }
  }

  return [];
}

// ─── Channel constants ────────────────────────────────────────────

export const CHANNEL_URL = "https://www.youtube.com/@thedayafterai";
export const PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";
export const CHANNEL_NAME = "TheDayAfterAI";
