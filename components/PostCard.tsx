"use client";

import { deletePostAction } from "@/actions/post";
import DeleteDialog from "@/components/DeleteDialog";
import PostOptions from "@/components/PostOptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import type { Post } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { cn } from "cn";
import { Trash2 } from "lucide-react";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import TimeAgo from "react-timeago";
import { toast } from "sonner";

type PostCardProps = {
  post: Post;
  highlightedPostId: string | null;
};

export default function PostCard({ post, highlightedPostId }: PostCardProps) {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isAuthor = user?.id === post?.user?.userId;

  function handleDeletePost() {
    startTransition(async () => {
      try {
        const result = await deletePostAction(post._id);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);

        router.refresh();
      } catch (error) {
        console.error("Delete post failed:", error);

        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <article
      id={`post-${post._id}`}
      className={cn(
        "overflow-hidden rounded-lg border bg-white shadow-xs transition-all",
        highlightedPostId === post._id &&
          "bg-primary/1 ring-primary/30 ring-2 ring-inset",
      )}
    >
      <header className="flex items-center gap-2 px-4 py-3">
        <UserAvatar
          src={post?.user?.userImage}
          user={user}
          className="sm:scale-115"
        />

        <div className="flex flex-1 flex-col leading-none">
          <p className="flex items-center font-medium text-gray-900">
            <span className="text-sm">
              {post?.user?.firstName} {post?.user?.lastName}
            </span>

            {isAuthor && (
              <Badge
                className="ml-2 text-xs font-medium text-gray-700"
                variant="secondary"
              >
                Author
              </Badge>
            )}
          </p>

          <p>
            {post?.createdAt && (
              <span className="text-xs text-gray-500">
                <TimeAgo date={post.createdAt} />
              </span>
            )}
          </p>
        </div>

        {isAuthor && (
          <DeleteDialog
            isDeleting={isPending}
            onDelete={handleDeletePost}
            title="Delete this post?"
            description="This action cannot be undone. Your post will be permanently deleted."
          >
            <Button
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              aria-label="Delete post"
            >
              <Trash2 />
            </Button>
          </DeleteDialog>
        )}
      </header>

      {post.text && (
        <p className="mt-3 px-4 text-[15px] whitespace-pre-wrap">{post.text}</p>
      )}

      {post.imagePublicId && (
        <CldImage
          src={post.imagePublicId}
          width={500}
          height={500}
          alt="Post image"
          className="mt-2 w-full object-cover"
        />
      )}

      {post.videoPublicId && (
        <div className="mt-2">
          <CldVideoPlayer
            id={`video-${post._id}`}
            src={post.videoPublicId}
            width={500}
            height={500}
          />
        </div>
      )}

      <PostOptions post={post} />
    </article>
  );
}
