// app/api/defective/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { DefectiveDeviceSchema } from "@/validationSchemas/defectiveDevice";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await request.json();
    console.log("Received data for update:", data);

    // Convert date strings to Date objects
    const parsedDateCourierReceivedAsset = data.dateCourierReceivedAsset
      ? new Date(data.dateCourierReceivedAsset)
      : null;
    const parsedDateWHReceivedAsset = data.dateWHReceivedAsset
      ? new Date(data.dateWHReceivedAsset)
      : null;

    // Convert entryid to an integer if provided, otherwise set it to null
    const parsedEntryId = data.entryid ? parseInt(data.entryid, 10) : null;

    // Validate data using Zod
    const validation = DefectiveDeviceSchema.safeParse({
      ...data,
      entryid: parsedEntryId, // Use parsed integer entryid
      dateCourierReceivedAsset: parsedDateCourierReceivedAsset,
      dateWHReceivedAsset: parsedDateWHReceivedAsset,
    });

    if (!validation.success) {
      console.log("Validation failed with errors:", validation.error.errors);
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // Update the defective device record
    const updatedDefectiveDevice = await prisma.defectiveDevice.update({
      where: { id: parseInt(id) },
      data: {
        serialnumber: data.serialnumber,
        entryid: parsedEntryId,
        sendTrackingId: data.sendTrackingId || null,
        receiveTrackingId: data.receiveTrackingId || null,
        supplierRepairCaseId: data.supplierRepairCaseId || null,
        defectReported: data.defectReported,
        typeOfRepair: data.typeOfRepair || null,
        dateCourierReceivedAsset: parsedDateCourierReceivedAsset,
        dateWHReceivedAsset: parsedDateWHReceivedAsset,
        currentLocation: data.currentLocation,
        partsReplaced: data.partsReplaced || null,
        notes: data.notes || null,
        quotationAmount: data.quotationAmount || null,
        repairedBy: data.repairedBy || null,
        deviceId: data.deviceId, // Make sure this is passed correctly
      },
    });

    return NextResponse.json(updatedDefectiveDevice, { status: 200 });
  } catch (error) {
    console.error("Error updating defective device:", error);
    return NextResponse.json(
      { error: "Failed to update defective device." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deletedDefectiveDevice = await prisma.defectiveDevice.delete({
      where: { id: parseInt(id) }, // `id` here refers to the `id` of the `defectivedevice` table
    });

    return NextResponse.json(deletedDefectiveDevice, { status: 200 });
  } catch (error) {
    console.error("Error deleting defective device:", error);
    return NextResponse.json(
      { error: "Failed to delete defective device." },
      { status: 500 }
    );
  }
}
