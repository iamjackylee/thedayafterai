export interface Topic {
  id: string;
  label: string;
  icon: string;
  color: string;
  subtopics: string[];
}

// Category order: AI-related first to show breadth of AI applications
export const TOPICS: Topic[] = [
  { id: "ai-academy", label: "AI Academy", icon: "🎓", color: "#6366f1", subtopics: ["academy"] },
  { id: "business-economy", label: "Business & Economy", icon: "💼", color: "#8b5cf6", subtopics: ["business", "economy"] },
  { id: "chatbot-development", label: "Chatbot Development", icon: "🤖", color: "#7c3aed", subtopics: ["chatbot-development"] },
  { id: "digital-security", label: "Digital Security", icon: "🔒", color: "#06b6d4", subtopics: ["digital-security"] },
  { id: "environment-science", label: "Environment & Science", icon: "🌍", color: "#10b981", subtopics: ["environment", "science"] },
  { id: "governance-politics", label: "Governance & Politics", icon: "🏛️", color: "#f59e0b", subtopics: ["governance", "politics"] },
  { id: "health-style", label: "Health & Style", icon: "🏥", color: "#ec4899", subtopics: ["health", "style"] },
  { id: "musical-art", label: "Musical Art", icon: "🎵", color: "#a855f7", subtopics: ["music"] },
  { id: "technology-innovation", label: "Technology & Innovation", icon: "💻", color: "#3b82f6", subtopics: ["technology", "innovation"] },
  { id: "unmanned-aircraft", label: "Unmanned Aircraft", icon: "🚁", color: "#22d3ee", subtopics: ["drone"] },
  { id: "visual-art-photography", label: "Visual Art & Photography", icon: "📸", color: "#fb923c", subtopics: ["art", "photography", "cameras"] },
];

// Map from old individual topic IDs to new group IDs
export const TOPIC_GROUP_MAP: Record<string, string> = {};
for (const topic of TOPICS) {
  TOPIC_GROUP_MAP[topic.id] = topic.id;
  for (const sub of topic.subtopics) {
    TOPIC_GROUP_MAP[sub] = topic.id;
  }
}

export function getTopicLabel(topicId: string): string {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (topic) return topic.label;
  const groupId = TOPIC_GROUP_MAP[topicId];
  if (groupId) {
    const group = TOPICS.find((t) => t.id === groupId);
    if (group) return group.label;
  }
  return topicId;
}
