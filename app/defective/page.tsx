// app\defective\page.tsx
import React from "react";
import prisma from "@/prisma/db";
import DefectiveDeviceTable from "./DefectiveDeviceTable"; // This is the table component to display defective devices
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import {
  CurrentLocation,
  TypeOfRepair,
  RepairedBy,
  DefectiveDevice,
} from "@prisma/client";
import SearchItem from "@/components/Searchbar";
import SearchMany from "@/components/SearchMany";

export interface SearchParams {
  currentLocation?: CurrentLocation;
  typeOfRepair?: TypeOfRepair;
  repairedBy?: RepairedBy;
  page?: string;
  orderBy?: keyof DefectiveDevice;
  pageSize?: string;
  query?: string;
}

const DefectiveDevices = async ({ searchParams }: { searchParams: any }) => {
  const params: SearchParams = Object.fromEntries(
    new URLSearchParams(searchParams).entries()
  ) as any;

  const pageSize = parseInt(params.pageSize || "10");
  const page = parseInt(params.page || "1");
  const orderBy = params.orderBy || "updatedAt";

  const where: any = {};

  if (params.currentLocation) {
    where.currentLocation = params.currentLocation;
  }

  if (params.typeOfRepair) {
    where.typeOfRepair = params.typeOfRepair;
  }

  if (params.repairedBy) {
    where.repairedBy = params.repairedBy;
  }

  if (params.query) {
    const query = params.query.toLowerCase();
    where.OR = [
      { serialnumber: { contains: query } },
      { defectReported: { contains: query } },
    ];
  }

  const defectiveDeviceCount = await prisma.defectiveDevice.count({ where });
  const defectiveDevices = await prisma.defectiveDevice.findMany({
    where,
    orderBy: { [orderBy]: "desc" },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div>
      <div className="p-4 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow">
          <SearchItem />
        </div>
      </div>

      {/* Filters can be added here similar to the devices page */}

      <DefectiveDeviceTable
        defectiveDevices={defectiveDevices}
        searchParams={new URLSearchParams(params as Record<string, string>)}
        itemCount={defectiveDeviceCount}
      />
      <Pagination
        itemCount={defectiveDeviceCount}
        pageSize={pageSize}
        currentPage={page}
      />
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2 mr-2">
          Select Number of Rows Per Page
        </div>
        {/* Add PageSizeSelector if needed */}
      </div>
      <div className="flex flex-col items-center mt-8">
        <Link
          href="/defective/new"
          className={buttonVariants({ variant: "default" })}
        >
          Add a Defective Device
        </Link>
      </div>
    </div>
  );
};

export default DefectiveDevices;
