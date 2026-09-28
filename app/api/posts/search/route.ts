import { getSearchPosts } from "@/mongodb/posts";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim();

    if (!query) return NextResponse.json([]);

    const posts = await getSearchPosts(query);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Search posts failed:", error);

    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 },
    );
  }
}
