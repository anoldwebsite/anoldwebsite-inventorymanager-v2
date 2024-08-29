// app\rackshelf\BulkDeviceAddExampleInputFile.tsx

"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { InOutStatus } from "@prisma/client";

const BulkDeviceAddExampleInputFile = () => {
  // Example data structure, replace with actual data if needed
  const exampleData = [
    {
      country: "SE",
      project: "INFOSYSEON",
      serialnumber: "5CG12765JF",
      item: "HP LAPTOP 855 G7 SE",
      model: "Laptop",
      status: "InStock",
      substatus: "Available",
      inOutStatus: "CHECKEDIN",
      leaseEndDate: "2025-09-30",
      specifications: "G7 AMD RYZEN 5 16GB",
      rack: "INFOSYSEON_SE_MAIN",
      shelf: "SE M07 A08 B",
    },
    {
      country: "SE",
      project: "RWE",
      serialnumber: "5CG401018S",
      item: "HP LAPTOP 845 G10 SE",
      model: "Laptop",
      status: "InStock",
      substatus: "Unimaged",
      inOutStatus: "CHECKEDIN",
      leaseEndDate: "2025.09.30",
      specifications: "G7 AMD RYZEN 5 16GB",
      rack: "INFOSYSEON_SE_MAIN",
      shelf: "SE M07 A08 B",
    },
    {
      country: "PL",
      project: "INFOSYSEON",
      serialnumber: "5CG423240Y",
      item: "HP ZBook Studio 16 inch G10 SE",
      model: "Laptop",
      status: "InTransit",
      substatus: "Unimaged",
      inOutStatus: "CHECKEDOUT",
      leaseEndDate: "2025/09/30",
      specifications: "G7 AMD RYZEN 5 16GB",
      rack: "INFOSYSEON_SE_PRESTAGING",
      shelf: "SE P02 A06 B",
    },
  ];

  return (
    <div className="rounded-md border w-full p-1 mb-8 mt-8">
      <div className="flex items-center ml-2 mb-8 mt-8">
        <p className="text-2xl text-gray-500">
          Example Input File Format for Adding Devices in Bulk
        </p>
      </div>
      <div className="flex items-center space-x-4 space-y-4 mb-4">
        <p className="text-base text-gray-400">
          Please ensure your file has the following headers. Fields marked with
          * are required. Headers not marked with * can be omitted/excluded from
          the input file.
        </p>
      </div>
      <div className="mt-4 w-max">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>country*</TableHead>
              <TableHead>project*</TableHead>
              <TableHead>serialnumber*</TableHead>
              <TableHead>item*</TableHead>
              <TableHead>model*</TableHead>
              <TableHead>status*</TableHead>
              <TableHead>substatus*</TableHead>
              <TableHead>inOutStatus*</TableHead>
              <TableHead>leaseEndDate*</TableHead>
              <TableHead>specifications*</TableHead>
              <TableHead>rack*</TableHead>
              <TableHead>shelf*</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exampleData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.country}</TableCell>
                <TableCell>{item.project}</TableCell>
                <TableCell>{item.serialnumber}</TableCell>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.substatus}</TableCell>
                <TableCell>{item.inOutStatus}</TableCell>
                <TableCell>{item.leaseEndDate}</TableCell>
                <TableCell>{item.specifications}</TableCell>
                <TableCell>{item.rack}</TableCell>
                <TableCell>{item.shelf}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BulkDeviceAddExampleInputFile;
