// app\tickets\[id]\page.tsx
import React from "react";
import prisma from "@/prisma/db";
import TicketDetail from "./TicketDetail";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

const ViewTicket = async ({ params }: Props) => {
  const session = await getServerSession(options);

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      assignedToUser: true,
      createdByUser: true,
      worknotes: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!ticket) {
    return <p className="text-destructive">Ticket Not Found!</p>;
  }

  // const users =  await prisma.$executeRaw`SELECT * FROM User where role = "TECH" or role = "ADMIN";`;

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.TECH, Role.ADMIN],
      },
    },
  });

  return (
    <TicketDetail
      ticket={ticket}
      users={users}
      userRole={session?.user.role ?? null}
      userId={session?.user.id ?? null}
    />
  );
};

export default ViewTicket;
