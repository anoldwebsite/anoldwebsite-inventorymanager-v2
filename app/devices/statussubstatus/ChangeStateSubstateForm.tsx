// app\devices\statussubstatus\ChangeStateSubstateForm.tsx

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import TemplateInputBulkStateSubstateChange from "@/components/template_input_files/TemplateInputBulkStateSubstateChange";

const actionSchema = z.object({
  action: z.enum(["STATUS", "SUBSTATUS", "STATUS_SUBSTATUS"]).nullable(),
  bulkFile: z.any().refine((file) => file !== null, "File is required"),
});

type ActionFormData = z.infer<typeof actionSchema>;

const ChangeStateSubstateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const form = useForm<ActionFormData>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      action: null,
      bulkFile: null,
    },
  });

  const handleFileUpload = (
    file: File,
    action: "STATUS" | "SUBSTATUS" | "STATUS_SUBSTATUS" | null
  ) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
        header: 1,
      });
      processExcelData(jsonData, action);
    };
    reader.readAsArrayBuffer(file);
  };

  const processExcelData = async (
    data: any[][],
    action: "STATUS" | "SUBSTATUS" | "STATUS_SUBSTATUS" | null
  ) => {
    const headers = data[0].map((header: string) =>
      header.trim().toLowerCase()
    );
    const rows = data.slice(1);
    const payload = rows
      .map((row) => {
        const item: any = {};
        headers.forEach((header: string, index: number) => {
          item[header] = row[index];
        });
        return item;
      })
      .filter((item) => item.serial); // Filter out rows without serial

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const response = await axios.post("/api/statussubstatus", {
        action,
        payload,
      });

      setIsSubmitting(false);
      if (response.data.notFound.length > 0) {
        setError(`Devices not found: ${response.data.notFound.join(", ")}`);
      } else {
        setSuccess("All devices updated successfully!");
      }
    } catch (error: unknown) {
      setIsSubmitting(false);
      setError("An error occurred while updating devices.");
      console.log(error);
    }
  };

  const onSubmit = (values: ActionFormData) => {
    const { action, bulkFile } = values;
    if (!action) {
      setError("Action is required.");
      return;
    }
    if (!bulkFile || bulkFile.length === 0) {
      setError("File is required.");
      return;
    }
    handleFileUpload(bulkFile[0], action);
  };

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Action</FormLabel>
                <FormControl>
                  <RadioGroup
                    {...field}
                    value={field.value || undefined}
                    onValueChange={(
                      value: "STATUS" | "SUBSTATUS" | "STATUS_SUBSTATUS"
                    ) => form.setValue("action", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="STATUS" id="status" />
                      <Label htmlFor="status">Change Status</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SUBSTATUS" id="substatus" />
                      <Label htmlFor="substatus">Change Substatus</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="STATUS_SUBSTATUS"
                        id="status_substatus"
                      />
                      <Label htmlFor="status_substatus">
                        Change Status and Substatus
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bulkFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Excel File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      form.setValue("bulkFile", file ? [file] : null);
                    }}
                    className="block w-75 text-sm text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        </form>
      </Form>
      {/* Sample input format components */}
      <div className="mt-8">
        <TemplateInputBulkStateSubstateChange />
      </div>
    </div>
  );
};

export default ChangeStateSubstateForm;
