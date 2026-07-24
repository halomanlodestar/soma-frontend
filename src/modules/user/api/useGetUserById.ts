import { useState, useEffect } from "react";
import { UserProfile } from "../types";

export const useGetUserById = (userId: string) => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        id: userId,
        name: "Elias Vance",
        username: "elias_vance",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
        coverUrl: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=2000&auto=format&fit=crop",
        bio: "Film photographer based in Portland. Finding light in the shadows. Believer in analog imperfections.",
        isVerified: true,
        joinedAt: "2024-03-12T00:00:00Z",
        stats: {
          posts: 42,
          comments: 312,
          followers: 1240,
          following: 89,
        },
        awards: ["Silver Lens", "Top Contributor", "Early Adopter"],
      });
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [userId]);

  return { data, isLoading };
};
