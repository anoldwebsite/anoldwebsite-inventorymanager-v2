// app\rackshelf\page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RackShelfTable from "./RackShelfTable";
import { countryOptions } from "@/components/countries";
import BulkAddRackShelf from "./BulkAddRackShelf";
import BulkShelfRackAddExampleInputFile from "./BulkShelfRackAddExampleInputFile";
import SearchRackShelf from "@/components/SearchRackShelf";

const schema = z.object({
  country: z.string().min(1, "Country is required"),
  project: z.string().min(1, "Project is required"),
  rack: z.string().min(1, "Rack is required"),
  shelf: z.string().min(1, "Shelf is required"),
});

type FormValues = z.infer<typeof schema>;

const NewRackShelf = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "",
      project: "",
      rack: "",
      shelf: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedRecords, setFailedRecords] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/rackshelf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccessMessage("Record added successfully!");
        setErrorMessage(null);
        form.reset();
        setRefresh((prev) => !prev);
        router.refresh();
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Failed to add rack and shelf");
        setSuccessMessage(null);
        if (errorData.failedRecords) {
          setFailedRecords(errorData.failedRecords);
        }
      }
    } catch (error) {
      setErrorMessage("Error adding rack and shelf");
      setSuccessMessage(null);
      console.error("Error adding rack and shelf:", error);
    }
  };

  return (
    <>
      <div className="m-8">
        <h1 className="mb-4 font-extrabold">
          Search for Existing Rack or Shelf
        </h1>
        <SearchRackShelf />
      </div>
      <div className="rounded-md border w-full p-4">
        <h1 className="mt-8 mb-4 font-extrabold">Add a New Rack or Shelf</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.country?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.project?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rack</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.rack?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shelf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.shelf?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit">Add Rack and Shelf</Button>
          </form>
        </Form>
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
      </div>
      <div className="m-12">
        <h1 className="font-extrabold">
          Add Shelves and Racks in Bulk using an Excel file
        </h1>
      </div>
      <div className="m-8">
        <BulkAddRackShelf />
      </div>
      <div>
        <BulkShelfRackAddExampleInputFile />
      </div>
    </>
  );
};

export default NewRackShelf;
