// app\api\status-substatus-change\statusSubstatusChangeTable.tsx

"use client";
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { DeviceStatus, DeviceSubstatus } from "@prisma/client";

interface Props {
  statusHistory: StatusSubstatusChange[];
}

interface StatusSubstatusChange {
  id: number;
  oldStatus: DeviceStatus | null;
  newStatus: DeviceStatus;
  oldSubstatus: DeviceSubstatus | null;
  newSubstatus: DeviceSubstatus;
  changedAt: string;
  user: { username: string };
}

const StatusSubstatusChangeTable = ({ statusHistory }: Props) => {
  return (
    <div className="lg:col-span-4 mt-4">
      <h2 className="text-xl font-semibold">Status/Substatus Change History</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary hover:bg-secondary">
            <TableHead>Old Status</TableHead>
            <TableHead>New Status</TableHead>
            <TableHead>Old Substatus</TableHead>
            <TableHead>New Substatus</TableHead>
            <TableHead>Changed At</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statusHistory.length > 0 ? (
            statusHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {record.oldStatus ? record.oldStatus : "N/A"}
                </TableCell>
                <TableCell>{record.newStatus}</TableCell>
                <TableCell>
                  {record.oldSubstatus ? record.oldSubstatus : "N/A"}
                </TableCell>
                <TableCell>{record.newSubstatus}</TableCell>
                <TableCell>
                  {format(new Date(record.changedAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{record.user.username}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                No status change history available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatusSubstatusChangeTable;
