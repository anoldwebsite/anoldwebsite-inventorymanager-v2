"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const worknoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  customervisible: z.boolean(),
});

interface Props {
  ticketId: number;
  userRole: string;
  userId: number;
}

const AddWorknote = ({ ticketId, userRole, userId }: Props) => {
  const form = useForm<z.infer<typeof worknoteSchema>>({
    resolver: zodResolver(worknoteSchema),
    defaultValues: {
      content: "",
      customervisible: false,
    },
  });
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (data: z.infer<typeof worknoteSchema>) => {
    try {
      await axios.post("/api/tickets/worknotes", {
        content: data.content,
        customervisible: data.customervisible,
        ticketId,
        userId,
      });
      form.reset(); // Reset the form fields
      router.refresh(); // Refresh the page to show the new worknote
    } catch (error) {
      setError("An error occurred while adding the worknote.");
      console.error(error);
    }
  };

  // Only TECH, ADMIN, or the user who created the ticket can add worknotes
  const canAddWorknote =
    userRole === "ADMIN" || userRole === "TECH" || userRole === "USER";

  if (!canAddWorknote) return null;

  return (
    <div className="mx-4 my-2 lg:my-4 lg:mx-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 lg:space-y-6 p-4 border rounded-lg w-full lg:w-full"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Worknote</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customervisible"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Visible to user</FormLabel>
              </FormItem>
            )}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full lg:w-auto">
            Add Worknote
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddWorknote;
