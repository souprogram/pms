import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";

export const useCurrentUser = () => {
  const { data: userData, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", data.user?.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      return {
        user: data.user,
        profile: profileData,
      };
    },
    refetchOnWindowFocus: false,
  });

  if (userError) {
    throw userError;
  }

  if (!userData) {
    return null;
  }

  return userData;
};
