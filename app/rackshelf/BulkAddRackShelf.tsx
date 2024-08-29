// app\rackshelf\BulkAddRackShelf.tsx

"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { RackShelf } from "@/prisma/types";

const BulkAddRackShelf = () => {
  const [records, setRecords] = useState<RackShelf[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedRecords, setFailedRecords] = useState<any[]>([]);
  const router = useRouter();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
            header: 1,
          });

          const records = jsonData.slice(1).map((row) => ({
            country: (row[0] as string).trim().toUpperCase(),
            project: (row[1] as string).trim().toUpperCase(),
            rack: (row[2] as string).trim().toUpperCase(),
            shelf: (row[3] as string).trim().toUpperCase(),
            id: -1, // Temporary ID since we don't have it from the file
            uniqueRackShelf: "", // Temporary unique value since we don't have it from the file
          })) as RackShelf[];

          setRecords(records);
          submitBulkData(records);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setErrorMessage("Error processing file");
      setSuccessMessage(null);
      console.error("Error processing file:", error);
    }
  };

  const submitBulkData = async (records: RackShelf[]) => {
    try {
      const res = await fetch("/api/rackshelf/bulkaddrackshelf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(records),
      });

      if (res.ok) {
        setSuccessMessage("Records added successfully!");
        setErrorMessage(null);
        setFailedRecords([]);
        router.refresh();
      } else {
        const errorData = await res.json();
        setErrorMessage("Some records could not be added.");
        setFailedRecords(errorData.failedRecords || []);
        setSuccessMessage(null);
      }
    } catch (error) {
      setErrorMessage("Error submitting data");
      setSuccessMessage(null);
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="rounded-md border w-full p-4 mb-8">
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {failedRecords.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold">Failed Records</h2>
          <ul className="text-red-500">
            {failedRecords.map((record, index) => (
              <li key={index}>
                {`${record.country}-${record.project}-${record.rack}-${record.shelf}: ${record.reason}`}
              </li>
            ))}
          </ul>
        </div>
      )}
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
            {records.length > 0 ? (
              records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.country}</TableCell>
                  <TableCell>{record.project}</TableCell>
                  <TableCell>{record.rack}</TableCell>
                  <TableCell>{record.shelf}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No data uploaded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BulkAddRackShelf;
