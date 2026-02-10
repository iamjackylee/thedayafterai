#!/usr/bin/env node
// Pre-fetch news and YouTube data, save as static JSON for fast page loads.
// Uses Google News RSS to discover articles, then Playwright to resolve
// each Google redirect URL to the actual publisher URL and fetch the real
// OG image — so every article link and thumbnail is real, not a Google proxy.
//
// Runs in GitHub Actions on a schedule (hourly) and on deploy.

const fs = require("fs");
const path = require("path");

const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search";
const PLAYLIST_ID = "PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";
const CHANNEL_ID = "UCwHJaEBaaSQPFHLUiMjHTtg";
const YOUTUBE_PLAYLIST_RSS = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const YOUTUBE_CHANNEL_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

const OUTPUT_DIR = path.join(__dirname, "..", "public", "data");
const URL_CACHE_PATH = path.join(OUTPUT_DIR, "url-cache.json");

const ARTICLES_PER_CATEGORY = 30;
const PLAYWRIGHT_CONCURRENCY = 5;
const PLAYWRIGHT_TIMEOUT = 15000;

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

// ── Fallback images ────────────────────────────────────────────────

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
  const hash = title.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return images[hash % images.length];
}

// ── Topic matching ─────────────────────────────────────────────────

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

// ── Helpers ────────────────────────────────────────────────────────

function isGenericImage(url) {
  if (!url) return true;
  if (/lh\d\.googleusercontent\.com/i.test(url)) return false;
  if (/(?:width|w|size)=(?:1\d{0,2}|[1-9]\d?)(?:\D|$)/i.test(url)) return true;
  return [/news\.google\.com/i, /googlenews/i, /gstatic\.com.*\/news/i, /\/logo/i, /\/favicon/i, /icon[-_]?\d+/i, /default[-_]?image/i, /placeholder/i, /\/avatar/i].some((re) => re.test(url));
}

function extractArticleId(url) {
  if (!url) return null;
  const match = url.match(/\/articles\/([^?]+)/);
  return match ? match[1] : null;
}

function loadUrlCache() {
  try { return JSON.parse(fs.readFileSync(URL_CACHE_PATH, "utf-8")); } catch { return {}; }
}

function saveUrlCache(cache) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(URL_CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
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

// ── Fetch news from Google News RSS ────────────────────────────────

async function fetchAllNews() {
  const categoryQueries = {
    "ai-academy": ["AI education university research", "AI academic learning school curriculum"],
    "business-economy": ["AI business economy startup funding", "AI company market invest stock finance"],
    "chatbot-development": ["AI chatbot GPT LLM OpenAI", "AI Claude Gemini language model conversational"],
    "digital-security": ["AI cybersecurity privacy digital security", "AI hack breach malware encryption"],
    "environment-science": ["AI climate environment science quantum", "AI sustainable energy physics biology discovery"],
    "governance-politics": ["AI regulation governance politics policy", "AI government legislation compliance framework"],
    "health-style": ["AI health medical diagnosis treatment", "AI fashion style design trend luxury"],
    "musical-art": ["AI music audio song compose Spotify", "AI album artist melody sound"],
    "technology-innovation": ["AI technology innovation breakthrough", "AI chip semiconductor hardware computing software", "AI agent autonomous robot"],
    "unmanned-aircraft": ["AI drone unmanned aircraft UAV aerial", "AI quadcopter flying delivery drone"],
    "visual-art-photography": ["AI photography visual art camera image", "AI painting creative artwork gallery museum"],
  };

  // Collect articles per category, capped at ARTICLES_PER_CATEGORY
  const perCategory = {};
  const seenTitles = new Set();

  for (const [category, queries] of Object.entries(categoryQueries)) {
    perCategory[category] = [];

    for (const q of queries) {
      if (perCategory[category].length >= ARTICLES_PER_CATEGORY) break;

      try {
        const rssUrl = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en&num=40`;
        const xml = await fetchWithRetry(rssUrl);
        const items = extractItems(xml);

        for (const item of items) {
          if (perCategory[category].length >= ARTICLES_PER_CATEGORY) break;

          const title = getTagContent(item, "title")[0] || "";
          if (!title || seenTitles.has(title)) continue;
          seenTitles.add(title);

          const link = getTagContent(item, "link")[0] || "";
          const pubDate = getTagContent(item, "pubDate")[0] || "";
          const source = getTagContent(item, "source")[0] || "Google News";
          const rawDescription = getTagContent(item, "description")[0] || "";
          const description = stripHtml(rawDescription);

          // Extract RSS image
          let imageUrl = "";
          const mediaUrls = getTagAttr(item, "media:content", "url");
          if (mediaUrls.length > 0 && !isGenericImage(mediaUrls[0])) imageUrl = mediaUrls[0];
          if (!imageUrl) {
            const enclosureUrls = getTagAttr(item, "enclosure", "url");
            if (enclosureUrls.length > 0 && !isGenericImage(enclosureUrls[0])) imageUrl = enclosureUrls[0];
          }
          if (!imageUrl) {
            const decodedDesc = rawDescription.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
            const imgMatch = decodedDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch && imgMatch[1] && !isGenericImage(imgMatch[1])) imageUrl = imgMatch[1];
          }

          perCategory[category].push({
            id: `gn-${category}-${perCategory[category].length}`,
            title,
            summary: description || title,
            topic: category,
            source,
            date: pubDate,
            imageUrl: imageUrl || "",
            url: link,
          });
        }
      } catch (err) {
        console.warn(`  Failed query "${q}": ${err.message}`);
      }
    }

    console.log(`  ${category}: ${perCategory[category].length} articles`);
  }

  // Flatten and sort by date
  const allArticles = Object.values(perCategory).flat();
  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  console.log(`Total: ${allArticles.length} articles (${ARTICLES_PER_CATEGORY} per category)`);

  return allArticles;
}

// ── Resolve Google URLs + fetch OG images via Playwright ───────────

async function resolveArticles(articles) {
  const cache = loadUrlCache();
  const cacheSize = Object.keys(cache).length;
  console.log(`URL cache: ${cacheSize} entries`);

  // Apply cached resolutions first
  let cacheHits = 0;
  for (const article of articles) {
    const id = extractArticleId(article.url);
    if (id && cache[id]) {
      article.url = cache[id].url || article.url;
      if (cache[id].imageUrl && !article.imageUrl) article.imageUrl = cache[id].imageUrl;
      cacheHits++;
    }
  }
  console.log(`Applied ${cacheHits} cached resolutions`);

  // Find articles still needing resolution (Google News URLs)
  const toResolve = articles.filter((a) => a.url && a.url.includes("news.google.com"));
  if (toResolve.length === 0) {
    console.log("All URLs resolved from cache!");
    saveUrlCache(cache);
    return;
  }

  console.log(`Resolving ${toResolve.length} URLs via Playwright...`);

  // Load Playwright
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    try {
      ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
    } catch {
      console.warn("Playwright not available — keeping Google News URLs for now.");
      return;
    }
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  });

  let resolved = 0;
  let failed = 0;

  for (let i = 0; i < toResolve.length; i += PLAYWRIGHT_CONCURRENCY) {
    const batch = toResolve.slice(i, i + PLAYWRIGHT_CONCURRENCY);
    const promises = batch.map(async (article) => {
      const gnUrl = article.url;
      const articleId = extractArticleId(gnUrl);
      const page = await context.newPage();

      try {
        // Navigate to Google News URL — follows redirect to actual article
        await page.goto(gnUrl, { waitUntil: "domcontentloaded", timeout: PLAYWRIGHT_TIMEOUT });
        await page.waitForTimeout(2000);

        let finalUrl = page.url();

        // If still on Google, try extracting from page content
        if (finalUrl.includes("news.google.com") || finalUrl.includes("consent.google")) {
          const extracted = await page.evaluate(() => {
            const c = document.querySelector('link[rel="canonical"]');
            if (c?.href && !c.href.includes("news.google.com")) return c.href;
            const o = document.querySelector('meta[property="og:url"]');
            if (o?.content && !o.content.includes("news.google.com")) return o.content;
            const d = document.querySelector("a[data-n-au]");
            if (d) return d.getAttribute("data-n-au");
            return null;
          });
          if (extracted) finalUrl = extracted;
        }

        const isResolved =
          finalUrl &&
          !finalUrl.includes("news.google.com") &&
          !finalUrl.includes("consent.google") &&
          !finalUrl.includes("accounts.google");

        if (isResolved) {
          article.url = finalUrl;

          // Now extract OG image from the real article page
          const meta = await page.evaluate(() => {
            const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
            const twImg = document.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || "";
            return ogImg || twImg || "";
          });
          if (meta && !isGenericImage(meta)) {
            article.imageUrl = meta;
          }

          // Cache the result
          if (articleId) {
            cache[articleId] = { url: finalUrl, imageUrl: article.imageUrl };
          }
          resolved++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      } finally {
        await page.close();
      }
    });

    await Promise.allSettled(promises);

    const processed = Math.min(i + PLAYWRIGHT_CONCURRENCY, toResolve.length);
    if (processed % 25 < PLAYWRIGHT_CONCURRENCY || processed >= toResolve.length) {
      console.log(`  ${processed}/${toResolve.length} (resolved: ${resolved}, failed: ${failed})`);
    }
  }

  await browser.close();
  saveUrlCache(cache);

  console.log(`Resolution done: ${resolved} resolved, ${failed} failed`);
  console.log(`Total with real URLs: ${articles.filter((a) => !a.url.includes("news.google.com")).length}/${articles.length}`);

  // For any articles still missing images, use fallback
  for (const article of articles) {
    if (!article.imageUrl) {
      article.imageUrl = generateImageUrl(article.title, article.topic);
    }
  }
}

// ── YouTube ────────────────────────────────────────────────────────

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
    videos.push({ id: videoId, videoId, title, thumbnail, publishedAt: published, description, channelTitle: "TheDayAfterAI" });
  }
  return videos;
}

async function fetchChannelVideos() {
  try {
    console.log("Trying playlist RSS feed...");
    const xml = await fetchWithRetry(YOUTUBE_PLAYLIST_RSS);
    const videos = parseVideoEntries(xml);
    if (videos.length > 0) { console.log(`Fetched ${videos.length} videos from playlist RSS`); return videos; }
  } catch (err) { console.warn("Playlist RSS fetch failed:", err.message); }

  try {
    console.log("Trying channel RSS feed...");
    const xml = await fetchWithRetry(YOUTUBE_CHANNEL_RSS);
    const videos = parseVideoEntries(xml);
    console.log(`Fetched ${videos.length} videos from channel RSS`);
    return videos;
  } catch (err) { console.warn("Channel RSS also failed:", err.message); return []; }
}

// ── TheDayAfterAI.com blog articles ───────────────────────────────

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
      if (xml && xml.includes("<item>")) { console.log(`  Found RSS at: ${rssUrl}`); break; }
    } catch { /* try next */ }
  }

  if (!xml || !xml.includes("<item>")) {
    console.log("  RSS not available");
    return [];
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
    let imageUrl = "";
    const enclosureUrl = getTagAttr(item, "enclosure", "url");
    if (enclosureUrl.length > 0) imageUrl = enclosureUrl[0];
    if (!imageUrl) { const mediaUrl = getTagAttr(item, "media:content", "url"); if (mediaUrl.length > 0) imageUrl = mediaUrl[0]; }
    if (!imageUrl) { const rawDesc = getTagContent(item, "description")[0] || ""; const imgMatch = rawDesc.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif)[^"']*)/i); if (imgMatch) imageUrl = imgMatch[1].replace(/&amp;/g, "&"); }
    articles.push({ id: `tdaai-${i}`, title, summary: description || title, date: pubDate, imageUrl, url: link, source: "TheDayAfterAI" });
  }
  console.log(`  Fetched ${articles.length} articles from TheDayAfterAI.com`);
  return articles;
}

// ── Enhance custom-articles.json ──────────────────────────────────

async function enhanceCustomArticles() {
  const customPath = path.join(OUTPUT_DIR, "custom-articles.json");
  let customData;
  try { customData = JSON.parse(fs.readFileSync(customPath, "utf-8")); } catch { return; }
  if (!customData.sections || customData.sections.length === 0) return;
  // OG image enhancement handled by fetch-custom-urls.js (Playwright)
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

  // Resolve Google News URLs to actual publisher URLs + fetch OG images
  console.log("\n=== Resolving Google News URLs to publisher URLs ===");
  await resolveArticles(news);

  const data = {
    fetchedAt: new Date().toISOString(),
    playlistUrl: PLAYLIST_URL,
    news,
    channelVideos,
    tdaaiArticles,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, "prefetched.json"), JSON.stringify(data, null, 2));

  const realUrlCount = news.filter((a) => !a.url.includes("news.google.com")).length;
  const realImgCount = news.filter((a) => a.imageUrl && !a.imageUrl.includes("unsplash.com")).length;
  console.log(`\nSaved: ${news.length} articles (${realUrlCount} real URLs, ${realImgCount} real images), ${channelVideos.length} videos, ${tdaaiArticles.length} TDAAI articles`);
}

main().catch((err) => {
  console.error("Pre-fetch failed:", err);
  process.exit(1);
});
