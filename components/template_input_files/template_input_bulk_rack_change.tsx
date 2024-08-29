// components\template_input_files\template_input_bulk_rack_change.tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

function template_input_bulk_rack_change() {
  return (
    <div className="rounded-md sm:border mt-4 mb-8">
      <div className="flex items-center space-x-4 space-y-4 mb-4">
        <p className="text-2xl text-gray-500">
          File Format for Changing rack/lager
        </p>
      </div>
      <div className="flex items-center space-x-4 space-y-4 mb-4">
        <p className="text-base text-gray-400">
          Please ensure your file has the following headers. Fields marked with
          * are required. Headers not marked with * can be omitted/excluded from
          the input file. To change the rack/lager or shelf/lagerort, the device
          musst have a status of "CHECKEDIN".No shelf/LAGERORT is required for
          changing rack/LAGER becasue shelf will be assigned automatically as
          "NULL_PLACEHOLDER". On the other hand if you change shelf/LAGERORT,
          the rack/LAGER will be automatically populated.
        </p>
      </div>

      <Table className="min-w-full mt-2 ml-2 mr-2 border border-gray-300">
        <TableHeader className="bg-gray-50">
          <TableRow className="bg-secondary hover:bg-secondary">
            <TableHead className="font-bold">SERIAL*</TableHead>
            <TableHead className="font-bold">LAGER*</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>5CG11839KL</TableCell>
            <TableCell>INFOSYSEON_SE_RETURN</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG1503WJV</TableCell>
            <TableCell>INFOSYSEON_SE_MAIN</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG2205QT8</TableCell>
            <TableCell>NULL_PLACEHOLDER</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG11544Y1</TableCell>
            <TableCell>INFOSYSEON_DK_MAIN</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CZC2337GKG</TableCell>
            <TableCell>INFOSYSEON_SE_STAGING</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG1503WJV</TableCell>
            <TableCell>INFOSYSEON_SE_PRESTAGING</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG15033JV</TableCell>
            <TableCell>INFOSYSEON_SE_DEFECTIVE</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default template_input_bulk_rack_change;
