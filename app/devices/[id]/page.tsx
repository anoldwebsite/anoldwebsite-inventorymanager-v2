// app/devices/[id]/page.tsx

import React from "react";
import prisma from "@/prisma/db";
import DeviceDetail from "./DeviceDetail";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

const ViewDevice = async ({ params }: Props) => {
  const session = await getServerSession(options);
  const device = await prisma.device.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      assignedToUser: true,
      checkinCheckouts: {
        include: { user: true }, // Include user data in checkinCheckout
      },
      statusSubstatusChanges: {
        include: { user: true }, // Include user data in statusSubstatusChanges
      },
    },
  });

  if (!device) {
    return <p className="text-destructive">Device Not Found!</p>;
  }

  // Parse dates as Date objects before passing them to the component
  const formattedDevice = {
    ...device,
    createdAt: new Date(device.createdAt),
    updatedAt: new Date(device.updatedAt),
    leaseEndDate: new Date(device.leaseEndDate),
  };

  const users = await prisma.user.findMany();

  return (
    <DeviceDetail
      device={formattedDevice}
      users={users}
      userRole={session?.user.role ?? null}
    />
  );
};

export default ViewDevice;
