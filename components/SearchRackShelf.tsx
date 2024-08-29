// components\SearchRackShelf.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RackShelf } from "@/prisma/types"; // Ensure you have defined the RackShelf type in types.ts
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

const SearchRackShelf = () => {
  const [results, setResults] = useState<RackShelf[]>([]);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const query = searchParams.get("query") || "";

  const fetchResults = async (query: string) => {
    try {
      const res = await fetch(`/api/rackshelf/searchrackshelf?query=${query}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults(query);
    } else {
      setResults([]);
    }
  }, [query]);

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
    <div className="rounded-md border w-full p-4 mb-8">
      <Input
        defaultValue={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search for a rack or shelf..."
      />
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Rack</TableHead>
              <TableHead>Shelf</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.country}</TableCell>
                  <TableCell>{result.project}</TableCell>
                  <TableCell>{result.rack}</TableCell>
                  <TableCell>{result.shelf}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SearchRackShelf;
