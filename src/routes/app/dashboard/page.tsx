import { Button } from "../../../components/ui/button";
import { useBlogListQuery } from "../../../hooks/use-blog-list-query";

export default function DashboardPage() {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBlogListQuery({ myBlogsOnly: true });

  if (isError) {
    return <div>Error loading blogs</div>;
  }

  const blogs = data?.pages.flatMap((page) => page.blogs) || [];

  return (
    <div className="flex flex-col gap-6 p-4">
      {isPending && <PendingState />}

      {!isPending && blogs.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-xl font-medium">Nema novosti</p>
          <p className="text-sm">Dodaj novu novost da ju vidiš ovdje.</p>
        </div>
      )}

      <div className="space-y-4">
        {blogs.map((blog) => (
          <>
            <div key={blog.id} className="border rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image skeleton */}
                <div className="md:w-1/5">
                  <img
                    src={blog.image_url}
                    alt={blog.image_alt}
                    className="w-full min-h-38 aspect-video object-cover object-center"
                  />
                </div>

                {/* Content skeleton */}
                <div className="p-4 md:w-4/5 space-y-2">
                  <div className="flex gap-x-8 justify-between items-start">
                    <h2 className="text-xl font-semibold">{blog.title}</h2>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-stone-500">
                      {new Date(blog.created_at).toLocaleDateString("hr-HR")}
                    </span>
                    {blog.updated_at && (
                      <span className="text-xs text-stone-500">Edited</span>
                    )}
                  </div>

                  <p className="text-sm text-stone-600 line-clamp-2 max-w-prose">
                    {blog.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-primary text-background px-2 py-1 rounded">
                      {blog.category}
                    </span>
                    {(blog.hashtags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
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
    </div>
  );
}

const PendingState = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image skeleton */}
            <div className="md:w-1/5">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 md:w-4/5 space-y-2">
              <div className="flex gap-x-8 justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>

              <div className="space-y-2 max-w-prose">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-12" />
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
