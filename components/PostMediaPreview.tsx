"use client";

import type { PostMedia } from "@/hooks/usePostMedia";
import { X } from "lucide-react";

type PostMediaPreviewProps = {
  media: PostMedia;
  onRemove: () => void;
  isPending: boolean;
};

export default function PostMediaPreview({
  media,
  onRemove,
  isPending,
}: PostMediaPreviewProps) {
  return (
    <div className="relative mt-3">
      {media.type === "image" ? (
        // eslint-disable-next-line
        <img
          src={media.previewUrl}
          alt="Preview post photo"
          className="w-full rounded-lg object-cover aria-disabled:opacity-80 aria-disabled:select-none"
          aria-disabled={isPending}
        />
      ) : (
        <video
          src={media.previewUrl}
          controls
          className="w-full rounded-lg aria-disabled:opacity-80 aria-disabled:select-none"
          aria-disabled={isPending}
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1 text-black shadow-md transition not-disabled:hover:scale-102 disabled:cursor-not-allowed"
        aria-label={`Remove ${media.type}`}
        disabled={isPending}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
