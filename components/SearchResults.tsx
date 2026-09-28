import { Spinner } from "@/components/ui/spinner";
import type { Post } from "@/lib/types";
import Image from "next/image";

type SearchResultsProps = {
  results: Post[];
  isSearching: boolean;
  onSelect: (postId: string) => void;
};

export default function SearchResults({
  results,
  onSelect,
  isSearching,
}: SearchResultsProps) {
  return (
    <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-sm border bg-gray-50 p-2 shadow-lg">
      {isSearching ? (
        <p className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600">
          <Spinner />
          <span>Searching...</span>
        </p>
      ) : results.length > 0 ? (
        results.map((post) => (
          <button
            key={post._id}
            type="button"
            onClick={() => onSelect(post._id)}
            className="flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-left transition hover:bg-gray-100"
          >
            <Image
              src={post.user.userImage}
              className="h-9 w-9 rounded-full"
              width={36}
              height={36}
              alt="Post user avatar"
            />

            <div className="flex min-w-0 flex-col items-start gap-0.5 leading-none">
              <p className="text-sm font-semibold">
                {post.user.firstName} {post.user.lastName}
              </p>

              <p className="line-clamp-2 text-xs text-gray-500">{post.text}</p>
            </div>
          </button>
        ))
      ) : (
        <p className="px-3 py-2 text-sm text-gray-500">No posts found.</p>
      )}
    </div>
  );
}
