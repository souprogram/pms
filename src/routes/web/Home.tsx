import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Button } from "../../components/ui/button";
import { BlogCard } from "../../components/web/blog/blog-card";
import { supabase } from "../../database/supabase";
import { Blog } from "../../types/blog";

export function Home() {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
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

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </>
  );
}
