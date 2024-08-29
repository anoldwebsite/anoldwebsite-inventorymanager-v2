// app\api\tickets\[id]\route.ts
import { ticketSchema, ticketPatchSchema } from "@/validationSchemas/ticket";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../../auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  // We have a session but is it the admin or technician who is trying to edit a ticket?
  // A technician and an admin can edit the ticket but not a user.
  if (session.user.role === "USER") {
    return NextResponse.json(
      { error: "Only an ADMIN or a TECH can edit a ticket!" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const validation = ticketPatchSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found!" }, { status: 404 });
  }

  // Ensure null is correctly handled for unassigning a ticket
  if (body?.assignedToUserId === 0) {
    body.assignedToUserId = null;
  }

  try {
    const updateTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        ...body,
      },
    });
    return NextResponse.json(updateTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to assign/unassign ticket!" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  // We have a session but is the admin who is trying to delete a ticket?
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }

  const ticketId = parseInt(params.id, 10);

  if (isNaN(ticketId)) {
    return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
  }

  try {
    await prisma.$transaction([
      prisma.worknote.deleteMany({
        where: { ticketId: ticketId },
      }),
      prisma.ticket.delete({
        where: { id: ticketId },
      }),
    ]);

    return NextResponse.json({
      message: "Ticket Deleted Successfully!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while deleting the ticket." },
      { status: 500 }
    );
  }
}

/* 
export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated!" }, { status: 401 });
  }

  // We have a session but is the admin who is trying to delete a ticket?
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
  }

  await prisma.ticket.delete({
    where: { id: ticket.id },
  });

  return NextResponse.json({
    message: "Ticket Deleted Successfully!",
  });
}
 */
