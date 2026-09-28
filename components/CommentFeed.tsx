import CommentItem from "@/components/CommentItem";
import type { Post } from "@/lib/types";

type CommentFeedProps = {
  post: Post;
};

export default function CommentFeed({ post }: CommentFeedProps) {
  if (post?.comments?.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-3 p-2">
      {post.comments?.map((comment) => (
        <CommentItem key={comment._id} comment={comment} postId={post._id} />
      ))}
    </div>
  );
}
