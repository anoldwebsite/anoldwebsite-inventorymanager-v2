// app\api\statussubstatus\route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, DeviceStatus, DeviceSubstatus } from "@prisma/client";

import prisma from "@/prisma/db";

const statusMap: { [key: string]: DeviceStatus } = {
  "in transit": DeviceStatus.InTransit,
  "in stock": DeviceStatus.InStock,
  "in use": DeviceStatus.InUse,
  missing: DeviceStatus.Missing,
  retired: DeviceStatus.Retired,
  "on order": DeviceStatus.OnOrder,
};

const substatusMap: { [key: string]: DeviceSubstatus } = {
  "pending repair": DeviceSubstatus.PendingRepair,
  "pending disposal": DeviceSubstatus.PendingDisposal,
  reserved: DeviceSubstatus.Reserved,
  unimaged: DeviceSubstatus.Unimaged,
  available: DeviceSubstatus.Available,
  defective: DeviceSubstatus.Defective,
  "pending transfer": DeviceSubstatus.PendingTransfer,
  deactivated: DeviceSubstatus.Deactivated,
  none: DeviceSubstatus.None,
  None: DeviceSubstatus.None,
};

export async function POST(request: NextRequest) {
  const { action, payload } = await request.json();

  if (!action || !payload) {
    return NextResponse.json(
      { error: "Missing action or payload" },
      { status: 400 }
    );
  }

  const notFound: string[] = [];
  const processed: string[] = [];

  console.log("Received payload:", payload);

  for (const item of payload) {
    // Check if item is valid and not empty
    if (!item || !item.serial || (!item.status && !item.substatus)) {
      console.log("Invalid or missing data in item:", item);
      continue;
    }

    const device = await prisma.device.findUnique({
      where: { serialnumber: item.serial },
    });

    if (!device) {
      notFound.push(item.serial);
      continue;
    }

    const updateData: any = {};
    if ((action === "STATUS" || action === "STATUS_SUBSTATUS") && item.status) {
      const statusValue = statusMap[item.status.toLowerCase()];
      if (!statusValue) {
        console.log(
          `Invalid status: ${item.status} for serial: ${item.serial}`
        );
        notFound.push(`Invalid status for serial: ${item.serial}`);
        continue;
      }
      updateData.status = statusValue;
    }
    if (
      (action === "SUBSTATUS" || action === "STATUS_SUBSTATUS") &&
      item.substatus
    ) {
      const substatusValue =
        substatusMap[item.substatus] ||
        substatusMap[item.substatus.toLowerCase()];
      if (!substatusValue) {
        console.log(
          `Invalid substatus: ${item.substatus} for serial: ${item.serial}`
        );
        notFound.push(`Invalid substatus for serial: ${item.serial}`);
        continue;
      }
      updateData.substatus = substatusValue;
    }

    try {
      await prisma.device.update({
        where: { serialnumber: item.serial },
        data: updateData,
      });
      processed.push(item.serial);
    } catch (error) {
      console.error(`Error updating device ${item.serial}:`, error);
    }
  }

  return NextResponse.json({ notFound, processed }, { status: 200 });
}
