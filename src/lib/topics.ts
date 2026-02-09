export interface Topic {
  id: string;
  label: string;
  icon: string;
  color: string;
  subtopics: string[];
}

// Vibrant neon category colors (Verge-inspired)
export const TOPICS: Topic[] = [
  { id: "ai-academy", label: "AI Academy", icon: "🎓", color: "#3cffd0", subtopics: ["academy"] },
  { id: "business-economy", label: "Business & Economy", icon: "💼", color: "#ff6b35", subtopics: ["business", "economy"] },
  { id: "chatbot-development", label: "Chatbot Development", icon: "🤖", color: "#a855f7", subtopics: ["chatbot-development"] },
  { id: "digital-security", label: "Digital Security", icon: "🔒", color: "#00d4ff", subtopics: ["digital-security"] },
  { id: "environment-science", label: "Environment & Science", icon: "🌍", color: "#22c55e", subtopics: ["environment", "science"] },
  { id: "governance-politics", label: "Governance & Politics", icon: "🏛️", color: "#fbbf24", subtopics: ["governance", "politics"] },
  { id: "health-style", label: "Health & Style", icon: "🏥", color: "#f472b6", subtopics: ["health", "style"] },
  { id: "musical-art", label: "Musical Art", icon: "🎵", color: "#c084fc", subtopics: ["music"] },
  { id: "technology-innovation", label: "Technology & Innovation", icon: "💻", color: "#60a5fa", subtopics: ["technology", "innovation"] },
  { id: "unmanned-aircraft", label: "Unmanned Aircraft", icon: "🚁", color: "#67e8f9", subtopics: ["drone"] },
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

export function getTopicColor(topicId: string): string {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (topic) return topic.color;
  const groupId = TOPIC_GROUP_MAP[topicId];
  if (groupId) {
    const group = TOPICS.find((t) => t.id === groupId);
    if (group) return group.color;
  }
  return "#3cffd0";
}
