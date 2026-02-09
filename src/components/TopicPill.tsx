"use client";

import type { Topic } from "@/lib/topics";

interface TopicPillProps {
  topic: Topic;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function TopicPill({
  topic,
  selected,
  onToggle,
}: TopicPillProps) {
  return (
    <button
      onClick={() => onToggle(topic.id)}
      className={`
        px-4 py-2 text-sm font-medium
        transition-all duration-200 cursor-pointer select-none
        border
        ${
          selected
            ? "bg-white text-black border-white"
            : "bg-transparent text-gray-400 border-[#2a2a2a] hover:border-gray-500 hover:text-white"
        }
      `}
    >
      <span className="mr-1.5">{topic.icon}</span>
      {topic.label}
    </button>
  );
}
