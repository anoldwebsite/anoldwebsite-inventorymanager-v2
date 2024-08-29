// app\api\devices\download\csv\route.ts

import { NextRequest, NextResponse } from "next/server";
import { createObjectCsvStringifier } from "csv-writer";
import * as XLSX from "xlsx"; // This can still be used to generate CSV
import prisma from "@/prisma/db";

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const searchParams = req.nextUrl.searchParams;

    // Initialize the where clause object
    const where: any = {};

    // Dynamically build the where clause based on the query parameters
    searchParams.forEach((value, key) => {
      switch (key) {
        case "leaseEndDate":
          if (value.startsWith("<")) {
            const months = parseInt(value.slice(1), 10);
            where.leaseEndDate = {
              lt: new Date(new Date().setMonth(new Date().getMonth() + months)),
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

        case "page":
        case "orderBy":
          // Ignore pagination and ordering params for the where clause
          break;

        default:
          where[key] = value;
          break;
      }
    });

    // Fetch filtered devices from the database
    const devices = await prisma.device.findMany({
      where,
    });

    // Convert the devices to a CSV file
    const worksheet = XLSX.utils.json_to_sheet(devices);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // Return the CSV file as a response
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=devices.csv`,
        "Content-Type": "text/csv",
      },
    });
  } catch (error) {
    console.error("Error generating CSV file:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV file" },
      { status: 500 }
    );
  }
}
