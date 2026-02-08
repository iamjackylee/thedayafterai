"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Zap,
  Video,
  Newspaper,
  X,
  Key,
  Loader2,
  RefreshCw,
} from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import TopicPill from "@/components/TopicPill";
import NewsCard from "@/components/NewsCard";
import VideoCard from "@/components/VideoCard";
import DailyNewsBar from "@/components/DailyNewsBar";
import ChannelSection from "@/components/ChannelSection";
import ApiKeyModal from "@/components/ApiKeyModal";
import { TOPICS } from "@/lib/topics";
import {
  fetchNews,
  fetchChannelVideos,
  searchYouTubeVideos,
  sortByDateDesc,
  topicToSearchQuery,
  hasApiKeys,
  type NewsArticle,
  type YouTubeVideo,
} from "@/lib/api";
import {
  getNewsByTopics as getFallbackNews,
  searchNews as searchFallbackNews,
} from "@/lib/newsData";
import {
  DAILY_CHANNEL_VIDEOS as FALLBACK_CHANNEL,
  getVideosForTopics as getFallbackVideos,
} from "@/lib/youtube";

// Convert old fallback videos to new shape
function adaptFallbackVideos(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vids: any[]
): YouTubeVideo[] {
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

function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTopics =
    searchParams.get("topics")?.split(",").filter(Boolean) || [];
  const initialQuery = searchParams.get("q") || "";

  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "videos">(
    "all"
  );
  const [showApiModal, setShowApiModal] = useState(false);

  // Data state
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [topicVideos, setTopicVideos] = useState<YouTubeVideo[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);

  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingChannel, setLoadingChannel] = useState(true);
  const [usingLiveData, setUsingLiveData] = useState(false);

  // ─── Fetch data ──────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    const keys = hasApiKeys();
    const isLive = keys.youtube || keys.news;
    setUsingLiveData(isLive);

    // Build search query string from selected topics
    const topicKeywords = selectedTopics.map(
      (id) => TOPICS.find((t) => t.id === id)?.label || id
    );

    // ── News ──
    setLoadingNews(true);
    if (keys.news) {
      const data = await fetchNews(topicKeywords, searchQuery);
      setArticles(sortByDateDesc(data));
    } else {
      // fallback to mock data
      let fallback;
      if (searchQuery.trim()) {
        fallback = searchFallbackNews(searchQuery);
        if (selectedTopics.length > 0) {
          fallback = fallback.filter((a) => selectedTopics.includes(a.topic));
        }
      } else {
        fallback = getFallbackNews(selectedTopics);
      }
      setArticles(sortByDateDesc(fallback));
    }
    setLoadingNews(false);

    // ── Topic videos ──
    setLoadingVideos(true);
    if (keys.youtube) {
      const query =
        searchQuery.trim() ||
        selectedTopics.map((id) => topicToSearchQuery[id] || id).join(" ");
      const vids = await searchYouTubeVideos(query || "latest", 9);
      setTopicVideos(vids);
    } else {
      setTopicVideos(adaptFallbackVideos(getFallbackVideos(selectedTopics)));
    }
    setLoadingVideos(false);

    // ── Channel videos ──
    setLoadingChannel(true);
    if (keys.youtube) {
      const ch = await fetchChannelVideos(6);
      setChannelVideos(ch);
    } else {
      setChannelVideos(adaptFallbackVideos(FALLBACK_CHANNEL));
    }
    setLoadingChannel(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopics.join(","), searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── URL sync ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTopics.length > 0)
      params.set("topics", selectedTopics.join(","));
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const newUrl = `${basePath}/feed${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedTopics, searchQuery]);

  // ── Debounced search ──
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(debouncedQuery), 500);
    return () => clearTimeout(t);
  }, [debouncedQuery]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setDebouncedQuery("");
    setSearchQuery("");
  };

  const selectedTopicLabels = selectedTopics
    .map((id) => TOPICS.find((t) => t.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="relative min-h-screen">
      <NeuralBackground />

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Daily news bar */}
      <div className="relative z-20">
        <DailyNewsBar latestVideo={channelVideos[0] || null} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Back + Brand */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={18} className="text-gray-400" />
              </motion.button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg gradient-text hidden sm:block">
                  The Day After AI
                </span>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={debouncedQuery}
                  onChange={(e) => setDebouncedQuery(e.target.value)}
                  placeholder="Search AI news..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Refresh */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={loadData}
                title="Refresh"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <RefreshCw
                  size={16}
                  className={`text-gray-400 ${
                    loadingNews ? "animate-spin" : ""
                  }`}
                />
              </motion.button>

              {/* API key button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowApiModal(true)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  usingLiveData
                    ? "bg-green-600/10 border border-green-500/20 text-green-400"
                    : "bg-amber-600/10 border border-amber-500/20 text-amber-400"
                }`}
              >
                <Key size={14} />
                <span className="hidden sm:block">
                  {usingLiveData ? "Live" : "Demo"}
                </span>
              </motion.button>

              {/* Filter toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showFilters || selectedTopics.length > 0
                    ? "bg-purple-600/20 border border-purple-500/30 text-purple-300"
                    : "bg-white/5 border border-white/[0.08] text-gray-400 hover:text-white"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:block">Topics</span>
                {selectedTopics.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                    {selectedTopics.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Active filters */}
          {selectedTopicLabels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 mt-3 flex-wrap"
            >
              <span className="text-xs text-gray-500">Filtered by:</span>
              {selectedTopicLabels.map((label) => (
                <span
                  key={label}
                  className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20"
                >
                  {label}
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
              >
                <X size={12} />
                Clear all
              </button>
            </motion.div>
          )}
        </div>

        {/* Expandable topic filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/[0.04] overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic, i) => (
                    <TopicPill
                      key={topic.id}
                      topic={topic}
                      selected={selectedTopics.includes(topic.id)}
                      onToggle={toggleTopic}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Data source indicator */}
      {!usingLiveData && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300/80">
            <Key size={14} className="shrink-0" />
            <span>
              Showing demo data.{" "}
              <button
                onClick={() => setShowApiModal(true)}
                className="underline hover:text-amber-200 transition-colors"
              >
                Add API keys
              </button>{" "}
              for real-time news and YouTube videos sorted by latest.
            </span>
          </div>
        </div>
      )}

      {/* Content tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-1 mb-6 bg-white/[0.03] rounded-xl p-1 w-fit border border-white/[0.06]">
          {[
            { id: "all" as const, label: "All", icon: Zap },
            { id: "articles" as const, label: "Articles", icon: Newspaper },
            { id: "videos" as const, label: "Videos", icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600/20 text-purple-300"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        {(activeTab === "all" || activeTab === "articles") && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedTopics.length > 0
                    ? "Your Curated News"
                    : "Latest AI News"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {loadingNews
                    ? "Searching..."
                    : `${articles.length} article${articles.length !== 1 ? "s" : ""} found`}
                </p>
              </div>
            </div>

            {loadingNews ? (
              <div className="flex items-center justify-center py-16 mb-12">
                <Loader2
                  size={28}
                  className="text-purple-400 animate-spin"
                />
                <span className="ml-3 text-gray-400">
                  Fetching latest news...
                </span>
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {articles.map((article, i) => (
                  <NewsCard key={article.id} article={article} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 mb-12"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search or topics to find more news.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Topic videos */}
        {(activeTab === "all" || activeTab === "videos") && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-2">
                Related AI Videos
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Watch the latest AI coverage on YouTube
              </p>
              {loadingVideos ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2
                    size={28}
                    className="text-purple-400 animate-spin"
                  />
                  <span className="ml-3 text-gray-400">
                    Searching YouTube...
                  </span>
                </div>
              ) : topicVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {topicVideos.map((video, i) => (
                    <VideoCard key={video.id} video={video} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm text-center py-8">
                  No related videos found.
                </p>
              )}
            </div>
          </>
        )}

        {/* Channel section - always visible */}
        <div className="mb-12">
          <ChannelSection videos={channelVideos} loading={loadingChannel} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm text-gray-500">
              The Day After AI &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Powered by AI. Curated for humans.
          </p>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        open={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSaved={loadData}
      />
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030014] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
