import { supabase } from "../database/supabase";
import { useQuery } from "@tanstack/react-query";

type Blog = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

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
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div>
        {blogsQuery.data.map((blog) => (
          <div key={blog.id} className="border p-4 mb-4">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p>{blog.content}</p>
            <p className="text-sm text-gray-500">
              {new Date(blog.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
