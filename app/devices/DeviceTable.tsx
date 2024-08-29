// app\devices\DeviceTable.tsx

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
import { Device } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { ArrowDown } from "lucide-react";
import { SearchParams } from "./page";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { object } from "zod";
import { Value } from "@radix-ui/react-select";

interface Props {
  devices: Device[];
  searchParams: URLSearchParams;
  groupedData: Record<string, Device[]> | null;
  itemCount: number;
}

const DeviceTable = ({
  devices,
  searchParams,
  groupedData: initialGroupedData,
  itemCount,
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [groupedData, setGroupedDataState] = useState<Record<
    string,
    Device[]
  > | null>(initialGroupedData);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const handleMenuClick = (column: string) => {
    setSelectedColumn(column);
    setDropdownOpen(true);
  };

  const handleMenuClose = () => {
    setDropdownOpen(false);
  };

  const handleGroupBy = async (column: keyof Device) => {
    console.log("Group By triggered for column:", column);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const response = await axios.get("/api/devices/grouping", {
        params: { ...params, groupBy: column },
      });

      const groupedData: Record<string, Device[]> = response.data;
      console.log(`Grouped data by ${column}:`, groupedData);

      setGroupedDataState(groupedData);
      setSelectedColumn(column);
      setExpandedGroups(new Set());
      handleMenuClose();
    } catch (error) {
      console.error(`Error grouping data by ${column}:`, error);
    }
  };

  const handleGroupToggle = (group: string) => {
    setExpandedGroups((prevExpandedGroups) => {
      const newExpandedGroups = new Set(prevExpandedGroups);
      if (newExpandedGroups.has(group)) {
        newExpandedGroups.delete(group);
      } else {
        newExpandedGroups.add(group);
      }
      return newExpandedGroups;
    });
  };

  const menuItems = [
    { label: "Download as Excel", onClick: () => handleDownload("excel") },
    { label: "Download as CSV", onClick: () => handleDownload("csv") },
    { label: "Download as JSON", onClick: () => handleDownload("json") },
  ];

  const handleDownload = async (format: string) => {
    try {
      // Initialize an empty object for query parameters
      const paramsObject: Record<string, string> = {};

      // Manually populate the paramsObject
      searchParams.forEach((filterPassed) => {
        const key = filterPassed[0];
        const value = filterPassed[1];
        paramsObject[key] = value;
      });

      // console.log("Params Object:", paramsObject); // Debug: Check the params object

      // Construct the URL for the download endpoint
      const url = `/api/devices/download/${format}`;

      // Send the request to the server
      const downloadResponse = await axios.get(url, {
        params: paramsObject, // Correctly formatted params object
        responseType: "blob", // Expect a binary response
      });

      // console.log("Download Response:", downloadResponse);

      // Create a URL for the downloaded file and trigger the download
      const downloadUrl = window.URL.createObjectURL(
        new Blob([downloadResponse.data])
      );
      const link = document.createElement("a");
      link.href = downloadUrl;

      let fileExtension;
      switch (format) {
        case "excel":
          fileExtension = "xlsx"; // Ensure it's correctly set to 'xlsx'
          break;
        case "csv":
          fileExtension = "csv";
          break;
        case "json":
          fileExtension = "json";
          break;
        default:
          fileExtension = format; // Fallback if format is correctly passed
      }

      link.setAttribute("download", `devices.${fileExtension}`);
      document.body.appendChild(link);
      link.click();

      /* const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `devices.${format}`);
      document.body.appendChild(link);
      link.click(); */
    } catch (error) {
      console.error(`Error downloading ${format} file:`, error);
    }
  };

  const renderTableRows = () => {
    if (groupedData) {
      return Object.entries(groupedData).map(([group, devices]) => (
        <React.Fragment key={group}>
          <TableRow>
            <TableCell
              colSpan={9}
              className="font-bold cursor-pointer"
              onClick={() => handleGroupToggle(group)}
            >
              {group} ({devices.length})
            </TableCell>
          </TableRow>
          {expandedGroups.has(group) &&
            devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <Link href={`/devices/${device.id}`}>
                    {device.serialnumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/devices/${device.id}`}>{device.title}</Link>
                </TableCell>
                <TableCell>
                  {device.modelCategory.replace(/([A-Z])/g, " $1").trim()}
                </TableCell>
                <TableCell>
                  {device.status.replace(/([A-Z])/g, " $1").trim()}
                </TableCell>
                <TableCell>
                  {device.substatus.replace(/([A-Z])/g, " $1").trim()}
                </TableCell>
                <TableCell>{device.inOutStatus}</TableCell>
                <TableCell>
                  {device.leaseEndDate
                    ? format(new Date(device.leaseEndDate), "yyyy-MM-dd")
                    : ""}
                </TableCell>
                <TableCell>{device.rack}</TableCell>
                <TableCell>{device.shelf}</TableCell>
              </TableRow>
            ))}
        </React.Fragment>
      ));
    } else {
      return devices.map((device) => (
        <TableRow key={device.id} data-href="/">
          <TableCell>
            <Link href={`/devices/${device.id}`}>{device.serialnumber}</Link>
          </TableCell>
          <TableCell>
            <Link href={`/devices/${device.id}`}>{device.title}</Link>
          </TableCell>
          <TableCell>
            {device.modelCategory.replace(/([A-Z])/g, " $1").trim()}
          </TableCell>
          <TableCell>
            {device.status.replace(/([A-Z])/g, " $1").trim()}
          </TableCell>
          <TableCell>
            {device.substatus.replace(/([A-Z])/g, " $1").trim()}
          </TableCell>
          <TableCell>{device.inOutStatus}</TableCell>
          <TableCell>
            {device.leaseEndDate
              ? format(new Date(device.leaseEndDate), "yyyy-MM-dd")
              : ""}
          </TableCell>
          <TableCell>{device.rack}</TableCell>
          <TableCell>{device.shelf}</TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <div className="w-full mt-5 overflow-x-auto">
      <div className="rounded-md sm:border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {[
                "serialnumber",
                "title",
                "modelCategory",
                "status",
                "substatus",
                "inOutStatus",
                "leaseEndDate",
                "rack",
                "shelf",
              ].map((column) => (
                <TableHead key={column}>
                  <div className="flex items-center">
                    <Link
                      href={{
                        query: {
                          ...Object.fromEntries(searchParams.entries()),
                          orderBy: column,
                          orderDirection: "asc",
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
                          <DropdownMenuItem
                            key="groupBy"
                            onClick={() =>
                              handleGroupBy(column as keyof Device)
                            }
                          >
                            {`Group By ${column}`}
                          </DropdownMenuItem>
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

export default DeviceTable;
