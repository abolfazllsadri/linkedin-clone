"use server";

import { deleteFromCloudinary } from "@/lib/cloudinary/server";
import type { ActionResult, User } from "@/lib/types";
import { createPost, deletePost } from "@/mongodb/posts";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CreatePostInput = {
  content: string;
  media?: {
    url: string;
    publicId: string;
    type: "image" | "video";
  };
};

export async function createPostAction({
  content,
  media,
}: CreatePostInput): Promise<ActionResult> {
  const user = await currentUser();

  if (!user)
    return {
      success: false,
      message: "You must be signed in to create a post.",
    };

  if (typeof content !== "string" || !content.trim())
    return {
      success: false,
      message: "Post cannot be empty.",
    };

  const expectedPrefix = `linkedin-clone/users/${user?.id}/`;

  if (media && !media.publicId.startsWith(expectedPrefix)) {
    return {
      success: false,
      message: "Invalid media.",
    };
  }

  const userDB: User = {
    userId: user?.id,
    userImage: user?.imageUrl,
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
  };

  try {
    await createPost({
      user: userDB,
      text: content.trim(),
      ...(media?.type === "image" && {
        imageUrl: media.url,
        imagePublicId: media.publicId,
      }),
      ...(media?.type === "video" && {
        videoUrl: media.url,
        videoPublicId: media.publicId,
      }),
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Post created successfully.",
    };
  } catch (error: unknown) {
    console.error("createPostAction failed:", error);

    if (media) {
      await deleteFromCloudinary(
        media.type === "image"
          ? { imagePublicId: media.publicId }
          : { videoPublicId: media.publicId },
        user.id,
      );
    }

    return {
      success: false,
      message: "We couldn't create your post. Please try again.",
    };
  }
}

export async function deletePostAction(postId: string): Promise<ActionResult> {
  const user = await currentUser();

  if (!user)
    return {
      success: false,
      message: "You must be signed in to delete this post.",
    };

  try {
    const deletedPost = await deletePost(postId, user.id);

    if (!deletedPost)
      return {
        success: false,
        message: "You can't delete this post.",
      };

    await deleteFromCloudinary(deletedPost, user.id);

    revalidatePath("/");

    return {
      success: true,
      message: "Post deleted successfully.",
    };
  } catch (error: unknown) {
    console.error("deletePostAction failed:", error);

    return {
      success: false,
      message: "We couldn't delete your post. Please try again.",
    };
  }
}
