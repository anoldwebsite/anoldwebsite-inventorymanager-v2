// \ticketapp\app\api\tickets\route.ts
import { NextRequest, NextResponse } from "next/server";
import { ticketSchema } from "@/validationSchemas/ticket";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not autenticated" }, { status: 401 });
  }
  // Everyone should be able to create a ticket if logged in. Therefore, commenting the code below.
  /*   // We hae a session but is is the admin who is trying to create a new ticket?
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin!" }, { status: 401 });
  }
 */
  const body = await request.json();
  const validation = ticketSchema.safeParse(body);

  if (!validation.success) {
    //Send formatted error to the user.
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const {
    title,
    description,
    status,
    priority,
    assignmentgroup,
    taskCategory,
    dueDate,
    assignedToUserId,
    deviceId,
  } = body;

  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        status,
        priority,
        assignmentgroup,
        taskCategory,
        dueDate,
        assignedToUserId,
        deviceId,
        createdByUserId: session.user.id, // Use the user ID from the session
      },
    });

    return NextResponse.json({ newTicket }, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the ticket." },
      { status: 500 }
    );
  }
}
