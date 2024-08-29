// app\defective\DefectiveDeviceForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/datetimepicker";
import { DefectiveDeviceSchema } from "@/validationSchemas/defectiveDevice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { DefectiveDevice } from "@prisma/client";
import { format } from "date-fns";

enum TypeOfRepair {
  IW = "IW",
  OOW = "OOW",
  BOTH = "BOTH",
  OTHER = "OTHER",
}

enum CurrentLocation {
  Warehouse = "Warehouse",
  Courier = "Courier",
  Supplier = "Supplier",
}

enum RepairedBy {
  Supplier = "Supplier",
  OurTeam = "OurTeam",
  NotRepaired = "NotRepaired",
  Other = "Other",
}

type DefectiveDeviceFormData = {
  serialnumber: string;
  entryid?: number;
  sendTrackingId?: string;
  receiveTrackingId?: string;
  supplierRepairCaseId?: string;
  defectReported: string;
  typeOfRepair?: TypeOfRepair;
  dateCourierReceivedAsset?: Date | null;
  dateWHReceivedAsset?: Date | null;
  currentLocation?: CurrentLocation;
  partsReplaced?: string;
  notes?: string;
  quotationAmount?: number;
  repairedBy?: RepairedBy;
  deviceId?: number;
};

interface Props {
  defectiveDevice?: DefectiveDevice;
}

const DefectiveDeviceForm = ({ defectiveDevice }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<DefectiveDeviceFormData>({
    resolver: zodResolver(DefectiveDeviceSchema),
    defaultValues: {
      serialnumber: defectiveDevice?.serialnumber || "",
      defectReported: defectiveDevice?.defectReported || "",
      currentLocation: CurrentLocation.Warehouse,
      dateCourierReceivedAsset:
        defectiveDevice?.dateCourierReceivedAsset || null,
      dateWHReceivedAsset: defectiveDevice?.dateWHReceivedAsset || null,
      entryid: defectiveDevice?.entryid || undefined,
      sendTrackingId: defectiveDevice?.sendTrackingId || "",
      receiveTrackingId: defectiveDevice?.receiveTrackingId || "",
      supplierRepairCaseId: defectiveDevice?.supplierRepairCaseId || "",
      quotationAmount: defectiveDevice?.quotationAmount || undefined,
      notes: defectiveDevice?.notes || "",
    },
  });

  async function onSubmit(values: DefectiveDeviceFormData) {
    try {
      //console.log("Form submission started with values:", values);

      setIsSubmitting(true);
      setError("");

      const response = await axios({
        method: defectiveDevice ? "PATCH" : "POST",
        url: defectiveDevice
          ? `/api/defective/${defectiveDevice.id}`
          : "/api/defective/new",
        data: values,
      });

      console.log("Response from server:", response.data);

      setIsSubmitting(false);
      router.push("/defective");
      router.refresh();
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error has occurred!");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="serialnumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Serial number of the Device..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defectReported"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defect Reported</FormLabel>
                <FormControl>
                  <Input placeholder="Describe the defect..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entryid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Entry ID..."
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sendTrackingId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Tracking ID</FormLabel>
                <FormControl>
                  <Input placeholder="Send Tracking ID..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiveTrackingId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receive Tracking ID</FormLabel>
                <FormControl>
                  <Input placeholder="Receive Tracking ID..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplierRepairCaseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Repair Case ID</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier Repair Case ID..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="typeOfRepair"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Repair</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type of repair..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TypeOfRepair).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? CurrentLocation.Warehouse}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current location..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(CurrentLocation).map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partsReplaced"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parts Replaced</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Comma-separated parts replaced..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateCourierReceivedAsset"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Courier Received Asset</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value ? new Date(field.value) : new Date()}
                    setDate={(date) => {
                      field.onChange(date);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateWHReceivedAsset"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Warehouse Received Asset</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value ? new Date(field.value) : new Date()}
                    setDate={(date) => {
                      field.onChange(date);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repairedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repaired By</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select repair agent..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(RepairedBy).map((agent) => (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Additional notes..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quotationAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quotation Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quotation amount..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default DefectiveDeviceForm;
