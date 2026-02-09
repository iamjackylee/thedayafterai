"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Loader2,
  RefreshCw,
  Facebook,
  Youtube,
  Linkedin,
  Video,
  Newspaper,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  getVideosForTopics as getFallbackVideos,
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
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "videos">("all");
  const topicNavRef = useRef<HTMLDivElement>(null);

  // Data
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [topicVideos, setTopicVideos] = useState<YouTubeVideo[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
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
    setLoadingVideos(true);
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

    const videoQuery =
      searchQuery.trim() ||
      selectedTopics.map((id) => topicToSearchQuery[id] || id).join(" ");
    const videosPromise = searchYouTubeVideos(videoQuery || "latest", 9)
      .then((vids) => {
        setTopicVideos(vids.length > 0 ? vids : adaptFallbackVideos(getFallbackVideos(selectedTopics)));
      })
      .catch(() => {
        setTopicVideos(adaptFallbackVideos(getFallbackVideos(selectedTopics)));
      })
      .finally(() => setLoadingVideos(false));

    const channelPromise = fetchChannelVideos(6)
      .then((ch) => {
        setChannelVideos(ch.length > 0 ? ch : adaptFallbackVideos(FALLBACK_CHANNEL));
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

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Daily news bar */}
      <DailyNewsBar latestVideo={channelVideos[0] || null} />

      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-[#2a2a2a] sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-[4vw] py-3">
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
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
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
            <div className="flex items-center gap-3">
              <button onClick={loadData} title="Refresh" className="p-2 hover:bg-[#1a1a1a] transition-colors">
                <RefreshCw size={16} className={`text-gray-500 ${loadingNews ? "animate-spin" : ""}`} />
              </button>
              <div className="hidden md:flex items-center gap-3 ml-1 pl-3 border-l border-[#2a2a2a]">
                <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors"><Facebook size={16} /></a>
                <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors"><Youtube size={16} /></a>
                <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors"><Linkedin size={16} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Topic navigation bar */}
        <div className="border-t border-[#2a2a2a]">
          <div className="max-w-[1800px] mx-auto px-[4vw] relative">
            <button
              onClick={() => scrollTopics("left")}
              className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-[#0a0a0a] to-transparent hidden md:flex items-center"
            >
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            <div
              ref={topicNavRef}
              className="topic-nav flex items-center gap-1 overflow-x-auto py-2"
            >
              <button
                onClick={() => setSelectedTopics([])}
                className={`shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedTopics.length === 0
                    ? "bg-[#1d4ed8] text-white"
                    : "text-gray-500 hover:text-white"
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
                      ? "bg-[#1d4ed8] text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {topic.icon} {topic.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollTopics("right")}
              className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-[#0a0a0a] to-transparent hidden md:flex items-center"
            >
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1800px] mx-auto px-[4vw] py-6">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-1 bg-[#141414] p-1 border border-[#2a2a2a]">
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
                    ? "bg-[#1d4ed8] text-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
          <div>
            <h2 className="font-display text-xl text-white">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedTopics.length > 0
                ? "Filtered News"
                : "Latest AI News"}
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {loadingNews ? "Searching..." : `${articles.length} articles found`}
            </p>
          </div>
        </div>

        {/* Articles */}
        {(activeTab === "all" || activeTab === "articles") && (
          <>
            {loadingNews ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="text-[#1d4ed8] animate-spin" />
                <span className="ml-3 text-gray-500">Fetching latest news...</span>
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {articles.map((article, i) => (
                  <NewsCard key={article.id} article={article} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 mb-12">
                <Search size={22} className="text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-300 mb-2">No articles found</h3>
                <p className="text-gray-600 text-sm">Try adjusting your search or topics.</p>
                <button
                  onClick={() => { setSelectedTopics([]); setDebouncedQuery(""); setSearchQuery(""); }}
                  className="mt-4 text-sm text-[#1d4ed8] hover:text-[#1e40af] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Videos */}
        {(activeTab === "all" || activeTab === "videos") && (
          <div className="mb-12">
            <h2 className="font-display text-2xl text-white mb-2">Related AI Videos</h2>
            <p className="text-sm text-gray-600 mb-6">Watch the latest AI coverage on YouTube</p>
            {loadingVideos ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-[#1d4ed8] animate-spin" />
                <span className="ml-3 text-gray-500">Loading videos...</span>
              </div>
            ) : topicVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {topicVideos.map((video, i) => (
                  <VideoCard key={video.id} video={video} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm text-center py-8">No related videos found.</p>
            )}
          </div>
        )}

        {/* Channel section */}
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
            <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors"><Facebook size={16} /></a>
            <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors"><Youtube size={16} /></a>
            <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors"><Linkedin size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
