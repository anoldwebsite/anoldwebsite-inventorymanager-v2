// app\api\deviceinout\route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Action } from "@prisma/client"; // Import the Action enum
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";
import prisma from "@/prisma/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not Authenticated!" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }

  try {
    const { action, serialNumbers } = await req.json();

    if (!Object.values(Action).includes(action)) {
      throw new Error(`Invalid action: ${action}`);
    }

    const updates = serialNumbers.map(
      async (item: { serial: string; rack?: string; shelf?: string }) => {
        const device = await prisma.device.findUnique({
          where: { serialnumber: item.serial },
        });

        if (!device) {
          const errorMessage = `Device with serial number ${item.serial} not found`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }

        // Validation for CHANGERACK: Only rack is required, shelf should be set to 'NULL_PLACEHOLDER'
        if (action === "CHANGERACK" && item.rack) {
          const isValidRack = await prisma.rackShelf.findMany({
            where: {
              country: device.country as string,
              project: device.project as string,
              rack: item.rack as string,
            },
          });

          if (isValidRack.length === 0) {
            const errorMessage = `Invalid rack for device with serial number ${item.serial}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
          }
        }

        // Validation for CHANGESHELF: Retrieve rack based on shelf and update both
        let newRack;
        if (action === "CHANGESHELF" && item.shelf) {
          const rackShelf = await prisma.rackShelf.findFirst({
            where: {
              shelf: item.shelf,
              rack: {
                not: "NULL_PLACEHOLDER",
              },
            },
          });

          if (!rackShelf) {
            const errorMessage = `Invalid shelf for device with serial number ${item.serial}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
          }

          newRack = rackShelf.rack; // Get the corresponding rack for the shelf
        }

        await prisma.checkinCheckout.create({
          data: {
            deviceId: device.id,
            userId: session.user.id, // Store the user ID performing the action
            action: action as Action, // Cast the action to the Action enum
            rack: item.rack ?? undefined,
            shelf: item.shelf ?? undefined,
          },
        });

        const updateData: any = {};
        if (action === "CHECKIN" || action === "CHECKOUT") {
          updateData.inOutStatus =
            action === "CHECKIN" ? "CHECKEDIN" : "CHECKEDOUT";
          if (action === "CHECKOUT") {
            updateData.rack = "NULL_PLACEHOLDER";
            updateData.shelf = "NULL_PLACEHOLDER";
          }
        } else if (action === "CHANGERACK") {
          updateData.rack = item.rack ?? "NULL_PLACEHOLDER";
          updateData.shelf = "NULL_PLACEHOLDER";
        } else if (action === "CHANGESHELF") {
          updateData.shelf = item.shelf;
          updateData.rack = newRack ?? undefined; // Update rack based on the new shelf
        }

        await prisma.device.update({
          where: { id: device.id },
          data: updateData,
        });
      }
    );

    await Promise.all(updates);

    return NextResponse.json({ message: "Success" });
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
