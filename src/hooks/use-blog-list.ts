import { useInfiniteQuery } from "@tanstack/react-query";
import { Blog } from "../types/blog";
import { supabase } from "../database/supabase";

export const useBlogList = () => {
  const blogListQuery = useInfiniteQuery({
    queryKey: ["blog_list"],
    queryFn: async ({ pageParam }) => {
      const { data, error, count } = await supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .range(pageParam * 10, (pageParam + 1) * 10 - 1);

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }

      const hasNextPage = (pageParam + 1) * 10 < (count ?? 0);

      return {
        blogs: data as Blog[],
        nextCursor: hasNextPage ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return blogListQuery;
};
