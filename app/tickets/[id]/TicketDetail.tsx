// app\tickets\[id]\TicketDetail.tsx"use client";

import React from "react";
import { Role, Ticket, User, Worknote } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TicketStatusBadge from "@/components/TicketStatusBadge";
import TicketPriority from "@/components/TicketPriority";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ReactMarkDown from "react-markdown";
import DeleteButton from "./DeleteButton";
import AssignTicket from "@/components/AssignTicket";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddWorknote from "@/components/AddWorknote";

type TicketWithRelations = Ticket & {
  assignedToUser: User | null;
  createdByUser: User;
  worknotes: (Worknote & { user: User })[];
};

interface Props {
  ticket: TicketWithRelations;
  users: User[];
  userRole: Role;
  userId: number;
}

const TicketDetail = ({ ticket, users, userRole, userId }: Props) => {
  const canViewWorknotes = (worknote: Worknote) => {
    return (
      userRole === "ADMIN" ||
      userRole === "TECH" ||
      (ticket.createdByUser.id === userId && worknote.customervisible)
    );
  };

  return (
    <div className="lg:grid lg:grid-cols-4">
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-3">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriority priority={ticket.priority} />
          </div>
          <CardTitle>{ticket.title}</CardTitle>
          <CardDescription>
            Created:{" "}
            {ticket.createdAt.toLocaleDateString("en-us", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            by {ticket.createdByUser.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <ReactMarkDown>{ticket.description}</ReactMarkDown>
        </CardContent>
        <CardFooter>
          Updated:{" "}
          {ticket.updatedAt.toLocaleDateString("en-us", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </CardFooter>
      </Card>
      <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2 lg:col-span-1">
        {(userRole === "ADMIN" || userRole === "TECH") && (
          <>
            <AssignTicket ticket={ticket} users={users} />
            <Link
              href={`/tickets/edit/${ticket.id}`}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              Edit Ticket
            </Link>
            <DeleteButton ticketId={ticket.id} />
          </>
        )}
      </div>
      {userRole === "ADMIN" ||
      userRole === "TECH" ||
      ticket.createdByUser.id === userId ? (
        <>
          <div className="lg:col-span-4">
            <AddWorknote
              ticketId={ticket.id}
              userRole={userRole}
              userId={userId}
            />
          </div>
          <Card className="mx-4 mt-4 lg:col-span-4 lg:mx-0">
            <CardHeader>
              <CardTitle>Worknotes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Author and Date</TableHead>
                      <TableHead className="w-3/4">Content</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticket.worknotes
                      .filter(canViewWorknotes)
                      .map((worknote) => (
                        <TableRow key={worknote.id}>
                          <TableCell className="w-1/4">
                            <div>{worknote.user.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(worknote.createdAt).toLocaleDateString(
                                "en-us",
                                {
                                  year: "2-digit",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="w-3/4">
                            {worknote.content}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default TicketDetail;
