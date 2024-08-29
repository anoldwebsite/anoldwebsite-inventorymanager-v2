// app\rackshelf\BulkShelfRackAddExampleInputFile.tsx"use client";
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

const BulkShelfRackAddExampleInputFile = () => {
  // Example data structure, replace with actual data if needed
  const exampleData = [
    {
      country: "SE",
      project: "INFOSYSEON",
      rack: "INFOSYSEON_SE_MAIN",
      shelf: "SE M07 A08 B",
    },
    {
      country: "PL",
      project: "RWE",
      rack: "INFOSYSEON_PL_RETURN",
      shelf: "PE A01 A03 D",
    },
  ];

  return (
    <div className="rounded-md border w-full p-4 mb-8">
      <div className="flex items-center space-x-4 space-y-4 mb-4 mt-8">
        <p className="text-2xl text-gray-500">
          Example Input File Format for Creating Racks and Shelves in Bulk
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
              <TableHead>rack*</TableHead>
              <TableHead>shelf*</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exampleData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.country}</TableCell>
                <TableCell>{item.project}</TableCell>
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

export default BulkShelfRackAddExampleInputFile;
