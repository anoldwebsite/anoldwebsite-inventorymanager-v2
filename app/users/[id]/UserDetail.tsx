import React from "react";
import { format } from "date-fns";
import { User, Device, Ticket } from "@prisma/client";
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
import DeleteUserButton from "./DeleteUserButton";
import ReactMarkDown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

interface Props {
  user: User & { assignedDevices: Device[]; assignedTickets: Ticket[] };
}

const UserDetail = ({ user }: Props) => {
  return (
    <div className="lg:grid lg:grid-cols-4">
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-3">{user.username}</div>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <ReactMarkDown>{user.username}</ReactMarkDown>
        </CardContent>
        <CardFooter>{user.role}</CardFooter>
      </Card>
      <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2">
        <Link
          href={`/users/edit/${user.id}`}
          className={`${buttonVariants({ variant: "default" })}`}
        >
          Edit User
        </Link>
        <DeleteUserButton userId={user.id} />
      </div>

      {/* Assigned Devices */}
      <div className="lg:col-span-4 mt-4">
        <h2 className="text-xl font-semibold">Assigned Devices</h2>
        <div className="rounded-md sm:border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-medium">Serial Number</TableHead>
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium">Specifications</TableHead>
                <TableHead className="font-medium">Lease End Date</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Rack</TableHead>
                <TableHead className="font-medium">Shelf</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user
                ? user.assignedDevices.map((device) => (
                    <TableRow key={device.id} data-href="/">
                      <TableCell>
                        <Link href={`/devices/${device.id}`}>
                          {device.serialnumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/devices/${device.id}`}>
                          {device.title}
                        </Link>
                      </TableCell>
                      <TableCell>{device.specifications}</TableCell>
                      <TableCell>
                        {format(new Date(device.leaseEndDate), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>{device.inOutStatus}</TableCell>
                      <TableCell>{device.rack}</TableCell>
                      <TableCell>{device.shelf}</TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assigned Tickets */}
      <div className="w-full lg:col-span-4 mt-8">
        <h2 className="text-xl font-semibold">Assigned Tickets</h2>
        <div className="rounded-md sm:border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium">Description</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Priority</TableHead>
                <TableHead className="font-medium">Due Date</TableHead>
                <TableHead className="font-medium">Updated Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.assignedTickets.map((ticket) => (
                <TableRow key={ticket.id} data-href="/">
                  <TableCell>
                    <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket.id}`}>
                      {ticket.description}
                    </Link>
                  </TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>
                    {ticket.dueDate
                      ? format(new Date(ticket.dueDate), "yyyy-MM-dd")
                      : "N/A"}
                    {/* {ticket.dueDate?.toLocaleDateString() || "N/A"} */}
                  </TableCell>
                  <TableCell>
                    {ticket.updatedAt
                      ? format(new Date(ticket.updatedAt), "yyyy-MM-dd")
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
