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
  Facebook,
  Youtube,
  Linkedin,
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

  // Fetch data — all 3 sources in parallel for speed
  const loadData = useCallback(async () => {
    const topicKeywords = selectedTopics.map(
      (id) => TOPICS.find((t) => t.id === id)?.label || id
    );

    setLoadingNews(true);
    setLoadingVideos(true);
    setLoadingChannel(true);

    // Run all fetches in parallel
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

    const videoQuery =
      searchQuery.trim() ||
      selectedTopics.map((id) => topicToSearchQuery[id] || id).join(" ");
    const videosPromise = searchYouTubeVideos(videoQuery || "latest", 9)
      .then((vids) => {
        if (vids.length > 0) {
          setTopicVideos(vids);
        } else {
          setTopicVideos(adaptFallbackVideos(getFallbackVideos(selectedTopics)));
        }
      })
      .catch(() => {
        setTopicVideos(adaptFallbackVideos(getFallbackVideos(selectedTopics)));
      })
      .finally(() => setLoadingVideos(false));

    const channelPromise = fetchChannelVideos(6)
      .then((ch) => {
        if (ch.length > 0) {
          setChannelVideos(ch);
        } else {
          setChannelVideos(adaptFallbackVideos(FALLBACK_CHANNEL));
        }
      })
      .catch(() => {
        setChannelVideos(adaptFallbackVideos(FALLBACK_CHANNEL));
      })
      .finally(() => setLoadingChannel(false));

    await Promise.allSettled([newsPromise, videosPromise, channelPromise]);
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Daily news bar */}
      <DailyNewsBar latestVideo={channelVideos[0] || null} />

      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-[#2a2a2a] sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-[4vw] py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Back + Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 hover:bg-[#1a1a1a] transition-colors"
              >
                <ArrowLeft size={18} className="text-gray-400" />
              </button>
              <img
                src="https://images.squarespace-cdn.com/content/v1/6676cf95ee3c1d15365d2d18/3827502e-87dd-4bf1-808a-7b732caf1d18/TheDayAfterAI+New+Logo.png?format=200w"
                alt="TheDayAfterAI News"
                className="h-8 hidden sm:block"
              />
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
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-none pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                title="Refresh"
                className="p-2 hover:bg-[#1a1a1a] transition-colors"
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
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all ${
                  showFilters || selectedTopics.length > 0
                    ? "bg-white text-black"
                    : "bg-[#141414] border border-[#2a2a2a] text-gray-400 hover:text-white"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:block">Topics</span>
                {selectedTopics.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#e63946] text-white text-xs flex items-center justify-center">
                    {selectedTopics.length}
                  </span>
                )}
              </button>

              {/* Social links */}
              <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-[#2a2a2a]">
                <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="https://www.youtube.com/@thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors">
                  <Youtube size={16} />
                </a>
                <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Active filters */}
          {selectedTopicLabels.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-600 uppercase tracking-wider">Filtered by:</span>
              {selectedTopicLabels.map((label) => (
                <span
                  key={label}
                  className="text-xs px-2.5 py-1 bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]"
                >
                  {label}
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-600 hover:text-white flex items-center gap-1 transition-colors"
              >
                <X size={12} />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Expandable topic filter panel */}
        {showFilters && (
          <div className="border-t border-[#2a2a2a]">
            <div className="max-w-[1800px] mx-auto px-[4vw] py-4">
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
      <div className="max-w-[1800px] mx-auto px-[4vw] pt-6">
        <div className="flex items-center gap-1 mb-6 bg-[#141414] p-1 w-fit border border-[#2a2a2a]">
          {[
            { id: "all" as const, label: "All", icon: LayoutGrid },
            { id: "articles" as const, label: "Articles", icon: Newspaper },
            { id: "videos" as const, label: "Videos", icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#e63946] text-white"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-[1800px] mx-auto px-[4vw] pb-16">
        {(activeTab === "all" || activeTab === "articles") && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl text-white">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedTopics.length > 0
                    ? "Your Curated News"
                    : "Latest AI News"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {loadingNews
                    ? "Searching..."
                    : `${articles.length} article${articles.length !== 1 ? "s" : ""} found`}
                </p>
              </div>
            </div>

            {loadingNews ? (
              <div className="flex items-center justify-center py-16 mb-12">
                <Loader2 size={24} className="text-[#e63946] animate-spin" />
                <span className="ml-3 text-gray-500">
                  Fetching latest news...
                </span>
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {articles.map((article, i) => (
                  <NewsCard key={article.id} article={article} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 mb-12">
                <div className="w-14 h-14 bg-[#141414] flex items-center justify-center mx-auto mb-4">
                  <Search size={22} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-300 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 text-sm">
                  Try adjusting your search or topics to find more news.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-[#e63946] hover:text-[#d62839] transition-colors"
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
            <h2 className="font-display text-2xl text-white mb-2">
              Related AI Videos
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Watch the latest AI coverage on YouTube
            </p>
            {loadingVideos ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-[#e63946] animate-spin" />
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
              <p className="text-gray-600 text-sm text-center py-8">
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
      <footer className="border-t border-[#2a2a2a] py-6">
        <div className="max-w-[1800px] mx-auto px-[4vw] flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} TheDayAfterAI News. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors">
              <Facebook size={16} />
            </a>
            <a href="https://www.youtube.com/@thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors">
              <Youtube size={16} />
            </a>
            <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 size={24} className="text-[#e63946] animate-spin" />
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
