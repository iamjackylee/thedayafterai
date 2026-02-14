#!/usr/bin/env node
// Generate a markdown report of articles currently using fallback images.
// Used by the GitHub Action "Fallback Image Report" to create/update a GitHub Issue.
//
// Usage:  node scripts/report-fallback-images.js
// Output: Prints markdown to stdout (piped into gh issue create/edit)

const fs = require("fs");
const path = require("path");

const PREFETCHED_PATH = path.join(__dirname, "..", "public", "data", "prefetched.json");
const OVERRIDES_DIR = path.join(__dirname, "..", "public", "data", "image-overrides");

/** Same hash function used by fetch-news.js — generates a short stable ID from a URL */
function urlHash(url) {
  let h = 0;
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) - h + url.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function main() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(PREFETCHED_PATH, "utf-8"));
  } catch {
    console.log("No prefetched.json found — nothing to report.");
    process.exit(0);
  }

  const articles = data.news || [];
  if (articles.length === 0) {
    console.log("No articles in prefetched.json.");
    process.exit(0);
  }

  // Find articles using fallback images (path starts with "images/news/")
  const fallbackArticles = articles.filter(
    (a) => a.imageUrl && a.imageUrl.startsWith("images/news/")
  );

  // Also find articles with NO image at all
  const noImageArticles = articles.filter((a) => !a.imageUrl);

  // Scan existing override files to show which ones are already handled
  let existingOverrides = new Set();
  try {
    const files = fs.readdirSync(OVERRIDES_DIR);
    for (const f of files) {
      // Extract hash from filename (e.g. "abc123.jpg" → "abc123")
      const base = path.basename(f, path.extname(f));
      if (base && base !== ".gitkeep") existingOverrides.add(base);
    }
  } catch { /* folder doesn't exist yet */ }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
  const totalArticles = articles.length;
  const withRealImage = articles.filter(
    (a) => a.imageUrl && !a.imageUrl.startsWith("images/news/")
  ).length;

  // Build markdown report
  const lines = [];
  lines.push(`## Fallback Image Report`);
  lines.push(``);
  lines.push(`**Generated:** ${now}`);
  lines.push(`**Total articles:** ${totalArticles}`);
  lines.push(`**With real images:** ${withRealImage} (${Math.round((withRealImage / totalArticles) * 100)}%)`);
  lines.push(`**Using fallback images:** ${fallbackArticles.length}`);
  lines.push(`**No image at all:** ${noImageArticles.length}`);
  lines.push(`**Existing overrides:** ${existingOverrides.size}`);
  lines.push(``);

  if (fallbackArticles.length === 0 && noImageArticles.length === 0) {
    lines.push(`All articles have real images! Nothing to review.`);
    console.log(lines.join("\n"));
    return;
  }

  // Group fallback articles by category
  const byCategory = {};
  for (const article of fallbackArticles) {
    const cat = article.topic || "unknown";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(article);
  }

  lines.push(`### How to fix`);
  lines.push(``);
  lines.push(`1. Visit the article URL below`);
  lines.push(`2. If the article has a feature image, right-click and save it`);
  lines.push(`3. **Rename** the saved image to the **Override Filename** shown in the table (e.g. \`abc123.jpg\`)`);
  lines.push(`4. Upload it to [\`public/data/image-overrides/\`](../tree/main/public/data/image-overrides) via GitHub's web UI (drag & drop)`);
  lines.push(`5. Commit — the next fetch run picks it up automatically (no JSON editing needed!)`);
  lines.push(``);
  lines.push(`> **Tip:** The override filename is a stable hash of the article URL. Any image format works (jpg, png, webp).`);
  lines.push(``);

  if (fallbackArticles.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`### Articles using fallback images (${fallbackArticles.length})`);
    lines.push(``);

    for (const [category, catArticles] of Object.entries(byCategory).sort()) {
      lines.push(`<details>`);
      lines.push(`<summary><strong>${category}</strong> (${catArticles.length} articles)</summary>`);
      lines.push(``);
      lines.push(`| # | Override Filename | Title | Source | Current Fallback | Article |`);
      lines.push(`|---|-------------------|-------|--------|------------------|---------|`);

      for (let i = 0; i < catArticles.length; i++) {
        const a = catArticles[i];
        const hash = urlHash(a.url);
        const title = a.title.length > 50 ? a.title.slice(0, 47) + "..." : a.title;
        const fallbackFile = path.basename(a.imageUrl);
        const hasOverride = existingOverrides.has(hash) ? " :white_check_mark:" : "";
        const source = (a.source || "").slice(0, 20);
        // Escape pipe characters in title/source for markdown table
        const safeTitle = title.replace(/\|/g, "\\|");
        const safeSource = source.replace(/\|/g, "\\|");
        lines.push(`| ${i + 1} | \`${hash}.jpg\`${hasOverride} | ${safeTitle} | ${safeSource} | \`${fallbackFile}\` | [Visit](${a.url}) |`);
      }

      lines.push(``);
      lines.push(`</details>`);
      lines.push(``);
    }
  }

  if (noImageArticles.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`### Articles with no image (${noImageArticles.length})`);
    lines.push(``);
    lines.push(`| # | Override Filename | Title | Source | Article |`);
    lines.push(`|---|-------------------|-------|--------|---------|`);

    for (let i = 0; i < noImageArticles.length; i++) {
      const a = noImageArticles[i];
      const hash = urlHash(a.url);
      const title = a.title.length > 50 ? a.title.slice(0, 47) + "..." : a.title;
      const source = (a.source || "").slice(0, 20);
      const hasOverride = existingOverrides.has(hash) ? " :white_check_mark:" : "";
      const safeTitle = title.replace(/\|/g, "\\|");
      const safeSource = source.replace(/\|/g, "\\|");
      lines.push(`| ${i + 1} | \`${hash}.jpg\`${hasOverride} | ${safeTitle} | ${safeSource} | [Visit](${a.url}) |`);
    }
    lines.push(``);
  }

  console.log(lines.join("\n"));
}

main();
