"use client";

import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/types";
import type { WithId } from "mongodb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PostFeedProps = {
  posts: WithId<Post>[];
  selectedPostId?: string | string[];
};

export default function PostFeed({ posts, selectedPostId }: PostFeedProps) {
  const router = useRouter();
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!selectedPostId || posts.length === 0) return;

    const element = document.getElementById(`post-${selectedPostId}`);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // eslint-disable-next-line
    setHighlightedPostId(selectedPostId as string);

    // Delete postId from URL
    router.replace("/", { scroll: false });

    const timer = setTimeout(() => {
      setHighlightedPostId(null);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedPostId, posts, router]);

  if (!posts || posts.length === 0)
    return (
      <p className="py-8 text-center text-gray-500">
        There are no posts yet. Be the first to post!
      </p>
    );

  return (
    <div className="space-y-3 pb-20 last:pb-15">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          highlightedPostId={highlightedPostId}
        />
      ))}
    </div>
  );
}
