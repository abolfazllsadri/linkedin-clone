import { deletePost, getPostById } from "@/mongodb/posts";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

    const post = await getPostById(id);

    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);

    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const post = await getPostById(id);

    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.user.userId !== userId)
      return NextResponse.json(
        { error: "You cannot delete this post" },
        { status: 403 },
      );

    const result = await deletePost(id, userId);

    if (!result)
      return NextResponse.json(
        { error: "Post could not be deleted" },
        { status: 404 },
      );

    return NextResponse.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
