// components\Searchbar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchItem = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const handleChange = (query: string) => {
    const params = new URLSearchParams(searchParams as any); // Explicitly cast to any
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <Input
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search by typing here ..."
    />
  );
};

export default SearchItem;
