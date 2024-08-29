// app\devices\new\page.tsx
import dynamic from "next/dynamic";
import React from "react";

// ssr = Server Side Rendering
const DeviceForm = dynamic(() => import("@/components/DeviceForm"), {
  ssr: false,
});

const NewDevice = () => {
  return <DeviceForm />;
};

export default NewDevice;
