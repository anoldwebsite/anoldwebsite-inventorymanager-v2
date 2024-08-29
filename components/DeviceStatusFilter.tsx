"use client";
//DeviceStatusFilter.tsx
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
import { DeviceStatus } from "@prisma/client";

const deviceStatusOptions: { label: string; value?: string }[] = [
  { label: "All" },
  { label: "In Transit", value: DeviceStatus.InTransit },
  { label: "In Stock", value: DeviceStatus.InStock },
  { label: "In Use", value: DeviceStatus.InUse },
  { label: "Missing", value: DeviceStatus.Missing },
  { label: "Retired", value: DeviceStatus.Retired },
  { label: "On Order", value: DeviceStatus.OnOrder },
];

const DeviceStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "";

  return (
    <Select
      value={currentStatus}
      onValueChange={(status) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status && status !== "0") {
          params.set("status", status);
        } else {
          params.delete("status");
        }
        // Set the page to 1 after the filter value is changed
        params.set("page", "1");
        router.push(`/devices?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {deviceStatusOptions.map((s) => (
            <SelectItem key={s.value || "0"} value={s.value || "0"}>
              {s.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceStatusFilter;
