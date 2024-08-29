// app/api/devices/download/excel/route.ts

import { NextRequest, NextResponse } from "next/server";
import { addMonths, startOfToday, differenceInCalendarMonths } from "date-fns";
import * as XLSX from "xlsx";
import prisma from "@/prisma/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filteredDevices } = body;
    if (!filteredDevices || !Array.isArray(filteredDevices)) {
      const errorDetails = {
        error: "Invalid devices data provided",
        details: "The 'filteredDevices' parameter must be an array.",
        errorObject:
          "Invalid filteredDevices data: " + JSON.stringify(filteredDevices),
      };
      return NextResponse.json(errorDetails, { status: 400 });
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredDevices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Devices");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const response = new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=devices.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    return response;
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const searchParams = req.nextUrl.searchParams;

    // Initialize the where clause object
    const where: any = {};

    // List of non-filtering query parameters that should be excluded
    const excludeParams = ["page", "pageSize", "orderBy"];

    // Dynamically build the where clause based on the query parameters
    searchParams.forEach((value, key) => {
      if (!excludeParams.includes(key)) {
        switch (key) {
          case "leaseEndDate":
            if (value.startsWith("<")) {
              const months = parseInt(value.slice(1), 10);
              where.leaseEndDate = {
                lt: new Date(
                  new Date().setMonth(new Date().getMonth() + months)
                ),
              };
            } else if (value.startsWith(">=")) {
              const months = parseInt(value.slice(2), 10);
              where.leaseEndDate = {
                gte: new Date(
                  new Date().setMonth(new Date().getMonth() + months)
                ),
              };
            }
            break;

          case "inOutStatus":
            where.inOutStatus = value;
            break;

          case "substatus":
            where.substatus = value;
            break;

          default:
            // Assume that the value is a direct filter on the field
            where[key] = value;
            break;
        }
      }
    });

    // Fetch filtered devices from the database
    const devices = await prisma.device.findMany({
      where,
    });

    // Convert the devices to an Excel file
    const worksheet = XLSX.utils.json_to_sheet(devices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Devices");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Return the Excel file as a response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=devices.xlsx`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}
