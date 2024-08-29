// app\api\bulkdeviceinout\route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Action } from "@prisma/client";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

import prisma from "@/prisma/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not Authenticated!" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "TECH") {
    return NextResponse.json({ error: "Not Authorized!" }, { status: 401 });
  }

  try {
    const { action, payload } = await req.json();

    const actionMap: { [key: string]: Action } = {
      BULK_CHECKIN: Action.CHECKIN,
      BULK_CHECKOUT: Action.CHECKOUT,
      BULK_CHANGERACK: Action.CHANGERACK,
      BULK_CHANGESHELF: Action.CHANGESHELF,
    };

    const standardAction = actionMap[action];
    if (!standardAction) {
      throw new Error(`Invalid action: ${action}`);
    }

    const notFoundDevices: { serial: string; error: string }[] = [];
    const processedDevices: { serial: string }[] = [];
    const invalidRackShelfDevices: { serial: string; error: string }[] = [];

    const updates = payload.map(
      async (item: { serial: string; rack?: string; shelf?: string }) => {
        try {
          const device = await prisma.device.findUnique({
            where: { serialnumber: item.serial },
          });

          if (!device) {
            console.error(`Device with serial number ${item.serial} not found`);
            notFoundDevices.push({
              serial: item.serial,
              error: "Device not found",
            });
            return;
          }

          // Ensure required fields are not null
          if (!device.country || !device.project) {
            const errorMessage = `Device with serial number ${item.serial} is missing country or project information`;
            console.error(errorMessage);
            notFoundDevices.push({ serial: item.serial, error: errorMessage });
            return;
          }

          // Check the legality of rack and shelf values for CHANGERACK and CHANGESHELF
          if (standardAction === Action.CHANGERACK && item.rack) {
            const isValidRack = await prisma.rackShelf.findMany({
              where: {
                country: device.country,
                project: device.project,
                rack: item.rack,
              },
            });

            if (isValidRack.length === 0) {
              console.error(
                `Invalid rack for device with serial number ${item.serial}`
              );
              invalidRackShelfDevices.push({
                serial: item.serial,
                error: "Invalid rack",
              });
              return;
            }
          }

          let newRack;
          if (standardAction === Action.CHANGESHELF && item.shelf) {
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
              invalidRackShelfDevices.push({
                serial: item.serial,
                error: errorMessage,
              });
              return;
            }

            newRack = rackShelf.rack; // Get the corresponding rack for the shelf
          }

          await prisma.checkinCheckout.create({
            data: {
              deviceId: device.id,
              action: standardAction,
              rack: item.rack,
              shelf: item.shelf,
              userId: session.user.id,
            },
          });

          const updateData: any = {};
          if (
            standardAction === Action.CHECKIN ||
            standardAction === Action.CHECKOUT
          ) {
            updateData.inOutStatus =
              standardAction === Action.CHECKIN ? "CHECKEDIN" : "CHECKEDOUT";
            if (standardAction === Action.CHECKOUT) {
              updateData.rack = "NULL_PLACEHOLDER";
              updateData.shelf = "NULL_PLACEHOLDER";
            }
          } else if (standardAction === Action.CHANGERACK) {
            updateData.rack = item.rack ?? "NULL_PLACEHOLDER";
            updateData.shelf = "NULL_PLACEHOLDER";
          } else if (standardAction === Action.CHANGESHELF) {
            updateData.shelf = item.shelf;
            updateData.rack = newRack ?? undefined; // Update rack based on the new shelf
          }

          await prisma.device.update({
            where: { id: device.id },
            data: updateData,
          });

          processedDevices.push({ serial: item.serial });
        } catch (err) {
          let errorMessage = "Unknown error";
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          console.error(
            `Error processing device with serial number ${item.serial}:`,
            errorMessage
          );
          notFoundDevices.push({ serial: item.serial, error: errorMessage });
        }
      }
    );

    await Promise.all(updates);

    return NextResponse.json({
      message: "Bulk update operation completed",
      notFound: notFoundDevices,
      invalidRackShelf: invalidRackShelfDevices,
      processed: processedDevices,
    });
  } catch (error) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error during the POST operation:", errorMessage);
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
