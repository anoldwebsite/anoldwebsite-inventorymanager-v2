// app\api\deviceinout\[serial]\route.ts

import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const serial = pathname.split("/").pop();

  if (!serial) {
    return NextResponse.json(
      { error: "Serial number is required" },
      { status: 400 }
    );
  }

  try {
    const device = await prisma.device.findUnique({
      where: { serialnumber: serial },
    });

    if (device) {
      return NextResponse.json({ exists: true, device });
    } else {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking serial number:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
