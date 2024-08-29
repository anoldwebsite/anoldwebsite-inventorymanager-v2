// app\deviceinout\BulkCheckInCheckout.tsx

"use client"; // Ensures that the code is executed on the client side

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import axios from "axios";
import { useRouter } from "next/navigation";
import TemplateInputBulkRackChange from "@/components/template_input_files/template_input_bulk_rack_change";
import TemplateInputBulkShelfChange from "@/components/template_input_files/template_input_bulk_shelf_change";

type BulkActionType =
  | "BULK_CHECKIN"
  | "BULK_CHECKOUT"
  | "BULK_CHANGERACK"
  | "BULK_CHANGESHELF"
  | null;

const bulkActionSchema = z.object({
  bulkAction: z
    .enum([
      "BULK_CHECKIN",
      "BULK_CHECKOUT",
      "BULK_CHANGERACK",
      "BULK_CHANGESHELF",
    ])
    .nullable(),
  bulkFile: z.any().refine((file) => file !== null, "File is required"),
});

type BulkActionFormData = z.infer<typeof bulkActionSchema>;

interface BulkCheckInCheckoutFormProps {
  setNotFoundSerials: (serials: string[]) => void;
  setProcessedSerials: (serials: string[]) => void;
  setInvalidRackShelfSerials: (serials: string[]) => void;
}

const BulkCheckInCheckoutForm: React.FC<BulkCheckInCheckoutFormProps> = ({
  setNotFoundSerials,
  setProcessedSerials,
  setInvalidRackShelfSerials,
}) => {
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const bulkRouter = useRouter();

  const bulkForm = useForm<BulkActionFormData>({
    resolver: zodResolver(bulkActionSchema),
    defaultValues: {
      bulkAction: null,
      bulkFile: null,
    },
  });

  const handleBulkFileUpload = (file: File, bulkAction: BulkActionType) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const bulkData = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(bulkData, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
          header: 1,
        });
        processBulkData(jsonData, bulkAction);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processBulkData = async (data: any[][], bulkAction: BulkActionType) => {
    const headers = data[0];
    const rows = data.slice(1);
    let payload: any[] = [];

    switch (bulkAction) {
      case "BULK_CHECKIN":
        payload = rows.map((row) => ({
          serial: row[headers.indexOf("SERIAL")],
          rack: row[headers.indexOf("LAGER")],
          shelf: row[headers.indexOf("LAGERORT")],
        }));
        break;
      case "BULK_CHECKOUT":
        payload = rows.map((row) => ({
          serial: row[headers.indexOf("SERIAL")],
        }));
        break;
      case "BULK_CHANGERACK":
        payload = rows.map((row) => ({
          serial: row[headers.indexOf("SERIAL")],
          rack: row[headers.indexOf("LAGER")],
          shelf: row[headers.indexOf("LAGERORT")],
        }));
        break;
      case "BULK_CHANGESHELF":
        payload = rows.map((row) => ({
          serial: row[headers.indexOf("SERIAL")],
          shelf: row[headers.indexOf("LAGERORT")],
        }));
        break;
    }

    await submitBulkData(bulkAction, payload);
  };

  const submitBulkData = async (bulkAction: BulkActionType, payload: any[]) => {
    try {
      setIsBulkSubmitting(true);
      setBulkError("");

      const response = await axios.post("/api/bulkdeviceinout", {
        action: bulkAction,
        payload,
      });

      if (response.data.notFound) {
        setNotFoundSerials(
          response.data.notFound.map((item: { serial: string }) => item.serial)
        );
      } else {
        setNotFoundSerials([]);
      }

      if (response.data.invalidRackShelf) {
        setInvalidRackShelfSerials(
          response.data.invalidRackShelf.map(
            (item: { serial: string }) => item.serial
          )
        );
      } else {
        setInvalidRackShelfSerials([]);
      }

      if (response.data.processed) {
        setProcessedSerials(
          response.data.processed.map((item: { serial: string }) => item.serial)
        );
      } else {
        setProcessedSerials([]);
      }

      setIsBulkSubmitting(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.notFound) {
          setNotFoundSerials(
            error.response.data.notFound.map(
              (item: { serial: string }) => item.serial
            )
          );
        } else if (error.response && error.response.data.error) {
          setBulkError(error.response.data.error);
        } else {
          setBulkError("An unknown error has occurred!");
        }
      } else {
        setBulkError("An error has occurred!");
      }
      setIsBulkSubmitting(false);
      console.log(error);
    }
  };

  const onBulkSubmit = (values: BulkActionFormData) => {
    const { bulkAction, bulkFile } = values;
    if (!bulkAction) {
      setBulkError("Bulk action is required.");
      return;
    }
    if (!bulkFile || bulkFile.length === 0) {
      setBulkError("File is required.");
      return;
    }
    handleBulkFileUpload(bulkFile[0], bulkAction);
  };

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...bulkForm}>
        <form
          onSubmit={bulkForm.handleSubmit(onBulkSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={bulkForm.control}
            name="bulkAction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Select Action for the devices in the Excel file
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    {...field}
                    value={field.value || undefined} // Convert null to undefined
                    onValueChange={(value) =>
                      bulkForm.setValue(
                        "bulkAction",
                        value as
                          | "BULK_CHECKIN"
                          | "BULK_CHECKOUT"
                          | "BULK_CHANGERACK"
                          | "BULK_CHANGESHELF"
                          | null
                      )
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BULK_CHECKIN" id="bulkCheckin" />
                      <Label htmlFor="bulkCheckin">
                        Check-in assets given in the File
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BULK_CHECKOUT" id="bulkCheckout" />
                      <Label htmlFor="bulkCheckout">
                        Check-out assets given in the File
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="BULK_CHANGERACK"
                        id="bulkChangeRack"
                      />
                      <Label htmlFor="bulkChangeRack">
                        Change Rack/LAGER for all the assets in the File
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="BULK_CHANGESHELF"
                        id="bulkChangeShelf"
                      />
                      <Label htmlFor="bulkChangeShelf">
                        Change Shelf/LAGERORT for all the assets in the File
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={bulkForm.control}
            name="bulkFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Upload Excel File with details of Assets. For the format of
                  the Excel file see the sample at the end of the page.
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      bulkForm.setValue("bulkFile", file ? [file] : null);
                    }}
                    className="block w-75 text-sm text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="submit" disabled={isBulkSubmitting}>
              {isBulkSubmitting ? "Submitting..." : "Submit"}
            </Button>
            {bulkError && <p className="text-red-500">{bulkError}</p>}
          </div>
        </form>
      </Form>
      {/* Sample input format components */}
      <div className="mt-8">
        <TemplateInputBulkRackChange />
      </div>
      <div className="mt-8">
        <TemplateInputBulkShelfChange />
      </div>
    </div>
  );
};

export default BulkCheckInCheckoutForm;
