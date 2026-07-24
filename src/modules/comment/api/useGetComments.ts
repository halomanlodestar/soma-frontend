import { useState, useEffect } from "react";
import { Comment } from "../types";

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c_1",
    postId: "p_1",
    parentId: null,
    content: "This absolutely resonates with me. I recently found my dad's old Olympus OM-1 and the sheer anxiety of not knowing if I got the shot is strangely liberating.",
    author: {
      name: "Sarah Jenkins",
      username: "sarahj",
      isVerified: false,
    },
    stats: { upvotes: 45 },
    createdAt: "2026-07-24T11:30:00Z",
    replies: [
      {
        id: "c_1_1",
        postId: "p_1",
        parentId: "c_1",
        content: "The OM-1 is a legendary camera! Be careful though, the light meter relies on old mercury batteries which are hard to find now.",
        author: {
          name: "Elias Vance",
          username: "elias_vance",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
          isVerified: true,
        },
        stats: { upvotes: 12 },
        createdAt: "2026-07-24T12:05:00Z",
      }
    ]
  },
  {
    id: "c_2",
    postId: "p_1",
    parentId: null,
    content: "I think people over-romanticize film. Yes it has character, but digital allows for a democratization of art that film never could due to cost.",
    author: {
      name: "Marcus Thorne",
      username: "marcus_woodcraft",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
      isVerified: true,
    },
    stats: { upvotes: 18 },
    createdAt: "2026-07-24T10:45:00Z",
  }
];

export const useGetComments = (postId: string) => {
  const [data, setData] = useState<Comment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_COMMENTS);
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [postId]);

  return { data, isLoading };
};
