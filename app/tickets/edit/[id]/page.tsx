import React from "react";
import dynamic from "next/dynamic";
import prisma from "@/prisma/db";

interface Props {
  params: { id: string };
}

// ssr means server side rendering.
const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
});

const EditTicket = async ({ params }: Props) => {
  const ticket = await prisma?.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return <p className="text-destructive">Ticekt not found!</p>;
  }

  return <TicketForm ticket={ticket} />;
};

export default EditTicket;
