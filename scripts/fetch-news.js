#!/usr/bin/env node
// Pre-fetch news and YouTube data, save as static JSON for fast page loads.
// Runs in GitHub Actions on a schedule (no browser, no CORS issues).

const fs = require("fs");
const path = require("path");

const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search";
const PLAYLIST_ID = "PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";
const CHANNEL_ID = "UCwHJaEBaaSQPFHLUiMjHTtg";
const YOUTUBE_PLAYLIST_RSS = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const YOUTUBE_CHANNEL_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

const OUTPUT_DIR = path.join(__dirname, "..", "public", "data");

// ── Simple XML helpers (no external deps) ──────────────────────────

function getTagContent(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g");
  const matches = [];
  let m;
  while ((m = regex.exec(xml)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

function getTagAttr(xml, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "g");
  const matches = [];
  let m;
  while ((m = regex.exec(xml)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

function extractItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    items.push(m[1]);
  }
  return items;
}

function extractEntries(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xml)) !== null) {
    entries.push(m[1]);
  }
  return entries;
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

// ── Placeholder images ─────────────────────────────────────────────

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
];

// ── Topic matching (11 grouped categories) ────────────────────────

const topicSearchTerms = {
  "ai-academy": ["university", "education", "student", "academic", "research", "school", "learning", "curriculum"],
  "business-economy": ["business", "company", "startup", "enterprise", "market", "invest", "funding", "economy", "economic", "gdp", "trade", "finance", "stock", "inflation"],
  "chatbot-development": ["chatbot", "gpt", "llm", "language model", "claude", "gemini", "openai"],
  "digital-security": ["security", "cyber", "hack", "privacy", "encryption", "malware", "breach"],
  "environment-science": ["environment", "climate", "carbon", "green", "sustainable", "emission", "science", "scientific", "discovery", "physics", "biology", "quantum"],
  "governance-politics": ["governance", "regulation", "policy", "compliance", "framework", "politic", "government", "election", "congress", "legislation"],
  "health-style": ["health", "medical", "hospital", "patient", "disease", "drug", "diagnos", "fashion", "style", "trend", "luxury"],
  "musical-art": ["music", "song", "album", "artist", "spotify", "audio", "compose", "melody"],
  "technology-innovation": ["tech", "software", "hardware", "chip", "processor", "computing", "innovation", "breakthrough", "frontier", "pioneer"],
  "unmanned-aircraft": ["drone", "uav", "unmanned", "aerial", "quadcopter"],
  "visual-art-photography": ["art", "painting", "gallery", "museum", "creative", "artwork", "photo", "camera", "image", "portrait", "lens", "sensor", "dslr", "mirrorless"],
};

function matchTopic(text) {
  const lower = text.toLowerCase();
  for (const [topic, keywords] of Object.entries(topicSearchTerms)) {
    if (keywords.some((kw) => lower.includes(kw))) return topic;
  }
  return "technology-innovation";
}

// ── Fetch with retry ───────────────────────────────────────────────

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "TheDayAfterAI-NewsBot/1.0" },
      });
      if (res.ok) return await res.text();
      console.warn(`Fetch ${url} returned ${res.status}, retry ${i + 1}`);
    } catch (err) {
      console.warn(`Fetch ${url} failed: ${err.message}, retry ${i + 1}`);
    }
    await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

// ── Fetch news ─────────────────────────────────────────────────────

async function fetchAllNews() {
  const queries = [
    "artificial intelligence",
    "AI chatbot GPT",
    "AI technology innovation",
    "AI health science",
    "AI business economy",
  ];

  const allArticles = [];
  const seenTitles = new Set();

  for (const q of queries) {
    try {
      const rssUrl = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en&tbs=qdr:w`;
      const xml = await fetchWithRetry(rssUrl);
      const items = extractItems(xml);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const title = getTagContent(item, "title")[0] || "";
        if (!title || seenTitles.has(title)) continue;
        seenTitles.add(title);

        const link = getTagContent(item, "link")[0] || "";
        const pubDate = getTagContent(item, "pubDate")[0] || "";
        const source = getTagContent(item, "source")[0] || "Google News";
        const description = stripHtml(getTagContent(item, "description")[0] || "");

        allArticles.push({
          id: `gn-${allArticles.length}`,
          title,
          summary: description || title,
          topic: matchTopic(title + " " + description),
          source,
          date: pubDate,
          imageUrl: PLACEHOLDER_IMAGES[allArticles.length % PLACEHOLDER_IMAGES.length],
          url: link,
        });
      }
    } catch (err) {
      console.warn(`Failed to fetch query "${q}":`, err.message);
    }
  }

  // Sort newest first
  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`Fetched ${allArticles.length} news articles`);
  return allArticles;
}

// ── Fetch channel videos ───────────────────────────────────────────

function parseVideoEntries(xml) {
  const entries = extractEntries(xml);
  const videos = [];

  for (const entry of entries) {
    const videoId = getTagContent(entry, "yt:videoId")[0] || "";
    const title = getTagContent(entry, "title")[0] || "";
    const published = getTagContent(entry, "published")[0] || "";
    const description = getTagContent(entry, "media:description")[0] || "";
    const thumbnails = getTagAttr(entry, "media:thumbnail", "url");
    const thumbnail = thumbnails[0] || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    videos.push({
      id: videoId,
      videoId,
      title,
      thumbnail,
      publishedAt: published,
      description,
      channelTitle: "The Day After AI",
    });
  }

  return videos;
}

async function fetchChannelVideos() {
  // Try playlist RSS first (user's specific AI news playlist)
  try {
    console.log("Trying playlist RSS feed...");
    const xml = await fetchWithRetry(YOUTUBE_PLAYLIST_RSS);
    const videos = parseVideoEntries(xml);
    if (videos.length > 0) {
      console.log(`Fetched ${videos.length} videos from playlist RSS`);
      return videos;
    }
  } catch (err) {
    console.warn("Playlist RSS fetch failed:", err.message);
  }

  // Fall back to channel RSS
  try {
    console.log("Trying channel RSS feed...");
    const xml = await fetchWithRetry(YOUTUBE_CHANNEL_RSS);
    const videos = parseVideoEntries(xml);
    console.log(`Fetched ${videos.length} videos from channel RSS`);
    return videos;
  } catch (err) {
    console.warn("Channel RSS fetch also failed:", err.message);
    return [];
  }
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log("Starting news pre-fetch...");
  console.log(`Time: ${new Date().toISOString()}`);

  const [news, channelVideos] = await Promise.all([
    fetchAllNews(),
    fetchChannelVideos(),
  ]);

  const data = {
    fetchedAt: new Date().toISOString(),
    playlistUrl: PLAYLIST_URL,
    news,
    channelVideos,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "prefetched.json"),
    JSON.stringify(data, null, 2)
  );

  console.log(`Saved to public/data/prefetched.json (${news.length} articles, ${channelVideos.length} videos)`);
}

main().catch((err) => {
  console.error("Pre-fetch failed:", err);
  process.exit(1);
});
