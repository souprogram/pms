import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }

      setImage(data.session?.user.user_metadata.avatar_url ?? null);
    };
    fetchUserImage();
  }, []);

  return image;
};
