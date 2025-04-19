import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";
import { Blog } from "../types/blog";

type UseBlogListQueryProps = {
  myBlogsOnly?: boolean;
};

export const useBlogListQuery = (options?: UseBlogListQueryProps) => {
  const { myBlogsOnly = false } = options || {};

  const blogListQuery = useInfiniteQuery({
    queryKey: ["blog_list", { myBlogsOnly }],
    queryFn: async ({ pageParam }) => {
      let userId: string | undefined;
      if (myBlogsOnly) {
        console.log("Fetching user ID...");
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user) throw new Error("Not authenticated");
        userId = user.id;
      }

      let query = supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (myBlogsOnly && userId) {
        console.log("Filtering blogs by user ID:", userId);
        query = query.eq("author_id", userId);
      }

      const { data, error, count } = await query.range(
        pageParam * 10,
        (pageParam + 1) * 10 - 1,
      );

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
