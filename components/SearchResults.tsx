import { Spinner } from "@/components/ui/spinner";
import type { Post } from "@/lib/types";
import { UserResource } from "@clerk/nextjs/types";
import Image from "next/image";

type SearchResultsProps = {
  results: Post[];
  isSearching: boolean;
  onSelect: (postId: string) => void;
  user: UserResource | null | undefined;
};

export default function SearchResults({
  results,
  onSelect,
  isSearching,
  user,
}: SearchResultsProps) {
  return (
    <div className="absolute top-full left-0 z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border bg-gray-50 p-2 shadow-lg">
      {isSearching && (
        <p className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600">
          <Spinner />
          <span>Searching...</span>
        </p>
      )}

      {!isSearching && !user && (
        <p className="px-3 py-2 text-sm text-gray-600">
          Sign in to search posts.
        </p>
      )}

      {!isSearching && user && results.length === 0 && (
        <p className="px-3 py-2 text-sm text-gray-600">No posts found.</p>
      )}

      {!isSearching &&
        results.length > 0 &&
        results.map((post) => (
          <button
            key={post._id}
            type="button"
            onClick={() => onSelect(post._id)}
            className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-left transition hover:bg-gray-100"
          >
            <Image
              src={post.user.userImage}
              className="h-9 w-9 shrink-0 rounded-full"
              width={36}
              height={36}
              alt="Post user avatar"
            />

            <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
              <p className="w-full truncate text-sm font-semibold">
                {post.user.firstName} {post.user.lastName}
              </p>

              <p className="line-clamp-2 w-full text-xs wrap-break-word text-gray-500">
                {post.text}
              </p>
            </div>
          </button>
        ))}
    </div>
  );
}
