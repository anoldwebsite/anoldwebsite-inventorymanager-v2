import { Status } from "@prisma/client";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  status: Status;
}

/*
In TypeScript, the Record utility type allows you to define an object type where the keys are of a certain type (Status in this case) and the values are of another type (an object with label and color properties in this example).

statusMap: This is an object that conforms to the type specified by Record. It maps each status (e.g., "OPEN", "STARTED") to an object with label and color properties.

By using Record, you ensure that statusMap follows a specific structure, providing type safety and allowing TypeScript to enforce constraints on the keys and values of the object.
*/
const statusMap: Record<
  Status,
  {
    label: string;
    color: "bg-purple-400" | "bg-yellow-400" | "bg-green-400" | "bg-red-800";
  }
> = {
  OPEN: { label: "Open", color: "bg-purple-400" },
  STARTED: { label: "Started", color: "bg-yellow-400" },
  CLOSED: { label: "Closed", color: "bg-green-400" },
  PENDING: { label: "Pending", color: "bg-yellow-400" },
  CANCELLED: { label: "Cancelled", color: "bg-red-800" },
};

const TicketStatusBadge = ({ status }: Props) => {
  // Add a fallback for invalid or undefined status values
  const statusInfo = statusMap[status] || {
    color: "bg-gray-200",
    label: "Unknown",
  };

  return (
    <Badge
      className={`${statusInfo.color} text-background hover:${statusInfo.color}`}
    >
      {statusInfo.label}
    </Badge>
  );
};

export default TicketStatusBadge;
