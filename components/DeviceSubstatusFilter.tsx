"use client";
//DeviceSubstatusFilter.tsx
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import React from "react";
import { DeviceSubstatus } from "@prisma/client";

const deviceStatusOptions: { label: string; value?: string }[] = [
  { label: "All" },
  { label: "Pending Repair", value: DeviceSubstatus.PendingRepair },
  { label: "Pending Disposal", value: DeviceSubstatus.PendingDisposal },
  { label: "Reserved", value: DeviceSubstatus.Reserved },
  { label: "Unimaged", value: DeviceSubstatus.Unimaged },
  { label: "Avialable", value: DeviceSubstatus.Available },
  { label: "Defective", value: DeviceSubstatus.Defective },
  { label: "Pending Transfer", value: DeviceSubstatus.PendingTransfer },
  { label: "Deactivated", value: DeviceSubstatus.Deactivated },
  { label: "None", value: DeviceSubstatus.None },
];

const DeviceSubstatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSubstatus = searchParams.get("substatus") || "";

  return (
    <Select
      value={currentSubstatus}
      onValueChange={(substatus) => {
        const params = new URLSearchParams(searchParams.toString());
        if (substatus && substatus !== "0") {
          params.set("substatus", substatus);
        } else {
          params.delete("substatus");
        }
        // Set the page to 1 after the filter value is changed
        params.set("page", "1");
        router.push(`/devices?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Substatus..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {deviceStatusOptions.map((ss) => (
            <SelectItem key={ss.value || "0"} value={ss.value || "0"}>
              {ss.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceSubstatusFilter;
