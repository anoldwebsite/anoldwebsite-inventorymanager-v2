"use client";
//DeviceCategoryFilter.tsx
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
import { ModelCategory } from "@prisma/client";

const modelCategoryOptions: { label: string; value?: string }[] = [
  { label: "Select Category" },
  { label: "Laptop", value: ModelCategory.Laptop },
  { label: "Tablet", value: ModelCategory.Tablet },
  { label: "Desktop/Workstation", value: ModelCategory.Desktop },
  { label: "Desktop Mini", value: ModelCategory.DesktopMini },
  { label: "Standard Monitor", value: ModelCategory.StandardMonitor },
  { label: "Monitor", value: ModelCategory.Monitor },
  { label: "Monitor with Dock", value: ModelCategory.MonitorWithDock },
  { label: "Conference Monitor", value: ModelCategory.ConferenceMonitor },
  { label: "Dockstation", value: ModelCategory.Dockstation },
  { label: "Other", value: ModelCategory.Other },
];

const DeviceCategoryFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentModelCategory = searchParams.get("modelCategory") || "";

  return (
    <Select
      value={currentModelCategory}
      onValueChange={(modelCategory) => {
        const params = new URLSearchParams(searchParams.toString());
        if (modelCategory && modelCategory !== "0") {
          params.set("modelCategory", modelCategory);
        } else {
          params.delete("modelCategory");
        }
        // Set the page to 1 after the filter value is changed
        params.set("page", "1");
        router.push(`/devices?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {modelCategoryOptions.map((category) => (
            <SelectItem
              key={category.value || "0"}
              value={category.value || "0"}
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceCategoryFilter;
