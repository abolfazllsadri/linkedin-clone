"use client";

import { useEffect, useState } from "react";

export type PostMedia = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

export function usePostMedia() {
  const [media, setMedia] = useState<PostMedia | null>(null);

  function selectMedia(file: File, type: PostMedia["type"]) {
    setMedia({
      file,
      previewUrl: URL.createObjectURL(file),
      type,
    });
  }

  function removeMedia() {
    setMedia(null);
  }

  useEffect(() => {
    return () => {
      if (media?.previewUrl) URL.revokeObjectURL(media.previewUrl);
    };
  }, [media]);

  return {
    media,
    selectMedia,
    removeMedia,
  };
}
