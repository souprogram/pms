import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";

export const useCurrentUser = () => {
  const { data: userData, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return null;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, is_subscribed")
        .eq("user_id", data.user?.id)
        .single();

      if (profileError) {
        return {
          user: data.user,
          profile: null,
        };
      }

      return {
        user: data.user,
        profile: profileData,
      };
    },
    refetchOnWindowFocus: false,
  });

  if (userError) {
    return null;
  }

  return userData ?? null;
};
