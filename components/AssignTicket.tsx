"use client";

import { Ticket, User } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

type TicketWithAssignedUser = Ticket & {
  assignedToUser: User | null;
};

interface Props {
  ticket: TicketWithAssignedUser;
  users: User[];
}

const AssignTicket = ({ ticket, users }: Props) => {
  const router = useRouter();
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const assignTicket = async (userId: string) => {
    setError(""); // Clear out old errors.
    setIsAssigning(true);
    try {
      await axios.patch(`/api/tickets/${ticket.id}`, {
        assignedToUserId: userId === "0" ? null : parseInt(userId),
      });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setError("Unable to assign ticket!");
    } finally {
      setIsAssigning(false);
    }
  };

  const isEditable =
    ticket.status !== "CLOSED" && ticket.status !== "CANCELLED";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={!isEditable}>
            {ticket.assignedToUser?.name || "Unassigned"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          {isEditable ? (
            <Select
              defaultValue={ticket.assignedToUserId?.toString() || "0"}
              onValueChange={assignTicket}
              disabled={isAssigning}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select User..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Unassign</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div>
              <p>Assigned to: {ticket.assignedToUser?.name || "Unassigned"}</p>
              <p>
                This ticket is {ticket.status.toLowerCase()} and cannot be
                reassigned.
              </p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignTicket;
