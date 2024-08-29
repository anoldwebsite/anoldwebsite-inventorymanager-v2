// app\defective\edit\[id]\page.tsx

import React from "react";
import dynamic from "next/dynamic";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

// Dynamically import the DefectiveDeviceForm with server-side rendering disabled
const DefectiveDeviceForm = dynamic(
  () => import("@/app/defective/DefectiveDeviceForm"),
  {
    ssr: false,
  }
);

const EditDefectiveDevice = async ({ params }: Props) => {
  // Get the session to check the user's role
  const session = await getServerSession(options);

  // Check if the user is logged in and has the appropriate role
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "TECH")
  ) {
    return (
      <p className="text-destructive">
        You are not authorized to edit this defective device.
      </p>
    );
  }

  // Find the defective device in the database
  const defectiveDevice = await prisma?.defectiveDevice.findUnique({
    where: { id: parseInt(params.id) },
  });

  // If no defective device is found, show an error message
  if (!defectiveDevice) {
    return <p className="text-destructive">Defective Device not found!</p>;
  }

  // Render the form for editing the defective device
  return <DefectiveDeviceForm defectiveDevice={defectiveDevice} />;
};

export default EditDefectiveDevice;
