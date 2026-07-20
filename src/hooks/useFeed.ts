/** @format */

import { useQuery } from "@tanstack/react-query";

export const useFeed = () => {
  return useQuery({
    queryKey: ["feed"],
  });
};
