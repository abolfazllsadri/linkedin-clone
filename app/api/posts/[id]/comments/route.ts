import { commentOnPost, getCommentsByPostId } from "@/mongodb/comments";
import { auth, currentUser } from "@clerk/nextjs/server";
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

    const comments = await getCommentsByPostId(id);

    if (comments === null)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);

    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text }: { text: string } = await request.json();

    if (!text?.trim())
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 },
      );

    const user = await currentUser();

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const commentUser = {
      userId: user.id,
      userImage: user.imageUrl,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    };

    const result = await commentOnPost(id, commentUser, text.trim());

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error creating comment:", error);

    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
