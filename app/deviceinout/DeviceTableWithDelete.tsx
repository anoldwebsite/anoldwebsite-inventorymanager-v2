// app\deviceinout\DeviceTableWithDelete.tsx
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Device } from "@prisma/client";
import { Button } from "@/components/ui/button";
import React from "react";
import { format } from "date-fns";

interface Props {
  devices: Partial<Device>[];
  onDelete: (index: number) => void;
}

const DeviceTableWithDelete = ({ devices, onDelete }: Props) => {
  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Serial Number",
                "Title",
                "Model Category",
                "Status",
                "Sub Status",
                "In/Out Status",
                "Lease End Date",
                "Rack",
                "Shelf",
                "Actions",
              ].map((column) => (
                <TableHead key={column}>
                  <div className="flex items-center">
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {devices.map((device, index) => (
              <TableRow key={index}>
                <TableCell>{device.serialnumber}</TableCell>
                <TableCell>{device.title}</TableCell>
                <TableCell>{device.modelCategory}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell>{device.substatus}</TableCell>
                <TableCell>{device.inOutStatus}</TableCell>
                <TableCell>
                  {device.leaseEndDate
                    ? format(new Date(device.leaseEndDate), "yyyy-MM-dd")
                    : ""}
                </TableCell>
                <TableCell>{device.rack}</TableCell>
                <TableCell>{device.shelf}</TableCell>
                <TableCell>
                  <Button type="button" onClick={() => onDelete(index)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeviceTableWithDelete;
