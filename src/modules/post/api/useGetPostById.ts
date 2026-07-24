import { useState, useEffect } from "react";
import { Post } from "../types";

export const useGetPostById = (postId: string) => {
  const [data, setData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        id: postId,
        title: "The warmth of analog photography in a digital age",
        excerpt: "There is something inherently human about the imperfections of film.",
        content: `
We live in an era of flawless pixels. Every smartphone is capable of capturing perfectly exposed, razor-sharp images. Algorithms fix our mistakes before we even realize we've made them. But in this pursuit of perfection, we've lost something essential: the human touch.

### The Imperfection of Film
Film photography is inherently flawed. Light leaks, grain, slightly missed focus—these aren't bugs; they are features of a physical medium. When you shoot film, you are capturing light on a physical piece of material. It is a chemical reaction, a chaotic dance of silver halides.

### Patience is a Virtue
With digital, the feedback loop is instantaneous. You shoot, you look at the screen, you shoot again. With film, you must wait. This forced patience changes how you see the world. You don't just take pictures; you make them. You think about the composition, the light, the moment. You wait for the *decisive moment*.

I recently dug out my grandfather's old Canon AE-1. The light meter is broken, the foam seals are degraded, but the mechanical shutter still fires with a satisfying *clunk*. Taking it out for a walk in the woods was a revelation. I only had 36 frames. Each click had a cost, both financial and emotional.

When I finally got the scans back from the lab two weeks later, the results were objectively worse than what my phone could do. But emotionally? They were infinitely better. They had soul. They had warmth. They were *real*.
        `,
        mediaUrl: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1200&auto=format&fit=crop",
        author: {
          name: "Elias Vance",
          username: "elias_vance",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
          isVerified: true,
          bio: "Film photographer based in Portland. Finding light in the shadows.",
          stats: { posts: 42, comments: 312 },
          awards: ["Silver Lens", "Top Contributor"]
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
      });
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [postId]);

  return { data, isLoading };
};
