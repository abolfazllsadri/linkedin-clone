import { unlikePost } from "@/mongodb/posts";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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

    const updatedPost = await unlikePost(id, userId);

    if (!updatedPost)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({
      message: "Post unliked successfully",
      likes: updatedPost.likes,
    });
  } catch (error) {
    console.error("Error unliking post:", error);

    return NextResponse.json(
      { error: "Failed to unlike post" },
      { status: 500 },
    );
  }
}
