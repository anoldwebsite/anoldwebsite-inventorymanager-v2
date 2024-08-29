// components\LeaseDateFilter.tsx
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
import React from "react";

const leaseDateOptions: { label: string; value?: string }[] = [
  { label: "All" },
  { label: "6 months or greater", value: ">=6" },
  { label: "18 months or greater", value: ">=18" },
  { label: "less than 6 months", value: "<6" },
  { label: "< 18 months but > 6 months", value: "<18>6" },
];

const LeaseDateFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLeaseDateFilter = searchParams.get("leaseEndDate") || "";

  const handleValueChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter && filter !== "0") {
      params.set("leaseEndDate", filter);

      // Apply predefined filters except when "less than 6 months" is selected
      params.set("status", "InStock");

      if (filter === "<6") {
        // If "less than 6 months" is selected, reset substatus to "All"
        params.delete("substatus");
      } else {
        // Otherwise, apply the predefined substatus filter
        params.set("substatus", "Available");
      }

      params.set("inOutStatus", "CHECKEDIN");

      // Set sorting parameters
      params.set("orderBy", "leaseEndDate");
      params.set("orderDirection", "asc"); // You can change this to "desc" if needed
    } else {
      // Remove the filter and the predefined filters when "All" is selected
      params.delete("leaseEndDate");
      params.delete("status");
      params.delete("substatus");
      params.delete("inOutStatus");

      // Remove sorting parameters
      params.delete("orderBy");
      params.delete("orderDirection");
    }

    // Set the page to 1 after the filter value is changed
    params.set("page", "1");

    router.push(`/devices?${params.toString()}`);
  };

  return (
    <Select value={currentLeaseDateFilter} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter Lease Date" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {leaseDateOptions.map((option) => (
            <SelectItem key={option.value || "0"} value={option.value || "0"}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LeaseDateFilter;
