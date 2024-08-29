// app/api/status-substatus-change/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not Authenticated!" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "TECH") {
    return NextResponse.json({ error: "Not Authorized!" }, { status: 401 });
  }

  try {
    const { deviceId, oldStatus, newStatus, oldSubstatus, newSubstatus } =
      await req.json();

    await prisma.statusSubstatusChange.create({
      data: {
        deviceId,
        userId: session.user.id, // Registering who made the change
        oldStatus,
        newStatus,
        oldSubstatus,
        newSubstatus,
      },
    });

    return NextResponse.json({
      message: "Status and substatus change recorded successfully",
    });
  } catch (error) {
    console.error("Error during the POST operation:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
