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

const roles: { label: string; value?: string }[] = [
  { label: "User/Technician" },
  { label: "User", value: "USER" },
  { label: "Technician", value: "TECH" },
  { label: "Admin", value: "ADMIN" },
];

const RoleFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get("role") || ""}
      onValueChange={(role) => {
        const params = new URLSearchParams();
        if (role) {
          params.append("role", role);
        }

        const query = params.size ? `?${params.toString()}` : "0";
        router.push(`/users${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Role..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {roles.map((role) => (
            <SelectItem key={role.value || "0"} value={role.value || "0"}>
              {role.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RoleFilter;
