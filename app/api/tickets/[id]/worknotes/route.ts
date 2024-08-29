// app\api\tickets\[id]\worknotes\route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = params;

  try {
    let worknotes;

    if (session.user.role === "USER") {
      worknotes = await prisma.worknote.findMany({
        where: {
          ticketId: parseInt(id),
          userId: session.user.id, // Only show user's own worknotes
        },
        include: {
          user: true, // Include user information
        },
      });
    } else if (session.user.role === "ADMIN" || session.user.role === "TECH") {
      worknotes = await prisma.worknote.findMany({
        where: { ticketId: parseInt(id) },
        include: {
          user: true, // Include user information
        },
      });
    }

    return NextResponse.json(worknotes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch worknotes" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { content, customervisible } = await req.json();
  const userId = session.user?.id; // Ensure userId is correctly retrieved from the session
  const ticketId = parseInt(params.id);

  console.log({ content, customervisible, ticketId, userId }); // Debugging line

  if (
    !content ||
    typeof customervisible === "undefined" ||
    !ticketId ||
    !userId
  ) {
    return NextResponse.json(
      { error: "Missing or invalid fields" },
      { status: 400 }
    );
  }

  try {
    const worknote = await prisma.worknote.create({
      data: {
        ticketId,
        userId,
        content,
        customervisible, // Ensure this is included and correctly typed
      },
    });

    return NextResponse.json(worknote, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create worknote" },
      { status: 500 }
    );
  }
}
