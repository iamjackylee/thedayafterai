"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import TopicPill from "@/components/TopicPill";
import { TOPICS } from "@/lib/topics";

export default function Home() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (selectedTopics.length > 0) {
      params.set("topics", selectedTopics.join(","));
    }
    if (freeText.trim()) {
      params.set("q", freeText.trim());
    }
    router.push(`/feed?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleExplore();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">The Day After AI</h1>
            <p className="text-xs text-gray-500">Your AI News Hub</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What AI topics interest you?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Select your interests or type a keyword. We&apos;ll show you the latest AI news that matters to you.
          </p>
        </div>

        {/* Search input */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for AI topics, e.g. &quot;GPT&quot;, &quot;robotics&quot;..."
              className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-xl mx-auto mb-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">or pick your interests</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Topic pills */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto mb-10">
          {TOPICS.map((topic) => (
            <TopicPill
              key={topic.id}
              topic={topic}
              selected={selectedTopics.includes(topic.id)}
              onToggle={toggleTopic}
            />
          ))}
        </div>

        {/* Selected count */}
        {selectedTopics.length > 0 && (
          <p className="text-center text-sm text-gray-500 mb-4">
            {selectedTopics.length} topic{selectedTopics.length > 1 ? "s" : ""} selected
          </p>
        )}

        {/* CTA buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleExplore}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            {selectedTopics.length > 0 || freeText
              ? "Show My News"
              : "Just Explore"}
            <ArrowRight size={16} />
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Press Enter or click the button to discover AI news
        </p>
      </main>
    </div>
  );
}
