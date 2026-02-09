"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Loader2,
  RefreshCw,
  Facebook,
  Youtube,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import NewsCard from "@/components/NewsCard";
import VideoCard from "@/components/VideoCard";
import DailyNewsBar from "@/components/DailyNewsBar";
import { TOPICS } from "@/lib/topics";
import {
  fetchNews,
  fetchChannelVideos,
  fetchCustomSections,
  sortByDateDesc,
  PLAYLIST_URL,
  type NewsArticle,
  type YouTubeVideo,
  type CustomSection,
} from "@/lib/api";
import {
  getNewsByTopics as getFallbackNews,
  searchNews as searchFallbackNews,
} from "@/lib/newsData";
import {
  DAILY_CHANNEL_VIDEOS as FALLBACK_CHANNEL,
} from "@/lib/youtube";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptFallbackVideos(vids: any[]): YouTubeVideo[] {
  return vids.map((v) => ({
    id: v.id,
    videoId: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    description: v.description,
    channelTitle: "TheDayAfterAI",
  }));
}

function CustomSectionRow({ section }: { section: CustomSection }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll, section.articles]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  if (section.articles.length === 0) return null;

  return (
    <div className="category-section">
      <div className="flex items-center justify-between mb-4">
        <div
          className="category-header"
          style={{ borderLeftColor: section.color } as React.CSSProperties}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-white uppercase tracking-wide">
              {section.title}
            </h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: section.color + "20", color: section.color }}
            >
              TheDayAfterAI
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? section.color : undefined }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? section.color : undefined }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="category-scroll flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {section.articles.map((article) => (
          <a
            key={article.id}
            href={article.url || "#"}
            target={article.url ? "_blank" : undefined}
            rel={article.url ? "noopener noreferrer" : undefined}
            className="shrink-0 w-[280px] group block bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all card-hover"
          >
            <div className="relative aspect-video overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${article.imageUrl})` }}
              />
            </div>
            <div className="p-3">
              <h4 className="text-xs font-bold text-white group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[var(--text-secondary)] text-[10px] font-medium">
                  {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function CategoryRow({ topic, articles, id }: { topic: typeof TOPICS[number]; articles: NewsArticle[]; id?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll, articles]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  return (
    <div className="category-section" id={id} data-topic-section={topic.id}>
      {/* Category header with colored border and arrows */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="category-header"
          style={{ borderLeftColor: topic.color } as React.CSSProperties}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-white uppercase tracking-wide">
              {topic.label}
            </h3>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: topic.color + "20", color: topic.color }}
            >
              {articles.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? topic.color : undefined }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? topic.color : undefined }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      {/* Horizontal scroll row */}
      <div
        ref={scrollRef}
        className="category-scroll flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {articles.map((article, i) => (
          <div key={article.id} className="shrink-0 w-[280px]">
            <NewsCard article={article} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const topicNavRef = useRef<HTMLDivElement>(null);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingChannel, setLoadingChannel] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(debouncedQuery), 500);
    return () => clearTimeout(t);
  }, [debouncedQuery]);

  const loadData = useCallback(async () => {
    const topicKeywords = selectedTopics.map(
      (id) => TOPICS.find((t) => t.id === id)?.label || id
    );

    setLoadingNews(true);
    setLoadingChannel(true);

    const newsPromise = fetchNews(topicKeywords, searchQuery)
      .then((data) => {
        if (data.length > 0) {
          setArticles(sortByDateDesc(data));
        } else {
          const fallback = searchQuery.trim()
            ? searchFallbackNews(searchQuery)
            : getFallbackNews(selectedTopics);
          setArticles(sortByDateDesc(fallback));
        }
      })
      .catch(() => {
        const fallback = searchQuery.trim()
          ? searchFallbackNews(searchQuery)
          : getFallbackNews(selectedTopics);
        setArticles(sortByDateDesc(fallback));
      })
      .finally(() => setLoadingNews(false));

    const channelPromise = fetchChannelVideos(15)
      .then((ch) => {
        setChannelVideos(ch.length > 0 ? ch : adaptFallbackVideos(FALLBACK_CHANNEL));
      })
      .catch(() => {
        setChannelVideos(adaptFallbackVideos(FALLBACK_CHANNEL));
      })
      .finally(() => setLoadingChannel(false));

    const customPromise = fetchCustomSections()
      .then((sections) => setCustomSections(sections))
      .catch(() => {});

    await Promise.allSettled([newsPromise, channelPromise, customPromise]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopics.join(","), searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const scrollTopics = (dir: "left" | "right") => {
    topicNavRef.current?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  // Group articles by topic in defined order
  const groupedArticles = TOPICS.map((topic) => ({
    topic,
    articles: articles.filter((a) => a.topic === topic.id),
  })).filter((g) => g.articles.length > 0);

  const displayGroups = selectedTopics.length > 0
    ? groupedArticles.filter((g) => selectedTopics.includes(g.topic.id))
    : groupedArticles;

  // Scroll-spy: highlight nav button for visible category section
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const sections = document.querySelectorAll("[data-topic-section]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        }
        if (best) {
          setActiveSection(best.target.getAttribute("data-topic-section"));
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [displayGroups.length]);

  // Auto-scroll nav to show active button
  useEffect(() => {
    if (!activeSection || !topicNavRef.current) return;
    const btn = topicNavRef.current.querySelector(`[data-nav-topic="${activeSection}"]`) as HTMLElement | null;
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeSection]);

  const sortedChannelVideos = sortByDateDesc(channelVideos);

  return (
    <div className="min-h-screen bg-black">
      {/* Daily news bar */}
      <DailyNewsBar latestVideo={channelVideos[0] || null} />

      {/* Header */}
      <header className="bg-black border-b border-[var(--border)] sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src="https://images.squarespace-cdn.com/content/v1/6676cf95ee3c1d15365d2d18/3827502e-87dd-4bf1-808a-7b732caf1d18/TheDayAfterAI+New+Logo.png?format=300w"
                alt="TheDayAfterAI News"
                className="h-10"
              />
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  value={debouncedQuery}
                  onChange={(e) => setDebouncedQuery(e.target.value)}
                  placeholder="Search AI news..."
                  className="w-full bg-[var(--surface)] border border-[var(--border-light)] rounded-none pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button onClick={loadData} title="Refresh" className="p-2 hover:bg-[var(--surface-light)] transition-colors rounded-sm">
                <RefreshCw size={16} className={`text-[var(--muted)] ${loadingNews ? "animate-spin" : ""}`} />
              </button>
              <div className="hidden md:flex items-center gap-4 ml-1 pl-4 border-l border-[var(--border-light)]">
                <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Facebook size={18} /></a>
                <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Youtube size={18} /></a>
                <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Topic navigation - color-coded pills */}
        <div className="border-t border-[var(--border)]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <button
              onClick={() => scrollTopics("left")}
              className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-black to-transparent hidden md:flex items-center"
            >
              <ChevronLeft size={16} className="text-[var(--muted)]" />
            </button>
            <div
              ref={topicNavRef}
              className="topic-nav flex items-center gap-1.5 overflow-x-auto py-3"
            >
              <button
                onClick={() => setSelectedTopics([])}
                className={`shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedTopics.length === 0
                    ? "bg-white text-black border-white"
                    : "text-[var(--muted)] border-transparent hover:text-white hover:border-[var(--border-light)]"
                }`}
              >
                All
              </button>
              {TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const isActive = !isSelected && activeSection === topic.id;
                return (
                  <button
                    key={topic.id}
                    data-nav-topic={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className="shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border"
                    style={
                      isSelected
                        ? { backgroundColor: topic.color, color: "#000", borderColor: topic.color }
                        : isActive
                        ? { color: topic.color, borderColor: topic.color, borderBottomWidth: "2px" }
                        : { color: "var(--muted)", borderColor: "transparent" }
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.target as HTMLElement).style.color = topic.color;
                        (e.target as HTMLElement).style.borderColor = topic.color + "40";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isActive) {
                        (e.target as HTMLElement).style.color = "var(--muted)";
                        (e.target as HTMLElement).style.borderColor = "transparent";
                      } else if (isActive) {
                        (e.target as HTMLElement).style.color = topic.color;
                        (e.target as HTMLElement).style.borderColor = topic.color;
                      }
                    }}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => scrollTopics("right")}
              className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-black to-transparent hidden md:flex items-center"
            >
              <ChevronRight size={16} className="text-[var(--muted)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Daily AI News Videos Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="category-header" style={{ borderLeftColor: "#ff0050" } as React.CSSProperties}>
              <h2 className="font-display text-2xl md:text-3xl text-white">Daily AI News</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">TheDayAfterAI YouTube Channel</p>
            </div>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ff0050] hover:bg-[#e00045] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Youtube size={14} />
              Subscribe
            </a>
          </div>

          {loadingChannel ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="text-[var(--accent)] animate-spin" />
              <span className="ml-3 text-[var(--muted)] text-lg">Loading videos...</span>
            </div>
          ) : sortedChannelVideos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Featured first video - large left */}
              <a
                href={`https://www.youtube.com/watch?v=${sortedChannelVideos[0].videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all card-hover"
              >
                {/* Thumbnail - full width, no cropping */}
                <div className="relative overflow-hidden">
                  <img
                    src={sortedChannelVideos[0].thumbnail}
                    alt={sortedChannelVideos[0].title}
                    className="w-full aspect-video object-contain bg-black transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-[#ff0050] flex items-center justify-center shadow-2xl">
                      <Play size={28} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                  {/* Badge */}
                  <div className="absolute top-0 left-0 px-2.5 py-1 bg-[#ff0050] text-white text-[10px] font-black uppercase tracking-widest">
                    Latest Episode
                  </div>
                </div>
                {/* Info below thumbnail */}
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-black text-white leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {sortedChannelVideos[0].title}
                  </h3>
                  {sortedChannelVideos[0].description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">{sortedChannelVideos[0].description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-[var(--muted)] font-medium">
                      {new Date(sortedChannelVideos[0].publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <span className="text-[var(--border-light)]">|</span>
                    <span className="text-xs text-[var(--muted)]">TheDayAfterAI</span>
                  </div>
                </div>
              </a>
              {/* 4 small videos - 2x2 grid on right */}
              <div className="grid grid-cols-2 gap-3">
                {sortedChannelVideos.slice(1, 5).map((video, i) => (
                  <VideoCard key={video.id} video={video} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border)]">
              <p className="text-[var(--muted)] text-sm mb-2">No videos loaded yet.</p>
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                Visit the channel on YouTube &rarr;
              </a>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-[var(--border-light)] mb-10" />

        {/* Custom editorial sections (e.g. AI Market Insight) */}
        {customSections.map((section) => (
          <CustomSectionRow key={section.id} section={section} />
        ))}

        {/* News heading */}
        <div className="mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
            {searchQuery
              ? `"${searchQuery}"`
              : selectedTopics.length > 0
              ? "Filtered News"
              : "AI News"}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {loadingNews ? "Searching..." : `${articles.length} articles across ${displayGroups.length} categories`}
          </p>
        </div>

        {/* News Articles grouped by category - horizontal scroll rows */}
        {loadingNews ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
            <span className="ml-4 text-[var(--muted)] text-lg">Fetching latest news...</span>
          </div>
        ) : displayGroups.length > 0 ? (
          <div>
            {displayGroups.map(({ topic, articles: groupArticles }) => (
              <CategoryRow key={topic.id} topic={topic} articles={groupArticles.slice(0, 30)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={28} className="text-[var(--muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No articles found</h3>
            <p className="text-[var(--muted)] text-sm mb-4">Try adjusting your search or topics.</p>
            <button
              onClick={() => { setSelectedTopics([]); setDebouncedQuery(""); setSearchQuery(""); }}
              className="text-sm text-[var(--accent)] hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 mt-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} TheDayAfterAI News
          </span>
          <div className="flex items-center gap-5">
            <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Facebook size={18} /></a>
            <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Youtube size={18} /></a>
            <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
