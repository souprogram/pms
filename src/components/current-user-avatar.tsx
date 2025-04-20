import { useCurrentUserImage } from "../hooks/use-current-user-image";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useCurrentUser } from "../hooks/use-current-user";

export const CurrentUserAvatar = () => {
  const profileImage = useCurrentUserImage();

  const user = useCurrentUser();
  const initials = (user?.profile.full_name as string)
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  return (
    <Avatar>
      {profileImage && <AvatarImage src={profileImage} alt={initials} />}
      <AvatarFallback className="bg-stone-700">{initials}</AvatarFallback>
    </Avatar>
  );
};
