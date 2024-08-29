// app/api/devices/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../../auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        checkinCheckouts: {
          include: { user: true },
        },
        assignedToUser: true,
        statusSubstatusChanges: {
          include: { user: true },
        },
      },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found!" }, { status: 404 });
    }

    return NextResponse.json(device, { status: 200 });
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { error: "Failed to fetch device" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }

  try {
    const device = await prisma.device.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found!" }, { status: 404 });
    }

    if (device.assignedToUserId) {
      return NextResponse.json(
        {
          error:
            "Device is assigned to a user. Unassign it first before deletion.",
        },
        { status: 400 }
      );
    }

    await prisma.device.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: "Device deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting device:", error);
    return NextResponse.json(
      { error: "Failed to delete device" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      assignedToUserId,
      country,
      project,
      rack,
      shelf,
      status,
      substatus,
      ...otherUpdates
    } = body;

    const device = await prisma.device.findUnique({
      where: { id: parseInt(params.id) },
      include: { assignedToUser: true },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found!" }, { status: 404 });
    }

    // Validate rack and shelf against rackshelf table if they are not NULL_PLACEHOLDER
    if (
      country &&
      project &&
      rack !== "NULL_PLACEHOLDER" &&
      shelf !== "NULL_PLACEHOLDER"
    ) {
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

    const updateData: any = { ...otherUpdates };

    // Set finalRack and finalShelf to "NULL_PLACEHOLDER" if they are not provided
    const finalRack = rack || "NULL_PLACEHOLDER";
    const finalShelf = shelf || "NULL_PLACEHOLDER";

    // Conditionally include country and project in updateData
    if (country) updateData.country = country.trim().toUpperCase();
    if (project) updateData.project = project.trim().toUpperCase();
    updateData.rack = finalRack;
    updateData.shelf = finalShelf;

    // Check if status or substatus has changed
    const statusChanged = status && status !== device.status;
    const substatusChanged = substatus && substatus !== device.substatus;

    if (statusChanged) {
      updateData.status = status;
    }

    if (substatusChanged) {
      updateData.substatus = substatus;
    }

    // Conditionally update the device assignment
    if (assignedToUserId !== undefined) {
      if (
        device.assignedToUserId &&
        device.assignedToUserId !== assignedToUserId &&
        assignedToUserId !== 0 &&
        assignedToUserId !== null
      ) {
        return NextResponse.json(
          {
            error: `Device is already assigned to user ${device.assignedToUser?.username}`,
            assignedUser: device.assignedToUser,
          },
          { status: 400 }
        );
      }

      updateData.assignedToUserId =
        assignedToUserId === 0 ? null : assignedToUserId;
    }

    // Update the device with new data
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: updateData,
    });

    // If status or substatus changed, create a new StatusSubstatusChange entry
    if (statusChanged || substatusChanged) {
      const statusSubstatusChangeData: any = {
        deviceId: device.id,
        userId: session.user.id,
        oldStatus: statusChanged ? device.status : device.status,
        newStatus: statusChanged ? status : device.status,
        oldSubstatus: substatusChanged ? device.substatus : device.substatus,
        newSubstatus: substatusChanged ? substatus : device.substatus,
      };

      // Create the entry only if there is a change in status or substatus
      if (statusChanged || substatusChanged) {
        console.log(
          "Creating statusSubstatusChange with data:",
          statusSubstatusChangeData
        );
        await prisma.statusSubstatusChange.create({
          data: statusSubstatusChangeData,
        });
        console.log("statusSubstatusChange created successfully");
      }
    }

    return NextResponse.json(updatedDevice, { status: 200 });
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json(
      { error: "Failed to update device" },
      { status: 500 }
    );
  }
}
