import prisma from "@/prisma/db";
import { userSchema } from "@/validationSchemas/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not aunthenticated!" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Not authorized! Only ADMIN can create a user!" },
      { status: 401 }
    );
  }
  // Only logged in admins go further from this point onwards.
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }
  // Check for duplicate usernames. Check if the username body.username already exists.
  const duplicate = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });
  /* "409 conflict" error is an HTTP status code wich indicates a conflict between the current state
   of a resource and the client's request to modify or update the resource. 
   */
  if (duplicate) {
    return NextResponse.json(
      { message: "Duplicate Username!" },
      { status: 409 }
    );
  }
  // Hash password supplied by user in the body.password for saving it in the database.
  // we installed bcrypt for this using the command npm i bcryptjs and npm i @types/bcryptjs
  const hashPass = await bcrypt.hash(body.password, 10); // 10 is the salt used to hash the password.
  body.password = hashPass; // Replacing the password in plain text with the hashed one.
  // Create the new user in the database.
  const newUser = await prisma.user.create({
    data: { ...body },
  });
  /* Http status code 201 means that the request was successfully fullfilled and resulted in one 
  or possibly multiple new resources being created. 
  */
  return NextResponse.json(newUser, { status: 201 });
}
