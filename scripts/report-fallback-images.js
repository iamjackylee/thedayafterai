#!/usr/bin/env node
// Generate a markdown report of articles currently using fallback images.
// Used by the GitHub Action "Fallback Image Report" to create/update a GitHub Issue.
//
// Usage:  node scripts/report-fallback-images.js
// Output: Prints markdown to stdout (piped into gh issue create/edit)

const fs = require("fs");
const path = require("path");

const PREFETCHED_PATH = path.join(__dirname, "..", "public", "data", "prefetched.json");
const OVERRIDES_PATH = path.join(__dirname, "..", "public", "data", "image-overrides.json");

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

  // Load existing overrides to show which ones are already handled
  let overrides = {};
  try {
    const overrideData = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
    overrides = overrideData.overrides || {};
  } catch { /* no overrides file */ }

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
  lines.push(`**Existing overrides:** ${Object.keys(overrides).length}`);
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
  lines.push(`2. If the article has a feature image, save it`);
  lines.push(`3. Drop the image into \`public/data/image-overrides/\` (any format: jpg, png, webp)`);
  lines.push(`4. Add an entry in \`public/data/image-overrides.json\`:`);
  lines.push(`   \`\`\`json`);
  lines.push(`   "overrides": {`);
  lines.push(`     "https://example.com/article-url": "my-saved-image.jpg"`);
  lines.push(`   }`);
  lines.push(`   \`\`\``);
  lines.push(`5. Commit and push — the next fetch run will process it automatically`);
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
      lines.push(`| # | Title | Source | Fallback Image | URL |`);
      lines.push(`|---|-------|--------|----------------|-----|`);

      for (let i = 0; i < catArticles.length; i++) {
        const a = catArticles[i];
        const title = a.title.length > 60 ? a.title.slice(0, 57) + "..." : a.title;
        const fallbackFile = path.basename(a.imageUrl);
        const hasOverride = overrides[a.url] ? " (override pending)" : "";
        const source = (a.source || "").slice(0, 20);
        // Escape pipe characters in title/source for markdown table
        const safeTitle = title.replace(/\|/g, "\\|");
        const safeSource = source.replace(/\|/g, "\\|");
        lines.push(`| ${i + 1} | ${safeTitle} | ${safeSource} | \`${fallbackFile}\`${hasOverride} | [Visit](${a.url}) |`);
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
    lines.push(`| # | Title | Source | URL |`);
    lines.push(`|---|-------|--------|-----|`);

    for (let i = 0; i < noImageArticles.length; i++) {
      const a = noImageArticles[i];
      const title = a.title.length > 60 ? a.title.slice(0, 57) + "..." : a.title;
      const source = (a.source || "").slice(0, 20);
      const safeTitle = title.replace(/\|/g, "\\|");
      const safeSource = source.replace(/\|/g, "\\|");
      lines.push(`| ${i + 1} | ${safeTitle} | ${safeSource} | [Visit](${a.url}) |`);
    }
    lines.push(``);
  }

  console.log(lines.join("\n"));
}

main();
