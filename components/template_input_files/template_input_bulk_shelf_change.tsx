// components\template_input_files\template_input_bulk_shelf_change.tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

function template_input_bulk_shelf_change() {
  return (
    <div className="rounded-md sm:border mt-4 mb-8">
      <div className="flex items-center space-x-4 space-y-4 mb-4">
        <p className="text-2xl text-gray-500">
          File Format for changing shelf/lagerort
        </p>
      </div>
      <div className="flex items-center space-x-4 space-y-4 mb-4">
        <p className="text-base text-gray-400">
          Please ensure your file has the following headers. Fields marked with
          * are required. Headers not marked with * can be omitted/excluded from
          the input file. To change the rack/lager or shelf/lagerort, the device
          musst have a status of "CHECKEDIN".
        </p>
      </div>

      <Table className="min-w-full mt-2 ml-2 mr-2 border border-gray-300">
        <TableHeader className="bg-gray-50">
          <TableRow className="bg-secondary hover:bg-secondary">
            <TableHead className="font-bold">SERIAL*</TableHead>
            <TableHead className="font-bold">LAGERORT*</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>5CG11839KL</TableCell>
            <TableCell>SE M04 C07 A</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG1503WJV</TableCell>
            <TableCell>SE P02 A07 B</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG2205QT8</TableCell>
            <TableCell>NULL_PLACEHOLDER</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default template_input_bulk_shelf_change;
