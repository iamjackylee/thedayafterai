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
  // Decode HTML entities, then strip tags
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function generateImageUrl(title) {
  // Use Pollinations.ai to generate a unique AI image for each article
  const prompt = `professional news article cover image about: ${title}, clean modern design, photorealistic`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true`;
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
  // Per-category queries to ensure each gets ~30 articles
  const categoryQueries = {
    "ai-academy": [
      "AI education university research",
      "AI academic learning school curriculum",
    ],
    "business-economy": [
      "AI business economy startup funding",
      "AI company market invest stock finance",
    ],
    "chatbot-development": [
      "AI chatbot GPT LLM OpenAI",
      "AI Claude Gemini language model conversational",
    ],
    "digital-security": [
      "AI cybersecurity privacy digital security",
      "AI hack breach malware encryption",
    ],
    "environment-science": [
      "AI climate environment science quantum",
      "AI sustainable energy physics biology discovery",
    ],
    "governance-politics": [
      "AI regulation governance politics policy",
      "AI government legislation compliance framework",
    ],
    "health-style": [
      "AI health medical diagnosis treatment",
      "AI fashion style design trend luxury",
    ],
    "musical-art": [
      "AI music audio song compose Spotify",
      "AI album artist melody sound",
    ],
    "technology-innovation": [
      "AI technology innovation breakthrough",
      "AI chip semiconductor hardware computing software",
      "AI agent autonomous robot",
    ],
    "unmanned-aircraft": [
      "AI drone unmanned aircraft UAV aerial",
      "AI quadcopter flying delivery drone",
    ],
    "visual-art-photography": [
      "AI photography visual art camera image",
      "AI painting creative artwork gallery museum",
    ],
  };

  // Also add broad queries
  const broadQueries = [
    "artificial intelligence",
    "artificial intelligence news today",
  ];

  const allArticles = [];
  const seenTitles = new Set();

  async function fetchQuery(q) {
    try {
      const rssUrl = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en&num=40`;
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
          imageUrl: generateImageUrl(title),
          url: link,
        });
      }
    } catch (err) {
      console.warn(`Failed to fetch query "${q}":`, err.message);
    }
  }

  // Fetch per-category queries
  for (const [category, queries] of Object.entries(categoryQueries)) {
    for (const q of queries) {
      await fetchQuery(q);
    }
    // Count how many we have for this category
    const count = allArticles.filter((a) => a.topic === category).length;
    console.log(`  ${category}: ${count} articles`);
  }

  // Fetch broad queries for additional coverage
  for (const q of broadQueries) {
    await fetchQuery(q);
  }

  // Sort newest first
  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Log per-category counts
  const counts = {};
  for (const a of allArticles) {
    counts[a.topic] = (counts[a.topic] || 0) + 1;
  }
  console.log(`Fetched ${allArticles.length} total news articles`);
  console.log("Per-category counts:", JSON.stringify(counts, null, 2));

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
      channelTitle: "TheDayAfterAI",
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

// ── Fetch OG image from article URL ──────────────────────────────

async function fetchOgImage(url) {
  if (!url) return "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TheDayAfterAI-NewsBot/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    // Look for og:image meta tag
    const ogMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );
    if (ogMatch && ogMatch[1]) return ogMatch[1];
    // Fallback: twitter:image
    const twMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );
    if (twMatch && twMatch[1]) return twMatch[1];
    return "";
  } catch {
    return "";
  }
}

// ── Fetch TheDayAfterAI.com blog articles ────────────────────────

const TDAAI_RSS_URLS = [
  "https://www.thedayafterai.com/blog?format=rss",
  "https://thedayafterai.com/blog?format=rss",
  "https://www.thedayafterai.com/?format=rss",
  "https://thedayafterai.com/?format=rss",
];

async function fetchTdaaiArticles() {
  console.log("Fetching TheDayAfterAI.com blog articles...");
  let xml = "";

  for (const rssUrl of TDAAI_RSS_URLS) {
    try {
      xml = await fetchWithRetry(rssUrl, 2);
      if (xml && xml.includes("<item>")) {
        console.log(`  Found RSS feed at: ${rssUrl}`);
        break;
      }
    } catch {
      // try next URL
    }
  }

  if (!xml || !xml.includes("<item>")) {
    // Fallback: try scraping the main page for blog posts
    console.log("  RSS not available, trying HTML scrape...");
    try {
      return await scrapeTdaaiHtml();
    } catch (err) {
      console.warn("  TheDayAfterAI.com scraping failed:", err.message);
      return [];
    }
  }

  const items = extractItems(xml);
  const articles = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const title = getTagContent(item, "title")[0] || "";
    if (!title) continue;

    const link = getTagContent(item, "link")[0] || "";
    const pubDate = getTagContent(item, "pubDate")[0] || "";
    const description = stripHtml(getTagContent(item, "description")[0] || "");

    // Extract image from enclosure, media:content, or description HTML
    let imageUrl = "";
    const enclosureUrl = getTagAttr(item, "enclosure", "url");
    if (enclosureUrl.length > 0) {
      imageUrl = enclosureUrl[0];
    }
    if (!imageUrl) {
      const mediaUrl = getTagAttr(item, "media:content", "url");
      if (mediaUrl.length > 0) imageUrl = mediaUrl[0];
    }
    if (!imageUrl) {
      // Try to find image in raw description HTML
      const rawDesc = getTagContent(item, "description")[0] || "";
      const imgMatch = rawDesc.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif)[^"']*)/i);
      if (imgMatch) imageUrl = imgMatch[1].replace(/&amp;/g, "&");
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

  console.log(`  Fetched ${articles.length} articles from TheDayAfterAI.com`);
  return articles;
}

async function scrapeTdaaiHtml() {
  const urls = [
    "https://www.thedayafterai.com/blog",
    "https://thedayafterai.com/blog",
    "https://www.thedayafterai.com",
    "https://thedayafterai.com",
  ];

  let html = "";
  for (const url of urls) {
    try {
      html = await fetchWithRetry(url, 2);
      if (html && html.length > 1000) break;
    } catch {
      // try next
    }
  }

  if (!html) return [];

  // Squarespace blog posts typically have structured data or summary blocks
  const articles = [];

  // Try JSON-LD structured data
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      try {
        const jsonStr = block.replace(/<\/?script[^>]*>/gi, "");
        const data = JSON.parse(jsonStr);
        const items = Array.isArray(data) ? data : data.itemListElement || [data];
        for (const item of items) {
          if (item["@type"] === "BlogPosting" || item["@type"] === "Article" || item["@type"] === "NewsArticle") {
            articles.push({
              id: `tdaai-html-${articles.length}`,
              title: item.headline || item.name || "",
              summary: item.description || "",
              date: item.datePublished || item.dateCreated || "",
              imageUrl: (typeof item.image === "string" ? item.image : item.image?.url) || "",
              url: item.url || item.mainEntityOfPage || "",
              source: "TheDayAfterAI",
            });
          }
        }
      } catch {
        // invalid JSON, skip
      }
    }
  }

  if (articles.length > 0) {
    console.log(`  Scraped ${articles.length} articles from HTML structured data`);
    return articles;
  }

  // Fallback: parse Squarespace summary blocks
  const blogItemRegex = /<article[^>]*class="[^"]*summary-item[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  let match;
  while ((match = blogItemRegex.exec(html)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<a[^>]*class="[^"]*summary-title[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
    const linkMatch = block.match(/<a[^>]*href=["']([^"']+)["']/i);
    const imgMatch = block.match(/data-src=["']([^"']+)["']/i) || block.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)/i);

    if (titleMatch) {
      const title = stripHtml(titleMatch[1]);
      articles.push({
        id: `tdaai-html-${articles.length}`,
        title,
        summary: "",
        date: "",
        imageUrl: imgMatch ? imgMatch[1].replace(/&amp;/g, "&") : "",
        url: linkMatch ? (linkMatch[1].startsWith("http") ? linkMatch[1] : `https://www.thedayafterai.com${linkMatch[1]}`) : "",
        source: "TheDayAfterAI",
      });
    }
  }

  console.log(`  Scraped ${articles.length} articles from HTML`);
  return articles;
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log("Starting news pre-fetch...");
  console.log(`Time: ${new Date().toISOString()}`);

  const [news, channelVideos, tdaaiArticles] = await Promise.all([
    fetchAllNews(),
    fetchChannelVideos(),
    fetchTdaaiArticles(),
  ]);

  // Fetch OG images for news articles that use AI-generated placeholders
  console.log("Fetching OG images for news articles...");
  const ogImageBatchSize = 10;
  for (let i = 0; i < news.length; i += ogImageBatchSize) {
    const batch = news.slice(i, i + ogImageBatchSize);
    const results = await Promise.allSettled(
      batch.map(async (article) => {
        if (article.url && article.imageUrl.includes("pollinations.ai")) {
          const ogImg = await fetchOgImage(article.url);
          if (ogImg) article.imageUrl = ogImg;
        }
      })
    );
  }
  const ogCount = news.filter((a) => !a.imageUrl.includes("pollinations.ai")).length;
  console.log(`  Replaced ${ogCount} article images with OG images`);

  // Also fetch OG images for TDAAI articles missing images
  for (let i = 0; i < tdaaiArticles.length; i += ogImageBatchSize) {
    const batch = tdaaiArticles.slice(i, i + ogImageBatchSize);
    await Promise.allSettled(
      batch.map(async (article) => {
        if (!article.imageUrl && article.url) {
          const ogImg = await fetchOgImage(article.url);
          if (ogImg) article.imageUrl = ogImg;
        }
      })
    );
  }

  const data = {
    fetchedAt: new Date().toISOString(),
    playlistUrl: PLAYLIST_URL,
    news,
    channelVideos,
    tdaaiArticles,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "prefetched.json"),
    JSON.stringify(data, null, 2)
  );

  console.log(`Saved to public/data/prefetched.json (${news.length} articles, ${channelVideos.length} videos, ${tdaaiArticles.length} TDAAI articles)`);
}

main().catch((err) => {
  console.error("Pre-fetch failed:", err);
  process.exit(1);
});
