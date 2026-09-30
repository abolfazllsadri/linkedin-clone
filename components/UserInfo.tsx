import SignedOut from "@/components/SignedOut";
import UserAvatar from "@/components/UserAvatar";
import { Post } from "@/lib/types";
import { Show } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function UserInfo({ posts }: { posts: Post[] }) {
  const user = await currentUser();

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`;
  const email = user?.emailAddresses.at(0)?.emailAddress;

  const userPosts =
    posts?.filter((post) => post.user?.userId === user?.id) ?? [];

  const userComments =
    posts?.flatMap((post) =>
      post.comments?.filter((comment) => comment.user?.userId === user?.id),
    ) ?? [];

  return (
    <div className="flex w-53 flex-col items-start justify-center rounded-lg border bg-white px-5 py-4 shadow-xs">
      <Show when="signed-in">
        <div className="flex flex-col gap-2">
          <Link href="/">
            <UserAvatar user={user} className="zoom-140" />
          </Link>

          <p className="leading-none font-semibold">{fullName}</p>
          <a href={`mailto:${email}`} className="text-xs leading-none">
            {email}
          </a>
          {user?.username && (
            <p className="text-xs leading-none">@{user.username}</p>
          )}
        </div>

        <hr className="my-5 w-full border-gray-200" />

        <div className="flex w-full justify-between text-sm">
          <p className="font-medium text-gray-400">Posts</p>
          <p className="text-blue-400">{userPosts.length}</p>
        </div>

        <div className="flex w-full justify-between text-sm">
          <p className="font-medium text-gray-400">Comments</p>
          <p className="text-blue-400">{userComments.length}</p>
        </div>
      </Show>

      <SignedOut />
    </div>
  );
}
