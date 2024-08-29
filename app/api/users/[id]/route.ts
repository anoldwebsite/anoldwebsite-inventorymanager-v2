// app\api\users\[id]\route.ts
import prisma from "@/prisma/db";
import { userSchema } from "@/validationSchemas/users";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";
import { error } from "console";

interface Props {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not autheticated!" }, { status: 401 });
  }

  /*
    Truth Table: Allow if the session user is ADMIN or the user themselves
session.user.role	  session.user.id	  userId	      session.user.role !== "ADMIN"	  session.user.id !== userId	  Condition Result (&&)	    Outcome
"ADMIN"	             Any	            Any	          FALSE	                           Any	                        FALSE	                    Admin can edit any profile
"USER"	             userId	          userId	      TRUE	                           FALSE	                      FALSE	                    User can edit own profile
"USER"	              userId	        Different ID	TRUE	                           TRUE	                        TRUE	                    User cannot edit others'

  */

  const userId = parseInt(params.id);

  // Allow if the session user is ADMIN or the user themselves
  if (session.user.role !== "ADMIN" && session.user.id !== userId) {
    return NextResponse.json({ error: "Not authorized!" }, { status: 403 });
  }

  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found!" }, { status: 404 });
  }

  if (body?.password && body.password != "") {
    const hashpassword = await bcrypt.hash(body.password, 10);
    body.password = hashpassword;
  } else {
    delete body.password;
  }

  // Check if the username is being updated and if it's already taken
  if (user.username !== body.username) {
    const duplicateUserName = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (duplicateUserName) {
      return NextResponse.json(
        { message: "Username is already taken!" },
        { status: 409 }
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { ...body },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not autheticated!" }, { status: 401 });
  }

  // Allow only ADMIN to delete users.
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Not authorized to delete users!" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found!" }, { status: 404 });
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  return NextResponse.json({
    message: "User Deleted Successfully!",
  });
}

export async function GET(request: NextRequest, { params }: Props) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      assignedDevices: true,
      assignedTickets: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found!" }, { status: 404 });
  }

  user.password = ""; // Remove the password before sending the response

  return NextResponse.json(user);
}
