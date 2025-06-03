import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { http } from "../lib/axios";
import { supabase } from "../lib/supabase/client";
import { useUserProfile } from "./use-profile";

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const { profile } = useUserProfile();

  const createBlogMutation = useMutation({
    mutationFn: async (formData: {
      title: string;
      description: string;
      image: File | null;
      image_alt: string;
      category: string;
      content: string;
      hashtags: string;
      send_mail?: boolean;
    }) => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await http.postForm(
        "/api/blogs",
        {
          ...formData,
          author_id: profile?.id,
          author: `${profile?.first_name} ${profile?.last_name}`,
        },
        {
          headers: {
            Authorization: `Bearer ${data?.session?.access_token}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Blog created successfully!", { closeButton: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create blog", { closeButton: true });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_list"] });
    },
  });

  return createBlogMutation;
};
