"use server";

import type { ActionResult, User } from "@/lib/types";
import { commentOnPost, deleteComment } from "@/mongodb/comments";
import { getPostById } from "@/mongodb/posts";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CreateCommentInput = {
  postId: string;
  comment: string;
};

type DeleteCommentInput = {
  postId: string;
  commentId: string;
};

export async function createCommentAction({
  postId,
  comment,
}: CreateCommentInput): Promise<ActionResult> {
  const user = await currentUser();

  if (!user)
    return {
      success: false,
      message: "You must be signed in to comment.",
    };

  if (typeof comment !== "string" || !comment.trim())
    return {
      success: false,
      message: "Comment cannot be empty.",
    };

  try {
    const post = await getPostById(postId);

    if (!post)
      return {
        success: false,
        message: "That post no longer exists.",
      };

    const userDB: User = {
      userId: user.id,
      userImage: user.imageUrl,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    };

    await commentOnPost(postId, userDB, comment.trim());

    revalidatePath("/");

    return {
      success: true,
      message: "Comment added successfully.",
    };
  } catch (error: unknown) {
    console.error("createCommentAction failed:", error);

    return {
      success: false,
      message: "We couldn't add your comment. Please try again.",
    };
  }
}

export async function deleteCommentAction({
  postId,
  commentId,
}: DeleteCommentInput): Promise<ActionResult> {
  const user = await currentUser();

  if (!user)
    return {
      success: false,
      message: "You must be signed in to delete this comment.",
    };

  try {
    const deleted = await deleteComment(postId, commentId, user.id);

    if (!deleted)
      return {
        success: false,
        message: "You can't delete this comment.",
      };

    revalidatePath("/");

    return {
      success: true,
      message: "Comment deleted successfully.",
    };
  } catch (error: unknown) {
    console.error("deleteCommentAction failed:", error);

    return {
      success: false,
      message: "We couldn't delete your comment. Please try again.",
    };
  }
}
