// app\api\devices\grouping\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

interface SearchParams {
  search?: string;
  filterStatus?: string;
  filterCategory?: string;
  filterSubstatus?: string;
  filterInOutStatus?: string;
  filterLeaseEndDate?: string;
  groupBy?: string;
}

const getGroupedDevices = async (
  groupBy: string,
  search: string | null,
  filters: Partial<SearchParams>
): Promise<Record<string, any[]>> => {
  let where: any = {};

  if (search) {
    where.OR = [
      { serialnumber: { contains: search } },
      { title: { contains: search } },
      { inOutStatus: { contains: search } },
    ];
  }

  if (filters.filterStatus) {
    where.status = filters.filterStatus;
  }
  if (filters.filterCategory) {
    where.modelCategory = filters.filterCategory;
  }
  if (filters.filterSubstatus) {
    where.substatus = filters.filterSubstatus;
  }
  if (filters.filterInOutStatus) {
    where.inOutStatus = filters.filterInOutStatus;
  }
  if (filters.filterLeaseEndDate) {
    where.leaseEndDate = filters.filterLeaseEndDate;
  }

  console.log("Fetching devices with where clause:", where);

  const devices = await prisma.device.findMany({
    where,
  });

  console.log("Devices fetched:", devices);

  if (!devices.length) {
    console.log("No devices found.");
    return {};
  }

  const validFields = [
    "serialnumber",
    "title",
    "specifications",
    "leaseEndDate",
    "createdAt",
    "updatedAt",
    "inOutStatus",
    "modelCategory",
    "status",
    "substatus",
    "rack",
    "shelf",
    "assignedToUserId",
  ];

  if (!validFields.includes(groupBy)) {
    console.error(`Invalid groupBy field: ${groupBy}`);
    throw new Error(`Invalid groupBy field: ${groupBy}`);
  }

  const groupedData = devices.reduce((acc: Record<string, any[]>, device) => {
    const key = String(device[groupBy as keyof typeof device]);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(device);
    return acc;
  }, {});

  return groupedData;
};

export const GET = async (req: NextRequest) => {
  console.log("Request received:", req.url);

  const url = new URL(req.url || "", `http://${req.headers.get("host")}`);
  const searchParams = url.searchParams;

  const search = searchParams.get("search");
  const filterStatus = searchParams.get("filterStatus");
  const filterCategory = searchParams.get("filterCategory");
  const filterSubstatus = searchParams.get("filterSubstatus");
  const filterInOutStatus = searchParams.get("filterInOutStatus");
  const filterLeaseEndDate = searchParams.get("filterLeaseEndDate");
  const groupBy = searchParams.get("groupBy");

  if (!groupBy) {
    console.error("Missing 'groupBy' parameter");
    return NextResponse.json(
      { error: "Missing 'groupBy' parameter" },
      { status: 400 }
    );
  }

  console.log("Received groupBy parameter:", groupBy);

  try {
    const groupedData = await getGroupedDevices(groupBy, search || null, {
      filterStatus: filterStatus || undefined,
      filterCategory: filterCategory || undefined,
      filterSubstatus: filterSubstatus || undefined,
      filterInOutStatus: filterInOutStatus || undefined,
      filterLeaseEndDate: filterLeaseEndDate || undefined,
    });
    return NextResponse.json(groupedData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error grouping data:", error.message);
      return NextResponse.json(
        { error: "Failed to group data", message: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Unexpected error occurred" },
        { status: 500 }
      );
    }
  }
};
