import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../lib/supabase/client";

type BlogData = {
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  category: string;
  content: string;
  hashtags: string[];
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData: BlogData) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("blogs")
        .insert(blogData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
