import React from "react";
import dynamic from "next/dynamic";
import prisma from "@/prisma/db";

interface Props {
  params: { id: string };
}

// ssr means server side rendering.
const DeviceForm = dynamic(() => import("@/components/DeviceForm"), {
  ssr: false,
});

const EditDevice = async ({ params }: Props) => {
  const device = await prisma?.device.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!device) {
    return <p className="text-destructive">Device not found!</p>;
  }
  return <DeviceForm device={device} />;
};

export default EditDevice;
