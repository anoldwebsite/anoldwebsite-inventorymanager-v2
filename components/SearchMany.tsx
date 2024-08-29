// components/SearchMany.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SearchMany = () => {
  const [serialNumbers, setSerialNumbers] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSerialNumbers(e.target.value);
  };

  const handleSearch = () => {
    const serials = serialNumbers
      .split(/\r?\n/)
      .map((serial) => serial.trim())
      .filter(Boolean);
    if (serials.length > 0) {
      const params = new URLSearchParams();
      serials.forEach((serial) => params.append("serialnumber", serial));
      router.push(`/devices?${params.toString()}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gray-800 rounded-lg">
      <Textarea
        value={serialNumbers}
        onChange={handleInputChange}
        placeholder="Paste serial numbers here, one per line..."
        rows={5}
        className="flex-grow bg-gray-700 text-white border-none"
      />
      <Button onClick={handleSearch} className="self-stretch sm:self-center">
        Search Devices
      </Button>
    </div>
  );
};

export default SearchMany;
