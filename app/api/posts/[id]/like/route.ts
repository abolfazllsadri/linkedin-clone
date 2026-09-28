import { getPostById, likePost } from "@/mongodb/posts";
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

    return NextResponse.json(post.likes ?? []);
  } catch (error) {
    console.error("Error fetching likes:", error);

    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 },
    );
  }
}

export async function POST(
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

    const updatedPost = await likePost(id, userId);

    if (!updatedPost)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({
      message: "Post liked successfully",
      likes: updatedPost.likes,
    });
  } catch (error) {
    console.error("Error liking post:", error);

    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}
