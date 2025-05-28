import { useCurrentUser } from "../hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const CurrentUserAvatar = () => {
  const user = useCurrentUser();

  const initials: string = [user?.profile?.first_name, user?.profile?.last_name]
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const profileImage = user?.user.user_metadata.avatar_url as
    | string
    | undefined;

  return (
    <Avatar>
      <AvatarImage src={profileImage} />
      <AvatarFallback className="bg-stone-700 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
