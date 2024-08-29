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

const statuses: { label: string; Value?: string }[] = [
  { label: "Open / Started" },
  { label: "Open", Value: "OPEN" },
  { label: "Started", Value: "STARTED" },
  { label: "Closed", Value: "CLOSED" },
  { label: "Cancelled", Value: "CANCELLED" },
];

const StatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get("status") || ""}
      onValueChange={(status) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", "1"); // Reset to page 1 when filter changes

        if (status) {
          params.set("status", status);
        } else {
          params.delete("status");
        }

        const query = params.size ? `?${params.toString()}` : "";
        router.push(`/tickets${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statuses.map((status) => (
            <SelectItem key={status.Value || "0"} value={status.Value || "0"}>
              {status.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
