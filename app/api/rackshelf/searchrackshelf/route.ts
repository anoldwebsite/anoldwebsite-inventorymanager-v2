//app\api\rackshelf\searchrackshelf\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { RackShelf } from "@/prisma/types"; // Ensure you have defined the RackShelf type in types.ts

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const results = await prisma.$queryRaw<RackShelf[]>`
      SELECT * FROM \`rackshelf\`
      WHERE LOWER(\`country\`) LIKE LOWER(${`%${query}%`})
      OR LOWER(\`project\`) LIKE LOWER(${`%${query}%`})
      OR LOWER(\`rack\`) LIKE LOWER(${`%${query}%`})
      OR LOWER(\`shelf\`) LIKE LOWER(${`%${query}%`})
    `;
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
