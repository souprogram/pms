import { User } from "lucide-react";
import { useUserProfile } from "../hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const CurrentUserAvatar = (
  props: React.ComponentProps<typeof Avatar>,
) => {
  const { user, profile } = useUserProfile();

  if (!user || !profile) {
    return (
      <Avatar {...props}>
        <AvatarFallback className="bg-muted text-white">
          <User className="text-gray-700" />
        </AvatarFallback>
      </Avatar>
    );
  }

  const initials: string = [profile.first_name, profile.last_name]
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar {...props}>
      <AvatarImage src={user.user_metadata.avatar_url} />
      <AvatarFallback className="bg-stone-700 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
