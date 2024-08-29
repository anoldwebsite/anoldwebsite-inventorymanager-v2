// app\api\rackshelf\bulkaddrackshelf\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function POST(req: NextRequest) {
  try {
    const records = await req.json();

    // Process records: trim and convert all fields to uppercase
    const processedRecords = records.map((record: any) => ({
      country: record.country.trim().toUpperCase(),
      project: record.project.trim().toUpperCase(),
      rack: record.rack.trim().toUpperCase(),
      shelf: record.shelf.trim().toUpperCase(),
    }));

    const successRecords: any[] = [];
    const failedRecords: any[] = [];

    for (const record of processedRecords) {
      try {
        await prisma.rackShelf.create({
          data: record,
        });
        successRecords.push(record);
      } catch (error: any) {
        if (error.code === "P2002") {
          // Unique constraint violation
          failedRecords.push({ ...record, reason: "Duplicate entry" });
        } else {
          failedRecords.push({ ...record, reason: error.message });
        }
      }
    }

    if (failedRecords.length > 0) {
      return NextResponse.json(
        {
          message: "Some records could not be added.",
          failedRecords,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "All records added successfully", successRecords },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing records:", error);
    return NextResponse.json(
      { error: "Failed to process records" },
      { status: 500 }
    );
  }
}

export function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 204 });
}

// Remove the default export statement
