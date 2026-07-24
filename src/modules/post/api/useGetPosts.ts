import { useState, useEffect } from "react";

import { Post } from "../types";

const MOCK_POSTS: Post[] = [
  {
    id: "p_1",
    title: "The warmth of analog photography in a digital age",
    excerpt: "There is something inherently human about the imperfections of film. The grain, the light leaks, the patience required before you can even see what you've captured.",
    mediaUrl: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Elias Vance",
      username: "elias_vance",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      isVerified: true,
      bio: "Film photographer based in Portland. Finding light in the shadows.",
      stats: { posts: 42, comments: 312 },
      awards: ["Silver Lens", "Top Contributor", "Early Adopter"]
    },
    soma: {
      name: "Visual Arts",
      slug: "visual-arts",
    },
    stats: {
      upvotes: 342,
      comments: 28,
    },
    createdAt: "2026-07-24T10:00:00Z",
  },
  {
    id: "p_2",
    title: "Why I stopped using generative tools for my writing",
    excerpt: "It started as a shortcut, but soon I realized the soul of my essays was being hollowed out. The struggle of finding the right word is exactly where the art lives.",
    author: {
      name: "Clara Lin",
      username: "clarawrites",
      isVerified: true,
      bio: "Essayist, overthinker, coffee enthusiast.",
      stats: { posts: 14, comments: 89 },
      awards: ["Golden Quill", "Thought Leader"]
    },
    soma: {
      name: "Essays & Thought",
      slug: "essays",
    },
    stats: {
      upvotes: 891,
      comments: 145,
    },
    createdAt: "2026-07-23T15:30:00Z",
  },
  {
    id: "p_3",
    title: "Hand-carved wooden sculptures from the Pacific Northwest",
    excerpt: "Spent the last three months working with reclaimed cedar. The smell alone is worth the effort.",
    mediaUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Marcus Thorne",
      username: "marcus_woodcraft",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
      isVerified: true,
      bio: "Creating tangible things in an intangible world. Woodworker for 20 years.",
      stats: { posts: 8, comments: 45 },
      awards: ["Master Craftsman"]
    },
    soma: {
      name: "Craftsmanship",
      slug: "crafts",
    },
    stats: {
      upvotes: 512,
      comments: 42,
    },
    createdAt: "2026-07-22T09:15:00Z",
  }
];

export const useGetPosts = () => {
  const [data, setData] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setData(MOCK_POSTS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};
