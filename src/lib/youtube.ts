export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
}

// The Day After AI YouTube channel videos
// In production, these would be fetched via YouTube Data API
export const DAILY_CHANNEL_VIDEOS: YouTubeVideo[] = [
  {
    id: "daily-1",
    title: "AI News Today: The Biggest Breakthroughs This Week",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&h=270&fit=crop",
    publishedAt: "2026-02-08",
    description: "Your daily roundup of the most important AI developments, breakthroughs, and industry moves.",
  },
  {
    id: "daily-2",
    title: "How AI is Changing Everything in 2026",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&h=270&fit=crop",
    publishedAt: "2026-02-07",
    description: "A comprehensive look at the transformative impact of AI across industries in 2026.",
  },
  {
    id: "daily-3",
    title: "Top 10 AI Tools You Need to Know About",
    thumbnail: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=480&h=270&fit=crop",
    publishedAt: "2026-02-06",
    description: "Discover the most powerful AI tools that are reshaping how we work and create.",
  },
];

// AI news videos from YouTube for different topics
export const TOPIC_VIDEOS: Record<string, YouTubeVideo[]> = {
  science: [
    {
      id: "sci-1",
      title: "AI Discovers New Physics: What It Means",
      thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=480&h=270&fit=crop",
      publishedAt: "2026-02-07",
      description: "How AI is uncovering fundamental physics principles that eluded human researchers.",
    },
  ],
  technology: [
    {
      id: "tech-1",
      title: "Inside the Next Generation of AI Chips",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=480&h=270&fit=crop",
      publishedAt: "2026-02-06",
      description: "A deep dive into the hardware powering the AI revolution.",
    },
  ],
  health: [
    {
      id: "health-1",
      title: "AI in Medicine: Saving Lives with Algorithms",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=480&h=270&fit=crop",
      publishedAt: "2026-02-05",
      description: "Exploring how AI diagnostic tools are transforming patient care.",
    },
  ],
  business: [
    {
      id: "biz-1",
      title: "The AI Economy: Winners and Losers",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&h=270&fit=crop",
      publishedAt: "2026-02-04",
      description: "Analysis of how AI is reshaping business and the global economy.",
    },
  ],
  "chatbot-development": [
    {
      id: "chat-1",
      title: "Building the Next Generation of AI Chatbots",
      thumbnail: "https://images.unsplash.com/photo-1531746790095-e5a3e0d43543?w=480&h=270&fit=crop",
      publishedAt: "2026-02-03",
      description: "Technical deep dive into modern chatbot architectures and capabilities.",
    },
  ],
  innovation: [
    {
      id: "innov-1",
      title: "10 AI Innovations That Will Define the Future",
      thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=480&h=270&fit=crop",
      publishedAt: "2026-02-02",
      description: "From brain-computer interfaces to autonomous systems, the innovations shaping tomorrow.",
    },
  ],
};

export function getVideosForTopics(topicIds: string[]): YouTubeVideo[] {
  if (topicIds.length === 0) {
    return Object.values(TOPIC_VIDEOS).flat();
  }
  return topicIds.flatMap((id) => TOPIC_VIDEOS[id] || []);
}

// The Day After AI YouTube channel URL
export const CHANNEL_URL = "https://www.youtube.com/@thedayafterai";
export const CHANNEL_NAME = "The Day After AI";
