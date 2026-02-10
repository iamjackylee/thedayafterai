#!/usr/bin/env node
// Fetch real article URLs and OG images from custom sections using a headless browser.
// Each section in custom-articles.json can have:
//   - pageUrl: the page to navigate to (e.g. landing page where articles are listed)
//   - collectionSlug: URL path fragment to filter article links (e.g. "/ai-market-insight/")
//
// The script navigates to pageUrl with Playwright, finds links containing collectionSlug,
// visits each article to grab the OG image and publish date, then updates custom-articles.json.
//
// Usage: npm install playwright && npx playwright install chromium && node scripts/fetch-custom-urls.js

const fs = require("fs");
const path = require("path");

const CUSTOM_JSON = path.join(__dirname, "..", "public", "data", "custom-articles.json");

async function main() {
  let customData;
  try {
    customData = JSON.parse(fs.readFileSync(CUSTOM_JSON, "utf-8"));
  } catch {
    console.log("No custom-articles.json found, skipping browser fetch.");
    return;
  }

  if (!customData.sections || customData.sections.length === 0) {
    console.log("No custom sections defined, skipping.");
    return;
  }

  // Only process sections that have a pageUrl (i.e. are sourced from a website)
  const sectionsToFetch = customData.sections.filter((s) => s.pageUrl);
  if (sectionsToFetch.length === 0) {
    console.log("No sections with pageUrl, skipping browser fetch.");
    return;
  }

  // Dynamically require playwright (installed via npm in CI)
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    try {
      ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
    } catch {
      console.warn("Playwright not available, skipping browser-based fetch.");
      return;
    }
  }

  console.log("Launching headless Chromium for custom article discovery...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  });

  let updated = false;

  for (const section of sectionsToFetch) {
    console.log(`\nFetching articles for "${section.title}" ...`);

    const pageUrl = section.pageUrl;
    const slug = section.collectionSlug || `/${section.id}/`;

    try {
      const page = await context.newPage();
      await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 30000 });
      console.log(`  Page loaded: ${pageUrl}`);

      // Extract article links from the landing page, filtered by collectionSlug
      const articles = await page.evaluate((filterSlug) => {
        const results = [];
        const seen = new Set();

        // Find ALL links on the page that contain the collection slug
        const allLinks = document.querySelectorAll("a[href]");

        for (const el of allLinks) {
          const href = el.href;
          if (!href || seen.has(href)) continue;
          if (!href.includes("thedayafterai.com")) continue;

          // Filter: only links whose path contains the collection slug
          try {
            const linkPath = new URL(href).pathname;
            // Must contain the slug AND be a sub-page (not just the collection index)
            // e.g. /ai-market-insight/some-article-slug (not just /ai-market-insight/ or /ai-market-insight)
            if (!linkPath.includes(filterSlug)) continue;
            // Ensure there's content after the slug (it's an actual article, not the index)
            const afterSlug = linkPath.split(filterSlug)[1];
            if (!afterSlug || afterSlug === "/" || afterSlug === "") continue;
          } catch {
            continue;
          }

          seen.add(href);

          // Extract title from the link or nearby heading
          let title =
            el.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
            el.closest("article, .summary-item, .blog-item, .sqs-block")?.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
            el.textContent?.trim().substring(0, 200) ||
            "";
          title = title.replace(/\s+/g, " ").trim();

          // Extract image from the link or its parent article container
          let imageUrl = "";
          const container = el.closest("article, .summary-item, .blog-item, .sqs-block") || el.parentElement;
          const img = el.querySelector("img") || container?.querySelector("img");
          if (img) {
            imageUrl = img.dataset?.src || img.src || "";
          }

          if (title) {
            results.push({ url: href, title, imageUrl });
          }
        }

        return results;
      }, slug);

      await page.close();

      // Deduplicate by URL (some links may appear multiple times in different selectors)
      const uniqueArticles = [];
      const seenUrls = new Set();
      for (const a of articles) {
        if (!seenUrls.has(a.url)) {
          seenUrls.add(a.url);
          uniqueArticles.push(a);
        }
      }

      console.log(`  Found ${uniqueArticles.length} article links matching "${slug}"`);

      if (uniqueArticles.length > 0) {
        // Fetch OG images and dates from individual article pages
        console.log("  Fetching OG images from article pages...");
        for (const article of uniqueArticles) {
          try {
            const articlePage = await context.newPage();
            await articlePage.goto(article.url, {
              waitUntil: "domcontentloaded",
              timeout: 15000,
            });

            const meta = await articlePage.evaluate(() => {
              const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
              const twImg = document.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || "";
              const pubDate =
                document.querySelector('meta[property="article:published_time"]')?.getAttribute("content") ||
                document.querySelector('time[datetime]')?.getAttribute("datetime") ||
                "";
              return { ogImg, twImg, pubDate };
            });

            if (meta.ogImg) article.imageUrl = meta.ogImg;
            else if (meta.twImg) article.imageUrl = meta.twImg;
            if (meta.pubDate) {
              try {
                article.date = new Date(meta.pubDate).toISOString().split("T")[0];
              } catch { /* ignore invalid dates */ }
            }

            console.log(`    ${article.title.slice(0, 50)}... => ${article.imageUrl ? "got image" : "no image"}`);
            await articlePage.close();
          } catch (err) {
            console.log(`    Failed for "${article.title.slice(0, 40)}": ${err.message.split("\n")[0]}`);
          }
        }

        // Update the section's articles
        section.articles = uniqueArticles.map((a, i) => ({
          id: `${section.id}-${i + 1}`,
          title: a.title,
          date: a.date || "",
          imageUrl: a.imageUrl || "",
          url: a.url,
          source: "TheDayAfterAI",
        }));
        updated = true;
        console.log(`  Updated "${section.title}" with ${uniqueArticles.length} articles`);
      } else {
        console.log(`  No articles found matching "${slug}", keeping existing entries.`);
      }
    } catch (err) {
      console.log(`  Failed to load "${section.title}": ${err.message.split("\n")[0]}`);
      console.log("  Keeping existing entries.");
    }
  }

  await browser.close();

  if (updated) {
    fs.writeFileSync(CUSTOM_JSON, JSON.stringify(customData, null, 2) + "\n");
    console.log("\nUpdated custom-articles.json with live data from browser!");
  } else {
    console.log("\nNo changes made to custom-articles.json");
  }
}

main().catch((err) => {
  console.error("Browser fetch failed:", err.message);
  console.log("Continuing with existing custom-articles.json data.");
  process.exit(0); // Don't fail the CI build
});
