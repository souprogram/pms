import { useQuery } from "@tanstack/react-query";
import { BlogCard } from "../../components/web/blog/blog-card";
import { supabase } from "../../database/supabase";
import { Blog } from "../../types/blog";

export function Home() {
  const blogsQuery = useQuery({
    queryKey: ["blog_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }

      return data as Blog[];
    },
  });

  if (blogsQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (blogsQuery.isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {blogsQuery.data.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  );
}
