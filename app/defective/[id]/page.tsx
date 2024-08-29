// app\defective\[id]\page.tsx

import React from "react";
import prisma from "@/prisma/db";
import DefectiveDeviceDetail from "./DefectiveDeviceDetail";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

const ViewDefectiveDevice = async ({ params }: Props) => {
  const session = await getServerSession(options);

  const defectiveDevice = await prisma.defectiveDevice.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      device: true, // Assuming a relation to the device table, if applicable
    },
  });

  if (!defectiveDevice) {
    return <p className="text-destructive">Defective Device Not Found!</p>;
  }

  // Parse dates as Date objects before passing them to the component
  const formattedDefectiveDevice = {
    ...defectiveDevice,
    createdAt: defectiveDevice.createdAt
      ? new Date(defectiveDevice.createdAt)
      : new Date(),
    updatedAt: defectiveDevice.updatedAt
      ? new Date(defectiveDevice.updatedAt)
      : new Date(),
    dateCourierReceivedAsset: defectiveDevice.dateCourierReceivedAsset
      ? new Date(defectiveDevice.dateCourierReceivedAsset)
      : new Date(),
    dateWHReceivedAsset: defectiveDevice.dateWHReceivedAsset
      ? new Date(defectiveDevice.dateWHReceivedAsset)
      : new Date(),
  };

  return (
    <DefectiveDeviceDetail
      defectiveDevice={formattedDefectiveDevice}
      userRole={session?.user.role ?? null}
    />
  );
};

export default ViewDefectiveDevice;
