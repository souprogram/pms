import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { BlogCard } from "../../components/web/blog/blog-card";
import { BlogContent } from "../../components/web/blog/blog-content";
import { BlogInfo } from "../../components/web/blog/blog-info";
import { createClient } from "../../lib/supabase/client";
import { Blog } from "../../types/blog";

export default function BlogPage() {
  const params = useParams<{ id: string }>();

  const { data: blog, isPending: isBlogPending } = useQuery({
    queryKey: ["blog", params.id],
    queryFn: async () => {
      const supabase = createClient();
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

      const supabase = createClient();
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
    <section className="flex flex-col gap-[var(--page-gap)] [--page-gap:calc(var(--spacing)*12)]">
      <header className="col-span-12 flex w-full flex-col">
        <div className="mx-auto w-fit">
          <BlogInfo blog={blog} />
        </div>

        <h1 className="max-w-prose py-4 text-5xl font-bold text-balance hyphens-auto uppercase md:pb-6 md:text-6xl">
          {blog.title}
        </h1>

        <span className="pb-6 text-lg md:text-xl">{blog.description}</span>

        <img
          src={blog.image_url}
          alt={blog.image_alt}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover object-center"
        />
      </header>

      <div className="grid grid-cols-1 gap-[var(--page-gap)] lg:grid-cols-[8fr_4fr] lg:flex-row">
        <article>
          <BlogContent content={blog.content} />
        </article>

        <aside className="@container/blog-sidebar sticky lg:top-(--nav-height) lg:self-start lg:[--nav-height:136px]">
          <h2 className="line-clamp-2 pb-4 text-2xl font-semibold text-balance hyphens-auto md:pb-6">
            Povezani članci
          </h2>
          <div className="grid grid-cols-1 gap-4 md:gap-6 @lg/blog-sidebar:grid-cols-2">
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
