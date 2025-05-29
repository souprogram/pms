import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";

export const useCurrentUserImage = () => {
  const { data: image } = useQuery({
    queryKey: ["user", "image"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return undefined;
      }
      return data.user.user_metadata.avatar_url ?? undefined;
    },
  });

  return image;
};
