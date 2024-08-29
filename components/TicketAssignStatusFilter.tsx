"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { User } from "@prisma/client";

export enum TicketAssignmentStatus {
  ALL = "ALL",
  UNASSIGNED = "UNASSIGNED",
}

const TicketAssignStatusFilter = ({ users }: { users: User[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={
        searchParams.get("ticketAssignStatus") || TicketAssignmentStatus.ALL
      }
      onValueChange={(ticketAssignStatus) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", "1"); // Reset to page 1 when filter changes

        if (ticketAssignStatus !== TicketAssignmentStatus.ALL) {
          params.set("ticketAssignStatus", ticketAssignStatus);
        } else {
          params.delete("ticketAssignStatus");
        }

        const query = params.size ? `?${params.toString()}` : "";
        router.push(`/tickets${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Assigned/Unassigned..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={TicketAssignmentStatus.ALL}>
            All Tickets
          </SelectItem>
          <SelectItem value={TicketAssignmentStatus.UNASSIGNED}>
            Unassigned
          </SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TicketAssignStatusFilter;
