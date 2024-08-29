// app\devices\page.tsx

import React from "react";
import prisma from "@/prisma/db";
import DeviceTable from "./DeviceTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import {
  InOutStatus,
  Device,
  ModelCategory,
  DeviceStatus,
  DeviceSubstatus,
} from "@prisma/client";
import DeviceSubstatusFilter from "@/components/DeviceSubstatusFilter";
import DeviceStatusFilter from "@/components/DeviceStatusFilter";
import PageSizeSelector from "@/components/PageSizeSelector";
import LeaseDateFilter from "@/components/LeaseDateFilter";
import DeviceIOFilter from "@/components/DeviceIOFilter";
import RackFilter from "@/components/RackFilter";
import DeviceCategoryFilter from "@/components/DeviceCategoryFilter";
import { addMonths, differenceInCalendarMonths, startOfToday } from "date-fns";
import DeviceGversionFilter from "@/components/DeviceGversionFilter";
import DeviceKeyboardFilter from "@/components/DeviceKeyboardFilter";
import SearchItem from "@/components/Searchbar";
import SearchMany from "@/components/SearchMany";

import dynamic from "next/dynamic";
import BulkDeviceAddExampleInputFile from "./new/BulkDeviceAddExampleInputFile";
import CountryFilter from "@/components/CountryDeviceFilter";

export interface SearchParams {
  inOutStatus?: InOutStatus;
  modelCategory?: ModelCategory;
  status?: DeviceStatus;
  substatus?: DeviceSubstatus;
  page?: string;
  orderBy?: keyof Device;
  orderDirection?: "asc" | "desc";
  pageSize?: string;
  leaseEndDate?: string;
  gversion?: string;
  keyboard?: string;
  query?: string; // For searching a device in the searchbar on the device page.
  groupBy?: string;
  rack?: string;
  serialnumber?: string[];
  country?: string;
}

const BulkDeviceAdd = dynamic(() => import("@/components/BulkDeviceAdd"), {
  ssr: false,
});

const Devices = async ({ searchParams }: { searchParams: any }) => {
  const params: SearchParams = Object.fromEntries(
    new URLSearchParams(searchParams).entries()
  ) as any;

  const pageSize = parseInt(params.pageSize || "10");
  const page = parseInt(params.page || "1");
  const orderBy = params.orderBy || "updatedAt";

  const inoutstatuses: InOutStatus[] = [
    InOutStatus.CHECKEDIN,
    InOutStatus.CHECKEDOUT,
  ];

  const racksInDatabase: string[] = [
    "INFOSYSEON_DK_MAIN",
    "INFOSYSEON_SE_DEFECTIVE",
    "INFOSYSEON_SE_MAIN",
    "INFOSYSEON_SE_PRESTAGING",
    "INFOSYSEON_SE_RETURN",
    "INFOSYSEON_SE_STAGING",
    "INFOSYSEON_TRANSFER_DISPOSAL",
    "N/A",
    "NULL_PLACEHOLDER",
    "INFOSYSEON_PL_RETURN",
  ];

  const rack =
    params.rack && racksInDatabase.includes(params.rack)
      ? params.rack
      : undefined;
  const inOutStatus =
    params.inOutStatus && inoutstatuses.includes(params.inOutStatus)
      ? params.inOutStatus
      : undefined;

  const modelcategories: ModelCategory[] = [
    ModelCategory.Laptop,
    ModelCategory.Desktop,
    ModelCategory.Tablet,
    ModelCategory.DesktopMini,
    ModelCategory.Monitor,
    ModelCategory.StandardMonitor,
    ModelCategory.MonitorWithDock,
    ModelCategory.ConferenceMonitor,
    ModelCategory.Dockstation,
    ModelCategory.Other,
  ];

  const modelCategory =
    params.modelCategory && modelcategories.includes(params.modelCategory)
      ? params.modelCategory
      : undefined;

  const deviceStatuses: DeviceStatus[] = [
    DeviceStatus.InStock,
    DeviceStatus.InTransit,
    DeviceStatus.InUse,
    DeviceStatus.Missing,
    DeviceStatus.OnOrder,
    DeviceStatus.Retired,
  ];

  const status =
    params.status && deviceStatuses.includes(params.status)
      ? params.status
      : undefined;

  const deviceSubstatuses: DeviceSubstatus[] = [
    DeviceSubstatus.Available,
    DeviceSubstatus.Deactivated,
    DeviceSubstatus.Defective,
    DeviceSubstatus.PendingDisposal,
    DeviceSubstatus.PendingRepair,
    DeviceSubstatus.PendingTransfer,
    DeviceSubstatus.Reserved,
    DeviceSubstatus.Unimaged,
    DeviceSubstatus.None,
  ];

  const substatus =
    params.substatus && deviceSubstatuses.includes(params.substatus)
      ? params.substatus
      : undefined;

  const where: any = {};

  if (params.country) {
    where.country = params.country;
  }
  // Convert the serialnumber parameter to an array if it's a string
  // Type guard to ensure params.serialnumber is a string before splitting
  const serialnumberParam = params.serialnumber as string | undefined;
  if (typeof serialnumberParam === "string") {
    params.serialnumber = serialnumberParam.split(",");
  }
  if (params.serialnumber && Array.isArray(params.serialnumber)) {
    where.serialnumber = { in: params.serialnumber };
  }

  if (modelCategory) where.modelCategory = modelCategory;
  else where.modelCategory = { in: modelcategories };

  if (inOutStatus) where.inOutStatus = inOutStatus;
  else where.inOutStatus = { in: inoutstatuses };

  if (status) where.status = status;
  else where.status = { in: deviceStatuses };

  if (substatus) where.substatus = substatus;
  else where.substatus = { in: deviceSubstatuses };

  if (rack) where.rack = rack;
  else where.rack = { in: racksInDatabase };

  const today = startOfToday();
  if (params.leaseEndDate) {
    const leaseEndDateFilter = params.leaseEndDate;

    if (leaseEndDateFilter.startsWith(">=")) {
      const months = parseInt(leaseEndDateFilter.slice(2));
      const filterDate = addMonths(today, months);
      where.leaseEndDate = { gte: filterDate };
    } else if (leaseEndDateFilter.startsWith("<")) {
      const months = parseInt(leaseEndDateFilter.slice(1));
      const filterDate = addMonths(today, months);
      where.leaseEndDate = { lt: filterDate };
    } else if (
      leaseEndDateFilter.includes(">") &&
      leaseEndDateFilter.includes("<")
    ) {
      const [greaterThan, lessThan] = leaseEndDateFilter
        .split(">")
        .pop()!
        .split("<")
        .map(Number);
      const todayMonths = differenceInCalendarMonths(
        addMonths(today, greaterThan),
        today
      );
      const filterMonths = differenceInCalendarMonths(
        addMonths(today, lessThan),
        today
      );
      where.leaseEndDate = {
        gte: addMonths(today, todayMonths),
        lt: addMonths(today, filterMonths),
      };
    }
  }

  const gversion = params.gversion && params.gversion !== "0";
  const keyboard = params.keyboard && params.keyboard !== "0";

  if (gversion && keyboard) {
    where.AND = [
      { title: { contains: params.gversion } },
      { title: { contains: params.keyboard } },
    ];
  } else if (keyboard) where.title = { contains: params.keyboard };
  else if (gversion) where.title = { contains: params.gversion };

  if (params.query) {
    const query = params.query.toLowerCase();
    where.OR = [
      { serialnumber: { contains: query } },
      { title: { contains: query } },
      { rack: { contains: query } },
      { shelf: { contains: query } },
    ];
  }

  //console.log("Final where clause:", where);

  const deviceCount = await prisma.device.count({ where });

  const sortBy: keyof Device = (params.orderBy as keyof Device) || "updatedAt";
  const orderDirection: "asc" | "desc" =
    (params.orderDirection as "asc" | "desc") || "asc";

  const devices = await prisma.device.findMany({
    where,
    orderBy: { [sortBy]: orderDirection },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const groupedDataResponse = params.groupBy
    ? await fetch(
        `http://${
          process.env.NEXT_PUBLIC_HOST
        }/api/devices/grouping?${new URLSearchParams(
          Object.entries(params).filter(
            ([key]) => key !== "page" && key !== "pageSize" && key !== "orderBy"
          )
        )}`
      )
    : null;

  const groupedData = groupedDataResponse
    ? await groupedDataResponse.json()
    : null;

  return (
    <div>
      <div className="p-4 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow">
          <SearchItem />
        </div>
        <div className="flex-grow">
          <SearchMany />
        </div>
      </div>

      <div className="flex gap-2">
        <CountryFilter />
        <DeviceIOFilter />
        <DeviceCategoryFilter />
        <DeviceStatusFilter />
        <DeviceSubstatusFilter />
        <DeviceGversionFilter />
        <LeaseDateFilter />
        <RackFilter />
        <DeviceKeyboardFilter />
      </div>
      <DeviceTable
        devices={devices}
        searchParams={new URLSearchParams(params as Record<string, string>)}
        groupedData={groupedData}
        itemCount={deviceCount}
      />
      <Pagination
        itemCount={deviceCount}
        pageSize={pageSize}
        currentPage={page}
      />
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2 mr-2">
          Select Number of Rows Per Page
        </div>
        <PageSizeSelector />
      </div>
      <div className="flex flex-col items-center mt-8">
        <Link
          href="/devices/new"
          className={buttonVariants({ variant: "default" })}
        >
          Add a Device
        </Link>
        <div className="rounded-md border w-full p-4">
          <BulkDeviceAdd />
        </div>

        <div className="rounded-md border w-full p-4">
          <BulkDeviceAddExampleInputFile />
        </div>
      </div>
    </div>
  );
};

export default Devices;
