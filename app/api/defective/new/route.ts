// app/api/defective/new/route.ts

import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import options from "../../auth/[...nextauth]/options";
import { DefectiveDeviceSchema } from "@/validationSchemas/defectiveDevice";

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "TECH") {
    return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Received form data:", body);

    const {
      serialnumber,
      entryid,
      dateCourierReceivedAsset,
      dateWHReceivedAsset,
      ...otherData
    } = body;

    // Convert entryid to an integer if provided, otherwise set it to undefined
    const parsedEntryId = entryid ? parseInt(entryid, 10) : undefined;

    // Convert the date strings to Date objects
    const parsedDateCourierReceivedAsset = dateCourierReceivedAsset
      ? new Date(dateCourierReceivedAsset)
      : undefined;
    const parsedDateWHReceivedAsset = dateWHReceivedAsset
      ? new Date(dateWHReceivedAsset)
      : undefined;

    // Find the device using the serialnumber
    const device = await prisma.device.findUnique({
      where: {
        serialnumber: serialnumber.trim().toUpperCase(),
      },
    });

    if (!device) {
      return NextResponse.json(
        { error: "Invalid serialnumber! Device not found in the database!" },
        { status: 400 }
      );
    }

    const deviceId = device.id;

    // Validate data using Zod
    const validation = DefectiveDeviceSchema.safeParse({
      ...otherData,
      serialnumber,
      entryid: parsedEntryId, // Use parsed integer entryid
      dateCourierReceivedAsset: parsedDateCourierReceivedAsset,
      dateWHReceivedAsset: parsedDateWHReceivedAsset,
      deviceId,
    });

    if (!validation.success) {
      console.log("Validation failed with errors:", validation.error.errors);
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // If validation passes, create the defective device record
    const newDefectiveDevice = await prisma.defectiveDevice.create({
      data: {
        ...otherData,
        serialnumber: serialnumber.trim().toUpperCase(),
        entryid: parsedEntryId, // Use parsed integer entryid
        dateCourierReceivedAsset: parsedDateCourierReceivedAsset,
        dateWHReceivedAsset: parsedDateWHReceivedAsset,
        deviceId,
      },
    });

    return NextResponse.json(newDefectiveDevice, { status: 201 });
  } catch (error) {
    console.error("Error creating defective device:", error);
    return NextResponse.json(
      { error: "Failed to create defective device." },
      { status: 500 }
    );
  }
}
