// /pages/api/devices/by-serial/[serialnumber].ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET(request: NextRequest) {
  try {
    // Extract the serialnumber directly from the URL's pathname
    const serialnumber = request.nextUrl.pathname.split("/").pop();

    if (!serialnumber) {
      return NextResponse.json(
        { error: "Serial number is required" },
        { status: 400 }
      );
    }

    // Ensure serialnumber is trimmed and uppercased
    const device = await prisma.device.findUnique({
      where: { serialnumber: serialnumber.trim().toUpperCase() },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json({ deviceId: device.id }, { status: 200 });
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { error: "Failed to fetch device" },
      { status: 500 }
    );
  }
}
