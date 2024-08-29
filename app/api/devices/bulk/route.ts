// app\api\devices\bulk\route.ts

import { NextRequest, NextResponse } from "next/server";
import { deviceSchema } from "@/validationSchemas/device";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../../auth/[...nextauth]/options";
import * as XLSX from "xlsx";
import { parse } from "date-fns";
import {
  InOutStatus,
  DeviceStatus,
  DeviceSubstatus,
  ModelCategory,
} from "@prisma/client";

export const runtime = "nodejs";

interface Device {
  serialnumber: string;
  title: string;
  modelCategory: string;
  status: string;
  substatus: string;
  inOutStatus: string;
  rack?: string;
  shelf?: string;
  leaseEndDate: Date | null;
  specifications: string;
  assignedToUserId?: number | null;
  country?: string;
  project?: string;
  [key: string]: any;
}

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
};

const modelCategoryMap: { [key: string]: ModelCategory } = {
  laptop: ModelCategory.Laptop,
  desktop: ModelCategory.Desktop,
  "desktop mini": ModelCategory.DesktopMini,
  monitor: ModelCategory.Monitor,
  "standard monitor": ModelCategory.StandardMonitor,
  "monitor with dock": ModelCategory.MonitorWithDock,
  "conference monitor": ModelCategory.ConferenceMonitor,
  dockstation: ModelCategory.Dockstation,
  tablet: ModelCategory.Tablet,
  other: ModelCategory.Other,
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: Device[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    const rows: Device[] = [];
    const headers: string[] = Object.keys(jsonData[0]);

    jsonData.forEach((row: any) => {
      const device: Device = {
        serialnumber: row.serialnumber,
        title: row.title,
        modelCategory:
          modelCategoryMap[row.modelCategory?.trim().toLowerCase()] ||
          row.modelCategory,
        status: statusMap[row.status?.trim().toLowerCase()] || row.status,
        substatus:
          substatusMap[row.substatus?.trim().toLowerCase()] || row.substatus,
        inOutStatus: row.inOutStatus as InOutStatus,
        rack: row.rack,
        shelf: row.shelf,
        leaseEndDate: null,
        specifications: row.specifications,
        assignedToUserId: row.assignedToUserId,
        country: row.country,
        project: row.project,
      };

      // Parse leaseEndDate correctly
      if (row.leaseEndDate) {
        let dateValue: Date | null = null;
        try {
          if (typeof row.leaseEndDate === "number") {
            const excelDate = row.leaseEndDate;
            dateValue = new Date(
              Math.round((excelDate - 25569) * 86400 * 1000)
            );
          } else if (
            typeof row.leaseEndDate === "string" &&
            row.leaseEndDate.includes("/")
          ) {
            dateValue = parse(
              row.leaseEndDate.trim(),
              "dd/MM/yyyy HH:mm:ss",
              new Date()
            );
          } else if (
            typeof row.leaseEndDate === "string" &&
            row.leaseEndDate.includes(".")
          ) {
            dateValue = parse(
              row.leaseEndDate.trim(),
              "dd.MM.yyyy HH:mm:ss",
              new Date()
            );
          } else {
            console.error(
              `Unsupported date format for device ${device.serialnumber}: ${row.leaseEndDate}`
            );
            device.leaseEndDate = null;
            return device;
          }

          if (dateValue && !isNaN(dateValue.getTime())) {
            device.leaseEndDate = dateValue;
          } else {
            console.error(
              `Invalid date format for device ${device.serialnumber}: ${row.leaseEndDate}`
            );
            device.leaseEndDate = null;
          }
        } catch (error) {
          console.error(
            `Error parsing date for device ${device.serialnumber}: ${row.leaseEndDate}`
          );
          device.leaseEndDate = null;
        }
      }

      rows.push(device);
    });

    console.log("Headers from file:", headers);
    if (rows.length > 0) {
      console.log("First row of data from file:", rows[0]);
    }

    const requiredHeaders = [
      "serialnumber",
      "title",
      "inOutStatus",
      "status",
      "substatus",
      "rack",
      "shelf",
      "leaseEndDate",
      "modelCategory",
      "specifications",
      "country",
      "project",
    ];

    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: "Missing headers", missingHeaders },
        { status: 400 }
      );
    }

    const validationResults = rows.map((device) => {
      const validation = deviceSchema.safeParse(device);
      if (!validation.success) {
        console.log("Validation error for device:", device);
        console.log("Errors:", validation.error.format());
      }
      return validation;
    });

    const validDevices = validationResults
      .filter((result) => result.success)
      .map((result) => (result as any).data);

    const invalidDevices = validationResults
      .filter((result) => !result.success)
      .map((result, index) => ({
        device: rows[index],
        errors: (result as any).error.format(),
      }));

    const successfullyAdded: string[] = [];
    const failedToAdd: { serialnumber: string; error: string }[] = [];

    // Update existing devices or create new ones
    const operations = validDevices.map(async (device) => {
      try {
        // Validate rack and shelf against rackshelf table if they are provided
        if (device.rack && device.shelf) {
          const isValidRackShelf = await prisma.rackShelf.findFirst({
            where: {
              country: device.country?.trim().toUpperCase(),
              project: device.project?.trim().toUpperCase(),
              rack: device.rack.trim().toUpperCase(),
              shelf: device.shelf.trim().toUpperCase(),
            },
          });

          if (!isValidRackShelf) {
            throw new Error(
              `Invalid rack or shelf for device with serialnumber ${device.serialnumber}`
            );
          }
        }

        const existingDevice = await prisma.device.findUnique({
          where: { serialnumber: device.serialnumber },
        });

        if (existingDevice) {
          // Check if status or substatus has changed
          const statusChanged =
            device.status && device.status !== existingDevice.status;
          const substatusChanged =
            device.substatus && device.substatus !== existingDevice.substatus;

          const updatedDevice = await prisma.device.update({
            where: { serialnumber: device.serialnumber },
            data: device,
          });

          if (statusChanged || substatusChanged) {
            await prisma.statusSubstatusChange.create({
              data: {
                deviceId: updatedDevice.id,
                userId: session.user.id, // Assuming session.user contains the user ID
                oldStatus: statusChanged ? existingDevice.status : null,
                newStatus: statusChanged ? device.status : null,
                oldSubstatus: substatusChanged
                  ? existingDevice.substatus
                  : null,
                newSubstatus: substatusChanged ? device.substatus : null,
              },
            });
          }

          successfullyAdded.push(device.serialnumber);
        } else {
          const createdDevice = await prisma.device.create({ data: device });

          await prisma.statusSubstatusChange.create({
            data: {
              deviceId: createdDevice.id,
              userId: session.user.id, // Assuming session.user contains the user ID
              oldStatus: null,
              newStatus: device.status,
              oldSubstatus: null,
              newSubstatus: device.substatus,
            },
          });

          successfullyAdded.push(device.serialnumber);
        }
      } catch (err) {
        console.error(`Failed to add device ${device.serialnumber}: ${err}`);
        failedToAdd.push({
          serialnumber: device.serialnumber,
          error: (err as Error).message,
        });
      }
    });

    await Promise.all(operations);

    if (invalidDevices.length > 0 || failedToAdd.length > 0) {
      return NextResponse.json(
        {
          message: "Some devices could not be added.",
          successfullyAdded,
          failedToAdd: [
            ...failedToAdd,
            ...invalidDevices.map((invalid) => ({
              serialnumber: invalid.device.serialnumber,
              error: JSON.stringify(invalid.errors),
            })),
          ],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "All devices added successfully",
      successfullyAdded,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
