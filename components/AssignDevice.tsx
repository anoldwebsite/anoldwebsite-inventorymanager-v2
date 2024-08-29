"client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Device, User } from "@prisma/client";
import React, { useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  device: Device;
  users: User[];
}

const AssignDevice = ({ device, users }: Props) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const assignDevice = async (userId: string) => {
    setError(""); // Clear old errors
    setIsAssigning(true);

    try {
      // Assign the device to the user with id equal to userId.
      await axios.patch(`/api/devices/${device.id}`, {
        assignedToUserId: userId === "0" ? 0 : parseInt(userId),
      });

      // If successful, close the dialog if open
      setIsDialogOpen(false);
    } catch (err: any) {
      if (err.response) {
        // Check if the error is from the server
        const errorMessage =
          err.response.data.error || "Unable to assign device!";
        setError(errorMessage);

        // Show dialog with the error message
        if (err.response.data.assignedUser) {
          const assignedUser = err.response.data.assignedUser;
          setDialogMessage(
            `Device is already assigned to user ${assignedUser.username}.`
          );
          setIsDialogOpen(true);
        }
      } else {
        // Handle unexpected errors
        setError("An unexpected error occurred.");
        console.error("Unexpected error assigning device:", err);
      }
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <Select
        defaultValue={device.assignedToUserId?.toString() || "0"}
        onValueChange={assignDevice}
        disabled={isAssigning}
      >
        <SelectTrigger>
          <SelectValue
            placeholder="Select User..."
            defaultValue={device.assignedToUserId?.toString() || "0"}
          ></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Unassign</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Device Assignment Error</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setIsDialogOpen(false)}>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="text-destructive">{error}</p>
    </>
  );
};

export default AssignDevice;
