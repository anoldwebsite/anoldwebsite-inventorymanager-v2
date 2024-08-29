// app\api\tickets\worknotes\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function POST(request: NextRequest) {
  const { content, customervisible, ticketId, userId } = await request.json();

  try {
    const worknote = await prisma.worknote.create({
      data: {
        content,
        customervisible,
        ticketId,
        userId,
      },
    });
    return NextResponse.json(worknote, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while creating the worknote." },
      { status: 500 }
    );
  }
}
