// To do
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

/*
These have been taken from the column rack from the table rackshelf.
INFOSYSEON_DK_MAIN
INFOSYSEON_SE_DEFECTIVE
INFOSYSEON_SE_MAIN
INFOSYSEON_SE_PRESTAGING
INFOSYSEON_SE_RETURN
INFOSYSEON_SE_STAGING
INFOSYSEON_PL_RETURN"
*/

const racks: { label: string; Value?: string }[] = [
  { label: "All Racks/Lager" },
  { label: "INFOSYSEON_SE_RETURN", Value: "INFOSYSEON_SE_RETURN" },
  { label: "INFOSYSEON_SE_MAIN", Value: "INFOSYSEON_SE_MAIN" },
  { label: "INFOSYSEON_DK_MAIN", Value: "INFOSYSEON_DK_MAIN" },
  { label: "INFOSYSEON_SE_STAGING", Value: "INFOSYSEON_SE_STAGING" },
  { label: "INFOSYSEON_SE_PRESTAGING", Value: "INFOSYSEON_SE_PRESTAGING" },
  { label: "INFOSYSEON_SE_DEFECTIVE", Value: "INFOSYSEON_SE_DEFECTIVE" },
  { label: "Sent to the Polish Warehouse", Value: "INFOSYSEON_PL_RETURN" },
  { label: "No Rack/Lager assigned", Value: "NULL_PLACEHOLDER" },
];

const RackFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get("rack") || ""}
      onValueChange={(rack) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", "1"); // Reset to page 1 when filter changes

        if (rack) {
          params.set("rack", rack);
        } else {
          params.delete("rack");
        }

        const query = params.size ? `?${params.toString()}` : "";
        router.push(`/devices${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Rack/Lager..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {racks.map((rack) => (
            <SelectItem key={rack.Value || "0"} value={rack.Value || "0"}>
              {rack.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RackFilter;
