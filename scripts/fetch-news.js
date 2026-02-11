#!/usr/bin/env node
// Pre-fetch news, YouTube, and custom articles as static JSON for fast page loads.
//
// Modes:
//   --all     Full fetch of all categories + YouTube + custom articles (used by deploy)
//   (none)    Rotating fetch: one slot every 10 min, cycling through all content
//
// Rotation slots (13 total, ~130 min full cycle):
//   Slots 0-10:  News categories (one per slot, 50 articles each, Playwright URL+image)
//   Slot 11:     YouTube + TheDayAfterAI RSS (fast, no Playwright)
//   Slot 12:     AI Market Insight custom articles from thedayafterai.com (Playwright)

const fs = require("fs");
const path = require("path");

const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search";
const PLAYLIST_ID = "PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";
const CHANNEL_ID = "UCwHJaEBaaSQPFHLUiMjHTtg";
const YOUTUBE_PLAYLIST_RSS = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const YOUTUBE_CHANNEL_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

const OUTPUT_DIR = path.join(__dirname, "..", "public", "data");
const PREFETCHED_PATH = path.join(OUTPUT_DIR, "prefetched.json");
const URL_CACHE_PATH = path.join(OUTPUT_DIR, "url-cache.json");
const CUSTOM_JSON_PATH = path.join(OUTPUT_DIR, "custom-articles.json");

const ARTICLES_PER_CATEGORY = 50;
const PLAYWRIGHT_CONCURRENCY = 5;
const PLAYWRIGHT_TIMEOUT = 15000;

// ── Category search queries ────────────────────────────────────────

const CATEGORY_QUERIES = {
  "ai-academy": [
    // AI Foundations — fundamental research, core concepts, academic breakthroughs
    "AI fundamental research university breakthrough",
    "AI foundational model academic research discovery",
    "AI education core learning concepts curriculum",
    // AI Evolution — model advancements, new architectures, benchmarks, milestones
    "AI model advancement new architecture upgrade",
    "AI benchmark milestone training methods performance",
    "AI capabilities breakthrough frontier development",
    // AI Integrations — AI in education, tools, workflows, collaborations
    "AI education platform integration tools",
    "AI learning teaching workflow knowledge delivery",
    "AI academic industry collaboration real-world",
    // AI Philosophy — ethics, alignment, safety, societal impact
    "AI ethics debate alignment safety",
    "AI human relationship societal impact philosophy",
    "AI governance responsibility society future",
  ],
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

// Per-category geo priority: fetch AU news first, then international to fill remaining slots
// Categories not listed here default to US-only
const CATEGORY_GEO = {
  "ai-academy": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en-US", gl: "US", ceid: "US:en" },   // Then international
  ],
};
const DEFAULT_GEO = [{ hl: "en-US", gl: "US", ceid: "US:en" }];

const CATEGORY_KEYS = Object.keys(CATEGORY_QUERIES);
const SLOT_YOUTUBE = CATEGORY_KEYS.length;       // 11
const SLOT_CUSTOM = CATEGORY_KEYS.length + 1;    // 12
const TOTAL_SLOTS = SLOT_CUSTOM + 1;             // 13

function getCurrentSlot() {
  const slotMinutes = 10;
  return Math.floor(Date.now() / (slotMinutes * 60 * 1000)) % TOTAL_SLOTS;
}

// ── Simple XML helpers (no external deps) ──────────────────────────

function getTagContent(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g");
  const matches = [];
  let m;
  while ((m = regex.exec(xml)) !== null) matches.push(m[1].trim());
  return matches;
}

function getTagAttr(xml, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "g");
  const matches = [];
  let m;
  while ((m = regex.exec(xml)) !== null) matches.push(m[1]);
  return matches;
}

function extractItems(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) items.push(m[1]);
  return items;
}

function extractEntries(xml) {
  const entries = [];
  const re = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = re.exec(xml)) !== null) entries.push(m[1]);
  return entries;
}

function stripHtml(html) {
  return html
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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

function loadPrefetched() {
  try { return JSON.parse(fs.readFileSync(PREFETCHED_PATH, "utf-8")); } catch {
    return { fetchedAt: "", playlistUrl: PLAYLIST_URL, news: [], channelVideos: [], tdaaiArticles: [] };
  }
}

function savePrefetched(data) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(PREFETCHED_PATH, JSON.stringify(data, null, 2));
}

// ── Fetch with retry ───────────────────────────────────────────────

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "TheDayAfterAI-NewsBot/1.0" } });
      if (res.ok) return await res.text();
      console.warn(`Fetch ${url} returned ${res.status}, retry ${i + 1}`);
    } catch (err) {
      console.warn(`Fetch ${url} failed: ${err.message}, retry ${i + 1}`);
    }
    await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

// ── Lazy Playwright loader ─────────────────────────────────────────

let _browser = null;
let _context = null;

async function getPlaywrightContext() {
  if (_context) return _context;
  let chromium;
  try { ({ chromium } = require("playwright")); } catch {
    try { ({ chromium } = require("/opt/node22/lib/node_modules/playwright")); } catch {
      throw new Error("Playwright not available");
    }
  }
  _browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  _context = await _browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  });
  return _context;
}

async function closePlaywright() {
  if (_browser) { await _browser.close(); _browser = null; _context = null; }
}

// ── Fetch news for a single category ───────────────────────────────

async function fetchCategoryNews(category) {
  const queries = CATEGORY_QUERIES[category];
  if (!queries) { console.warn(`Unknown category: ${category}`); return []; }

  const geoList = CATEGORY_GEO[category] || DEFAULT_GEO;
  const articles = [];
  const seenTitles = new Set();

  // For multi-geo categories (e.g. ai-academy): run all queries with AU geo first,
  // then all queries again with US geo to fill remaining slots. This ensures
  // Australian news is prioritised while international news fills the gaps.
  //
  // Within each geo pass, we do TWO time passes:
  //   Pass 1: "when:7d" — articles from the past week, sorted by recency
  //   Pass 2: no time filter — older articles to fill remaining slots
  for (const geo of geoList) {
    if (articles.length >= ARTICLES_PER_CATEGORY) break;
    const geoLabel = geo.gl;

    // Pass 1: recent articles (past 7 days)
    for (const q of queries) {
      if (articles.length >= ARTICLES_PER_CATEGORY) break;
      try {
        const rssUrl = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(q + " when:7d")}&hl=${geo.hl}&gl=${geo.gl}&ceid=${geo.ceid}`;
        const xml = await fetchWithRetry(rssUrl);
        const items = extractItems(xml);
        parseRssItems(items, articles, seenTitles, category);
      } catch (err) {
        console.warn(`  Failed query "${q}" [${geoLabel}, 7d]: ${err.message}`);
      }
    }

    if (geoList.length > 1) {
      console.log(`    ${geoLabel} (7d): ${articles.length} articles`);
    }

    // Pass 2: no time restriction — fill remaining slots with older articles
    if (articles.length < ARTICLES_PER_CATEGORY) {
      for (const q of queries) {
        if (articles.length >= ARTICLES_PER_CATEGORY) break;
        try {
          const rssUrl = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(q)}&hl=${geo.hl}&gl=${geo.gl}&ceid=${geo.ceid}`;
          const xml = await fetchWithRetry(rssUrl);
          const items = extractItems(xml);
          parseRssItems(items, articles, seenTitles, category);
        } catch (err) {
          console.warn(`  Failed query "${q}" [${geoLabel}]: ${err.message}`);
        }
      }

      if (geoList.length > 1) {
        console.log(`    ${geoLabel} (all): ${articles.length} articles`);
      }
    }
  }

  console.log(`  ${category}: ${articles.length} articles`);
  return articles;
}

// Parse RSS items into articles array (shared by time-filtered and unfiltered passes)
function parseRssItems(items, articles, seenTitles, category) {
  for (const item of items) {
    if (articles.length >= ARTICLES_PER_CATEGORY) break;

    const title = getTagContent(item, "title")[0] || "";
    if (!title || seenTitles.has(title)) continue;
    seenTitles.add(title);

    const link = getTagContent(item, "link")[0] || "";
    const pubDate = getTagContent(item, "pubDate")[0] || "";
    const source = getTagContent(item, "source")[0] || "Google News";
    const rawDescription = getTagContent(item, "description")[0] || "";
    const description = stripHtml(rawDescription);

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

    articles.push({
      id: `gn-${category}-${articles.length}`,
      title, summary: description || title, topic: category,
      source, date: pubDate, imageUrl: imageUrl || "", url: link,
    });
  }
}

// ── Resolve Google URLs + fetch OG images via Playwright ───────────

async function resolveArticles(articles) {
  const cache = loadUrlCache();
  console.log(`URL cache: ${Object.keys(cache).length} entries`);

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

  const toResolve = articles.filter((a) => a.url && a.url.includes("news.google.com"));
  if (toResolve.length === 0) {
    console.log("All URLs resolved from cache!");
    saveUrlCache(cache);
    applyFallbackImages(articles);
    return;
  }

  console.log(`Resolving ${toResolve.length} URLs via Playwright...`);
  let context;
  try { context = await getPlaywrightContext(); } catch {
    console.warn("Playwright not available — keeping Google News URLs for now.");
    applyFallbackImages(articles);
    return;
  }

  let resolved = 0, failed = 0;

  for (let i = 0; i < toResolve.length; i += PLAYWRIGHT_CONCURRENCY) {
    const batch = toResolve.slice(i, i + PLAYWRIGHT_CONCURRENCY);
    const promises = batch.map(async (article) => {
      const gnUrl = article.url;
      const articleId = extractArticleId(gnUrl);
      const page = await context.newPage();
      try {
        await page.goto(gnUrl, { waitUntil: "load", timeout: PLAYWRIGHT_TIMEOUT });
        await page.waitForTimeout(1500);
        let finalUrl = page.url();

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

        const isResolved = finalUrl &&
          !finalUrl.includes("news.google.com") &&
          !finalUrl.includes("consent.google") &&
          !finalUrl.includes("accounts.google");

        if (isResolved) {
          article.url = finalUrl;
          const imgUrl = await page.evaluate(() => {
            const selectors = [
              'meta[property="og:image"]', 'meta[property="og:image:secure_url"]',
              'meta[property="og:image:url"]', 'meta[name="twitter:image"]',
              'meta[name="twitter:image:src"]', 'meta[name="image"]',
              'meta[itemprop="image"]', 'link[rel="image_src"]',
            ];
            for (const sel of selectors) {
              const el = document.querySelector(sel);
              const val = el?.getAttribute("content") || el?.getAttribute("href") || "";
              if (val && val.startsWith("http")) return val;
            }
            const imgs = Array.from(document.querySelectorAll("article img[src], .post-content img[src], .article-body img[src], main img[src]"));
            for (const img of imgs) {
              const src = img.getAttribute("src") || "";
              if (src.startsWith("http") && !src.includes("avatar") && !src.includes("logo") && !src.includes("icon")) return src;
            }
            return "";
          });
          if (imgUrl && !isGenericImage(imgUrl)) article.imageUrl = imgUrl;
          if (articleId) cache[articleId] = { url: finalUrl, imageUrl: article.imageUrl };
          resolved++;
        } else { failed++; }
      } catch { failed++; }
      finally { await page.close(); }
    });

    await Promise.allSettled(promises);
    const processed = Math.min(i + PLAYWRIGHT_CONCURRENCY, toResolve.length);
    if (processed % 25 < PLAYWRIGHT_CONCURRENCY || processed >= toResolve.length) {
      console.log(`  ${processed}/${toResolve.length} (resolved: ${resolved}, failed: ${failed})`);
    }
  }

  saveUrlCache(cache);
  console.log(`Resolution done: ${resolved} resolved, ${failed} failed`);
  applyFallbackImages(articles);
}

function applyFallbackImages(articles) {
  for (const article of articles) {
    if (!article.imageUrl) article.imageUrl = generateImageUrl(article.title, article.topic);
  }
}

// ── YouTube ────────────────────────────────────────────────────────

function parseVideoEntries(xml) {
  const entries = extractEntries(xml);
  return entries.map((entry) => {
    const videoId = getTagContent(entry, "yt:videoId")[0] || "";
    const title = getTagContent(entry, "title")[0] || "";
    const published = getTagContent(entry, "published")[0] || "";
    const description = getTagContent(entry, "media:description")[0] || "";
    const thumbnails = getTagAttr(entry, "media:thumbnail", "url");
    const thumbnail = thumbnails[0] || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    return { id: videoId, videoId, title, thumbnail, publishedAt: published, description, channelTitle: "TheDayAfterAI" };
  });
}

async function fetchChannelVideos() {
  try {
    console.log("Fetching playlist RSS...");
    const xml = await fetchWithRetry(YOUTUBE_PLAYLIST_RSS);
    const videos = parseVideoEntries(xml);
    if (videos.length > 0) { console.log(`  ${videos.length} videos from playlist`); return videos; }
  } catch (err) { console.warn("Playlist RSS failed:", err.message); }

  try {
    console.log("Fetching channel RSS...");
    const xml = await fetchWithRetry(YOUTUBE_CHANNEL_RSS);
    const videos = parseVideoEntries(xml);
    console.log(`  ${videos.length} videos from channel`);
    return videos;
  } catch (err) { console.warn("Channel RSS also failed:", err.message); return []; }
}

// ── TheDayAfterAI.com blog articles (RSS) ──────────────────────────

const TDAAI_RSS_URLS = [
  "https://www.thedayafterai.com/blog?format=rss",
  "https://thedayafterai.com/blog?format=rss",
  "https://www.thedayafterai.com/?format=rss",
  "https://thedayafterai.com/?format=rss",
];

async function fetchTdaaiArticles() {
  console.log("Fetching TheDayAfterAI.com RSS...");
  let xml = "";
  for (const rssUrl of TDAAI_RSS_URLS) {
    try {
      xml = await fetchWithRetry(rssUrl, 2);
      if (xml && xml.includes("<item>")) { console.log(`  Found RSS at: ${rssUrl}`); break; }
    } catch { /* try next */ }
  }
  if (!xml || !xml.includes("<item>")) { console.log("  RSS not available"); return []; }

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
  console.log(`  ${articles.length} TDAAI blog articles`);
  return articles;
}

// ── AI Market Insight custom articles (Playwright) ─────────────────

async function fetchCustomArticles() {
  console.log("Fetching AI Market Insight from thedayafterai.com...");

  let customData;
  try { customData = JSON.parse(fs.readFileSync(CUSTOM_JSON_PATH, "utf-8")); } catch {
    console.log("  No custom-articles.json found, skipping.");
    return;
  }

  const sectionsToFetch = (customData.sections || []).filter((s) => s.pageUrl);
  if (sectionsToFetch.length === 0) { console.log("  No sections with pageUrl, skipping."); return; }

  let context;
  try { context = await getPlaywrightContext(); } catch {
    console.warn("  Playwright not available, skipping custom articles.");
    return;
  }

  let updated = false;

  for (const section of sectionsToFetch) {
    const pageUrl = section.pageUrl;
    const slug = section.collectionSlug || `/${section.id}/`;

    try {
      const page = await context.newPage();
      await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 30000 });
      console.log(`  Loaded: ${pageUrl}`);

      const articles = await page.evaluate((filterSlug) => {
        const results = [];
        const seen = new Set();
        for (const el of document.querySelectorAll("a[href]")) {
          const href = el.href;
          if (!href || seen.has(href) || !href.includes("thedayafterai.com")) continue;
          try {
            const linkPath = new URL(href).pathname;
            if (!linkPath.includes(filterSlug)) continue;
            const afterSlug = linkPath.split(filterSlug)[1];
            if (!afterSlug || afterSlug === "/" || afterSlug === "") continue;
          } catch { continue; }
          seen.add(href);

          const container = el.closest("article, .summary-item, .blog-item, .sqs-block") || el.parentElement;
          let title = el.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
            container?.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
            el.textContent?.trim().substring(0, 200) || "";
          title = title.replace(/\s+/g, " ").trim();

          let imageUrl = "";
          const img = el.querySelector("img") || container?.querySelector("img");
          if (img) imageUrl = img.dataset?.src || img.src || "";

          let date = "";
          const timeEl = container?.querySelector("time[datetime]") ||
            container?.querySelector(".summary-metadata-item--date") ||
            container?.querySelector(".blog-date");
          if (timeEl) date = timeEl.getAttribute("datetime") || "";

          if (title) results.push({ url: href, title, imageUrl, date });
        }
        return results;
      }, slug);
      await page.close();

      // Deduplicate
      const uniqueArticles = [];
      const seenUrls = new Set();
      for (const a of articles) {
        if (!seenUrls.has(a.url)) { seenUrls.add(a.url); uniqueArticles.push(a); }
      }
      console.log(`  Found ${uniqueArticles.length} articles matching "${slug}"`);

      if (uniqueArticles.length > 0) {
        // Fetch OG images and dates from article pages
        for (const article of uniqueArticles) {
          try {
            const articlePage = await context.newPage();
            await articlePage.goto(article.url, { waitUntil: "domcontentloaded", timeout: 15000 });
            const meta = await articlePage.evaluate(() => {
              const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
              const twImg = document.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || "";
              const pubDate =
                document.querySelector('meta[property="article:published_time"]')?.getAttribute("content") ||
                document.querySelector('time.blog-date[datetime]')?.getAttribute("datetime") ||
                document.querySelector('time[datetime]')?.getAttribute("datetime") ||
                document.querySelector('.entry-dateline time')?.getAttribute("datetime") ||
                document.querySelector('.blog-item-date time')?.getAttribute("datetime") ||
                document.querySelector('.dt-published')?.getAttribute("datetime") || "";
              return { ogImg, twImg, pubDate };
            });
            if (meta.ogImg) article.imageUrl = meta.ogImg;
            else if (meta.twImg) article.imageUrl = meta.twImg;
            if (meta.pubDate) {
              try { article.date = new Date(meta.pubDate).toISOString().split("T")[0]; } catch {}
            }
            console.log(`    ${article.title.slice(0, 50)}... => ${article.imageUrl ? "img" : "no-img"}, ${article.date || "no date"}`);
            await articlePage.close();
          } catch (err) {
            console.log(`    Failed: "${article.title.slice(0, 40)}": ${err.message.split("\n")[0]}`);
          }
        }

        section.articles = uniqueArticles.map((a, i) => {
          let normalizedDate = "";
          if (a.date) { try { normalizedDate = new Date(a.date).toISOString().split("T")[0]; } catch {} }
          return { id: `${section.id}-${i + 1}`, title: a.title, date: normalizedDate, imageUrl: a.imageUrl || "", url: a.url, source: "TheDayAfterAI" };
        });
        updated = true;
        console.log(`  Updated "${section.title}" with ${uniqueArticles.length} articles`);
      } else {
        console.log(`  No articles found, keeping existing entries.`);
      }
    } catch (err) {
      console.log(`  Failed: ${err.message.split("\n")[0]}`);
    }
  }

  if (updated) {
    fs.writeFileSync(CUSTOM_JSON_PATH, JSON.stringify(customData, null, 2) + "\n");
    console.log("  Saved custom-articles.json");
  }
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const isFullFetch = process.argv.includes("--all");
  const slot = isFullFetch ? -1 : getCurrentSlot();

  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Mode: ${isFullFetch ? "FULL (--all)" : `ROTATION slot ${slot}/${TOTAL_SLOTS - 1}`}`);

  const data = loadPrefetched();

  if (isFullFetch) {
    // ── Full fetch: all categories + YouTube + custom ──
    console.log("\n=== Fetching all 11 news categories ===");
    const allNews = [];
    for (const category of CATEGORY_KEYS) {
      const articles = await fetchCategoryNews(category);
      allNews.push(...articles);
    }
    console.log(`Total: ${allNews.length} articles`);

    console.log("\n=== Resolving Google News URLs ===");
    await resolveArticles(allNews);
    allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    data.news = allNews;

    console.log("\n=== Fetching YouTube + TDAAI RSS ===");
    const [channelVideos, tdaaiArticles] = await Promise.all([
      fetchChannelVideos(),
      fetchTdaaiArticles(),
    ]);
    data.channelVideos = channelVideos;
    data.tdaaiArticles = tdaaiArticles;

    console.log("\n=== Fetching AI Market Insight ===");
    await fetchCustomArticles();

  } else if (slot >= 0 && slot < CATEGORY_KEYS.length) {
    // ── Single news category ──
    const category = CATEGORY_KEYS[slot];
    console.log(`\n=== Fetching category: ${category} ===`);
    const articles = await fetchCategoryNews(category);

    console.log(`\n=== Resolving ${articles.length} URLs ===`);
    await resolveArticles(articles);

    // Merge: replace this category's articles in existing data
    data.news = (data.news || []).filter((a) => a.topic !== category).concat(articles);
    data.news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } else if (slot === SLOT_YOUTUBE) {
    // ── YouTube + TDAAI RSS ──
    console.log("\n=== Fetching YouTube + TDAAI RSS ===");
    const [channelVideos, tdaaiArticles] = await Promise.all([
      fetchChannelVideos(),
      fetchTdaaiArticles(),
    ]);
    data.channelVideos = channelVideos;
    data.tdaaiArticles = tdaaiArticles;

  } else if (slot === SLOT_CUSTOM) {
    // ── AI Market Insight custom articles ──
    console.log("\n=== Fetching AI Market Insight ===");
    await fetchCustomArticles();
  }

  // Save updated prefetched.json
  data.fetchedAt = new Date().toISOString();
  data.playlistUrl = PLAYLIST_URL;
  savePrefetched(data);

  await closePlaywright();

  const newsCount = (data.news || []).length;
  const realUrlCount = (data.news || []).filter((a) => !a.url.includes("news.google.com")).length;
  const realImgCount = (data.news || []).filter((a) => a.imageUrl && !a.imageUrl.includes("unsplash.com")).length;
  console.log(`\nSaved: ${newsCount} news (${realUrlCount} real URLs, ${realImgCount} real images), ${(data.channelVideos || []).length} videos, ${(data.tdaaiArticles || []).length} TDAAI`);
}

main().catch((err) => {
  console.error("Pre-fetch failed:", err);
  process.exit(1);
});
