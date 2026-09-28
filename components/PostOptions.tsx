"use client";

import CommentFeed from "@/components/CommentFeed";
import CommentForm from "@/components/CommentForm";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/types";
import { Show, useUser } from "@clerk/nextjs";
import { cn } from "cn";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

export default function PostOptions({ post }: { post: Post }) {
  const { user } = useUser();

  const [likes, setLikes] = useState(() => post?.likes ?? []);
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes);
  const liked = user?.id ? (optimisticLikes ?? []).includes(user.id) : false;

  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  async function handleToggleLike() {
    if (!user?.id) return;

    const nextLiked = !liked;
    const previousLikes = likes;

    const nextLikes = nextLiked
      ? [...(likes ?? []), user.id]
      : (likes ?? []).filter((id) => id !== user.id);

    startTransition(async () => {
      setOptimisticLikes(nextLikes);

      const res = await fetch(
        `/api/posts/${post._id}/${nextLiked ? "like" : "unlike"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setLikes(previousLikes);
        toast.error(
          data.error ?? `Failed to ${nextLiked ? "Like" : "Unlike"} Post`,
        );
        return;
      }

      setLikes(data.likes);
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 border-b px-3 py-2">
        <div className="flex items-center">
          {optimisticLikes && optimisticLikes.length > 0 && (
            <p className="hover:text-primary flex cursor-pointer items-center gap-1 text-sm text-gray-500 hover:underline">
              <span className="bg-primary flex items-center justify-center rounded-full p-0.75">
                <ThumbsUpIcon
                  size={12}
                  className="fill-white/70 stroke-black"
                />
              </span>
              <span> {optimisticLikes.length}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end">
          {post?.comments && post.comments.length > 0 && (
            <button
              onClick={() => setIsCommentOpen((open) => !open)}
              className="hover:text-primary flex cursor-pointer items-center gap-1 text-xs text-gray-500 hover:underline"
            >
              <span>{post.comments.length}</span>
              <span>comments</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center px-4 py-1">
        <Button
          variant="ghost"
          className="post-option-btn transition active:scale-95"
          onClick={handleToggleLike}
          disabled={isPending}
        >
          <ThumbsUpIcon
            className={cn(
              "mr-1 stroke-2 text-black/80",
              liked && "fill-primary text-primary",
            )}
          />
          <span className="text-black/80">Like</span>
        </Button>

        <Button
          variant="ghost"
          className="post-option-btn"
          onClick={() => setIsCommentOpen((open) => !open)}
        >
          <MessageCircle
            className={cn("mr-1", isCommentOpen && "fill-primary text-primary")}
          />
          <span className="text-black/80">Comment</span>
        </Button>

        <Button variant="ghost" className="post-option-btn">
          <Repeat2 className="mr-1 text-black/80" />
          <span className="text-black/80">Repost</span>
        </Button>

        <Button variant="ghost" className="post-option-btn">
          <Send className="mr-1 text-black/80" />
          <span className="text-black/80">Send</span>
        </Button>
      </div>

      {isCommentOpen && (
        <div className="p-4">
          <Show when="signed-in">
            <CommentForm postId={post._id} />
          </Show>

          <CommentFeed post={post} />
        </div>
      )}
    </div>
  );
}
