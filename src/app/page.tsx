"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Zap } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import TopicPill from "@/components/TopicPill";
import { TOPICS } from "@/lib/topics";

const TYPING_PHRASES = [
  "What AI news interests you today?",
  "Discover the future of artificial intelligence...",
  "Type anything or pick topics below...",
];

export default function Home() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Typing animation for placeholder
  useEffect(() => {
    const phrase = TYPING_PHRASES[typingIndex];
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      const type = () => {
        if (charIndex <= phrase.length) {
          setDisplayText(phrase.slice(0, charIndex));
          charIndex++;
          timeout = setTimeout(type, 40);
        } else {
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      };
      type();
    } else {
      const erase = () => {
        if (charIndex >= 0) {
          setDisplayText(phrase.slice(0, charIndex));
          charIndex--;
          timeout = setTimeout(erase, 20);
        } else {
          setTypingIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
          setIsTyping(true);
        }
      };
      charIndex = phrase.length;
      erase();
    }

    return () => clearTimeout(timeout);
  }, [typingIndex, isTyping]);

  // Staggered content appearance
  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

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
    <div className="relative min-h-screen overflow-hidden">
      <NeuralBackground />

      {/* Radial gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl mx-auto flex flex-col items-center"
            >
              {/* Logo / Brand */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"
                  >
                    <Zap size={24} className="text-white" />
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    <span className="gradient-text">The Day After AI</span>
                  </h1>
                </div>
                <p className="text-gray-400 text-sm tracking-widest uppercase">
                  Your Personalized AI News Hub
                </p>
              </motion.div>

              {/* Main heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-center mb-10"
              >
                <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                  Discover AI News
                  <br />
                  <span className="gradient-text">That Matters to You</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Select your interests or describe what you&apos;re looking for.
                  We&apos;ll curate the most relevant AI news just for you.
                </p>
              </motion.div>

              {/* Search input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-full max-w-2xl mb-10"
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                  <div className="relative flex items-center bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl">
                    <Search
                      size={20}
                      className="ml-5 text-gray-500 shrink-0"
                    />
                    <input
                      type="text"
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder=""
                      className="w-full bg-transparent px-4 py-5 text-white placeholder:text-gray-600 outline-none text-lg"
                    />
                    {!freeText && (
                      <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                        <span className="text-gray-600 text-lg">
                          {displayText}
                        </span>
                        <span className="w-0.5 h-6 bg-purple-400 ml-0.5 animate-blink" />
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExplore}
                      className="mr-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-indigo-500 transition-all shrink-0 flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      Explore
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-4 w-full max-w-2xl mb-8"
              >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/30" />
                <span className="text-sm text-gray-500 px-2">
                  or pick your interests
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/30" />
              </motion.div>

              {/* Topic pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-3 max-w-3xl mb-10"
              >
                {TOPICS.map((topic, i) => (
                  <TopicPill
                    key={topic.id}
                    topic={topic}
                    selected={selectedTopics.includes(topic.id)}
                    onToggle={toggleTopic}
                    index={i}
                  />
                ))}
              </motion.div>

              {/* Selected count & CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                {selectedTopics.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-purple-300"
                  >
                    {selectedTopics.length} topic
                    {selectedTopics.length > 1 ? "s" : ""} selected
                  </motion.p>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExplore}
                    className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold text-base hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25 animate-glow"
                  >
                    {selectedTopics.length > 0 || freeText
                      ? "Show My News"
                      : "Just Explore"}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </div>
              </motion.div>

              {/* Subtle hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-gray-600 text-xs mt-8"
              >
                Press Enter or click Explore to discover AI news
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
