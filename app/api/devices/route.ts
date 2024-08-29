// app\api\devices\route.ts

import { NextRequest, NextResponse } from "next/server";
import { deviceSchema } from "@/validationSchemas/device";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  // We have a session but is it the admin who is trying to create a new device?
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { country, project, rack, shelf, ...otherData } = body;

    // Validate rack and shelf against rackshelf table if country and project are provided
    if (country && project && rack && shelf) {
      const isValidRackShelf = await prisma.rackShelf.findFirst({
        where: {
          country: country.trim().toUpperCase(),
          project: project.trim().toUpperCase(),
          rack: rack.trim().toUpperCase(),
          shelf: shelf.trim().toUpperCase(),
        },
      });

      if (!isValidRackShelf) {
        return NextResponse.json(
          { error: "Invalid rack or shelf!" },
          { status: 400 }
        );
      }
    }

    // Ensure rack and shelf are not empty
    const finalRack = rack || "NULL_PLACEHOLDER";
    const finalShelf = shelf || "NULL_PLACEHOLDER";

    // Parse leaseEndDate as a Date object
    if (otherData.leaseEndDate) {
      const temp = new Date(otherData.leaseEndDate); // Convert to a Date object
      const year = temp.getFullYear();
      const month = temp.getMonth() + 1; // Months are 0-based, so add 1
      const day = temp.getDate();
      otherData.leaseEndDate = new Date(year, month - 1, day); // Subtract 1 from month
    }

    const validation = deviceSchema.safeParse({
      ...otherData,
      country,
      project,
    });
    if (!validation.success) {
      console.log("Validation failed for the new device.");
      return NextResponse.json(validation.error.format(), { status: 400 });
    } else {
      console.log(
        "Validation succeeded for the new device. Let's create the new device now!"
      );
    }

    // Data is validated; create a new device in the database.
    const newDevice = await prisma.device.create({
      data: {
        ...otherData,
        country: country?.trim().toUpperCase(),
        project: project?.trim().toUpperCase(),
        rack: finalRack.trim().toUpperCase(),
        shelf: finalShelf.trim().toUpperCase(),
      },
    });

    return NextResponse.json({ newDevice }, { status: 201 });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error creating new device:", error);
    const errorMessage = "Failed to create device";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
