import { User } from "lucide-react";
import { Link } from "react-router";
import { useUserProfile } from "../hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type CurrentUserAvatarProps = React.ComponentProps<typeof Avatar>;

export const CurrentUserAvatar = (props: CurrentUserAvatarProps) => {
  const { user, profile } = useUserProfile();

  if (!user || !profile) {
    return (
      <Link to="/login" className="flex items-center justify-center">
        <Avatar {...props}>
          <AvatarFallback className="bg-muted text-white">
            <User className="text-gray-700" />
          </AvatarFallback>
        </Avatar>
      </Link>
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
