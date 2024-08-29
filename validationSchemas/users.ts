import { z } from "zod";
import { Role } from "@prisma/client";
import { deviceSchema } from "./device";
import { ticketSchema } from "./ticket";

export const userSchema = z.object({
  name: z.string().min(2, "Name is required!").max(255),
  username: z.string().min(3, "Username is required!").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long!")
    .max(255)
    .optional() // We make it optional so that when we update a User, we don't have to update the password.
    .or(z.literal("")), //This is a little workaround for passing a blank password when updating a user without updating the password.
  role: z.enum([Role.ADMIN, Role.TECH, Role.USER]),
  assignedDevices: z.array(deviceSchema).optional(),
  assignedTickets: z.array(ticketSchema).optional(),
});
