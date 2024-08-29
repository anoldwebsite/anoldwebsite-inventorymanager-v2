// app\users\[id]\page.tsx
import React from "react";
import prisma from "@/prisma/db";
import UserDetail from "./UserDetail";

interface Props {
  params: { id: string };
}

const ViewUser = async ({ params }: Props) => {
  const user = await prisma?.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      assignedDevices: true,
      assignedTickets: true,
    },
  });

  if (!user) {
    return <p className="text-destructive">User Not Found!</p>;
  }

  user.password = "";
  return <UserDetail user={user} />;
};

export default ViewUser;
