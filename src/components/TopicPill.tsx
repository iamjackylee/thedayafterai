"use client";

import { motion } from "framer-motion";
import type { Topic } from "@/lib/topics";

interface TopicPillProps {
  topic: Topic;
  selected: boolean;
  onToggle: (id: string) => void;
  index: number;
}

export default function TopicPill({
  topic,
  selected,
  onToggle,
  index,
}: TopicPillProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.03,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(topic.id)}
      className={`
        relative px-5 py-2.5 rounded-full text-sm font-medium
        transition-all duration-300 cursor-pointer select-none
        border backdrop-blur-sm
        ${
          selected
            ? "text-white border-transparent shadow-lg"
            : "text-gray-300 border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10"
        }
      `}
      style={
        selected
          ? {
              background: `linear-gradient(135deg, ${topic.color}dd, ${topic.color}88)`,
              boxShadow: `0 0 20px ${topic.color}40, 0 4px 15px ${topic.color}30`,
            }
          : {}
      }
    >
      <span className="mr-1.5">{topic.icon}</span>
      {topic.label}
      {selected && (
        <motion.div
          layoutId={`glow-${topic.id}`}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${topic.color}20 0%, transparent 70%)`,
          }}
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
