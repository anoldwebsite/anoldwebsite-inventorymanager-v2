// validationSchemas\defectiveDevice.ts

import { z } from "zod";

// Enum definitions that match your Prisma schema
const TypeOfRepairEnum = z.enum(["IW", "OOW", "BOTH", "OTHER"]);
const CurrentLocationEnum = z.enum(["Warehouse", "Courier", "Supplier"]);
const RepairedByEnum = z.enum(["Supplier", "OurTeam", "NotRepaired", "Other"]);

export const DefectiveDeviceSchema = z.object({
  serialnumber: z.string().min(1, "Serial number is required"),
  entryid: z.number().int().optional(), // Change this line to expect an integer
  sendTrackingId: z.string().optional(), // Optional field
  receiveTrackingId: z.string().optional(), // Optional field
  supplierRepairCaseId: z.string().optional(), // Optional field
  defectReported: z.string().min(1, "Defect report is required"),
  typeOfRepair: TypeOfRepairEnum.optional(), // Optional field
  dateCourierReceivedAsset: z.date().optional(), // Optional field
  dateWHReceivedAsset: z.date().optional(), // Optional field
  currentLocation: CurrentLocationEnum,
  partsReplaced: z.string().optional(), // Optional field, could be JSON or a string representation
  notes: z.string().optional(), // Optional field
  quotationAmount: z.number().optional(), // Optional field
  repairedBy: RepairedByEnum.optional(), // Optional field
  deviceId: z.number().int().optional(), // Make deviceId optional here
});
