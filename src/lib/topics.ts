export interface Topic {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const TOPICS: Topic[] = [
  { id: "academy", label: "Academy", icon: "🎓", color: "#6366f1" },
  { id: "business", label: "Business", icon: "💼", color: "#8b5cf6" },
  { id: "economy", label: "Economy", icon: "📊", color: "#a78bfa" },
  { id: "chatbot-development", label: "Chatbot Development", icon: "🤖", color: "#7c3aed" },
  { id: "digital-security", label: "Digital Security", icon: "🔒", color: "#06b6d4" },
  { id: "environment", label: "Environment", icon: "🌍", color: "#10b981" },
  { id: "science", label: "Science", icon: "🔬", color: "#14b8a6" },
  { id: "governance", label: "Governance", icon: "🏛️", color: "#f59e0b" },
  { id: "politics", label: "Politics", icon: "⚖️", color: "#ef4444" },
  { id: "health", label: "Health", icon: "🏥", color: "#ec4899" },
  { id: "style", label: "Style", icon: "✨", color: "#f472b6" },
  { id: "music", label: "Music", icon: "🎵", color: "#a855f7" },
  { id: "art", label: "Art", icon: "🎨", color: "#e879f9" },
  { id: "photography", label: "Photography", icon: "📸", color: "#fb923c" },
  { id: "cameras", label: "Cameras", icon: "📷", color: "#f97316" },
  { id: "technology", label: "Technology", icon: "💻", color: "#3b82f6" },
  { id: "innovation", label: "Innovation", icon: "💡", color: "#eab308" },
  { id: "drone", label: "Drone", icon: "🚁", color: "#22d3ee" },
];
