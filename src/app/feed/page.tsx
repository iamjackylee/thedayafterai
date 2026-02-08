"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
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
} from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import TopicPill from "@/components/TopicPill";
import NewsCard from "@/components/NewsCard";
import VideoCard from "@/components/VideoCard";
import DailyNewsBar from "@/components/DailyNewsBar";
import ChannelSection from "@/components/ChannelSection";
import { TOPICS } from "@/lib/topics";
import { getNewsByTopics, searchNews, type NewsArticle } from "@/lib/newsData";
import { getVideosForTopics } from "@/lib/youtube";

function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTopics = searchParams.get("topics")?.split(",").filter(Boolean) || [];
  const initialQuery = searchParams.get("q") || "";

  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "videos">("all");

  const filteredNews = useMemo(() => {
    let results: NewsArticle[];
    if (searchQuery.trim()) {
      results = searchNews(searchQuery);
      if (selectedTopics.length > 0) {
        results = results.filter((a) => selectedTopics.includes(a.topic));
      }
    } else {
      results = getNewsByTopics(selectedTopics);
    }
    return results;
  }, [selectedTopics, searchQuery]);

  const topicVideos = useMemo(
    () => getVideosForTopics(selectedTopics),
    [selectedTopics]
  );

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setSearchQuery("");
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTopics.length > 0) params.set("topics", selectedTopics.join(","));
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const newUrl = `/feed${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedTopics, searchQuery]);

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

      {/* Daily news bar - always visible */}
      <div className="relative z-20">
        <DailyNewsBar />
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI news..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>

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

          {/* Active filters display */}
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
            {/* News section header */}
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
                  {filteredNews.length} article
                  {filteredNews.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* News grid */}
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {filteredNews.map((article, i) => (
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

        {/* Video section */}
        {(activeTab === "all" || activeTab === "videos") && (
          <>
            {topicVideos.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Related AI Videos
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Watch the latest AI coverage on YouTube
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {topicVideos.map((video, i) => (
                    <VideoCard key={video.id} video={video} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* The Day After AI Channel Section - always visible */}
        <div className="mb-12">
          <ChannelSection />
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
