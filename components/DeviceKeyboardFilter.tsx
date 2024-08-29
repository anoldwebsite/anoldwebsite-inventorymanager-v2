"use client";
//DeviceKeyboardFilter.tsx
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

const deviceKBoptions: { label: string; value?: string }[] = [
  { label: "All" },
  { label: "Swedish", value: " SE" },
  { label: "Danish", value: " DK" },
  { label: "English", value: " INTL" },
  { label: "German", value: " DE" },
];

const DeviceKeyboardFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentKeyboard = searchParams.get("keyboard") || "";

  return (
    <Select
      value={currentKeyboard}
      onValueChange={(keyboard) => {
        const params = new URLSearchParams(searchParams.toString());
        if (keyboard && keyboard !== "0") {
          params.set("keyboard", keyboard);
        } else {
          params.delete("keyboard");
        }
        // Set the page to 1 after the filter value is changed
        params.set("page", "1");
        router.push(`/devices?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Keyboard Lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {deviceKBoptions.map((kbl) => (
            <SelectItem key={kbl.value || "0"} value={kbl.value || "0"}>
              {kbl.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceKeyboardFilter;
