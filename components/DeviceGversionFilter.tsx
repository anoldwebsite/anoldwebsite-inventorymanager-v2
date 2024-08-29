"use client";
//DeviceGversion.tsx
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

const deviceGoptions: { label: string; value?: string }[] = [
  { label: "All" },
  { label: "G7", value: "G7" },
  { label: "G8", value: "G8" },
  { label: "G9", value: "G9" },
  { label: "G10", value: "G10" },
  { label: "G11", value: "G11" },
  { label: "G12", value: "G12" },
];

const DeviceGversionFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGversion = searchParams.get("gversion") || "";

  return (
    <Select
      value={currentGversion}
      onValueChange={(gversion) => {
        const params = new URLSearchParams(searchParams.toString());
        if (gversion && gversion !== "0") {
          params.set("gversion", gversion);
        } else {
          params.delete("gversion");
        }
        // Set the page to 1 after the filter value is changed
        params.set("page", "1");
        router.push(`/devices?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Filter by G" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {deviceGoptions.map((g) => (
            <SelectItem key={g.value || "0"} value={g.value || "0"}>
              {g.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceGversionFilter;
