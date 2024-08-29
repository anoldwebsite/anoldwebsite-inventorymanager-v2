// app\rackshelf\RackShelfTable.tsx

"use client";

import React from "react";
import { RackShelf } from "@/prisma/types"; // Ensure you have defined the RackShelf type in types.ts
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

interface RackShelfTableProps {
  data: RackShelf[];
}

const RackShelfTable: React.FC<RackShelfTableProps> = ({ data }) => {
  return (
    <div className="rounded-md border w-full p-4 mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Rack</TableHead>
            <TableHead>Shelf</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((rackShelf, index) => (
              <TableRow key={index}>
                <TableCell>{rackShelf.country}</TableCell>
                <TableCell>{rackShelf.project}</TableCell>
                <TableCell>{rackShelf.rack}</TableCell>
                <TableCell>{rackShelf.shelf}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RackShelfTable;
