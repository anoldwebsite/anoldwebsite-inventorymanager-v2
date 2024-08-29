import { z } from "zod";
import {
  InOutStatus,
  DeviceStatus,
  DeviceSubstatus,
  ModelCategory,
} from "@prisma/client";

export const deviceSchema = z.object({
  serialnumber: z.string().min(5, "Serial number is required!").max(255),
  title: z.string().min(2, "A device must have a title.").max(255),
  inOutStatus: z.enum([InOutStatus.CHECKEDIN, InOutStatus.CHECKEDOUT]),
  status: z.enum([
    DeviceStatus.InTransit,
    DeviceStatus.InStock,
    DeviceStatus.InUse,
    DeviceStatus.Missing,
    DeviceStatus.Retired,
    DeviceStatus.OnOrder,
  ]),
  substatus: z.enum([
    DeviceSubstatus.PendingRepair,
    DeviceSubstatus.PendingDisposal,
    DeviceSubstatus.Reserved,
    DeviceSubstatus.Unimaged,
    DeviceSubstatus.Available,
    DeviceSubstatus.Defective,
    DeviceSubstatus.PendingTransfer,
    DeviceSubstatus.Deactivated,
    DeviceSubstatus.None,
  ]),
  rack: z.string().max(255).optional(),
  shelf: z.string().max(255).optional(),
  leaseEndDate: z.date(),
  modelCategory: z.enum([
    ModelCategory.Laptop,
    ModelCategory.Desktop,
    ModelCategory.DesktopMini,
    ModelCategory.Monitor,
    ModelCategory.StandardMonitor,
    ModelCategory.MonitorWithDock,
    ModelCategory.ConferenceMonitor,
    ModelCategory.Dockstation,
    ModelCategory.Tablet,
    ModelCategory.Other,
  ]),
  specifications: z
    .string()
    .min(3, "Specifications of the device and any info about its repair.")
    .max(65535),
  assignedToUserId: z.number().int().nullable().optional(),
  country: z.string().optional(),
  project: z.string().optional(),
});
