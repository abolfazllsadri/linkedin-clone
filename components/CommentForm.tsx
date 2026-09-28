"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { Spinner } from "@/components/ui/spinner";
import { createCommentAction } from "@/actions/comment";
import { toast } from "sonner";

export default function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!comment.trim()) return;

    startTransition(async () => {
      try {
        const result = await createCommentAction({ postId, comment });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        setComment("");
        router.refresh();
      } catch (error) {
        console.error("Create comment failed:", error);

        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <UserAvatar user={user} size="default" className="sm:zoom-110" />

      <label
        className={`relative flex flex-1 rounded-full border bg-white p-3 has-[input]:focus-within:border-black/70 ${isPending ? "cursor-not-allowed" : "cursor-text"}`}
      >
        <input
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Add a comment..."
          className="flex-1 border-none bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
        />

        <Button
          type="submit"
          variant={isPending ? "outline" : "default"}
          className={`absolute top-1 right-1 z-50 cursor-pointer rounded-full text-xs ${comment.trim() ? "inline-flex" : "hidden"} items-center gap-1 whitespace-nowrap`}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner className="size-3.5 shrink-0" />
              <span>Loading</span>
            </>
          ) : (
            "Comment"
          )}
        </Button>
      </label>
    </form>
  );
}
