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
  sortByDateDesc,
  PLAYLIST_URL,
  type NewsArticle,
  type YouTubeVideo,
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
    channelTitle: "The Day After AI",
  }));
}

export default function Home() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const topicNavRef = useRef<HTMLDivElement>(null);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
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

    await Promise.allSettled([newsPromise, channelPromise]);
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
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className="shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border"
                  style={
                    selectedTopics.includes(topic.id)
                      ? { backgroundColor: topic.color, color: "#000", borderColor: topic.color }
                      : { color: "var(--muted)", borderColor: "transparent" }
                  }
                  onMouseEnter={(e) => {
                    if (!selectedTopics.includes(topic.id)) {
                      (e.target as HTMLElement).style.color = topic.color;
                      (e.target as HTMLElement).style.borderColor = topic.color + "40";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedTopics.includes(topic.id)) {
                      (e.target as HTMLElement).style.color = "var(--muted)";
                      (e.target as HTMLElement).style.borderColor = "transparent";
                    }
                  }}
                >
                  {topic.label}
                </button>
              ))}
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
              <p className="text-sm text-[var(--text-secondary)] mt-1">The Day After AI YouTube Channel</p>
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
              <div>
                <a
                  href={`https://www.youtube.com/watch?v=${sortedChannelVideos[0].videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative h-full bg-[var(--surface)] overflow-hidden card-hover"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${sortedChannelVideos[0].thumbnail})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 rounded-full bg-[#ff0050] flex items-center justify-center shadow-2xl">
                        <Play size={36} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="px-2.5 py-1 bg-[#ff0050] text-white text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                        Latest Episode
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {sortedChannelVideos[0].title}
                      </h3>
                      {sortedChannelVideos[0].description && (
                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">{sortedChannelVideos[0].description}</p>
                      )}
                      <span className="text-xs text-gray-500 mt-3 block font-medium">
                        {new Date(sortedChannelVideos[0].publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
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

        {/* News Articles grouped by category */}
        {loadingNews ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
            <span className="ml-4 text-[var(--muted)] text-lg">Fetching latest news...</span>
          </div>
        ) : displayGroups.length > 0 ? (
          <div>
            {displayGroups.map(({ topic, articles: groupArticles }) => (
              <div key={topic.id} className="category-section">
                {/* Category header with colored border */}
                <div
                  className="category-header mb-5"
                  style={{ borderLeftColor: topic.color } as React.CSSProperties}
                >
                  <div className="flex items-center gap-3">
                    <h3
                      className="text-lg font-black text-white uppercase tracking-wide"
                    >
                      {topic.label}
                    </h3>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-sm"
                      style={{ backgroundColor: topic.color + "20", color: topic.color }}
                    >
                      {groupArticles.length}
                    </span>
                  </div>
                </div>
                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupArticles.map((article, i) => (
                    <NewsCard key={article.id} article={article} index={i} />
                  ))}
                </div>
              </div>
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
