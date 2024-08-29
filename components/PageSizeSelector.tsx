"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const numRows = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

const PageSizeSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get("rows") || "10"}
      onValueChange={(rows) => {
        const params = new URLSearchParams(searchParams.toString());
        if (rows) {
          params.set("pageSize", rows);
        } else {
          params.set("pageSize", "10");
        }
        params.set("page", "1"); // Reset to first page
        router.push("?" + params.toString());
        //const query = params.toString() ? `?${params.toString()}` : "";
        // router.push(`/devices${query}`); // Update with your page path
      }}
    >
      <SelectTrigger className="w-[75px]">
        <SelectValue placeholder="Rows Per Page" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {numRows.map((numRow) => (
            <SelectItem key={numRow.value} value={numRow.value}>
              {numRow.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PageSizeSelector;
