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

// Topic-specific fallback images from Unsplash CDN (reliable, no rate limits)
const TOPIC_FALLBACK_IMAGES = {
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

function generateImageUrl(title, topic) {
  const images = TOPIC_FALLBACK_IMAGES[topic || "technology-innovation"] || TOPIC_FALLBACK_IMAGES["technology-innovation"];
  // Deterministic pick based on title hash
  const hash = title.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return images[hash % images.length];
}

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
        const rawDescription = getTagContent(item, "description")[0] || "";
        const description = stripHtml(rawDescription);

        // Extract image from RSS item: try media:content, enclosure, then description <img>
        let imageUrl = "";
        const mediaUrls = getTagAttr(item, "media:content", "url");
        if (mediaUrls.length > 0 && !isGenericImage(mediaUrls[0])) {
          imageUrl = mediaUrls[0];
        }
        if (!imageUrl) {
          const enclosureUrls = getTagAttr(item, "enclosure", "url");
          if (enclosureUrls.length > 0 && !isGenericImage(enclosureUrls[0])) {
            imageUrl = enclosureUrls[0];
          }
        }
        if (!imageUrl) {
          // Google News puts publisher images in description HTML as <img src="...">
          const decodedDesc = rawDescription
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&").replace(/&quot;/g, '"');
          const imgMatch = decodedDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch && imgMatch[1] && !isGenericImage(imgMatch[1])) {
            imageUrl = imgMatch[1];
          }
        }

        const topic = matchTopic(title + " " + description);
        allArticles.push({
          id: `gn-${allArticles.length}`,
          title,
          summary: description || title,
          topic,
          source,
          date: pubDate,
          imageUrl: imageUrl || generateImageUrl(title, topic),
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

// ── Resolve Google News redirect URLs ─────────────────────────────

async function resolveGoogleNewsUrl(gnUrl) {
  if (!gnUrl || !gnUrl.includes("news.google.com")) return gnUrl;
  try {
    // Method 1: Follow all redirects and check final URL
    const res = await fetch(gnUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    // Check if we were redirected to the real article
    if (res.url && !res.url.includes("news.google.com") && !res.url.includes("consent.google")) {
      return res.url;
    }
    // Method 2: Parse the response HTML for redirect clues
    const html = await res.text();
    // Look for canonical link
    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (canonMatch && !canonMatch[1].includes("news.google.com") && !canonMatch[1].includes("consent.google")) return canonMatch[1];
    // Look for data-redirect or data-url attributes
    const dataUrl = html.match(/data-(?:redirect|url)=["'](https?:\/\/(?!news\.google\.com)[^"']+)["']/i);
    if (dataUrl) return dataUrl[1];
    // Look for JS redirect: window.location or location.href
    const jsRedirect = html.match(/(?:window\.location|location\.href)\s*=\s*["'](https?:\/\/(?!news\.google\.com)[^"']+)["']/i);
    if (jsRedirect) return jsRedirect[1];
    // Look for any non-Google href as last resort
    const hrefMatch = html.match(/href=["'](https?:\/\/(?!news\.google\.com|consent\.google|accounts\.google)[^"']+)["']/i);
    if (hrefMatch) return hrefMatch[1];
  } catch {
    // ignore — keep original URL
  }
  return gnUrl;
}

// ── Fetch OG image from article URL ──────────────────────────────

// Reject images that are clearly generic logos, not article-specific thumbnails
const REJECTED_IMAGE_PATTERNS = [
  /news\.google\.com/i,
  /googlenews/i,
  /gstatic\.com.*\/news/i,
  /\/logo/i,
  /\/favicon/i,
  /icon[-_]?\d+/i,
  /default[-_]?image/i,
  /placeholder/i,
  /\/avatar/i,
];

function isGenericImage(url) {
  if (!url) return true;
  // Google's image proxy (lh3.googleusercontent.com) serves real article images — allow it
  if (/lh\d\.googleusercontent\.com/i.test(url)) return false;
  // Very small images are likely icons/logos
  if (/(?:width|w|size)=(?:1\d{0,2}|[1-9]\d?)(?:\D|$)/i.test(url)) return true;
  return REJECTED_IMAGE_PATTERNS.some((re) => re.test(url));
}

async function fetchOgImage(url) {
  if (!url) return "";
  // Don't try to get OG image from Google News URLs directly — resolve first
  if (url.includes("news.google.com")) return "";
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
    if (ogMatch && ogMatch[1] && !isGenericImage(ogMatch[1])) return ogMatch[1];
    // Fallback: twitter:image
    const twMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );
    if (twMatch && twMatch[1] && !isGenericImage(twMatch[1])) return twMatch[1];
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

  // Step 1: Resolve Google News redirect URLs to actual publisher URLs
  console.log("Resolving Google News redirect URLs...");
  const resolveBatchSize = 10;
  let resolvedCount = 0;
  for (let i = 0; i < news.length; i += resolveBatchSize) {
    const batch = news.slice(i, i + resolveBatchSize);
    await Promise.allSettled(
      batch.map(async (article) => {
        if (article.url && article.url.includes("news.google.com")) {
          const resolved = await resolveGoogleNewsUrl(article.url);
          if (resolved !== article.url) {
            article.url = resolved;
            resolvedCount++;
          }
        }
      })
    );
  }
  console.log(`  Resolved ${resolvedCount}/${news.length} Google News URLs to publisher URLs`);

  // Step 2: Fetch OG images from the resolved publisher URLs
  console.log("Fetching OG images for news articles...");
  const ogImageBatchSize = 10;
  for (let i = 0; i < news.length; i += ogImageBatchSize) {
    const batch = news.slice(i, i + ogImageBatchSize);
    await Promise.allSettled(
      batch.map(async (article) => {
        if (article.url && (article.imageUrl.includes("unsplash.com") || article.imageUrl.includes("pollinations.ai"))) {
          const ogImg = await fetchOgImage(article.url);
          if (ogImg) article.imageUrl = ogImg;
        }
      })
    );
  }
  const ogCount = news.filter((a) => !a.imageUrl.includes("unsplash.com") && !a.imageUrl.includes("pollinations.ai")).length;
  console.log(`  Replaced ${ogCount} article images with real OG images`);

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
