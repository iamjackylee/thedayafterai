#!/usr/bin/env node
// Resolve Google News redirect URLs to actual publisher article URLs.
//
// Google News RSS gives URLs like: https://news.google.com/rss/articles/CBMi...
// These use encrypted article IDs that can only be resolved by following the
// redirect in a real browser.
//
// The script maintains a URL cache (url-cache.json) so previously resolved
// URLs don't need to be resolved again on each CI run.
//
// Usage: npm install playwright && npx playwright install chromium && node scripts/resolve-google-urls.js

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "public", "data");
const PREFETCHED_JSON = path.join(DATA_DIR, "prefetched.json");
const URL_CACHE_JSON = path.join(DATA_DIR, "url-cache.json");
const CONCURRENCY = 5;
const TIMEOUT_PER_URL = 15000;

// Extract the article ID from a Google News URL
function extractArticleId(url) {
  if (!url) return null;
  const match = url.match(/\/articles\/([^?]+)/);
  return match ? match[1] : null;
}

// Load or create the URL cache
function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(URL_CACHE_JSON, "utf-8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(URL_CACHE_JSON, JSON.stringify(cache, null, 2) + "\n");
}

async function main() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(PREFETCHED_JSON, "utf-8"));
  } catch {
    console.log("No prefetched.json found, skipping URL resolution.");
    return;
  }

  if (!data.news || data.news.length === 0) {
    console.log("No news articles found, skipping.");
    return;
  }

  // Load URL cache
  const cache = loadCache();
  const cacheSize = Object.keys(cache).length;
  console.log(`URL cache loaded: ${cacheSize} cached entries`);

  // Apply cached resolutions first
  let cacheHits = 0;
  for (const article of data.news) {
    if (!article.url || !article.url.includes("news.google.com")) continue;
    const id = extractArticleId(article.url);
    if (id && cache[id]) {
      article.url = cache[id];
      cacheHits++;
    }
  }
  console.log(`Applied ${cacheHits} cached URL resolutions`);

  // Find remaining articles with Google News URLs
  const toResolve = data.news.filter(
    (a) => a.url && a.url.includes("news.google.com")
  );

  if (toResolve.length === 0) {
    console.log("All URLs resolved from cache. Saving...");
    fs.writeFileSync(PREFETCHED_JSON, JSON.stringify(data, null, 2));
    return;
  }

  console.log(`${toResolve.length} URLs still need resolution via Playwright...`);

  // Load Playwright
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    try {
      ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
    } catch {
      console.warn("Playwright not available, skipping URL resolution.");
      // Still save cache hits
      if (cacheHits > 0) {
        fs.writeFileSync(PREFETCHED_JSON, JSON.stringify(data, null, 2));
      }
      return;
    }
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  });

  let resolved = 0;
  let failed = 0;

  for (let i = 0; i < toResolve.length; i += CONCURRENCY) {
    const batch = toResolve.slice(i, i + CONCURRENCY);
    const promises = batch.map(async (article) => {
      const gnUrl = article.url;
      const articleId = extractArticleId(gnUrl);
      const page = await context.newPage();

      try {
        // Navigate to the Google News URL and wait for redirect
        const response = await page.goto(gnUrl, {
          waitUntil: "domcontentloaded",
          timeout: TIMEOUT_PER_URL,
        });

        // Wait for JS redirects to fire
        await page.waitForTimeout(2000);

        let finalUrl = page.url();

        // If still on Google, try extracting from page content
        if (finalUrl.includes("news.google.com") || finalUrl.includes("consent.google")) {
          const extracted = await page.evaluate(() => {
            // Look for the article link in Google News article page
            const canonical = document.querySelector('link[rel="canonical"]');
            if (canonical?.href && !canonical.href.includes("news.google.com")) return canonical.href;

            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl?.content && !ogUrl.content.includes("news.google.com")) return ogUrl.content;

            // Google News shows the article in a frame/redirect - look for the actual link
            const dataUrl = document.querySelector("[data-article-url], [data-redirect], a[data-n-au]");
            if (dataUrl) {
              return dataUrl.getAttribute("data-article-url") ||
                     dataUrl.getAttribute("data-redirect") ||
                     dataUrl.getAttribute("data-n-au");
            }

            // Try to find any non-Google external link
            const links = document.querySelectorAll('a[href]');
            for (const link of links) {
              const href = link.href;
              if (href &&
                  href.startsWith("http") &&
                  !href.includes("google.com") &&
                  !href.includes("youtube.com") &&
                  !href.includes("gstatic.com")) {
                return href;
              }
            }
            return null;
          });

          if (extracted) finalUrl = extracted;
        }

        // Check if we successfully resolved
        if (
          finalUrl &&
          !finalUrl.includes("news.google.com") &&
          !finalUrl.includes("consent.google") &&
          !finalUrl.includes("accounts.google")
        ) {
          article.url = finalUrl;
          if (articleId) cache[articleId] = finalUrl;
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

    // Progress logging
    const processed = Math.min(i + CONCURRENCY, toResolve.length);
    if (processed % 50 < CONCURRENCY || processed >= toResolve.length) {
      console.log(
        `  Progress: ${processed}/${toResolve.length} (resolved: ${resolved}, failed: ${failed})`
      );
    }
  }

  await browser.close();

  console.log(`\nResolution complete: ${resolved} newly resolved, ${failed} unresolved`);
  console.log(`Total resolved (cache + new): ${cacheHits + resolved}/${data.news.length}`);

  // Save updated data and cache
  fs.writeFileSync(PREFETCHED_JSON, JSON.stringify(data, null, 2));
  saveCache(cache);
  console.log("Saved prefetched.json and url-cache.json");
}

main().catch((err) => {
  console.error("URL resolution failed:", err.message);
  console.log("Continuing with existing URLs.");
  process.exit(0);
});
