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
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 cursor-pointer select-none
        border
        ${
          selected
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }
      `}
    >
      <span className="mr-1.5">{topic.icon}</span>
      {topic.label}
    </button>
  );
}
