/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return (await api.auth.me()).data;
    },
  });
};
