import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { BlogCard } from "../../components/web/blog/blog-card";
import { BlogContent } from "../../components/web/blog/blog-content";
import { BlogInfo } from "../../components/web/blog/blog-info";
import { supabase } from "../../lib/supabase/client";
import { Blog } from "../../types/blog";

export default function BlogPage() {
  const params = useParams<{ id: string }>();

  const { data: blog, isPending: isBlogPending } = useQuery({
    queryKey: ["blog", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", params.id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data as Blog;
    },
  });

  const { data: relatedBlogs, isPending: isRelatedBlogsPending } = useQuery({
    queryKey: ["relatedBlogs", blog?.id],
    queryFn: async () => {
      if (!blog?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .neq("id", blog.id)
        .overlaps("hashtags", blog.hashtags ?? [])
        .limit(4);

      if (error) {
        throw new Error(error.message);
      }
      return data as Blog[];
    },
    enabled: !!blog,
  });

  if (!blog || !relatedBlogs || isBlogPending || isRelatedBlogsPending) {
    return <div className="flex items-center justify-center"></div>;
  }

  return (
    <section className="flex flex-col [--page-gap:calc(var(--spacing)*8)] gap-[var(--page-gap)] sm:[--page-gap:calc(var(--spacing)*12)]">
      <header className="col-span-12 flex w-full flex-col gap-4">
        <div className="mx-auto w-fit">
          <BlogInfo blog={blog} />
        </div>

        <div className="flex flex-col gap-2 sm:gap-4">
          <h1 className="max-w-prose text-4xl font-bold text-balance hyphens-auto uppercase sm:text-5xl">
            {blog.title}
          </h1>

          <span className="text-base sm:text-lg">{blog.description}</span>

          <div className="flex flex-col gap-2">
            <img
              src={blog.image_url}
              alt={blog.image_alt}
              width={1200}
              height={675}
              className="aspect-video w-full object-cover object-center"
            />

            <span className="text-sm sm:text-base text-gray-500">
              {blog.image_alt}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-[var(--page-gap)] lg:grid-cols-[8fr_4fr] lg:flex-row">
        <article>
          <BlogContent content={blog.content} />
        </article>

        <aside className="@container/blog-sidebar sticky lg:top-(--nav-height) lg:self-start lg:[--nav-height:6rem]">
          <h2 className="line-clamp-2 pb-4 text-2xl font-semibold text-balance hyphens-auto sm:pb-6">
            Povezani članci
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 @lg/blog-sidebar:grid-cols-2">
            {relatedBlogs.map((relatedBlog) => (
              <BlogCard
                blog={relatedBlog}
                key={relatedBlog.id}
                imgClassName="h-48"
                noDescription
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
