import {
  Status,
  Priority,
  AssignmentGroup,
  TaskCategory,
} from "@prisma/client";
import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(1, "A ticket must have a title.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
  status: z
    .enum([
      Status.OPEN,
      Status.STARTED,
      Status.CLOSED,
      Status.PENDING,
      Status.CANCELLED,
    ])
    .optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  assignmentgroup: z
    .enum([
      AssignmentGroup.WAREHOUSE,
      AssignmentGroup.HUB,
      AssignmentGroup.DISPATCH,
      AssignmentGroup.CONSULTANT,
      AssignmentGroup.OTHER,
    ])
    .optional(),
  taskCategory: z
    .enum([
      TaskCategory.IMAGING,
      TaskCategory.INSTALLATION,
      TaskCategory.DEINSTALLATION,
      TaskCategory.DISKKILL,
      TaskCategory.CHECKIN,
      TaskCategory.CHECKOUT,
      TaskCategory.REFURBISHMENT,
      TaskCategory.PALLET,
      TaskCategory.OTHER,
    ])
    .optional(),
  dueDate: z.date().optional(),
  //assignedToUserId: z.number().int().optional(),
  assignedToUserId: z.number().int().nullable().optional(),
  //assignedToUserId: z.union([z.number(), z.null()]).optional(),
  deviceId: z.number().int().optional(),
});

export const ticketPatchSchema = z.object({
  title: z.string().min(1, "A ticket must have a title.").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(65535)
    .optional(),
  status: z
    .enum([
      Status.OPEN,
      Status.STARTED,
      Status.CLOSED,
      Status.PENDING,
      Status.CANCELLED,
    ])
    .optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  assignmentgroup: z
    .enum([
      AssignmentGroup.WAREHOUSE,
      AssignmentGroup.HUB,
      AssignmentGroup.DISPATCH,
      AssignmentGroup.CONSULTANT,
      AssignmentGroup.OTHER,
    ])
    .optional(),
  taskCategory: z
    .enum([
      TaskCategory.IMAGING,
      TaskCategory.INSTALLATION,
      TaskCategory.DEINSTALLATION,
      TaskCategory.DISKKILL,
      TaskCategory.CHECKIN,
      TaskCategory.CHECKOUT,
      TaskCategory.REFURBISHMENT,
      TaskCategory.PALLET,
      TaskCategory.OTHER,
    ])
    .optional(),
  dueDate: z.date().optional(),
  //assignedToUserId: z.number().int().optional(),
  assignedToUserId: z.number().int().nullable().optional(),
  // assignedToUserId: z.union([z.number(), z.null()]).optional(),
  deviceId: z.number().int().optional(),
});
