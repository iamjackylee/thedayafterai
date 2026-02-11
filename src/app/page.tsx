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
  ChevronsLeft,
  ChevronsRight,
  Play,
  ExternalLink,
} from "lucide-react";
import NewsCard from "@/components/NewsCard";
import VideoCard from "@/components/VideoCard";
import { TOPICS } from "@/lib/topics";
import {
  fetchNews,
  fetchChannelVideos,
  fetchCustomSections,
  fetchTdaaiArticles,
  sortByDateDesc,
  PLAYLIST_URL,
  type NewsArticle,
  type YouTubeVideo,
  type CustomSection,
  type TdaaiArticle,
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

function CustomSectionRow({ section, showCount }: { section: CustomSection; showCount?: boolean }) {
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

  const scrollToEdge = (edge: "start" | "end") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: edge === "start" ? 0 : el.scrollWidth, behavior: "smooth" });
  };

  if (section.articles.length === 0) return null;

  return (
    <div className="category-section" data-topic-section={`custom-${section.id}`}>
      <div className="flex items-center justify-between mb-4">
        <div
          className="category-header"
          style={{ borderLeftColor: section.color } as React.CSSProperties}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-white uppercase tracking-wide">
              {section.title}
            </h3>
            {showCount && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-sm"
                style={{ backgroundColor: section.color + "20", color: section.color }}
              >
                {section.articles.length}
              </span>
            )}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: section.color + "20", color: section.color }}
            >
              TheDayAfterAI
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => scrollToEdge("start")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? section.color : undefined }}
            title="Newest"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? section.color : undefined }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? section.color : undefined }}
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => scrollToEdge("end")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? section.color : undefined }}
            title="Oldest"
          >
            <ChevronsRight size={18} />
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
            style={{ ["--card-accent" as string]: section.color }}
          >
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
              <img
                src={article.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format"}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  const fb = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format";
                  if (img.src !== fb) { img.src = fb; } else { img.style.display = "none"; }
                }}
              />
            </div>
            <div className="p-3">
              <h4 className="text-xs font-bold text-white transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[var(--text-secondary)] text-[10px] font-medium">
                  {article.date && !isNaN(new Date(article.date).getTime())
                    ? new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : article.source || "TheDayAfterAI"}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function TdaaiSectionRow({ articles }: { articles: TdaaiArticle[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionColor = "#3cffd0";

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

  const scrollToEdge = (edge: "start" | "end") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: edge === "start" ? 0 : el.scrollWidth, behavior: "smooth" });
  };

  if (articles.length === 0) return null;

  return (
    <div className="category-section" data-topic-section="tdaai">
      <div className="flex items-center justify-between mb-4">
        <div
          className="category-header"
          style={{ borderLeftColor: sectionColor } as React.CSSProperties}
        >
          <h3 className="text-lg font-black text-white uppercase tracking-wide">
            From TheDayAfterAI.com
          </h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => scrollToEdge("start")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? sectionColor : undefined }}
            title="Newest"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? sectionColor : undefined }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? sectionColor : undefined }}
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => scrollToEdge("end")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? sectionColor : undefined }}
            title="Oldest"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="category-scroll flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url || "https://thedayafterai.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-[280px] group block bg-[var(--surface)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-light)] transition-all card-hover"
            style={{ ["--card-accent" as string]: sectionColor }}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
              <img
                src={article.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format"}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  const fb = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format";
                  if (img.src !== fb) { img.src = fb; } else { img.style.display = "none"; }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-0 left-0 px-2 py-0.5 bg-[#3cffd0] text-black text-[9px] font-black uppercase tracking-widest">
                Exclusive
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-xs font-bold text-white transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h4>
              {article.summary && article.summary !== article.title && (
                <p className="text-[var(--muted)] text-[10px] leading-relaxed mt-1 line-clamp-2">
                  {article.summary}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[var(--text-secondary)] text-[10px] font-medium">
                  {article.date
                    ? new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : "TheDayAfterAI.com"}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function CategoryRow({ topic, articles, id, showCount }: { topic: typeof TOPICS[number]; articles: NewsArticle[]; id?: string; showCount?: boolean }) {
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

  const scrollToEdge = (edge: "start" | "end") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: edge === "start" ? 0 : el.scrollWidth, behavior: "smooth" });
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
            {showCount && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-sm"
                style={{ backgroundColor: topic.color + "20", color: topic.color }}
              >
                {articles.length}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => scrollToEdge("start")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? topic.color : undefined }}
            title="Newest"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollLeft ? topic.color : undefined }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? topic.color : undefined }}
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => scrollToEdge("end")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-sm transition-colors disabled:opacity-20"
            style={{ color: canScrollRight ? topic.color : undefined }}
            title="Oldest"
          >
            <ChevronsRight size={18} />
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
            <NewsCard article={article} index={i} topicColor={topic.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const topicNavRef = useRef<HTMLDivElement>(null);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [tdaaiArticles, setTdaaiArticles] = useState<TdaaiArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingChannel, setLoadingChannel] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(debouncedQuery), 500);
    return () => clearTimeout(t);
  }, [debouncedQuery]);

  const loadData = useCallback(async () => {
    setLoadingNews(true);
    setLoadingChannel(true);

    const newsPromise = fetchNews([], searchQuery)
      .then(async (data) => {
        if (data.length > 0) {
          const sorted = sortByDateDesc(data);
          setArticles(sorted);
        } else {
          const fallback = searchQuery.trim()
            ? searchFallbackNews(searchQuery)
            : getFallbackNews([]);
          setArticles(sortByDateDesc(fallback));
        }
      })
      .catch(() => {
        const fallback = searchQuery.trim()
          ? searchFallbackNews(searchQuery)
          : getFallbackNews([]);
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

    const tdaaiPromise = fetchTdaaiArticles()
      .then((arts) => setTdaaiArticles(arts))
      .catch(() => {});

    await Promise.allSettled([newsPromise, channelPromise, customPromise, tdaaiPromise]);
  }, [searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scroll to a section when a nav button is clicked
  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(`[data-topic-section="${sectionId}"]`);
    if (el) {
      const headerHeight = 120; // sticky header height
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
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

  // Build unified nav items: TDAAI blog + custom sections + topic categories
  // When searching, only include TDAAI/custom sections if they have matching articles
  const sq = searchQuery.trim().toLowerCase();
  const navItems: { id: string; label: string; color: string }[] = [];
  if (tdaaiArticles.length > 0) {
    const hasTdaaiMatch = !sq || tdaaiArticles.some((a) => a.title.toLowerCase().includes(sq) || (a.summary && a.summary.toLowerCase().includes(sq)));
    if (hasTdaaiMatch) {
      navItems.push({ id: "tdaai", label: "TheDayAfterAI.com", color: "#3cffd0" });
    }
  }
  for (const section of customSections) {
    if (section.articles.length > 0) {
      const hasMatch = !sq || section.articles.some((a) => a.title.toLowerCase().includes(sq));
      if (hasMatch) {
        navItems.push({ id: `custom-${section.id}`, label: section.title, color: section.color });
      }
    }
  }
  for (const g of groupedArticles) {
    navItems.push({ id: g.topic.id, label: g.topic.label, color: g.topic.color });
  }

  // Scroll-spy: highlight nav button for the topmost visible category section.
  // We track all intersecting sections and pick the one closest to the top of
  // the viewport, debouncing the state update to prevent rapid toggling when
  // scrolling across section boundaries.
  // When the user scrolls to the bottom of the page, the observer's narrow
  // rootMargin may miss the last section, so we detect that case separately.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const sections = document.querySelectorAll("[data-topic-section]");
    if (sections.length === 0) return;

    const visibleSet = new Map<Element, IntersectionObserverEntry>();
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let atPageBottom = false;

    function pickBestSection() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // When at the bottom of the page, highlight the last section
        if (atPageBottom) {
          const allSections = document.querySelectorAll("[data-topic-section]");
          if (allSections.length > 0) {
            const lastTopic = allSections[allSections.length - 1].getAttribute("data-topic-section");
            if (lastTopic) {
              setActiveSection(lastTopic);
              return;
            }
          }
        }

        // Pick the last section whose header has scrolled past (or is near)
        // the upper 35% of the viewport. This naturally highlights the section
        // the user is currently reading.
        const threshold = window.innerHeight * 0.35;
        let best: Element | null = null;
        let bestTop = -Infinity;
        for (const [el] of visibleSet) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold && rect.top > bestTop) {
            bestTop = rect.top;
            best = el;
          }
        }
        // Fallback: if no section header is above the threshold, pick the
        // one closest to the top of viewport (first visible section)
        if (!best) {
          let closestTop = Infinity;
          for (const [el] of visibleSet) {
            const rect = el.getBoundingClientRect();
            if (rect.top < closestTop) {
              closestTop = rect.top;
              best = el;
            }
          }
        }
        if (best) {
          setActiveSection(best.getAttribute("data-topic-section"));
        }
      }, 80);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSet.set(entry.target, entry);
          } else {
            visibleSet.delete(entry.target);
          }
        }
        pickBestSection();
      },
      // Wide observation zone: from top of viewport to 75% down
      { rootMargin: "0px 0px -25% 0px", threshold: [0, 0.1] }
    );

    // Detect when user reaches the bottom of the page
    const handleScroll = () => {
      const wasAtBottom = atPageBottom;
      atPageBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 150;
      if (atPageBottom !== wasAtBottom) {
        pickBestSection();
      }
    };

    sections.forEach((s) => observer.observe(s));
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // check initial state

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [navItems.length]);

  // Auto-scroll nav to show active button (debounced to avoid jitter)
  useEffect(() => {
    if (!activeSection || !topicNavRef.current) return;
    const timer = setTimeout(() => {
      const nav = topicNavRef.current;
      if (!nav) return;
      const btn = nav.querySelector(`[data-nav-topic="${activeSection}"]`) as HTMLElement | null;
      if (!btn) return;
      // Manually scroll the nav container instead of scrollIntoView to avoid
      // interfering with the page scroll.
      const navRect = nav.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const btnCenter = btnRect.left + btnRect.width / 2;
      const navCenter = navRect.left + navRect.width / 2;
      const offset = btnCenter - navCenter;
      nav.scrollBy({ left: offset, behavior: "smooth" });
    }, 150);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const sortedChannelVideos = sortByDateDesc(channelVideos);

  return (
    <div className="min-h-screen bg-black">
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
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/tdai-letter-logo.png`}
                alt="TDAI"
                className="h-[2.875rem] tdai-hue"
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

        {/* Section navigation - color-coded pills + latest video */}
        <div className="border-t border-[var(--border)]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-3">
            {/* Topic pills (scrollable) */}
            <div className="relative flex-1 min-w-0">
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
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      data-nav-topic={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider border topic-pill ${isActive ? "viewing" : ""}`}
                      style={
                        isActive
                          ? {
                              color: item.color,
                              borderColor: item.color,
                              borderBottomWidth: "2px",
                              ["--pill-color" as string]: item.color,
                              ["--pill-border" as string]: item.color + "40",
                            }
                          : {
                              color: "var(--muted)",
                              borderColor: "transparent",
                              ["--pill-color" as string]: item.color,
                              ["--pill-border" as string]: item.color + "40",
                            }
                      }
                    >
                      {item.label}
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

            {/* Latest video + Watch */}
            <div className="hidden md:flex items-center gap-3 shrink-0 pl-3 border-l border-[var(--border-light)]">
              <Play size={10} className="text-[#ff0050] shrink-0" fill="currentColor" />
              {channelVideos[0] ? (
                <a
                  href={`https://www.youtube.com/watch?v=${channelVideos[0].videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--foreground)] truncate max-w-[200px] hover:text-[var(--accent)] transition-colors font-medium"
                >
                  {channelVideos[0].title}
                </a>
              ) : (
                <span className="text-xs text-[var(--muted)] truncate">
                  Loading...
                </span>
              )}
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent)] hover:text-white transition-colors shrink-0 uppercase tracking-widest"
              >
                Watch
                <ExternalLink size={10} />
              </a>
            </div>
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

        {/* Search results heading (only when searching) — shown above all sections */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
              &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {loadingNews ? "Searching..." : `${articles.length} results`}
            </p>
          </div>
        )}

        {/* TheDayAfterAI.com Blog Articles Section — filtered when searching */}
        {(() => {
          const q = searchQuery.trim().toLowerCase();
          const filteredTdaai = q
            ? tdaaiArticles.filter((a) => a.title.toLowerCase().includes(q) || (a.summary && a.summary.toLowerCase().includes(q)))
            : tdaaiArticles;
          return filteredTdaai.length > 0 ? <TdaaiSectionRow articles={filteredTdaai} /> : null;
        })()}

        {/* Custom editorial sections (e.g. AI Market Insight) — filtered when searching */}
        {customSections.map((section) => {
          const q = searchQuery.trim().toLowerCase();
          const filteredSection = q
            ? { ...section, articles: section.articles.filter((a) => a.title.toLowerCase().includes(q)) }
            : section;
          return <CustomSectionRow key={section.id} section={filteredSection} showCount={!!searchQuery} />;
        })}

        {/* News Articles grouped by category - horizontal scroll rows */}
        {loadingNews ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
            <span className="ml-4 text-[var(--muted)] text-lg">Fetching latest news...</span>
          </div>
        ) : groupedArticles.length > 0 ? (
          <div>
            {groupedArticles.map(({ topic, articles: groupArticles }) => (
              <CategoryRow key={topic.id} topic={topic} articles={groupArticles.slice(0, 30)} showCount={!!searchQuery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={28} className="text-[var(--muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No articles found</h3>
            <p className="text-[var(--muted)] text-sm mb-4">Try adjusting your search.</p>
            <button
              onClick={() => { setDebouncedQuery(""); setSearchQuery(""); }}
              className="text-sm text-[var(--accent)] hover:underline font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
          {/* Top section: Brand + Category columns */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Brand column — wider, takes ~38% */}
            <div className="lg:w-[38%] lg:pr-8 lg:border-r lg:border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>TheDayAfterAI News</h2>
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/tdai-letter-logo.png`} alt="TDAI" className="h-[2.875rem] tdai-hue" />
              </div>
              <div className="flex items-center gap-4 mb-5">
                <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Facebook size={20} /></a>
                <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Youtube size={20} /></a>
                <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"><Linkedin size={20} /></a>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--muted)] mb-4">
                <a href="https://www.thedayafterai.com/info" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">About Us</a><span>|</span>
                <a href="https://www.thedayafterai.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Terms of Service</a><span>|</span>
                <a href="https://www.thedayafterai.com/disclaimer" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Disclaimer</a><span>|</span>
                <a href="https://www.thedayafterai.com/ethics-policy" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Ethics Policy</a><span>|</span>
                <a href="https://www.thedayafterai.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</a><span>|</span>
                <a href="https://www.thedayafterai.com/licensing" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Licensing Terms</a><span>|</span>
                <a href="https://www.thedayafterai.com/advertise" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Advertise with Us</a>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic">
                Copyright &copy; 2024-{new Date().getFullYear()} TheDayAfterAI News. All Rights Reserved.
              </p>
            </div>

            {/* Category columns — grouped with tighter gaps */}
            <div className="lg:flex-1 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
              {/* Tech Frontiers */}
              <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Tech Frontiers</h3>
                <ul className="space-y-1 text-[13px]">
                  <li><button onClick={() => scrollToSection("ai-academy")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">AI Academy</button></li>
                  <li><button onClick={() => scrollToSection("chatbot-development")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Chatbot Development</button></li>
                  <li><button onClick={() => scrollToSection("technology-innovation")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Technology &amp; Innovation</button></li>
                  <li><button onClick={() => scrollToSection("unmanned-aircraft")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Unmanned Aircraft</button></li>
                </ul>
              </div>

              {/* Global Dynamics */}
              <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Global Dynamics</h3>
                <ul className="space-y-1 text-[13px]">
                  <li><button onClick={() => scrollToSection("business-economy")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Business &amp; Economy</button></li>
                  <li><button onClick={() => scrollToSection("digital-security")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Digital Security</button></li>
                  <li><button onClick={() => scrollToSection("environment-science")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Environment &amp; Science</button></li>
                  <li><button onClick={() => scrollToSection("governance-politics")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Governance &amp; Politics</button></li>
                </ul>
              </div>

              {/* Arts & Culture */}
              <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Arts &amp; Culture</h3>
                <ul className="space-y-1 text-[13px]">
                  <li><button onClick={() => scrollToSection("health-style")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Health &amp; Style</button></li>
                  <li><button onClick={() => scrollToSection("musical-art")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Musical Art</button></li>
                  <li><button onClick={() => scrollToSection("visual-art-photography")} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Visual Art &amp; Photography</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Acknowledgment of Country — full width, aligned with columns above */}
          <div className="border-t border-[var(--border)] pt-6">
            <h4 className="text-sm font-bold text-white mb-2">Acknowledgment of Country</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              TheDayAfterAI respectfully acknowledges the Ngunnawal people of the Australian Capital Territory as the Traditional Custodians of the land on which we operate. We pay our respects to their Elders past, present, and emerging, and extend that respect to all Aboriginal and Torres Strait Islander peoples. This acknowledgment honours the enduring connection of Indigenous Australians to their land and culture.{" "}
              <a href="https://www.reconciliation.org.au/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--accent)] transition-colors">Learn more</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
