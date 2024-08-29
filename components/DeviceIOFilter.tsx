"use client";
//DeviceIOFilter.tsx
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

const inOutStatusOptions: { label: string; value?: string }[] = [
  { label: "Select check-in/out" },
  { label: "Checkedin", value: "CHECKEDIN" },
  { label: "Checkedout", value: "CHECKEDOUT" },
];

const DeviceIOFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentInOutStatus = searchParams.get("inOutStatus") || "";

  return (
    <Select
      value={currentInOutStatus}
      onValueChange={(inOutStatus) => {
        const params = new URLSearchParams(searchParams.toString());
        if (inOutStatus && inOutStatus !== "0") {
          params.set("inOutStatus", inOutStatus);
        } else {
          params.delete("inOutStatus");
        }
        // Set the page to 1 after the filter value is changed
        params.set("page", "1");
        router.push(`/devices?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Check-in/out" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {inOutStatusOptions.map((status) => (
            <SelectItem key={status.value || "0"} value={status.value || "0"}>
              {status.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceIOFilter;
