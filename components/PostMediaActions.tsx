"use client";

import { FileText, Image as Photo, Video } from "lucide-react";

type PostMediaActionsProps = {
  disabled: boolean;
  mediaType: "image" | "video" | null;
  onImageSelect: (file: File) => void;
  onVideoSelect: (file: File) => void;
};

export default function PostMediaActions({
  disabled,
  onImageSelect,
  onVideoSelect,
  mediaType,
}: PostMediaActionsProps) {
  return (
    <div className="flex items-center justify-around px-4 pt-6">
      <label
        htmlFor="video"
        className={`flex items-center gap-1 ${
          mediaType === "image" || disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <Video className="h-5 w-5 fill-lime-700 stroke-transparent sm:h-7 sm:w-7" />
        <span className="text-sm font-medium text-nowrap text-gray-900 sm:text-base">
          {mediaType === "video" ? "Change" : "Video"}
        </span>

        <input
          id="video"
          name="video"
          type="file"
          accept="video/*"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onVideoSelect(file);
            e.target.value = "";
          }}
        />
      </label>

      <label
        htmlFor="image"
        className={`flex items-center gap-1 ${
          mediaType === "video" || disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <Photo className="h-5 w-5 stroke-blue-500 sm:h-7 sm:w-7" />
        <span className="text-sm font-medium text-nowrap text-gray-900 sm:text-base">
          {mediaType === "image" ? "Change" : "Photo"}
        </span>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onImageSelect(file);
            e.target.value = "";
          }}
        />
      </label>

      <button
        type="button"
        disabled={disabled || mediaType === "image" || mediaType === "video"}
        className="flex cursor-pointer items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileText className="h-5 w-5 stroke-amber-700 sm:h-7 sm:w-7" />
        <span className="text-sm font-medium text-nowrap text-gray-900 sm:text-base">
          Write article
        </span>
      </button>
    </div>
  );
}
