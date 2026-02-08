"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Video,
  Newspaper,
  X,
  Loader2,
  RefreshCw,
  LayoutGrid,
} from "lucide-react";
import TopicPill from "@/components/TopicPill";
import NewsCard from "@/components/NewsCard";
import VideoCard from "@/components/VideoCard";
import DailyNewsBar from "@/components/DailyNewsBar";
import ChannelSection from "@/components/ChannelSection";
import { TOPICS } from "@/lib/topics";
import {
  fetchNews,
  fetchChannelVideos,
  searchYouTubeVideos,
  sortByDateDesc,
  topicToSearchQuery,
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

  // Data state
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [topicVideos, setTopicVideos] = useState<YouTubeVideo[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);

  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingChannel, setLoadingChannel] = useState(true);

  // Fetch data
  const loadData = useCallback(async () => {
    const topicKeywords = selectedTopics.map(
      (id) => TOPICS.find((t) => t.id === id)?.label || id
    );

    // News (Google News RSS)
    setLoadingNews(true);
    try {
      const data = await fetchNews(topicKeywords, searchQuery);
      if (data.length > 0) {
        setArticles(sortByDateDesc(data));
      } else {
        let fallback;
        if (searchQuery.trim()) {
          fallback = searchFallbackNews(searchQuery);
          if (selectedTopics.length > 0) {
            fallback = fallback.filter((a) =>
              selectedTopics.includes(a.topic)
            );
          }
        } else {
          fallback = getFallbackNews(selectedTopics);
        }
        setArticles(sortByDateDesc(fallback));
      }
    } catch {
      let fallback;
      if (searchQuery.trim()) {
        fallback = searchFallbackNews(searchQuery);
      } else {
        fallback = getFallbackNews(selectedTopics);
      }
      setArticles(sortByDateDesc(fallback));
    }
    setLoadingNews(false);

    // Topic videos
    setLoadingVideos(true);
    try {
      const query =
        searchQuery.trim() ||
        selectedTopics.map((id) => topicToSearchQuery[id] || id).join(" ");
      const vids = await searchYouTubeVideos(query || "latest", 9);
      if (vids.length > 0) {
        setTopicVideos(vids);
      } else {
        setTopicVideos(adaptFallbackVideos(getFallbackVideos(selectedTopics)));
      }
    } catch {
      setTopicVideos(adaptFallbackVideos(getFallbackVideos(selectedTopics)));
    }
    setLoadingVideos(false);

    // Channel videos
    setLoadingChannel(true);
    try {
      const ch = await fetchChannelVideos(6);
      if (ch.length > 0) {
        setChannelVideos(ch);
      } else {
        setChannelVideos(adaptFallbackVideos(FALLBACK_CHANNEL));
      }
    } catch {
      setChannelVideos(adaptFallbackVideos(FALLBACK_CHANNEL));
    }
    setLoadingChannel(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopics.join(","), searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTopics.length > 0)
      params.set("topics", selectedTopics.join(","));
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const newUrl = `${basePath}/feed${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedTopics, searchQuery]);

  // Debounced search
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
    <div className="min-h-screen bg-gray-50">
      {/* Daily news bar */}
      <DailyNewsBar latestVideo={channelVideos[0] || null} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Back + Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={18} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <span className="font-bold text-lg text-gray-900 hidden sm:block">
                  The Day After AI
                </span>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={debouncedQuery}
                  onChange={(e) => setDebouncedQuery(e.target.value)}
                  placeholder="Search AI news..."
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                title="Refresh"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RefreshCw
                  size={16}
                  className={`text-gray-500 ${
                    loadingNews ? "animate-spin" : ""
                  }`}
                />
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showFilters || selectedTopics.length > 0
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:block">Topics</span>
                {selectedTopics.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    {selectedTopics.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filters */}
          {selectedTopicLabels.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-500">Filtered by:</span>
              {selectedTopicLabels.map((label) => (
                <span
                  key={label}
                  className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {label}
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <X size={12} />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Expandable topic filter panel */}
        {showFilters && (
          <div className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <TopicPill
                    key={topic.id}
                    topic={topic}
                    selected={selectedTopics.includes(topic.id)}
                    onToggle={toggleTopic}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-1 mb-6 bg-white rounded-lg p-1 w-fit border border-gray-200 shadow-sm">
          {[
            { id: "all" as const, label: "All", icon: LayoutGrid },
            { id: "articles" as const, label: "Articles", icon: Newspaper },
            { id: "videos" as const, label: "Videos", icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {(activeTab === "all" || activeTab === "articles") && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
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
                <Loader2 size={24} className="text-blue-600 animate-spin" />
                <span className="ml-3 text-gray-500">
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
              <div className="text-center py-16 mb-12">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search size={22} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search or topics to find more news.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Topic videos */}
        {(activeTab === "all" || activeTab === "videos") && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Related AI Videos
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Watch the latest AI coverage on YouTube
            </p>
            {loadingVideos ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-blue-600 animate-spin" />
                <span className="ml-3 text-gray-500">
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
              <p className="text-gray-500 text-sm text-center py-8">
                No related videos found.
              </p>
            )}
          </div>
        )}

        {/* Channel section - always visible */}
        <div className="mb-12">
          <ChannelSection videos={channelVideos} loading={loadingChannel} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">AI</span>
            </div>
            <span className="text-sm text-gray-500">
              The Day After AI &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-gray-400">
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 size={24} className="text-blue-600 animate-spin" />
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
