import { useState, useEffect } from "react";
import { Soma } from "../types";

export const useGetSomaBySlug = (slug: string) => {
  const [data, setData] = useState<Soma | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setData({
        id: "s_1",
        name: "Visual Arts",
        slug: slug,
        description: "A sanctuary for painters, photographers, and digital artists who craft by hand. Share your canvas, your process, and your final pieces. No generative art allowed.",
        memberCount: 12400,
        weeklyVisitorCount: 45200,
        coverUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2000&auto=format&fit=crop",
      });
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  return { data, isLoading };
};
