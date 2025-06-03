import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "../lib/supabase/client";
import { Blog } from "../types/blog";
import { useUserProfile } from "./use-profile";
import { useResponsiveChunks } from "./use-responsive-chunks";

type UseBlogListQueryProps = {
  myBlogsOnly: boolean;
  searchQuery?: string;
};

export const useBlogListQuery = (options?: Partial<UseBlogListQueryProps>) => {
  const { myBlogsOnly = false, searchQuery = "" } = options || {};

  const { user } = useUserProfile();

  const blogListQuery = useInfiniteQuery({
    queryKey: ["blog_list", { myBlogsOnly, searchQuery }],
    queryFn: async ({ pageParam }) => {
      const userId = myBlogsOnly ? (user?.id ?? null) : null;

      let query = supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (myBlogsOnly && userId) {
        query = query.eq("author_id", userId);
      }

      if (searchQuery) {
        console.log("Filtering blogs by search query:", searchQuery);
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`,
        );
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

  const dataList = useMemo(() => {
    return blogListQuery.data?.pages.flatMap((page) => page.blogs);
  }, [blogListQuery.data]);

  const rows = useResponsiveChunks(dataList ?? []);

  return {
    ...blogListQuery,
    dataList,
    rows,
  };
};
