"use client";

import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { DefectiveDevice } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SearchParams } from "./page"; // Ensures consistency with parent component

interface Props {
  defectiveDevices: DefectiveDevice[];
  searchParams: URLSearchParams;
  itemCount: number;
}

const DefectiveDeviceTable = ({
  defectiveDevices,
  searchParams,
  itemCount,
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const handleMenuClick = (column: string) => {
    setSelectedColumn(column);
    setDropdownOpen(true);
  };

  const handleMenuClose = () => {
    setDropdownOpen(false);
  };

  const handleDownload = async (format: string) => {
    try {
      const paramsObject: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        paramsObject[key] = value;
      });

      const url = `/api/defective-devices/download/${format}`;
      const downloadResponse = await axios.get(url, {
        params: paramsObject,
        responseType: "blob",
      });

      const downloadUrl = window.URL.createObjectURL(
        new Blob([downloadResponse.data])
      );
      const link = document.createElement("a");
      link.href = downloadUrl;

      const fileExtension = format === "excel" ? "xlsx" : format;
      link.setAttribute("download", `defective_devices.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(`Error downloading ${format} file:`, error);
    }
  };

  const renderTableRows = () => {
    return defectiveDevices.map((device) => (
      <TableRow key={device.id}>
        <TableCell>
          <Link href={`/defective/${device.id}`}>{device.serialnumber}</Link>
        </TableCell>
        <TableCell>{device.defectReported}</TableCell>
        <TableCell>
          {device.typeOfRepair?.replace(/([A-Z])/g, " $1").trim()}
        </TableCell>
        <TableCell>
          {device.currentLocation.replace(/([A-Z])/g, " $1").trim()}
        </TableCell>
        <TableCell>
          {device.repairedBy?.replace(/([A-Z])/g, " $1").trim()}
        </TableCell>
        <TableCell>
          {device.dateCourierReceivedAsset
            ? format(new Date(device.dateCourierReceivedAsset), "yyyy-MM-dd")
            : ""}
        </TableCell>
        <TableCell>
          {device.dateWHReceivedAsset
            ? format(new Date(device.dateWHReceivedAsset), "yyyy-MM-dd")
            : ""}
        </TableCell>
        <TableCell>{device.partsReplaced}</TableCell>
        <TableCell>{device.quotationAmount}</TableCell>
      </TableRow>
    ));
  };

  const menuItems = [
    { label: "Download as Excel", onClick: () => handleDownload("excel") },
    { label: "Download as CSV", onClick: () => handleDownload("csv") },
    { label: "Download as JSON", onClick: () => handleDownload("json") },
  ];

  return (
    <div className="w-full mt-5 overflow-x-auto">
      <div className="rounded-md sm:border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {[
                "serialnumber",
                "defectReported",
                "typeOfRepair",
                "currentLocation",
                "repairedBy",
                "dateCourierReceivedAsset",
                "dateWHReceivedAsset",
                "partsReplaced",
                "quotationAmount",
              ].map((column) => (
                <TableHead key={column}>
                  <div className="flex items-center">
                    <Link
                      href={{
                        query: {
                          ...Object.fromEntries(searchParams.entries()),
                          orderBy: column,
                        },
                      }}
                      className="mr-2"
                    >
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div
                          onClick={() => handleMenuClick(column)}
                          className="cursor-pointer ml-2"
                        >
                          <span className="text-lg">&#x22EE;</span>
                        </div>
                      </DropdownMenuTrigger>
                      {dropdownOpen && selectedColumn === column && (
                        <DropdownMenuContent>
                          {menuItems.map((item, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={item.onClick}
                            >
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DefectiveDeviceTable;
