import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@clerk/nextjs/server";
import type { UserResource } from "@clerk/nextjs/types";

type UserAvatarProps = {
  user: UserResource | User | null | undefined;
  size?: "sm" | "default" | "lg";
  className?: string;
  src?: string;
};

export default function UserAvatar({
  user,
  size = "lg",
  className,
  src,
}: UserAvatarProps) {
  const avatarUrl = src
    ? src
    : user?.hasImage
      ? user?.imageUrl
      : "./default-user.svg";

  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={avatarUrl} alt="User avatar" />

      <AvatarFallback className="uppercase">
        {(user?.firstName?.at(0) ?? "") + (user?.lastName?.at(0) ?? "")}
      </AvatarFallback>
    </Avatar>
  );
}
