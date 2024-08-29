import React from "react";
import prisma from "@/prisma/db";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import StatusFilter from "@/components/StatusFilter";
import TicketAssignStatusFilter from "@/components/TicketAssignStatusFilter";
import { Role, Status, Ticket } from "@prisma/client";
import TicketsTable from "./TicketsTable";

export interface SearchParams {
  status: Status;
  page: string;
  orderBy: keyof Ticket;
  ticketAssignStatus: string; // Keep as string
}

const Tickets = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10;
  const page = parseInt(searchParams.page) || 1;
  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  let where: any = {};

  if (status) {
    where.status = status;
  } else {
    where.NOT = [
      { status: "CLOSED" as Status },
      { status: "CANCELLED" as Status },
    ];
  }

  if (searchParams.ticketAssignStatus === "UNASSIGNED") {
    where.assignedToUser = null;
  } else if (
    searchParams.ticketAssignStatus &&
    searchParams.ticketAssignStatus !== "ALL"
  ) {
    where.assignedToUserId = parseInt(searchParams.ticketAssignStatus); // Convert to integer
  }

  const ticketcount = await prisma.ticket.count({ where });
  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      assignedToUser: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.TECH, Role.ADMIN],
      },
    },
  });

  return (
    <div>
      <div className="flex gap-2">
        <Link
          href="/tickets/new"
          className={buttonVariants({ variant: "default" })}
        >
          Create a ticket
        </Link>
        <StatusFilter />
        <TicketAssignStatusFilter users={users} />
      </div>
      <TicketsTable
        tickets={tickets}
        users={users}
        searchParams={searchParams}
      />
      <Pagination
        itemCount={ticketcount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Tickets;
