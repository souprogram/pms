import { Button } from "../../components/ui/button";
import { BlogCard } from "../../components/web/blog/blog-card";
import { useBlogListQuery } from "../../hooks/use-blog-list-query";
import { useResponsiveChunks } from "../../hooks/use-responsive-chunks";

export default function HomePage() {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useBlogListQuery();

  const rows = useResponsiveChunks(
    data?.pages.flatMap((page) => page.blogs) || [],
  );

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
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid gap-4 ${getGridClass(row.length)}`}
          >
            {row.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
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

function getGridClass(count: number) {
  const base = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  } as { [key: number]: string };

  // Fallback for unexpected counts
  return base[count] || base[1];
}
