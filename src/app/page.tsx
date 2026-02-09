"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Facebook, Youtube, Linkedin } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="max-w-[1800px] mx-auto px-[4vw] py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.squarespace-cdn.com/content/v1/6676cf95ee3c1d15365d2d18/3827502e-87dd-4bf1-808a-7b732caf1d18/TheDayAfterAI+New+Logo.png?format=300w"
              alt="TheDayAfterAI News"
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Facebook size={18} />
            </a>
            <a href="https://www.youtube.com/@thedayafterai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Youtube size={18} />
            </a>
            <a href="https://www.linkedin.com/company/thedayafterai/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-[4vw] py-16">
        <div className="w-full max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight tracking-tight">
            Your Premier Source for<br />AI News and Insights
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The leading news channel for AI trends, insights and developments, keeping you informed on AI&apos;s impact on technology, society and the future.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search AI topics..."
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-none pl-11 pr-4 py-3.5 text-base text-white placeholder:text-gray-600 outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-xl mx-auto mb-8">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-sm text-gray-600 uppercase tracking-widest">Pick your interests</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          {/* Topic pills */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto mb-10">
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
            <p className="text-sm text-gray-500 mb-4">
              {selectedTopics.length} topic{selectedTopics.length > 1 ? "s" : ""} selected
            </p>
          )}

          {/* CTA */}
          <button
            onClick={handleExplore}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#e63946] text-white font-semibold text-sm uppercase tracking-wider hover:bg-[#d62839] transition-colors"
          >
            {selectedTopics.length > 0 || freeText
              ? "Show My News"
              : "Just Explore"}
            <ArrowRight size={16} />
          </button>

          <p className="text-gray-600 text-xs mt-8 uppercase tracking-wider">
            Press Enter or click the button to discover AI news
          </p>
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
