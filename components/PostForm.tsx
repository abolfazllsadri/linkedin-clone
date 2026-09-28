"use client";

import Link from "next/link";
import { createPostAction } from "@/actions/post";
import { useTransition } from "react";
import { useUser } from "@clerk/nextjs";

import { usePostMedia } from "@/hooks/usePostMedia";
import PostMediaPreview from "@/components/PostMediaPreview";
import PostMediaActions from "@/components/PostMediaActions";
import UserAvatar from "@/components/UserAvatar";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary/client";
import { toast } from "sonner";
import { validateMedia } from "@/lib/cloudinary/client";

export default function PostForm() {
  const { user } = useUser();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const { media, selectMedia, removeMedia } = usePostMedia();

  function handleImageSelect(file: File) {
    const error = validateMedia(file);

    if (error) {
      toast.error(error);
      return;
    }

    selectMedia(file, "image");
  }

  function handleVideoSelect(file: File) {
    const error = validateMedia(file);

    if (error) {
      toast.error(error);
      return;
    }

    selectMedia(file, "video");
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const content = formData.get("content")?.toString() ?? "";

    if (!content.trim()) return;

    startTransition(async () => {
      try {
        let uploadedMedia;

        if (media) {
          const validationError = validateMedia(media.file);

          if (validationError) {
            toast.error(validationError);
            return;
          }

          const uploadResult = await uploadToCloudinary(media.file, media.type);

          uploadedMedia = {
            url: uploadResult.secureUrl,
            publicId: uploadResult.publicId,
            type: media.type,
          };
        }

        const postResult = createPostAction({
          content,
          media: uploadedMedia,
        });

        toast.promise(postResult, {
          loading: "Creating post...",
          success: (await postResult).message,
          error: (await postResult).message,
        });

        if (!(await postResult).success) return;

        form.reset();
        removeMedia();
        router.refresh();
      } catch (error) {
        console.error("Create post failed:", error);

        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <div className="mb-2 flex flex-col rounded-lg border border-b-gray-50 bg-white p-4 shadow-xs">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-1 items-center space-x-2">
          <Link href="/">
            <UserAvatar user={user} className="sm:zoom-110" />
          </Link>

          <input
            type="text"
            name="content"
            id="content"
            placeholder="Start a post"
            maxLength={3000}
            disabled={isPending}
            className="flex-1 rounded-full border-2 border-gray-300 px-4 py-3 transition-all outline-none not-disabled:focus-within:border-gray-500 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        {media && (
          <PostMediaPreview
            isPending={isPending}
            onRemove={removeMedia}
            media={media}
          />
        )}

        <PostMediaActions
          disabled={isPending}
          mediaType={media?.type ?? null}
          onImageSelect={handleImageSelect}
          onVideoSelect={handleVideoSelect}
        />

        <button type="submit" hidden disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
