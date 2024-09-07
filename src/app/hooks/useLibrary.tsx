import { useQuery } from "@tanstack/react-query";
import { getLibrary } from "~/server/actions";
export const useLibrary = () => {
  return useQuery({
    queryKey: ["library"],
    queryFn:  async () => {
          const result = await getLibrary();
          return result;
        },
    staleTime: 1000,
  });
};