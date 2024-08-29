// app\deviceinout\page.tsx

"use client";

import React, { useState } from "react";
import CheckinCheckoutForm from "./CheckinCheckout";
import BulkCheckInCheckoutForm from "./BulkCheckInCheckout";
import ChangeStateSubstateForm from "../devices/statussubstatus/ChangeStateSubstateForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import BulkDeviceAddExampleInputFile from "../devices/new/BulkDeviceAddExampleInputFile";

// Unauthorized users will be redirected by the middleware (middleware.ts) before they can access this page.
const DeviceInOutPage = () => {
  const [notFoundSerials, setNotFoundSerials] = useState<string[]>([]);
  const [processedSerials, setProcessedSerials] = useState<string[]>([]);
  const [invalidRackShelfSerials, setInvalidRackShelfSerials] = useState<
    string[]
  >([]);

  const notProcessedSerials = [...notFoundSerials, ...invalidRackShelfSerials];

  return (
    <>
      <div>
        <h1 className="mx-4 my-10 font-extrabold">Device Check-in/Check-out</h1>
        <CheckinCheckoutForm />
      </div>

      <div>
        <h1 className="mx-4 my-10 font-extrabold">
          Change State/Substate of Devices using an Excel File
        </h1>
        <ChangeStateSubstateForm />
      </div>

      <div className="lg:grid lg:grid-cols-2">
        <h1 className="mx-4 my-10 font-extrabold">
          Change Rack or Shelf or do Check-in/Check-out in Bulk
        </h1>
      </div>
      <div className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <BulkCheckInCheckoutForm
          setNotFoundSerials={setNotFoundSerials}
          setProcessedSerials={setProcessedSerials}
          setInvalidRackShelfSerials={setInvalidRackShelfSerials}
        />
      </div>

      {notProcessedSerials.length > 0 || processedSerials.length > 0 ? (
        <Table className="min-w-full mt-4">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold">Processed Serials</TableHead>
              <TableHead className="font-bold">Not Processed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="align-top">
                <ul className="list-disc list-inside">
                  {processedSerials.map((serial: string) => (
                    <li key={serial}>{serial}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="align-top">
                <ul className="list-disc list-inside">
                  {notProcessedSerials.map((serial: string) => (
                    <li key={serial}>{serial}</li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
          <h2 className="font-extrabold">Created by Ajmal Khan</h2>
        </div>
      )}
      <div className="rounded-md border w-full p-4">
        <BulkDeviceAddExampleInputFile />
      </div>
    </>
  );
};

export default DeviceInOutPage;
