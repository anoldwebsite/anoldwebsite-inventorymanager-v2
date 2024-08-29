// app\defective\[id]\DefectiveDeviceDetail.tsx

"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { DefectiveDevice, Role } from "@prisma/client";

interface Props {
  userRole: Role;
  defectiveDevice: DefectiveDevice & {
    // Add any necessary relations here if applicable
  };
}

const DefectiveDeviceDetail = ({ defectiveDevice, userRole }: Props) => {
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (defectiveDevice.createdAt)
      setCreatedAt(new Date(defectiveDevice.createdAt));
    if (defectiveDevice.updatedAt)
      setUpdatedAt(new Date(defectiveDevice.updatedAt));
  }, [defectiveDevice]);

  if (!createdAt || !updatedAt) {
    return null;
  }

  return (
    <div className="lg:grid lg:grid-cols-4" key={defectiveDevice.id}>
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-3"></div>
          <CardTitle>{`Defective Device ID: ${defectiveDevice.id}`}</CardTitle>
          <CardDescription>
            <div className="text-xl shadow-lg">
              <div>
                Serialnumber:{" "}
                {defectiveDevice.serialnumber
                  ? defectiveDevice.serialnumber
                  : "No Info about Serialnumber!"}
              </div>
              <div>
                Defect Reported:{" "}
                {defectiveDevice.defectReported
                  ? defectiveDevice.defectReported
                  : "No defect reported!"}
              </div>
              <div>
                Type of Repair:{" "}
                {defectiveDevice.typeOfRepair
                  ? defectiveDevice.typeOfRepair
                  : "Not specified"}
              </div>
              <div>
                Current Location:{" "}
                {defectiveDevice.currentLocation
                  ? defectiveDevice.currentLocation
                  : "No Info about Location!"}
              </div>
              <div>
                Date Courier Received Asset:{" "}
                {defectiveDevice.dateCourierReceivedAsset
                  ? format(
                      new Date(defectiveDevice.dateCourierReceivedAsset),
                      "yyyy-MM-dd HH:mm:ss"
                    )
                  : "Not specified"}
              </div>
              <div>
                Date Warehouse Received Asset:{" "}
                {defectiveDevice.dateWHReceivedAsset
                  ? format(
                      new Date(defectiveDevice.dateWHReceivedAsset),
                      "yyyy-MM-dd HH:mm:ss"
                    )
                  : "Not specified"}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <div>Additional Notes: {defectiveDevice.notes || "None"}</div>
        </CardContent>
        <CardFooter>
          <div>
            <div>
              Created:{" "}
              {createdAt.toLocaleDateString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
            <div>
              Updated:{" "}
              {updatedAt.toLocaleDateString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </CardFooter>
      </Card>
      <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2">
        {userRole === "ADMIN" && (
          <>
            <Link
              href={`/defective/edit/${defectiveDevice.id}`}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              Edit Defective Device
            </Link>
            {/* Assuming you might need a delete button */}
            <Link
              href={`/defective/delete/${defectiveDevice.id}`}
              className={`${buttonVariants({ variant: "destructive" })}`}
            >
              Delete Defective Device
            </Link>
          </>
        )}
      </div>
      {/* Additional tables or data can be added here if needed */}
    </div>
  );
};

export default DefectiveDeviceDetail;
