#!/usr/bin/env node
// Pre-fetch news, YouTube, and custom articles as static JSON for fast page loads.
//
// Modes:
//   --all     Full fetch of all categories + YouTube + custom articles (used by deploy)
//   (none)    Rotating fetch: one category every 10 min + YouTube/custom every 15 min
//
// Rotation: 11 category slots (one per 10-min cron run, ~110 min full cycle)
// YouTube + AI Market Insight refresh every 15 min alongside the current category

const fs = require("fs");
const path = require("path");

const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search";
const PLAYLIST_ID = "PLFDiWEVfJRSs6cucI99ugO8xh6kIekfqe";
const CHANNEL_ID = "UCwHJaEBaaSQPFHLUiMjHTtg";
const YOUTUBE_PLAYLIST_RSS = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const YOUTUBE_CHANNEL_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

const OUTPUT_DIR = path.join(__dirname, "..", "public", "data");
const SCREENSHOTS_DIR = path.join(__dirname, "..", "public", "data", "screenshots");
const DOWNLOADED_IMAGES_DIR = path.join(__dirname, "..", "public", "data", "images");
const FALLBACK_IMAGES_DIR = path.join(__dirname, "..", "public", "images", "news");
const IMAGE_MANIFEST_PATH = path.join(__dirname, "..", "public", "images", "image-manifest.json");
const PREFETCHED_PATH = path.join(OUTPUT_DIR, "prefetched.json");
const URL_CACHE_PATH = path.join(OUTPUT_DIR, "url-cache.json");
const CUSTOM_JSON_PATH = path.join(OUTPUT_DIR, "custom-articles.json");

const ARTICLES_PER_CATEGORY = 50;
const PLAYWRIGHT_CONCURRENCY = 5;
const PLAYWRIGHT_TIMEOUT = 15000;

// AI-relevance keywords — articles must mention at least one to be included.
// This prevents Google News from returning tangentially related non-AI articles.
const AI_RELEVANCE_KEYWORDS = /(?:\b(?:ai|artificial\s+intelligence|machine\s+learning|deep\s*learning|neural\s+nets?|llms?|large\s+language\s+models?|generative|gpt|chatgpt|gemini|claude|copilot|openai|deepmind|anthropic|midjourney|dall[\-·]?e|stable\s+diffusion|chatbots?|deepfakes?|robot(?:ic|s)?|autonomous|self[\-\s]driving|computer\s+vision|natural\s+language|nlp|algorithms?|automation|predictive\s+analytics|smart\s+(?:device|assistant|speaker|home)|wearables?|drones?|uavs?)\b|a\.i\.)/i;

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
  "business-economy": [
    // Global Economy — AI's macro impact on trade, GDP, markets, global economic shifts
    "AI global economy trade GDP market impact",
    "AI economic growth forecast industry disruption",
    "AI supply chain automation global commerce",
    // Investments & Strategies — AI funding, VC, IPO, M&A, corporate strategy
    "AI startup funding venture capital investment",
    "AI company IPO acquisition merger valuation",
    "AI corporate strategy digital transformation spending",
    // Workforce Impact — AI jobs, hiring, displacement, reskilling, future of work
    "AI workforce jobs hiring displacement automation",
    "AI reskilling upskilling employment future work",
    "AI productivity remote work labour market",
    // Company Applications — specific companies deploying AI solutions
    "AI enterprise adoption company deploy solution",
    "AI business application case study revenue",
  ],
  "chatbot-development": [
    // Market Competition — rivalry between AI chatbot providers, benchmarks, market share
    "AI chatbot competition GPT Claude Gemini market",
    "AI language model benchmark comparison performance",
    "AI chatbot market share rivalry OpenAI Google Anthropic",
    // Company Applications — businesses deploying chatbots, enterprise use cases
    "AI chatbot enterprise deployment customer service",
    "AI conversational agent business automation workflow",
    "AI virtual assistant company integration platform",
    // Personal Assistance — consumer chatbots, daily life, productivity, companions
    "AI personal assistant daily life productivity",
    "AI chatbot companion consumer health wellness",
    "AI voice assistant smart home personal use",
    // Social Implications — impact on society, communication, misinformation, trust
    "AI chatbot social impact misinformation trust",
    "AI conversational ethics deepfake manipulation",
    "AI human interaction communication society change",
  ],
  "digital-security": [
    // Scam & Fraud — AI-powered scams, phishing, deepfake fraud, social engineering
    "AI scam fraud phishing deepfake impersonation",
    "AI social engineering cyber attack romance scam",
    "AI generated fake identity financial fraud",
    // Privacy Concerns — AI surveillance, data collection, tracking, biometrics
    "AI privacy surveillance data collection tracking",
    "AI facial recognition biometric data breach",
    "AI personal data harvesting privacy violation",
    // Legal & Ethics — AI cybercrime law, liability, regulation, ethical hacking
    "AI cybercrime law regulation liability prosecution",
    "AI digital ethics responsible disclosure hacking",
    "AI security legislation compliance standard",
    // Security Solutions — AI-powered defence, threat detection, cybersecurity tools
    "AI cybersecurity threat detection defence protection",
    "AI security tool malware detection endpoint",
    "AI zero trust authentication encryption solution",
  ],
  "environment-science": [
    // Earth Applications — AI for climate, weather, natural disasters, environmental monitoring
    "AI climate change weather prediction environmental monitoring",
    "AI natural disaster detection wildfire flood forecast",
    "AI carbon emissions sustainability earth observation",
    // Smart Infrastructure — AI for energy grids, smart cities, water, waste management
    "AI smart grid energy efficiency renewable power",
    "AI smart city infrastructure urban planning transport",
    "AI water management waste recycling circular economy",
    // Living Systems — AI in biology, ecology, conservation, agriculture, biodiversity
    "AI biology ecology conservation biodiversity wildlife",
    "AI agriculture precision farming crop livestock",
    "AI marine ocean ecosystem species discovery",
    // Scientific Breakthroughs — AI in physics, quantum, chemistry, space, materials science
    "AI scientific discovery physics quantum computing",
    "AI chemistry materials science drug molecule",
    "AI space exploration astronomy satellite research",
  ],
  "governance-politics": [
    // Elections & Democracy — AI in elections, campaigns, voting, political influence
    "AI election campaign political advertising deepfake",
    "AI democracy voting disinformation manipulation",
    "AI political influence social media propaganda",
    // Regulation & Legislation — AI laws, bills, regulatory frameworks, compliance
    "AI regulation legislation bill law framework",
    "AI policy compliance government regulatory agency",
    "AI executive order act parliament policy reform",
    // National Security — AI in defence, intelligence, military, geopolitics
    "AI national security defence military intelligence",
    "AI geopolitics arms race surveillance warfare",
    "AI border security homeland threat assessment",
    // Ethics & Societal Impact — AI governance, accountability, bias, public trust
    "AI governance accountability bias fairness",
    "AI public trust transparency societal impact",
    "AI human rights civil liberties discrimination",
  ],
  "health-style": [
    // Lifestyle Technology — AI in fitness, wearables, fashion, food, daily wellness
    "AI fitness wearable health tracker lifestyle",
    "AI fashion style recommendation personalisation",
    "AI food nutrition diet wellness technology",
    // Medical AI — AI diagnosis, treatment, drug discovery, hospital, clinical
    "AI medical diagnosis treatment clinical hospital",
    "AI drug discovery pharmaceutical genomics precision",
    "AI radiology pathology surgery robotic healthcare",
    // AI Relationships With Human — AI companions, dating, social bonds, emotional AI
    "AI human relationship companion emotional bond",
    "AI dating app social connection virtual friend",
    "AI empathy interaction trust human machine",
    // Mental Health — AI therapy, counselling, wellbeing, stress, addiction
    "AI mental health therapy counselling wellbeing",
    "AI stress anxiety depression support chatbot",
    "AI addiction recovery mindfulness brain health",
  ],
  "musical-art": [
    // Broadcasting & Curation — AI in streaming, playlists, radio, music recommendation
    "AI music streaming playlist recommendation Spotify",
    "AI radio broadcasting curation algorithm listener",
    "AI music discovery personalisation audio platform",
    // Industry Implications — AI impact on music industry, labels, royalties, copyright
    "AI music industry label royalty copyright licensing",
    "AI music business revenue streaming rights dispute",
    "AI music disruption record label distribution",
    // Artist Collaborations — artists using AI tools, partnerships, AI-assisted production
    "AI artist collaboration music technology producer",
    "AI musician tool partnership creative production",
    "AI singer songwriter band AI-generated feature",
    // Music Creation — AI composing, generating, producing, remixing, sound design
    "AI music creation compose generate produce song",
    "AI sound design remix synthesizer beat making",
    "AI vocal clone audio deepfake music production",
  ],
  "technology-innovation": [
    // Hardware & Connectivity — AI chips, semiconductors, networking, 5G/6G, computing
    "AI chip semiconductor processor GPU hardware",
    "AI computing infrastructure data centre networking",
    "AI connectivity 5G 6G edge computing bandwidth",
    // Tech Startups & Entrepreneurship — AI startups, founders, accelerators, innovation
    "AI startup founder entrepreneur innovation launch",
    "AI accelerator incubator tech venture disrupt",
    "AI product launch platform scale growth company",
    // Smart & Wearable Devices — AI in wearables, glasses, headsets, consumer gadgets
    "AI wearable device smartwatch glasses headset",
    "AI smart gadget consumer electronics sensor",
    "AI augmented reality virtual reality XR device",
    // Robotics, Automation & IoT — AI robots, factory automation, smart sensors, IoT
    "AI robot robotics humanoid autonomous machine",
    "AI factory automation manufacturing industrial IoT",
    "AI smart sensor connected device Internet of Things",
  ],
  "unmanned-aircraft": [
    // Civilian Uses — AI drones for delivery, agriculture, photography, inspection, search & rescue
    "AI drone delivery logistics commercial civilian",
    "AI drone agriculture surveying inspection mapping",
    "AI drone search rescue emergency disaster response",
    // Regulatory Challenges — drone airspace rules, FAA/CASA regulations, licensing, safety
    "AI drone regulation airspace FAA CASA licensing",
    "AI unmanned aircraft policy safety compliance rule",
    "AI drone privacy law restriction no-fly zone",
    // Military Drones — AI in combat UAVs, defence surveillance, autonomous weapons
    "AI military drone combat UAV autonomous weapon",
    "AI defence surveillance reconnaissance unmanned",
    "AI drone warfare strike swarm tactical operation",
    // Technological Breakthroughs — AI drone hardware, battery, navigation, AI flight systems
    "AI drone technology breakthrough navigation sensor",
    "AI UAV battery range endurance flight system",
    "AI autonomous flying vehicle eVTOL air taxi",
  ],
  "visual-art-photography": [
    // Imaging Equipment — AI cameras, lenses, sensors, computational photography hardware
    "AI camera lens sensor computational photography",
    "AI imaging equipment mirrorless DSLR hardware",
    "AI photo capture technology pixel image sensor",
    // Post-Production Tools — AI editing, retouching, upscaling, colour grading software
    "AI photo editing retouching software Photoshop",
    "AI image upscale enhance restore colour grading",
    "AI video editing post production visual effects",
    // Mobile Photography — AI smartphone camera, phone photography, mobile editing apps
    "AI smartphone camera mobile photography feature",
    "AI phone photo app filter portrait mode",
    "AI mobile editing Instagram TikTok content creator",
    // Artistic Innovation — AI-generated art, digital painting, gallery exhibitions, NFT
    "AI generated art digital painting creative visual",
    "AI art exhibition gallery museum installation",
    "AI artwork NFT generative design illustration",
  ],
};

// Per-category geo priority: fetch AU news first, then international to fill remaining slots.
// "International" passes omit gl/ceid so Google returns globally diverse results.
// Categories not listed here default to international English.
const CATEGORY_GEO = {
  "ai-academy": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "business-economy": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "chatbot-development": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "digital-security": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "environment-science": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "governance-politics": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "health-style": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "musical-art": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "technology-innovation": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "unmanned-aircraft": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
  "visual-art-photography": [
    { hl: "en-AU", gl: "AU", ceid: "AU:en" },   // Australian news first
    { hl: "en", gl: "", ceid: "" },               // Then truly international
  ],
};
const DEFAULT_GEO = [{ hl: "en", gl: "", ceid: "" }]; // International English

const CATEGORY_KEYS = Object.keys(CATEGORY_QUERIES);
const TOTAL_SLOTS = CATEGORY_KEYS.length;        // 11 (categories only)

function getCurrentSlot() {
  return Math.floor(Date.now() / (10 * 60 * 1000)) % TOTAL_SLOTS;
}

// YouTube + AI Market Insight refresh on a separate 15-min cycle.
// Returns true when the current 10-min tick crosses a 15-min boundary.
function shouldRefreshExtras() {
  const now = Date.now();
  const current15 = Math.floor(now / (15 * 60 * 1000));
  const prev15 = Math.floor((now - 10 * 60 * 1000) / (15 * 60 * 1000));
  return current15 !== prev15;
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
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

// ── Local fallback image picker (replaces Unsplash stock images) ──────
// All curated fallback images live in a single public/images/news/ folder.
// image-manifest.json contains keyword tags for each image. The picker
// scores every image against the article title + summary and picks the
// single best match, using a title-hash to diversify among top scorers.

let _imageManifest = null;
const MANIFEST_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

/** Auto-generate the image manifest by scanning public/images/news/ for
 *  .webp files.  Tags are derived from the filename: "hardware-chips.webp" →
 *  ["hardware", "chips"].  Drop new images into the news/ folder and they'll
 *  be picked up within an hour. */
function buildImageManifest() {
  if (!fs.existsSync(FALLBACK_IMAGES_DIR)) fs.mkdirSync(FALLBACK_IMAGES_DIR, { recursive: true });
  const files = fs.readdirSync(FALLBACK_IMAGES_DIR).filter((f) => f.endsWith(".webp")).sort();
  const images = files.map((file) => ({
    file,
    tags: path.basename(file, ".webp").split("-").filter(Boolean),
  }));
  const out = { _comment: "Auto-generated by fetch-news.js — do not edit manually. Drop .webp files into public/images/news/; tags are derived from the filename.", images };
  fs.writeFileSync(IMAGE_MANIFEST_PATH, JSON.stringify(out, null, 2) + "\n");
  return { images };
}

function loadImageManifest() {
  if (_imageManifest) return _imageManifest;
  // Only rebuild the manifest if the file is missing or older than 1 hour
  try {
    const stat = fs.statSync(IMAGE_MANIFEST_PATH);
    if (Date.now() - stat.mtimeMs < MANIFEST_MAX_AGE_MS) {
      _imageManifest = JSON.parse(fs.readFileSync(IMAGE_MANIFEST_PATH, "utf-8"));
      return _imageManifest;
    }
  } catch { /* missing or unreadable — rebuild */ }
  _imageManifest = buildImageManifest();
  return _imageManifest;
}

/** Score how relevant an image's tags are to an article's text. */
function scoreRelevance(text, tags) {
  const lower = text.toLowerCase();
  let score = 0;
  for (const tag of tags) {
    if (lower.includes(tag.toLowerCase())) score++;
  }
  return score;
}

/** Pick the single best local fallback image for an article from the global pool.
 *  Returns relative path like "images/news/filename.webp" or "" if none. */
function pickLocalFallback(article) {
  const manifest = loadImageManifest();
  const pool = manifest.images || [];
  if (pool.length === 0) return "";

  // Filter to images whose files actually exist
  const available = pool.filter((img) => {
    const fullPath = path.join(FALLBACK_IMAGES_DIR, img.file);
    return fs.existsSync(fullPath);
  });
  if (available.length === 0) return "";

  const text = `${article.title} ${article.summary || ""}`;

  // Score every image by keyword relevance
  const scored = available.map((img) => ({
    file: img.file,
    score: scoreRelevance(text, img.tags || []),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Gather the top tier — anything within 1 point of the best, or at least
  // all zero-scorers (so hash diversity still works when nothing matches)
  const best = scored[0].score;
  const topTier = scored.filter((s) => s.score >= Math.max(best - 1, 0));

  // Hash-based pick within the top tier for diversity across articles
  const hash = text.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const pick = topTier[Math.abs(hash) % topTier.length];

  return `images/news/${pick.file}`;
}

// ── Helpers ────────────────────────────────────────────────────────

function isGenericImage(url) {
  if (!url) return true;
  // Small images in URL params (width/w/size < 150) are likely icons/logos
  if (/(?:width|w|size)=(?:1[0-4]?\d|[1-9]\d?)(?:\D|$)/i.test(url)) return true;
  return [
    /news\.google\.com/i, /googlenews/i, /gstatic\.com.*\/news/i,
    /\/logo/i, /\/favicon/i, /icon[-_]?\d+/i, /default[-_]?image/i,
    /placeholder/i, /\/avatar/i, /site[-_]?logo/i, /brand[-_]?logo/i,
    /masthead/i, /header[-_]?logo/i, /nav[-_]?logo/i, /\.ico(?:\?|$)/i,
    /og[-_]img/i, /default[-_]?og/i, /site[-_]?default/i,
  ].some((re) => re.test(url));
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

const BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

async function fetchWithRetry(url, retries = 3) {
  // Use browser UA for YouTube to avoid bot-detection blocks
  const ua = url.includes("youtube.com") ? BROWSER_UA : "TheDayAfterAI-NewsBot/1.0";
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": ua } });
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
  _browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox", "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });
  _context = await _browser.newContext({
    userAgent: BROWSER_UA,
    viewport: { width: 1920, height: 1080 },
    screen: { width: 1920, height: 1080 },
    locale: "en-US",
  });
  // Hide navigator.webdriver flag — many bot detectors check this
  await _context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
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
  // then all queries again with international geo to fill remaining slots. This ensures
  // Australian news is prioritised while international news fills the gaps.
  //
  // Within each geo pass, we do TWO time passes:
  //   Pass 1: "when:7d" — articles from the past week, sorted by recency
  //   Pass 2: no time filter — older articles to fill remaining slots
  for (const geo of geoList) {
    if (articles.length >= ARTICLES_PER_CATEGORY) break;
    const geoLabel = geo.gl || "intl";

    // Build RSS URL, omitting gl/ceid when empty (for international/worldwide results)
    const buildRssUrl = (query) => {
      let url = `${GOOGLE_NEWS_RSS}?q=${encodeURIComponent(query)}&hl=${geo.hl}`;
      if (geo.gl) url += `&gl=${geo.gl}`;
      if (geo.ceid) url += `&ceid=${geo.ceid}`;
      return url;
    };

    // Pass 1: recent articles (past 7 days)
    for (const q of queries) {
      if (articles.length >= ARTICLES_PER_CATEGORY) break;
      try {
        const rssUrl = buildRssUrl(q + " when:7d");
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
          const rssUrl = buildRssUrl(q);
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

    const rawDescription = getTagContent(item, "description")[0] || "";
    const description = stripHtml(rawDescription);

    // Reject articles that don't mention AI in title or description
    const textToCheck = `${title} ${description}`;
    if (!AI_RELEVANCE_KEYWORDS.test(textToCheck)) continue;

    seenTitles.add(title);

    const link = getTagContent(item, "link")[0] || "";
    const pubDate = getTagContent(item, "pubDate")[0] || "";
    const source = getTagContent(item, "source")[0] || "Google News";

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
      if (imgMatch && imgMatch[1] && !isGenericImage(imgMatch[1])) {
        // Google News RSS descriptions embed small publisher logos (typically 80x80).
        // Check width/height attributes — reject images ≤ 150px (logos).
        const fullTag = decodedDesc.match(/<img[^>]*src=["'][^"']*["'][^>]*>/i)?.[0] || "";
        const wMatch = fullTag.match(/width=["']?(\d+)/i);
        const hMatch = fullTag.match(/height=["']?(\d+)/i);
        const w = wMatch ? parseInt(wMatch[1], 10) : 999;
        const h = hMatch ? parseInt(hMatch[1], 10) : 999;
        if (w > 150 && h > 150) {
          imageUrl = imgMatch[1];
        }
      }
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
      // Handle both old format (plain URL string) and new format ({ url, imageUrl })
      const entry = typeof cache[id] === "string"
        ? { url: cache[id], imageUrl: "" }
        : cache[id];
      article.url = entry.url || article.url;
      // Always prefer cached Playwright-extracted image over RSS image
      // (RSS images from Google News are usually publisher logos or
      // images from a different article in the same news cluster).
      if (entry.imageUrl) {
        article.imageUrl = entry.imageUrl;
      } else if (entry.url) {
        // We resolved this article before but couldn't extract an image.
        // Clear the RSS image so the screenshot fallback can try instead.
        article.imageUrl = "";
      }
      cacheHits++;
    }
  }
  console.log(`Applied ${cacheHits} cached resolutions`);

  // Articles still pointing at Google News (need full resolution)
  const toResolve = articles.filter((a) => a.url && a.url.includes("news.google.com"));
  // Articles with resolved URLs but no image (need image re-extraction)
  const needsImage = articles.filter((a) => {
    if (a.url.includes("news.google.com")) return false; // handled above
    return !a.imageUrl;
  });
  if (toResolve.length === 0 && needsImage.length === 0) {
    console.log("All URLs resolved from cache and all have images!");
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
          // If we landed on an AMP page, navigate to the canonical URL for better images
          const isAmp = finalUrl.includes("/amp/") || finalUrl.includes("/amp?") || finalUrl.endsWith("/amp");
          if (isAmp) {
            const canonicalUrl = await page.evaluate(() => {
              const c = document.querySelector('link[rel="canonical"]');
              return c?.href || "";
            });
            if (canonicalUrl && canonicalUrl !== finalUrl && !canonicalUrl.includes("/amp")) {
              try {
                await page.goto(canonicalUrl, { waitUntil: "load", timeout: PLAYWRIGHT_TIMEOUT });
                await page.waitForTimeout(1500);
                finalUrl = canonicalUrl;
              } catch { /* keep AMP page */ }
            }
          }
          article.url = finalUrl;
          // Extract the best article image using multiple strategies:
          // 1. JSON-LD structured data (most accurate — publisher's chosen article image)
          // 2. og:image / twitter:image (universal — nearly all news sites set these)
          // 3. Article hero/featured image (CMS-specific selectors)
          // 4. First large image in article body
          const imgUrl = await page.evaluate(() => {
            const isGoodUrl = (u) => {
              if (!u || !u.startsWith("http")) return false;
              const lower = u.toLowerCase();
              return ![
                "avatar", "/logo", "favicon", "icon", "pixel", "tracking",
                "1x1", "spacer", "badge", "brand", "masthead", "site-logo",
                "site_logo", "header-logo", "header_logo", "nav-logo", "nav_logo",
                ".ico", ".svg", "widget", "button", "banner-ad", "advertisement",
                "og-img", "og_img", "default-og", "site-default",
              ].some((pat) => lower.includes(pat));
            };

            // 1. JSON-LD structured data — most accurate article image
            try {
              const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
              for (const script of ldScripts) {
                const data = JSON.parse(script.textContent || "");
                const items = Array.isArray(data) ? data : data["@graph"] || [data];
                for (const item of items) {
                  const t = item["@type"];
                  if (t === "NewsArticle" || t === "Article" || t === "BlogPosting" ||
                      t === "WebPage" || t === "ReportageNewsArticle") {
                    const img = item.image;
                    if (typeof img === "string" && isGoodUrl(img)) return img;
                    if (Array.isArray(img) && img.length > 0) {
                      const first = typeof img[0] === "string" ? img[0] : img[0]?.url;
                      if (isGoodUrl(first)) return first;
                    }
                    if (img?.url && isGoodUrl(img.url)) return img.url;
                    if (item.thumbnailUrl && isGoodUrl(item.thumbnailUrl)) return item.thumbnailUrl;
                  }
                }
              }
            } catch {}

            // 2. og:image / meta tags — universal, nearly all news sites implement these
            const metaSelectors = [
              'meta[property="og:image"]', 'meta[property="og:image:secure_url"]',
              'meta[property="og:image:url"]', 'meta[name="twitter:image"]',
              'meta[name="twitter:image:src"]', 'meta[name="image"]',
              'meta[itemprop="image"]', 'link[rel="image_src"]',
            ];
            for (const sel of metaSelectors) {
              const el = document.querySelector(sel);
              const val = el?.getAttribute("content") || el?.getAttribute("href") || "";
              if (isGoodUrl(val)) return val;
            }

            // 3. Article hero/featured image (common CMS patterns)
            const heroSelectors = [
              ".post-hero img", ".article-hero img", ".hero-image img",
              "[data-hero] img", ".featured-image img", ".post-thumbnail img",
              ".article-featured-image img", "figure.lead img", "figure:first-of-type img",
              ".entry-content > figure:first-child img", ".article__hero img",
              ".slideshow img", ".carousel img", ".gallery-image img",
              ".wp-post-image", "picture source", ".top-image img",
              "[data-main-image] img", ".lead-media img", ".article-image img",
            ];
            for (const sel of heroSelectors) {
              const el = document.querySelector(sel);
              if (!el) continue;
              const src = el.getAttribute("src") || el.dataset?.src ||
                el.getAttribute("srcset")?.split(",")[0]?.trim()?.split(" ")[0] || "";
              if (isGoodUrl(src)) return src;
            }

            // 4. First large image in article body (prefer images > 200px wide)
            const bodySelectors = [
              "article img[src]", ".post-content img[src]", ".article-body img[src]",
              ".entry-content img[src]", ".article-content img[src]", "main img[src]",
            ];
            const imgs = Array.from(document.querySelectorAll(bodySelectors.join(", ")));
            for (const img of imgs) {
              const src = img.getAttribute("src") || "";
              if (isGoodUrl(src) && img.naturalWidth > 200) return src;
            }
            for (const img of imgs) {
              const src = img.getAttribute("src") || "";
              if (isGoodUrl(src)) return src;
            }
            return "";
          });
          // Only store Playwright-extracted images in cache (not RSS logos).
          // If Playwright found nothing, store "" so future runs re-try extraction.
          const extractedImg = (imgUrl && !isGenericImage(imgUrl)) ? imgUrl : "";
          if (extractedImg) {
            article.imageUrl = extractedImg;
          } else {
            // Clear the unreliable RSS image — Google News RSS often returns
            // images from a different article in the same news cluster.
            // Better to trigger the screenshot fallback or show a topic
            // placeholder than display a wrong article's image.
            article.imageUrl = "";
          }
          if (articleId) cache[articleId] = { url: finalUrl, imageUrl: extractedImg };
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

  // ── Playwright image re-extraction for cached articles missing images ──
  // Articles with resolved URLs but no image (cache had imageUrl:"") get another
  // chance with the stealthier Playwright settings.
  const needsPlaywrightImage = articles.filter((a) =>
    !a.imageUrl &&
    !a.url.includes("news.google.com") && a.url.startsWith("http")
  );
  if (needsPlaywrightImage.length > 0) {
    console.log(`Re-trying Playwright image extraction for ${needsPlaywrightImage.length} articles...`);
    let pwRetryFixed = 0;
    for (let i = 0; i < needsPlaywrightImage.length; i += PLAYWRIGHT_CONCURRENCY) {
      const batch = needsPlaywrightImage.slice(i, i + PLAYWRIGHT_CONCURRENCY);
      await Promise.allSettled(batch.map(async (article) => {
        const page = await context.newPage();
        try {
          await page.goto(article.url, { waitUntil: "load", timeout: PLAYWRIGHT_TIMEOUT });
          await page.waitForTimeout(1000);
          const imgUrl = await page.evaluate(() => {
            const isGood = (u) => u && u.startsWith("http") && ![
              "avatar","/logo","favicon","icon","pixel","tracking","1x1","spacer",
              "badge","brand","masthead","site-logo","site_logo",".ico",".svg",
            ].some((p) => u.toLowerCase().includes(p));
            // JSON-LD
            try {
              for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
                const d = JSON.parse(s.textContent || "");
                for (const item of (Array.isArray(d) ? d : d["@graph"] || [d])) {
                  if (["NewsArticle","Article","BlogPosting","WebPage","ReportageNewsArticle"].includes(item["@type"])) {
                    const img = item.image;
                    if (typeof img === "string" && isGood(img)) return img;
                    if (Array.isArray(img) && img[0]) { const f = typeof img[0] === "string" ? img[0] : img[0]?.url; if (isGood(f)) return f; }
                    if (img?.url && isGood(img.url)) return img.url;
                  }
                }
              }
            } catch {}
            // og:image / twitter:image
            for (const sel of ['meta[property="og:image"]','meta[name="twitter:image"]']) {
              const val = document.querySelector(sel)?.getAttribute("content") || "";
              if (isGood(val)) return val;
            }
            return "";
          });
          if (imgUrl && !isGenericImage(imgUrl)) {
            article.imageUrl = imgUrl;
            const aid = extractArticleId(article.url) || article.url;
            if (cache[aid]) cache[aid].imageUrl = imgUrl;
            else cache[aid] = { url: article.url, imageUrl: imgUrl };
            pwRetryFixed++;
          }
        } catch {}
        finally { await page.close(); }
      }));
    }
    console.log(`  Playwright re-extraction: ${pwRetryFixed}/${needsPlaywrightImage.length} fixed`);
  }

  // ── Lightweight HTTP og:image extraction for articles still missing images ──
  // A simple HTTP GET + regex parse for extracting og:image / twitter:image
  // since these meta tags are server-rendered in HTML (no JS needed).
  const stillNeedsImage = articles.filter((a) =>
    !a.imageUrl   ).filter((a) => !a.url.includes("news.google.com")); // must have resolved URL

  if (stillNeedsImage.length > 0) {
    console.log(`Fetching og:image via HTTP for ${stillNeedsImage.length} articles...`);
    let httpFixed = 0;
    const HTTP_CONCURRENCY = 10;
    for (let i = 0; i < stillNeedsImage.length; i += HTTP_CONCURRENCY) {
      const batch = stillNeedsImage.slice(i, i + HTTP_CONCURRENCY);
      await Promise.allSettled(batch.map(async (article) => {
        const img = await fetchOgImageHttp(article.url);
        if (img && !isGenericImage(img)) {
          article.imageUrl = img;
          const articleId = extractArticleId(article.url) || article.url;
          if (cache[articleId]) cache[articleId].imageUrl = img;
          httpFixed++;
        }
      }));
    }
    console.log(`  HTTP og:image extraction: ${httpFixed}/${stillNeedsImage.length} fixed`);
  }

  saveUrlCache(cache);
  console.log(`Resolution done: ${resolved} resolved, ${failed} failed`);

  // Download extracted images locally for faster UI display
  await downloadArticleImages(articles);

  // Screenshot fallback — capture hero images for articles still missing images
  await captureScreenshots(articles, cache);

  applyFallbackImages(articles);
  cleanupScreenshots(articles);
}

/** Lightweight og:image extraction via HTTP GET (no Playwright needed).
 *  Uses realistic browser headers to avoid bot detection. Extracts og:image,
 *  twitter:image, and JSON-LD image from raw HTML using regex. */
async function fetchOgImageHttp(url) {
  if (!url) return "";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return "";
    const html = await res.text();

    // 1. JSON-LD image (most accurate)
    const ldMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (ldMatch) {
      try {
        const data = JSON.parse(ldMatch[1]);
        const items = Array.isArray(data) ? data : data["@graph"] || [data];
        for (const item of items) {
          const t = item["@type"];
          if (["NewsArticle","Article","BlogPosting","WebPage","ReportageNewsArticle"].includes(t)) {
            const img = item.image;
            if (typeof img === "string" && img.startsWith("http") && !isGenericImage(img)) return img;
            if (Array.isArray(img) && img.length > 0) {
              const first = typeof img[0] === "string" ? img[0] : img[0]?.url;
              if (first && first.startsWith("http") && !isGenericImage(first)) return first;
            }
            if (img?.url && img.url.startsWith("http") && !isGenericImage(img.url)) return img.url;
          }
        }
      } catch {}
    }

    // 2. og:image meta tag
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogMatch?.[1] && ogMatch[1].startsWith("http") && !isGenericImage(ogMatch[1])) return ogMatch[1];

    // 3. og:image:secure_url
    const ogSecure = html.match(/<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image:secure_url["']/i);
    if (ogSecure?.[1] && ogSecure[1].startsWith("http") && !isGenericImage(ogSecure[1])) return ogSecure[1];

    // 4. twitter:image meta tag
    const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
    if (twMatch?.[1] && twMatch[1].startsWith("http") && !isGenericImage(twMatch[1])) return twMatch[1];

  } catch { /* timeout or network error — skip */ }
  return "";
}

// ── Local image download & optimization ─────────────────────────────
// After og:image extraction, download each article's image locally into
// public/data/images/{category}/{hash}.webp for faster UI display and to avoid
// hotlinking / CORS issues. Uses sharp for resize + WebP conversion.
// Falls back to raw download if sharp is unavailable.

const IMAGE_DL_CONCURRENCY = 10;

/** Download article images locally, optimise with sharp if available.
 *  Inserts between HTTP og:image extraction and screenshot fallback. */
async function downloadArticleImages(articles) {
  const toDownload = articles.filter((a) =>
    a.imageUrl && a.imageUrl.startsWith("http")   );
  if (toDownload.length === 0) return;

  let sharp;
  try { sharp = require("sharp"); } catch {
    console.warn("sharp not installed — skipping local image download (images served from external URLs)");
    return;
  }

  console.log(`Downloading ${toDownload.length} article images locally...`);
  let downloaded = 0, skipped = 0, failed = 0;

  for (let i = 0; i < toDownload.length; i += IMAGE_DL_CONCURRENCY) {
    const batch = toDownload.slice(i, i + IMAGE_DL_CONCURRENCY);
    await Promise.allSettled(batch.map(async (article) => {
      const category = article.topic || "technology-innovation";
      const categoryDir = path.join(DOWNLOADED_IMAGES_DIR, category);
      fs.mkdirSync(categoryDir, { recursive: true });

      const hash = screenshotHash(article.imageUrl);
      const filename = `${hash}.webp`;
      const localPath = `data/images/${category}/${filename}`;
      const fullPath = path.join(categoryDir, filename);

      // Skip if already downloaded in a previous run
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        if (stat.size > 1000) {
          article.imageUrl = localPath;
          skipped++;
          return;
        }
        // Tiny/corrupt file — re-download
        fs.unlinkSync(fullPath);
      }

      try {
        const res = await fetch(article.imageUrl, {
          headers: { "User-Agent": BROWSER_UA },
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) { failed++; return; }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) { failed++; return; }

        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length < 1000) { failed++; return; }

        // Resize to 600×400 and convert to WebP for consistent, fast thumbnails
        await sharp(buffer)
          .resize(600, 400, { fit: "cover", position: "centre" })
          .webp({ quality: 80 })
          .toFile(fullPath);

        const stat = fs.statSync(fullPath);
        if (stat.size < 500) {
          fs.unlinkSync(fullPath);
          failed++;
          return;
        }

        article.imageUrl = localPath;
        downloaded++;
      } catch {
        // Download or sharp error — leave the external URL as-is
        failed++;
      }
    }));
  }

  console.log(`  Image download: ${downloaded} new, ${skipped} cached, ${failed} failed`);
}

/** Remove auto-downloaded images no longer referenced by any article. */
function cleanupDownloadedImages(articles) {
  const referenced = new Set(
    articles
      .filter((a) => a.imageUrl?.startsWith("data/images/"))
      .map((a) => a.imageUrl)
  );
  let removed = 0;
  for (const category of CATEGORY_KEYS) {
    const dir = path.join(DOWNLOADED_IMAGES_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      const relPath = `data/images/${category}/${file}`;
      if (!referenced.has(relPath)) {
        fs.unlinkSync(path.join(dir, file));
        removed++;
      }
    }
  }
  if (removed > 0) console.log(`Cleaned up ${removed} unused downloaded images`);
}

// ── Screenshot-based image capture ─────────────────────────────────
// When all meta-tag / og:image extraction methods fail, Playwright can still
// "see" the rendered page. We find the largest visible image element on the
// page and screenshot just that element, saving it locally. This captures the
// actual article hero image even when sites block meta-tag scraping or use
// heavily JS-rendered pages.

/** Generate a short deterministic filename hash from a URL */
function screenshotHash(url) {
  let h = 0;
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) - h + url.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

/** Capture the hero image from a page via Playwright element screenshot.
 *  Returns the local path (relative to public/) or "" on failure. */
async function captureHeroScreenshot(page, articleUrl) {
  try {
    // Scroll slightly to trigger lazy-loaded hero images
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Find the largest visible image on the page (likely the hero/featured image)
    const imgHandle = await page.evaluateHandle(() => {
      const isGood = (src) => {
        if (!src || !src.startsWith("http")) return false;
        const l = src.toLowerCase();
        return !["avatar", "/logo", "favicon", "icon", "pixel", "tracking",
          "1x1", "spacer", "badge", "brand", "masthead", ".ico", ".svg",
          "site-logo", "site_logo", "header-logo", "nav-logo", "widget",
          "button", "banner-ad", "advertisement",
        ].some((p) => l.includes(p));
      };
      let best = null;
      let bestArea = 0;
      for (const img of document.querySelectorAll("img")) {
        const rect = img.getBoundingClientRect();
        // Must be visible, reasonably sized, and have a valid src
        if (rect.width < 200 || rect.height < 120) continue;
        if (rect.top > 1200) continue; // only above-the-fold / near top
        const src = img.currentSrc || img.src || "";
        if (!isGood(src)) continue;
        const area = rect.width * rect.height;
        if (area > bestArea) { bestArea = area; best = img; }
      }
      return best;
    });

    if (!imgHandle || !(await imgHandle.asElement())) return "";
    const element = imgHandle.asElement();

    // Verify the element is still attached and visible
    const box = await element.boundingBox();
    if (!box || box.width < 200 || box.height < 120) return "";

    // Create screenshots directory
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    const filename = `${screenshotHash(articleUrl)}.jpg`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    await element.screenshot({ path: filepath, type: "jpeg", quality: 82 });

    // Verify file was created and is reasonable size (> 5KB, < 2MB)
    const stat = fs.statSync(filepath);
    if (stat.size < 5000 || stat.size > 2 * 1024 * 1024) {
      fs.unlinkSync(filepath);
      return "";
    }

    console.log(`    Screenshot captured: ${filename} (${Math.round(stat.size / 1024)}KB)`);
    // Return path relative to public/ so it works with basePath on GitHub Pages
    return `data/screenshots/${filename}`;
  } catch {
    return "";
  }
}

/** Playwright screenshot fallback for articles still missing images.
 *  Visits each article page with a real browser and captures the hero image. */
async function captureScreenshots(articles, cache) {
  const needsScreenshot = articles.filter((a) =>
    !a.imageUrl &&
    !a.url.includes("news.google.com") && a.url.startsWith("http")
  );
  if (needsScreenshot.length === 0) return;

  let context;
  try { context = await getPlaywrightContext(); } catch {
    console.warn("Playwright not available for screenshot capture.");
    return;
  }

  console.log(`Capturing hero screenshots for ${needsScreenshot.length} articles...`);
  let captured = 0;

  for (let i = 0; i < needsScreenshot.length; i += PLAYWRIGHT_CONCURRENCY) {
    const batch = needsScreenshot.slice(i, i + PLAYWRIGHT_CONCURRENCY);
    await Promise.allSettled(batch.map(async (article) => {
      const page = await context.newPage();
      try {
        const resp = await page.goto(article.url, { waitUntil: "load", timeout: PLAYWRIGHT_TIMEOUT });
        // Only proceed if page actually loaded (not 4xx/5xx)
        if (!resp || resp.status() >= 400) return;
        await page.waitForTimeout(2000); // let images render

        const localPath = await captureHeroScreenshot(page, article.url);
        if (localPath) {
          article.imageUrl = localPath;
          const articleId = extractArticleId(article.url) || article.url;
          if (cache[articleId]) cache[articleId].imageUrl = localPath;
          else cache[articleId] = { url: article.url, imageUrl: localPath };
          captured++;
        }
      } catch { /* page load failed — skip */ }
      finally { await page.close(); }
    }));
  }
  console.log(`  Screenshot capture: ${captured}/${needsScreenshot.length} captured`);
  saveUrlCache(cache);
}

/** Remove screenshot files that are no longer referenced by any article. */
function cleanupScreenshots(articles) {
  if (!fs.existsSync(SCREENSHOTS_DIR)) return;
  const referencedFiles = new Set(
    articles
      .filter((a) => a.imageUrl?.startsWith("data/screenshots/"))
      .map((a) => path.basename(a.imageUrl))
  );
  const files = fs.readdirSync(SCREENSHOTS_DIR);
  let removed = 0;
  for (const file of files) {
    if (!referencedFiles.has(file)) {
      fs.unlinkSync(path.join(SCREENSHOTS_DIR, file));
      removed++;
    }
  }
  if (removed > 0) console.log(`Cleaned up ${removed} unused screenshots`);
}

function applyFallbackImages(articles) {
  let applied = 0;
  for (const article of articles) {
    if (!article.imageUrl) {
      article.imageUrl = pickLocalFallback(article);
      if (article.imageUrl) applied++;
    }
  }
  if (applied > 0) console.log(`  Applied ${applied} local fallback images`);
}

// ── YouTube ────────────────────────────────────────────────────────

function parseVideoEntries(xml) {
  const entries = extractEntries(xml);
  return entries.map((entry) => {
    const videoId = getTagContent(entry, "yt:videoId")[0] || "";
    const title = stripHtml(getTagContent(entry, "title")[0] || "");
    const published = getTagContent(entry, "published")[0] || "";
    const description = stripHtml(getTagContent(entry, "media:description")[0] || "");
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

// ── AI Market Insight custom articles ────────────────────────────────

const MAX_CUSTOM_ARTICLES = 30;
const SQSP_PAGE_SIZE = 20; // Squarespace default page size

/** Fetch a Squarespace JSON API URL with browser UA (avoid bot blocking) */
async function fetchSquarespace(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": BROWSER_UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

/** Try Squarespace JSON API, RSS feed, and Playwright scraping */
async function fetchCustomArticles() {
  console.log("Fetching AI Market Insight from thedayafterai.com...");

  let customData;
  try { customData = JSON.parse(fs.readFileSync(CUSTOM_JSON_PATH, "utf-8")); } catch {
    console.log("  No custom-articles.json found, skipping.");
    return;
  }

  const sectionsToFetch = (customData.sections || []).filter((s) => s.pageUrl);
  if (sectionsToFetch.length === 0) { console.log("  No sections with pageUrl, skipping."); return; }

  let updated = false;

  for (const section of sectionsToFetch) {
    const pageUrl = section.pageUrl;
    const categoryFilter = section.categoryFilter || "";
    const slug = section.collectionSlug || `/${section.id}/`;

    // ── Strategy 1: Squarespace JSON API with pagination ──
    // Try multiple filter combinations: category, tag, no filter
    let bestArticles = [];

    const attempts = [];
    if (categoryFilter) {
      attempts.push({ label: `category "${categoryFilter}"`, param: `&category=${encodeURIComponent(categoryFilter)}` });
      attempts.push({ label: `tag "${categoryFilter}"`, param: `&tag=${encodeURIComponent(categoryFilter)}` });
    }
    attempts.push({ label: "no filter (all articles)", param: "" });

    for (const attempt of attempts) {
      try {
        const thisAttempt = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore && thisAttempt.length < MAX_CUSTOM_ARTICLES) {
          const jsonUrl = `${pageUrl}?format=json${attempt.param}&offset=${offset}`;
          if (offset === 0) console.log(`  Trying Squarespace JSON API (${attempt.label}): ${jsonUrl}`);
          const raw = await fetchSquarespace(jsonUrl);
          const data = JSON.parse(raw);
          const items = data.items || data.collection?.items || [];

          if (items.length === 0) break;

          for (const item of items) {
            const fullUrl = item.fullUrl ? `https://www.thedayafterai.com${item.fullUrl}` : "";
            if (!fullUrl || !item.title) continue;

            // Skip category/tag pages — only keep actual article URLs
            try {
              const urlPath = new URL(fullUrl).pathname;
              if (urlPath.includes("/category/") || urlPath.includes("/tag/")) continue;
            } catch { continue; }

            let imageUrl = item.assetUrl || "";
            if (!imageUrl && item.socialImage) imageUrl = item.socialImage;

            // Parse date — Squarespace uses epoch ms OR ISO strings
            let dateStr = "";
            for (const field of [item.publishOn, item.updatedOn, item.addedOn]) {
              if (!field) continue;
              try {
                // Try epoch milliseconds first, then ISO string
                let d;
                if (typeof field === "number") {
                  d = new Date(field);
                } else if (/^\d{10,}$/.test(String(field))) {
                  d = new Date(parseInt(field, 10));
                } else {
                  d = new Date(field); // ISO string like "2026-02-07T12:00:00-0800"
                }
                if (d.getFullYear() >= 2020 && d.getFullYear() <= 2030) {
                  dateStr = d.toISOString().split("T")[0];
                  break;
                }
              } catch {}
            }

            const title = (item.title || "").replace(/&amp;/g, "&").trim();
            thisAttempt.push({ url: fullUrl, title, imageUrl, date: dateStr });
          }

          const pagination = data.pagination;
          if (pagination?.nextPage && items.length >= SQSP_PAGE_SIZE) {
            offset += items.length;
          } else {
            hasMore = false;
          }
        }

        console.log(`  Squarespace JSON API (${attempt.label}) returned ${thisAttempt.length} articles`);
        // Keep the best result across all attempts
        if (thisAttempt.length > bestArticles.length) {
          bestArticles = thisAttempt;
        }
        // If we got enough, stop trying more
        if (bestArticles.length >= 3) break;
      } catch (err) {
        console.log(`  Squarespace JSON API (${attempt.label}) failed: ${err.message.split("\n")[0]}`);
      }
    }

    let articlesFromApi = bestArticles;

    // ── Strategy 2: Squarespace RSS feed (alternative) ──
    if (articlesFromApi.length < 3) {
      console.log("  Trying Squarespace RSS feed...");
      try {
        const rssUrl = `${pageUrl}?format=rss`;
        const xml = await fetchSquarespace(rssUrl);
        const items = extractItems(xml);
        const rssArticles = [];
        for (const item of items) {
          const title = (getTagContent(item, "title")[0] || "").trim();
          const link = (getTagContent(item, "link")[0] || "").trim();
          if (!title || !link) continue;
          // Skip category/tag pages
          try {
            const urlPath = new URL(link).pathname;
            if (urlPath.includes("/category/") || urlPath.includes("/tag/")) continue;
          } catch { continue; }

          let imageUrl = "";
          const enclosureUrl = getTagAttr(item, "enclosure", "url");
          if (enclosureUrl.length > 0) imageUrl = enclosureUrl[0];
          if (!imageUrl) { const mediaUrl = getTagAttr(item, "media:content", "url"); if (mediaUrl.length > 0) imageUrl = mediaUrl[0]; }
          const pubDate = getTagContent(item, "pubDate")[0] || "";
          let dateStr = "";
          if (pubDate) { try { dateStr = new Date(pubDate).toISOString().split("T")[0]; } catch {} }

          rssArticles.push({ url: link, title, imageUrl, date: dateStr });
        }
        console.log(`  Squarespace RSS returned ${rssArticles.length} articles`);
        if (rssArticles.length > articlesFromApi.length) {
          articlesFromApi = rssArticles;
        }
      } catch (err) {
        console.log(`  Squarespace RSS failed: ${err.message.split("\n")[0]}`);
      }
    }

    // ── Strategy 3: Playwright scraping (fallback when API + RSS got < 3) ──
    if (articlesFromApi.length < 3) {
      let context;
      try { context = await getPlaywrightContext(); } catch {
        console.warn("  Playwright not available, skipping scraping.");
        context = null;
      }

      if (context) try {
        const page = await context.newPage();
        await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 30000 });
        console.log(`  Loaded via Playwright: ${pageUrl}`);

        // Scroll extensively to trigger lazy-loaded content (Squarespace infinite scroll)
        for (let i = 0; i < 15; i++) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          await page.waitForTimeout(600);
        }
        await page.waitForTimeout(1500);

        const scraped = await page.evaluate((filterSlug) => {
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
              // Skip category filter pages
              if (afterSlug.startsWith("category/")) continue;
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

        // Deduplicate against existing API/RSS results
        const seenUrls = new Set(articlesFromApi.map(a => a.url));
        const newFromPlaywright = [];
        for (const a of scraped) {
          if (!seenUrls.has(a.url)) { seenUrls.add(a.url); newFromPlaywright.push(a); articlesFromApi.push(a); }
        }
        console.log(`  Playwright found ${newFromPlaywright.length} new articles (total: ${articlesFromApi.length})`);

        // Fetch OG images and dates from Playwright-scraped articles only
        if (newFromPlaywright.length > 0) {
          for (const article of newFromPlaywright) {
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
        }
      } catch (err) {
        console.log(`  Playwright failed: ${err.message.split("\n")[0]}`);
      }
    }

    // Final deduplication by URL
    const finalSeen = new Set();
    articlesFromApi = articlesFromApi.filter(a => {
      if (finalSeen.has(a.url)) return false;
      finalSeen.add(a.url);
      return true;
    });

    if (articlesFromApi.length > 0) {
      section.articles = articlesFromApi.map((a, i) => {
        let normalizedDate = "";
        if (a.date) { try { normalizedDate = new Date(a.date).toISOString().split("T")[0]; } catch {} }
        return { id: `${section.id}-${i + 1}`, title: a.title, date: normalizedDate, imageUrl: a.imageUrl || "", url: a.url, source: "TheDayAfterAI" };
      });
      updated = true;
      console.log(`  Updated "${section.title}" with ${articlesFromApi.length} articles`);
    } else {
      console.log(`  No articles found, keeping existing entries.`);
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
    // Only overwrite if fetch returned results; preserve existing data on failure
    if (channelVideos.length > 0) data.channelVideos = channelVideos;
    else console.warn("  YouTube fetch returned 0 videos, keeping existing data");
    if (tdaaiArticles.length > 0) data.tdaaiArticles = tdaaiArticles;
    else console.warn("  TDAAI fetch returned 0 articles, keeping existing data");

    console.log("\n=== Fetching AI Market Insight ===");
    await fetchCustomArticles();

  } else {
    // ── Rotation mode: one category + optional 15-min extras ──
    const category = CATEGORY_KEYS[slot];
    console.log(`\n=== Fetching category: ${category} ===`);
    const articles = await fetchCategoryNews(category);

    console.log(`\n=== Resolving ${articles.length} URLs ===`);
    await resolveArticles(articles);

    // Merge: replace this category's articles in existing data
    data.news = (data.news || []).filter((a) => a.topic !== category).concat(articles);
    data.news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // YouTube + AI Market Insight: refresh every 15 min (independent of category rotation)
    if (shouldRefreshExtras()) {
      console.log("\n=== Refreshing YouTube + TDAAI RSS (15-min cycle) ===");
      const [channelVideos, tdaaiArticles] = await Promise.all([
        fetchChannelVideos(),
        fetchTdaaiArticles(),
      ]);
      // Only overwrite if fetch returned results; preserve existing data on failure
      if (channelVideos.length > 0) data.channelVideos = channelVideos;
      else console.warn("  YouTube fetch returned 0 videos, keeping existing data");
      if (tdaaiArticles.length > 0) data.tdaaiArticles = tdaaiArticles;
      else console.warn("  TDAAI fetch returned 0 articles, keeping existing data");

      console.log("\n=== Refreshing AI Market Insight (15-min cycle) ===");
      await fetchCustomArticles();
    } else {
      console.log("\nYouTube + AI Market Insight: skipped (next refresh at 15-min boundary)");
    }
  }

  // Save updated prefetched.json
  data.fetchedAt = new Date().toISOString();
  data.playlistUrl = PLAYLIST_URL;
  savePrefetched(data);

  // Clean up auto-downloaded images no longer referenced by any article
  cleanupDownloadedImages(data.news || []);

  await closePlaywright();

  const newsCount = (data.news || []).length;
  const realUrlCount = (data.news || []).filter((a) => !a.url.includes("news.google.com")).length;
  const realImgCount = (data.news || []).filter((a) => a.imageUrl).length;
  console.log(`\nSaved: ${newsCount} news (${realUrlCount} real URLs, ${realImgCount} real images), ${(data.channelVideos || []).length} videos, ${(data.tdaaiArticles || []).length} TDAAI`);
}

main().catch((err) => {
  console.error("Pre-fetch failed:", err);
  process.exit(1);
});
