// components\template_input_files\template_input_bulk_state_substate_change.tsx

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

function template_input_bulk_state_substate_change() {
  return (
    <div className="rounded-md sm:border mt-4 mb-8">
      <div className="flex items-center space-x-4 space-y-4 mb-4">
        <p className="text-2xl text-gray-500">
          File Format for Changing Device Status and Substatus
        </p>
      </div>
      <div className="flex items-center space-x-4 space-y-4 mb-4">
        <p className="text-base text-gray-400">
          Please ensure your file has the following headers. Fields marked with
          * are required. Headers not marked with * can be omitted/excluded from
          the input file.
        </p>
      </div>

      <Table className="min-w-full mt-2 ml-2 mr-2 border border-gray-300">
        <TableHeader className="bg-gray-50">
          <TableRow className="bg-secondary hover:bg-secondary">
            <TableHead className="font-bold">SERIAL*</TableHead>
            <TableHead className="font-bold">STATUS*</TableHead>
            <TableHead className="font-bold">SUBSTATUS*</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>5CG2211C3W</TableCell>
            <TableCell>in stock</TableCell>
            <TableCell>available</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG2442NNX</TableCell>
            <TableCell>in transit</TableCell>
            <TableCell>defective</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG11546IL</TableCell>
            <TableCell>in transit</TableCell>
            <TableCell>pending transfer</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG127BXS4</TableCell>
            <TableCell>in stock</TableCell>
            <TableCell>pending repair</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG3210R4K</TableCell>
            <TableCell>in stock</TableCell>
            <TableCell>unimaged</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG2442NTB</TableCell>
            <TableCell>in stock</TableCell>
            <TableCell>defective</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CND1502BFC</TableCell>
            <TableCell>in stock</TableCell>
            <TableCell>pending disposal</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>8CG1331F2B</TableCell>
            <TableCell>in stock</TableCell>
            <TableCell>reserved</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG1504WPW</TableCell>
            <TableCell>in use</TableCell>
            <TableCell>None</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG11544XT</TableCell>
            <TableCell>missing</TableCell>
            <TableCell>deactivated</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG2442NH9</TableCell>
            <TableCell>retired</TableCell>
            <TableCell>deactivated</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5CG3212SK8</TableCell>
            <TableCell>on order</TableCell>
            <TableCell>None</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default template_input_bulk_state_substate_change;
