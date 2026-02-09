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

  // Data
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingChannel, setLoadingChannel] = useState(true);

  // Debounced search
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

  // Group articles by topic in the defined order
  const groupedArticles = TOPICS.map((topic) => ({
    topic,
    articles: articles.filter((a) => a.topic === topic.id),
  })).filter((g) => g.articles.length > 0);

  // If filtering by selected topics, only show those groups
  const displayGroups = selectedTopics.length > 0
    ? groupedArticles.filter((g) => selectedTopics.includes(g.topic.id))
    : groupedArticles;

  // Sort channel videos by date, newest first
  const sortedChannelVideos = sortByDateDesc(channelVideos);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Daily news bar */}
      <DailyNewsBar latestVideo={channelVideos[0] || null} />

      {/* Header */}
      <header className="bg-[var(--background)] border-b border-[var(--border)] sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src="https://images.squarespace-cdn.com/content/v1/6676cf95ee3c1d15365d2d18/3827502e-87dd-4bf1-808a-7b732caf1d18/TheDayAfterAI+New+Logo.png?format=300w"
                alt="TheDayAfterAI News"
                className="h-9"
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
                  className="w-full bg-[var(--surface)] border border-[var(--border-light)] rounded-none pl-10 pr-4 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button onClick={loadData} title="Refresh" className="p-2 hover:bg-[var(--surface-light)] transition-colors">
                <RefreshCw size={16} className={`text-[var(--muted)] ${loadingNews ? "animate-spin" : ""}`} />
              </button>
              <div className="hidden md:flex items-center gap-3 ml-1 pl-3 border-l border-[var(--border-light)]">
                <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors"><Facebook size={16} /></a>
                <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors"><Youtube size={16} /></a>
                <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors"><Linkedin size={16} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Topic navigation bar */}
        <div className="border-t border-[var(--border)]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <button
              onClick={() => scrollTopics("left")}
              className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-[var(--background)] to-transparent hidden md:flex items-center"
            >
              <ChevronLeft size={16} className="text-[var(--muted)]" />
            </button>
            <div
              ref={topicNavRef}
              className="topic-nav flex items-center gap-1 overflow-x-auto py-2"
            >
              <button
                onClick={() => setSelectedTopics([])}
                className={`shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedTopics.length === 0
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                All
              </button>
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedTopics.includes(topic.id)
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--muted)] hover:text-white"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollTopics("right")}
              className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-[var(--background)] to-transparent hidden md:flex items-center"
            >
              <ChevronRight size={16} className="text-[var(--muted)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Daily AI News Videos Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="section-accent">
              <h2 className="font-display text-xl text-white">Daily AI News</h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">The Day After AI YouTube Channel</p>
            </div>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Youtube size={14} />
              Subscribe
            </a>
          </div>

          {loadingChannel ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-[var(--accent)] animate-spin" />
              <span className="ml-3 text-[var(--muted)]">Loading videos...</span>
            </div>
          ) : sortedChannelVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Featured first video */}
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                <a
                  href={`https://www.youtube.com/watch?v=${sortedChannelVideos[0].videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative h-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
                >
                  <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[300px] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${sortedChannelVideos[0].thumbnail})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="px-2 py-0.5 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-wider inline-block mb-2">
                        Latest
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {sortedChannelVideos[0].title}
                      </h3>
                      {sortedChannelVideos[0].description && (
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{sortedChannelVideos[0].description}</p>
                      )}
                      <span className="text-xs text-gray-400 mt-2 block">
                        {new Date(sortedChannelVideos[0].publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
              {/* Remaining videos in grid */}
              {sortedChannelVideos.slice(1, 7).map((video, i) => (
                <VideoCard key={video.id} video={video} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-[var(--muted)] text-sm mb-2">No videos loaded yet.</p>
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
              >
                Visit the channel on YouTube &rarr;
              </a>
            </div>
          )}
        </section>

        {/* News heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="section-accent">
            <h2 className="font-display text-xl text-white">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedTopics.length > 0
                ? "Filtered News"
                : "AI News by Category"}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {loadingNews ? "Searching..." : `${articles.length} articles across ${displayGroups.length} categories`}
            </p>
          </div>
        </div>

        {/* News Articles grouped by category */}
        {loadingNews ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-[var(--accent)] animate-spin" />
            <span className="ml-3 text-[var(--muted)]">Fetching latest news...</span>
          </div>
        ) : displayGroups.length > 0 ? (
          <div>
            {displayGroups.map(({ topic, articles: groupArticles }) => (
              <div key={topic.id} className="category-section">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{topic.icon}</span>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">{topic.label}</h3>
                  <span className="text-xs text-[var(--muted)]">({groupArticles.length})</span>
                  <div className="flex-1 h-px bg-[var(--border)]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupArticles.map((article, i) => (
                    <NewsCard key={article.id} article={article} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-12">
            <Search size={22} className="text-[var(--muted)] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-300 mb-2">No articles found</h3>
            <p className="text-[var(--muted)] text-sm">Try adjusting your search or topics.</p>
            <button
              onClick={() => { setSelectedTopics([]); setDebouncedQuery(""); setSearchQuery(""); }}
              className="mt-4 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} TheDayAfterAI News. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors"><Facebook size={16} /></a>
            <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors"><Youtube size={16} /></a>
            <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors"><Linkedin size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
