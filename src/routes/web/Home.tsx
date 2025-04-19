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
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-lg">
            <div className="h-60 w-full rounded-lg bg-stone-200"></div>
            <div className="mt-4 h-6 w-3/4 rounded bg-stone-200"></div>
            <div className="mt-2 h-6 w-full rounded bg-stone-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Nema blogova</h1>
      </div>
    );
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

      <div>
        {isFetching && !isFetchingNextPage ? "Dohvačam podatke..." : null}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <Button
            variant="link"
            size="lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Učitavam..." : "Učitaj više"}
          </Button>
        </div>
      )}
    </>
  );
}
