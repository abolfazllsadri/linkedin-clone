"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TimeAgo from "react-timeago";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUpIcon, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCommentAction } from "@/actions/comment";
import DeleteDialog from "@/components/DeleteDialog";
import type { Comment } from "@/lib/types";

type CommentItemProps = {
  comment: Comment;
  postId: string;
};

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const [isDeleting, startTransition] = useTransition();
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const { user } = useUser();
  const router = useRouter();

  const isCommentAuthor = user?.id === comment?.user?.userId;

  function handleDeleteComment() {
    startTransition(async () => {
      setDeletingCommentId(comment._id);

      try {
        const result = await deleteCommentAction({
          postId,
          commentId: comment._id,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
      } catch (error) {
        console.error("Delete comment failed:", error);
        toast.error("Something went wrong.");
      } finally {
        setDeletingCommentId(null);
      }
    });
  }

  if (!comment) return null;

  return (
    <div key={comment._id} className="flex items-start gap-2">
      {/* Avatar */}
      <Avatar className="h-6 w-6 shrink-0 sm:h-8 sm:w-8">
        <AvatarImage src={comment.user?.userImage} alt="User avatar" />

        <AvatarFallback className="text-xs uppercase">
          {(comment.user?.firstName?.at(0) ?? "") +
            (comment.user?.lastName?.at(0) ?? "")}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="min-w-0 flex-1 rounded-lg bg-gray-50">
        <div className="px-3 py-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-xs font-medium text-gray-900 sm:text-[13px]">
                  {comment.user?.firstName} {comment.user?.lastName}
                </span>

                {isCommentAuthor && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer px-1.5 py-0 text-[8px] font-medium sm:text-[10px]"
                  >
                    Author
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[8px] text-gray-500 sm:text-[10px]">
                <TimeAgo date={comment.createdAt} />
              </span>

              {isCommentAuthor && (
                <DeleteDialog
                  onDelete={handleDeleteComment}
                  isDeleting={deletingCommentId === comment._id}
                  title="Delete this comment?"
                  description="This action cannot be undone."
                >
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    className="cursor-pointer"
                    disabled={isDeleting}
                    aria-label="Delete comment"
                  >
                    <Trash2 />
                  </Button>
                </DeleteDialog>
              )}
            </div>
          </div>

          {/* Comment text */}
          {comment.text && (
            <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-gray-900 sm:text-sm">
              {comment.text}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 px-2 font-medium text-gray-500">
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer text-xs hover:text-gray-900"
          >
            <ThumbsUpIcon className="h-2 w-2 sm:h-4 sm:w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer text-xs hover:text-gray-900"
          >
            <MessageCircle className="h-2 w-2 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
