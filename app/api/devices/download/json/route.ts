// app\api\devices\download\json\route.ts

import { NextRequest, NextResponse } from "next/server";
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

    // Convert the devices to a JSON string
    const json = JSON.stringify(devices, null, 2);

    // Return the JSON data as a response
    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=devices.json`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating JSON file:", error);
    return NextResponse.json(
      { error: "Failed to generate JSON file" },
      { status: 500 }
    );
  }
}
