import React from "react";
import { Button } from "../../components/ui/button";
import { BlogCard } from "../../components/web/blog/blog-card";
import { useBlogList } from "../../hooks/use-blog-list";

export default function HomePage() {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useBlogList();

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
