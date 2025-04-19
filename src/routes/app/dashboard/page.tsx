import { Button } from "../../../components/ui/button";
import { useBlogList } from "../../../hooks/use-blog-list";

export const DashboardPage = () => {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useBlogList();

  if (isError) {
    return <div>Error loading blogs</div>;
  }

  const blogs = data?.pages.flatMap((page) => page.blogs) || [];

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">Tvoje novosti</h1>

      {isPending && <PendingState />}

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="border rounded-lg overflow-hidden hover:bg-primary/5 transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* Blog Image */}
              <div className="md:w-1/5">
                <img
                  src={blog.image_url}
                  alt={blog.image_alt}
                  className="w-full min-h-38 h-full object-cover"
                />
              </div>

              {/* Blog Content */}
              <div className="p-4 md:w-4/5">
                <div className="flex gap-x-8 justify-between items-start">
                  <h2 className="text-xl font-semibold">{blog.title}</h2>
                  <span className="text-xs bg-foreground text-background px-2 py-1 rounded">
                    {blog.category}
                  </span>
                </div>

                <p className="text-sm text-stone-600 mt-2 line-clamp-2">
                  {blog.description} {blog.description}
                  {blog.description}
                  {blog.description}
                  {blog.description}
                  {blog.description}
                </p>

                {/* Dates */}
                <div className="flex gap-4 mt-3 text-xs text-stone-500">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(blog.created_at).toLocaleDateString()}
                  </div>
                  {blog.updated_at && (
                    <div>
                      <span className="font-medium">Updated:</span>{" "}
                      {new Date(blog.updated_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Hashtags */}
                {blog.hashtags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {blog.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {isFetching && !isFetchingNextPage && (
        <div className="text-center text-stone-500">Loading more blogs...</div>
      )}
    </div>
  );
};

const PendingState = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image skeleton */}
            <div className="md:w-1/5">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 md:w-4/5 space-y-3">
              <div className="flex gap-x-8 justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-12" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="flex gap-4 mt-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-14" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${className}`} />
);
