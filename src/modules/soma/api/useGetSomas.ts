import { useState, useEffect } from "react";

import { Soma } from "../types";

const MOCK_SOMAS: Soma[] = [
  {
    id: "s_1",
    name: "Visual Arts",
    slug: "visual-arts",
    description: "A sanctuary for painters, photographers, and digital artists who craft by hand.",
    memberCount: 12400,
    weeklyVisitorCount: 45200,
    coverUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "s_2",
    name: "Essays & Thought",
    slug: "essays",
    description: "Long-form writing, personal philosophy, and intentional living.",
    memberCount: 8900,
    weeklyVisitorCount: 31000,
    coverUrl: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "s_3",
    name: "Craftsmanship",
    slug: "crafts",
    description: "Woodworking, pottery, and the physical arts.",
    memberCount: 5200,
    weeklyVisitorCount: 18500,
    coverUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=600&auto=format&fit=crop",
  }
];

export const useGetSomas = () => {
  const [data, setData] = useState<Soma[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_SOMAS);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};
