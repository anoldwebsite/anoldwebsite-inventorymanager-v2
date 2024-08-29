// app\devices\[id]\DeviceDetail.tsx

"use client";
import { formatEnumValue } from "@/utils/formatEnumValue";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ReactMarkDown from "react-markdown";
import StatusSubstatusChangeTable from "@/app/api/status-substatus-change/statusSubstatusChangeTable";
import DeleteButton from "./DeleteButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import AssignDevice from "@/components/AssignDevice";
import {
  User,
  Device,
  InOutStatus,
  ModelCategory,
  DeviceStatus,
  DeviceSubstatus,
  Role,
} from "@prisma/client";

interface Props {
  users: User[];
  userRole: Role;
  device: Device & {
    assignedToUser?: User | null;
  };
}

interface CheckinCheckout {
  id: number;
  deviceId: number;
  action: string;
  timestamp: string;
  rack: string | null;
  shelf: string | null;
  user: { username: string };
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

const DeviceDetail = ({ device, users, userRole }: Props) => {
  const [leaseEndDate, setLeaseEndDate] = useState<Date | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [history, setHistory] = useState<CheckinCheckout[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusSubstatusChange[]>(
    []
  );

  useEffect(() => {
    setLeaseEndDate(new Date(device.leaseEndDate));
    setCreatedAt(new Date(device.createdAt));
    setUpdatedAt(new Date(device.updatedAt));
  }, [device]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/api/devices/${device.id}`);
        setHistory(response.data.checkinCheckouts);
        setStatusHistory(response.data.statusSubstatusChanges);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [device.id]);

  if (!leaseEndDate || !createdAt || !updatedAt) {
    return null;
  }

  const parsedDevice = {
    ...device,
    leaseEndDate: new Date(device.leaseEndDate), // Parse to Date
    createdAt: new Date(device.createdAt), // Parse to Date
    updatedAt: new Date(device.updatedAt), // Parse to Date
  };

  return (
    <div className="lg:grid lg:grid-cols-4" key={device.id}>
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-3"></div>
          <CardTitle>{device.title}</CardTitle>
          <CardDescription>
            <div className="text-xl shadow-lg">
              <div>
                Serialnumber:{" "}
                {device.serialnumber
                  ? device.serialnumber
                  : "No Info about Serialnumber!"}
              </div>
              <div>
                {device.inOutStatus
                  ? device.inOutStatus
                  : "No Info about check-in/out status!"}
              </div>
              <div>
                Status:{" "}
                {device.status
                  ? formatEnumValue(device.status)
                  : "No Info about Status of this device!"}
              </div>
              <div>
                Substatus:{" "}
                {device.substatus
                  ? formatEnumValue(device.substatus)
                  : "No Info about Substatus of this device!"}
              </div>
              <div>
                Location (Country):{" "}
                {device.country
                  ? formatEnumValue(device.country)
                  : "No Info about in which country the device is now!"}
              </div>
              <div>
                Project in which the device is used:{" "}
                {device.project
                  ? formatEnumValue(device.project)
                  : "No Info about in which project the device is used now!"}
              </div>
              <div>
                Lease End Date:{" "}
                {leaseEndDate
                  ? format(new Date(leaseEndDate), "yyyy-MM-dd")
                  : ""}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <ReactMarkDown>
            {device.specifications ? device.specifications : ""}
          </ReactMarkDown>
        </CardContent>
        <CardFooter>
          <div>
            <div>
              Created:{" "}
              {createdAt.toLocaleDateString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
            <div>
              Updated:{" "}
              {updatedAt.toLocaleDateString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </CardFooter>
      </Card>
      <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2">
        {userRole === "ADMIN" && ( // Conditional rendering. Only ADMIN can edit/delete/assign/unassign devices.
          <>
            <AssignDevice device={parsedDevice} users={users} />
            <Link
              href={`/devices/edit/${device.id}`}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              Edit Device
            </Link>
            <DeleteButton deviceId={device.id} />
          </>
        )}
      </div>
      <div className="lg:col-span-4 mt-4">
        <h2 className="text-xl font-semibold">Check-in/Check-out History</h2>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Rack</TableHead>
              <TableHead>Shelf</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length > 0 ? (
              history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.action}</TableCell>
                  <TableCell>
                    {format(new Date(record.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell>{record.rack ? record.rack : "N/A"}</TableCell>
                  <TableCell>{record.shelf ? record.shelf : "N/A"}</TableCell>
                  <TableCell>{record.user.username}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No history available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="lg:col-span-4 mt-14">
        <h2 className="text-xl font-semibold">
          Status/Substatus Change History
        </h2>
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
    </div>
  );
};

export default DeviceDetail;
