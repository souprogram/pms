import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useCurrentUser } from "../hooks/use-current-user";

export const CurrentUserAvatar = () => {
  const user = useCurrentUser();

  const initials = (user?.profile.full_name as string)
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  const profileImage = user?.user.user_metadata.avatar_url as string | null;

  return (
    <Avatar>
      {profileImage && <AvatarImage src={profileImage} alt={initials} />}
      <AvatarFallback className="bg-stone-700 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
