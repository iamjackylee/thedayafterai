#!/usr/bin/env node
// Use Playwright headless browser to fetch real article URLs from thedayafterai.com
// This bypasses bot protection by running a real Chromium browser.

const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const TARGET_URL = "https://www.thedayafterai.com/ai-market-insight";
const CUSTOM_JSON = path.join(__dirname, "..", "public", "data", "custom-articles.json");

async function main() {
  console.log("Launching headless Chromium...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--no-proxy-server"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    // 1. Navigate to the AI Market Insight page
    console.log(`Navigating to ${TARGET_URL} ...`);
    await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 30000 });
    console.log("Page loaded. Extracting article data...");

    // 2. Extract all article links from the page
    const articles = await page.evaluate(() => {
      const results = [];

      // Squarespace blog list items — try multiple selectors
      const selectors = [
        "article a[href]",
        ".summary-item a[href]",
        ".blog-item a[href]",
        ".collection-item a[href]",
        'a[href*="/ai-market-insight/"]',
        ".sqs-block a[href]",
      ];

      const seen = new Set();
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          const href = el.href;
          if (!href || seen.has(href)) continue;
          // Only include links to articles on this site
          if (
            !href.includes("thedayafterai.com") ||
            href === window.location.href
          )
            continue;
          seen.add(href);

          // Try to get the title from the link or nearby heading
          let title =
            el.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
            el.textContent?.trim() ||
            "";
          // Get image if available
          let imageUrl = "";
          const img =
            el.querySelector("img") ||
            el.closest("article")?.querySelector("img");
          if (img) {
            imageUrl = img.dataset?.src || img.src || "";
          }

          results.push({ url: href, title, imageUrl });
        }
      }

      return results;
    });

    console.log(`\nFound ${articles.length} article links:\n`);
    for (const a of articles) {
      console.log(`  Title: ${a.title}`);
      console.log(`  URL:   ${a.url}`);
      console.log(`  Image: ${a.imageUrl || "(none)"}`);
      console.log("");
    }

    // 3. Also dump the full HTML source for inspection
    const html = await page.content();
    const htmlPath = path.join(__dirname, "..", "debug-ai-market-insight.html");
    fs.writeFileSync(htmlPath, html);
    console.log(`Full HTML saved to: ${htmlPath}`);

    // 4. Also try to fetch the RSS version
    console.log("\nTrying RSS feed...");
    const rssPage = await context.newPage();
    try {
      await rssPage.goto(TARGET_URL + "?format=rss", {
        waitUntil: "networkidle",
        timeout: 15000,
      });
      const rssContent = await rssPage.content();
      const rssPath = path.join(
        __dirname,
        "..",
        "debug-ai-market-insight-rss.xml"
      );
      fs.writeFileSync(rssPath, rssContent);
      console.log(`RSS saved to: ${rssPath}`);
    } catch (err) {
      console.log(`RSS fetch failed: ${err.message}`);
    }
    await rssPage.close();

    // 5. Navigate to each article to get OG images
    if (articles.length > 0) {
      console.log("\nFetching OG images from individual articles...");
      for (const article of articles) {
        if (!article.url) continue;
        try {
          const articlePage = await context.newPage();
          await articlePage.goto(article.url, {
            waitUntil: "domcontentloaded",
            timeout: 15000,
          });
          const ogImage = await articlePage.evaluate(() => {
            const meta =
              document.querySelector('meta[property="og:image"]') ||
              document.querySelector('meta[name="twitter:image"]');
            return meta?.getAttribute("content") || "";
          });
          if (ogImage) article.imageUrl = ogImage;
          console.log(
            `  ${article.title.slice(0, 50)}... => ${ogImage || "(no og:image)"}`
          );
          await articlePage.close();
        } catch (err) {
          console.log(
            `  Failed to get OG image for "${article.title.slice(0, 40)}": ${err.message}`
          );
        }
      }
    }

    // 6. Update custom-articles.json if we found articles
    if (articles.length > 0) {
      try {
        const customData = JSON.parse(fs.readFileSync(CUSTOM_JSON, "utf-8"));
        const section = customData.sections.find(
          (s) => s.id === "ai-market-insight"
        );
        if (section) {
          section.articles = articles.map((a, i) => ({
            id: `ami-${i + 1}`,
            title: a.title,
            date: "",
            imageUrl: a.imageUrl || "",
            url: a.url,
            source: "TheDayAfterAI",
          }));
          fs.writeFileSync(
            CUSTOM_JSON,
            JSON.stringify(customData, null, 2) + "\n"
          );
          console.log(
            `\nUpdated custom-articles.json with ${articles.length} real articles!`
          );
        }
      } catch (err) {
        console.error("Failed to update custom-articles.json:", err.message);
      }
    }
  } catch (err) {
    console.error("Error:", err.message);

    // Save whatever we got for debugging
    try {
      const html = await page.content();
      const htmlPath = path.join(
        __dirname,
        "..",
        "debug-ai-market-insight.html"
      );
      fs.writeFileSync(htmlPath, html);
      console.log(`Debug HTML saved to: ${htmlPath}`);
    } catch {}
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
