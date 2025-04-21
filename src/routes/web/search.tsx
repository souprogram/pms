import { useSearchParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Searchbar } from "../../components/ui/searchbar";
import { BlogCardHeader } from "../../components/web/blog/blog-card";
import { BlogImgLink } from "../../components/web/blog/blog-img-link";
import { BlogInfo } from "../../components/web/blog/blog-info";
import { useBlogListQuery } from "../../hooks/use-blog-list-query";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const {
    dataList,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBlogListQuery({
    searchQuery,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = (formData.get("q") as string).trim();

    if (search) {
      setSearchParams({ q: search }, { replace: true });
    }
  };

  return (
    <div>
      <div className="pb-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Searchbar
            defaultValue={searchQuery}
            name="q"
            aria-label="Pretraži"
            placeholder="Pretraži"
          />
          <Button type="submit">Pretraži</Button>
        </form>
      </div>

      <div className="pb-6">Prikazani rezultati za "{searchQuery}":</div>

      {isPending && (
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-medium">Loading...</h1>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-medium">Error loading blogs</h1>
        </div>
      )}

      {dataList && dataList?.length > 0 && (
        <div className="flex flex-col divide-y divide-primary border-y border-primary">
          {dataList.map((blog) => (
            <div key={blog.id} className="flex gap-6 py-3">
              <BlogImgLink
                href={`/blogs/${blog.id}`}
                className="h-48 w-full aspect-[12/10] object-cover object-center"
                src={blog.image_url}
                alt={blog.title}
              />

              <div className="flex flex-col gap-1">
                <BlogCardHeader href={`/blogs/${blog.id}`}>
                  {blog.title}
                </BlogCardHeader>
                <BlogInfo blog={blog} />
                <span className="text-base">{blog.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
