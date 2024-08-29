// components\CountryDeviceFilter.tsx
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
import { countryOptions } from "@/components/countries";

const CountryFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get("country") || ""}
      onValueChange={(country) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", "1"); // Reset to page 1 when filter changes

        if (country === "0") {
          // If "All" is selected, remove the country filter
          params.delete("country");
        } else if (country) {
          // If a specific country is selected, set the country filter
          params.set("country", country);
        } else {
          params.delete("country");
        }

        const query = params.size ? `?${params.toString()}` : "";
        router.push(`/devices${query}`);
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Country..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {countryOptions.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CountryFilter;
