#!/usr/bin/env node
// Fetch real article URLs and OG images from custom sections using a headless browser.
// Reads rssUrl from each section in custom-articles.json, navigates with Playwright,
// and updates the file with real URLs, titles, dates, and images.
//
// Usage: npx playwright install chromium && node scripts/fetch-custom-urls.js

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

  // Only process sections that have an rssUrl (i.e. are sourced from a website)
  const sectionsToFetch = customData.sections.filter((s) => s.rssUrl);
  if (sectionsToFetch.length === 0) {
    console.log("No sections with rssUrl, skipping browser fetch.");
    return;
  }

  // Dynamically require playwright (installed via npx in CI)
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    try {
      // Fallback: global install path
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

    // Derive the collection page URL from the rssUrl (strip ?format=rss)
    const pageUrl = section.rssUrl.replace(/\?format=rss$/, "");

    try {
      const page = await context.newPage();
      await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 30000 });
      console.log(`  Page loaded: ${pageUrl}`);

      // Extract article links from the Squarespace collection page
      const articles = await page.evaluate((sectionPageUrl) => {
        const results = [];
        const seen = new Set();

        // Squarespace uses various selectors for blog list items
        const selectors = [
          "article a[href]",
          ".summary-item a[href]",
          ".blog-item a[href]",
          ".collection-item a[href]",
          ".sqs-block a[href]",
        ];

        // Also match links containing the collection slug
        const urlPath = new URL(sectionPageUrl).pathname;
        if (urlPath && urlPath !== "/") {
          selectors.push(`a[href*="${urlPath}/"]`);
        }

        for (const sel of selectors) {
          for (const el of document.querySelectorAll(sel)) {
            const href = el.href;
            if (!href || seen.has(href)) continue;
            if (!href.includes("thedayafterai.com")) continue;
            if (href === sectionPageUrl || href === sectionPageUrl + "/") continue;
            // Must be a sub-page (article), not just the collection page
            const hrefPath = new URL(href).pathname;
            if (hrefPath === urlPath || hrefPath === urlPath + "/") continue;
            seen.add(href);

            let title =
              el.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
              el.textContent?.trim().substring(0, 200) ||
              "";
            // Clean up whitespace
            title = title.replace(/\s+/g, " ").trim();

            let imageUrl = "";
            const img =
              el.querySelector("img") ||
              el.closest("article, .summary-item")?.querySelector("img");
            if (img) {
              imageUrl = img.dataset?.src || img.src || "";
            }

            if (title) {
              results.push({ url: href, title, imageUrl });
            }
          }
        }

        return results;
      }, pageUrl);

      await page.close();

      console.log(`  Found ${articles.length} article links`);

      if (articles.length > 0) {
        // Fetch OG images from individual article pages
        console.log("  Fetching OG images...");
        for (const article of articles) {
          try {
            const articlePage = await context.newPage();
            await articlePage.goto(article.url, {
              waitUntil: "domcontentloaded",
              timeout: 15000,
            });

            const meta = await articlePage.evaluate(() => {
              const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
              const twImg = document.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || "";
              const pubDate = document.querySelector('meta[property="article:published_time"]')?.getAttribute("content") ||
                document.querySelector('time[datetime]')?.getAttribute("datetime") || "";
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
        section.articles = articles.map((a, i) => ({
          id: `${section.id}-${i + 1}`,
          title: a.title,
          date: a.date || "",
          imageUrl: a.imageUrl || "",
          url: a.url,
          source: "TheDayAfterAI",
        }));
        updated = true;
        console.log(`  Updated "${section.title}" with ${articles.length} articles`);
      } else {
        console.log(`  No articles found on page, keeping existing entries.`);
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
