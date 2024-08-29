// components\DeviceForm.tsx
"use client";
import { formatEnumValue } from "@/utils/formatEnumValue";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { deviceSchema } from "@/validationSchemas/device";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Input } from "./ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "./ui/datetimepicker";
import {
  Device,
  DeviceStatus,
  DeviceSubstatus,
  ModelCategory,
  InOutStatus,
} from "@prisma/client";

const countryOptions = [
  { value: "SE", label: "Sweden" },
  { value: "DK", label: "Denmark" },
  { value: "DE", label: "Germany" },
  { value: "PL", label: "Poland" },
  { value: "FI", label: "Finland" },
  { value: "NO", label: "Norway" },
  { value: "GB", label: "United Kingdom" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "NL", label: "Netherlands" },
  { value: "CH", label: "Switzerland" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "IN", label: "India" },
  // Add more countries as needed
];

const projectOptions = [
  { value: "INFOSYSEON", label: "INFOSYSEON" },
  { value: "RWE", label: "RWE" },
  { value: "ANOTHER_PROJECT", label: "Another Project" },
  // Add more projects as needed
];

const modelCategories = [
  ModelCategory.Laptop,
  ModelCategory.Desktop,
  ModelCategory.DesktopMini,
  ModelCategory.Monitor,
  ModelCategory.StandardMonitor,
  ModelCategory.MonitorWithDock,
  ModelCategory.ConferenceMonitor,
  ModelCategory.Dockstation,
  ModelCategory.Tablet,
  ModelCategory.Other,
];

const deviceStatuses = [
  DeviceStatus.InTransit,
  DeviceStatus.InStock,
  DeviceStatus.InUse,
  DeviceStatus.Missing,
  DeviceStatus.Retired,
  DeviceStatus.OnOrder,
];

const deviceSubstatuses = [
  DeviceSubstatus.PendingRepair,
  DeviceSubstatus.PendingDisposal,
  DeviceSubstatus.Reserved,
  DeviceSubstatus.Unimaged,
  DeviceSubstatus.Available,
  DeviceSubstatus.Defective,
  DeviceSubstatus.PendingTransfer,
  DeviceSubstatus.Deactivated,
  DeviceSubstatus.None,
];

enum Action {
  CHECKIN = "CHECKIN",
  CHECKOUT = "CHECKOUT",
}

type DeviceFormData = z.infer<typeof deviceSchema>;
type Payload = {
  serial: string;
  status?: DeviceStatus;
  substatus?: DeviceSubstatus;
};
type ActionType = "STATUS" | "SUBSTATUS" | "STATUS_SUBSTATUS";

interface Props {
  device?: Device;
}

const DeviceForm = ({ device }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rackOptions, setRackOptions] = useState<string[]>([]);
  const router = useRouter();

  const [originalValues, setOriginalValues] = useState({
    status: device?.status,
    substatus: device?.substatus,
    inOutStatus: device?.inOutStatus,
  });

  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      country: device?.country || "SE", // Added SE as default value for country
      project: device?.project || "INFOSYSEON", // Added INFOSYSEON as default value for project
      serialnumber: device?.serialnumber || "",
      title: device?.title || "",
      modelCategory: device?.modelCategory || ModelCategory.Laptop, // Assuming a default value of Laptop
      status: device?.status || DeviceStatus.InStock, // Assuming a default value of InStock
      substatus: device?.substatus || DeviceSubstatus.Available, // Assuming a default value of Available
      inOutStatus: device?.inOutStatus || InOutStatus.CHECKEDIN, // Assuming a default value of CHECKEDIN
      rack: device?.rack || "NULL_PLACEHOLDER", // If the device has no rack, assign it "NULL_PLACEHOLDER"
      shelf: device?.shelf || "NULL_PLACEHOLDER", // If the device has no shel, assign it "NULL_PLACEHOLDER".
      leaseEndDate: device?.leaseEndDate || new Date(), // The date picker wants a date; if none is available, we give it today's date.
      specifications: device?.specifications || "",
    },
  });

  const inOutStatus = useWatch({
    control: form.control,
    name: "inOutStatus",
  });

  const status = useWatch({
    control: form.control,
    name: "status",
  });

  useEffect(() => {
    const fetchRackOptions = async () => {
      try {
        const response = await axios.get("/api/rackshelf?distinct=rack");
        setRackOptions(response.data);
      } catch (error) {
        console.error("Error fetching rack options:", error);
      }
    };
    fetchRackOptions();
  }, []);

  async function onSubmit(values: z.infer<typeof deviceSchema>) {
    try {
      setIsSubmitting(true);
      setError("");

      // Trim the serialnumber before submitting
      values.serialnumber = values.serialnumber.trim();
      // Inspect form values
      //console.log("Form Values:", values);

      if (device) {
        await axios.patch("/api/devices/" + device.id, values);

        if (
          values.status !== originalValues.status ||
          values.substatus !== originalValues.substatus
        ) {
          const payload: Payload[] = [{ serial: values.serialnumber }];
          let action: ActionType = "STATUS"; // Initialize with a default value

          if (
            values.status !== originalValues.status &&
            values.substatus !== originalValues.substatus
          ) {
            action = "STATUS_SUBSTATUS";
            payload[0].status = values.status;
            payload[0].substatus = values.substatus;
          } else if (values.status !== originalValues.status) {
            action = "STATUS";
            payload[0].status = values.status;
          } else if (values.substatus !== originalValues.substatus) {
            action = "SUBSTATUS";
            payload[0].substatus = values.substatus;
          }

          await axios.post("/api/statussubstatus", {
            action: action,
            payload: payload,
          });
        }

        if (values.inOutStatus !== originalValues.inOutStatus) {
          const action: Action =
            values.inOutStatus === InOutStatus.CHECKEDIN
              ? Action.CHECKIN
              : Action.CHECKOUT;
          await axios.post("/api/deviceinout", {
            action: action,
            serialNumbers: [{ serial: values.serialnumber }],
          });
        }
      } else {
        await axios.post("/api/devices", values);
      }

      setIsSubmitting(false);
      router.push("/devices");
      router.refresh();
    } catch (error) {
      setError("An error has occurred!");
      setIsSubmitting(false);
      console.log(error);
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectOptions.map((project) => (
                      <SelectItem key={project.value} value={project.value}>
                        {project.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Title</FormLabel>
                <FormControl>
                  <Input placeholder="Device title..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type of device..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modelCategories.map((modelCategory) => (
                      <SelectItem key={modelCategory} value={modelCategory}>
                        {formatEnumValue(modelCategory)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Only adjust inOutStatus if status is set to InStock
                    if (value === DeviceStatus.InStock) {
                      form.setValue("inOutStatus", InOutStatus.CHECKEDIN, {
                        shouldDirty: true,
                      });
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status of the device..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deviceStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatEnumValue(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inOutStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in/out status</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);

                    // Handle changes to rack and shelf if CHECKEDOUT is selected
                    if (value === InOutStatus.CHECKEDOUT) {
                      form.setValue("rack", "NULL_PLACEHOLDER");
                      form.setValue("shelf", "NULL_PLACEHOLDER");
                    }

                    // Automatically set status to InStock if CHECKEDIN is selected
                    if (value === InOutStatus.CHECKEDIN) {
                      form.setValue("status", DeviceStatus.InStock, {
                        shouldDirty: true,
                      });
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>{formatEnumValue(field.value)}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={InOutStatus.CHECKEDIN}>
                      Checked in
                    </SelectItem>
                    <SelectItem value={InOutStatus.CHECKEDOUT}>
                      Checked out
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rack / Lager</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={inOutStatus === InOutStatus.CHECKEDOUT} // Disable when checked out
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rack..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rackOptions.map((rack) => (
                      <SelectItem key={rack} value={rack}>
                        {rack}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shelf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shelf / Lagerort</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Shelf / Lagerort..."
                    {...field}
                    disabled={inOutStatus === InOutStatus.CHECKEDOUT} // Disable when checked out
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="leaseEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lease End Date</FormLabel>
                <FormControl>
                  <DateTimePicker date={field.value} setDate={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specifications</FormLabel>
                <FormControl>
                  <Controller
                    name="specifications"
                    control={form.control}
                    render={({ field }) => (
                      <SimpleMDE placeholder="Specifications" {...field} />
                    )}
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

export default DeviceForm;
