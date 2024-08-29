// app\tickets\new\page.tsx
import dynamic from "next/dynamic";
import React from "react";

// ssr = Server Side Rendering
const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
});

const NewTicket = () => {
  return <TicketForm />;
};

export default NewTicket;
