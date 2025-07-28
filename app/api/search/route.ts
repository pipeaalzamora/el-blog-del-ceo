import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/notion";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "all";

    // Perform search
    const posts = await searchPosts(query);

    // Filter by category if specified
    const filteredPosts =
      category === "all"
        ? posts
        : posts.filter((post) => post.category === category);

    return NextResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length,
      query,
      category,
    });
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
