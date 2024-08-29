// app\deviceinout\CheckinCheckout.tsx

"use client"; // Ensures that the code is executed on the client side
import React, { useState } from "react"; // Importing React and useState hook
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"; // Importing form-related components
import { z } from "zod"; // Importing Zod for schema validation
import { useForm } from "react-hook-form"; // Importing React Hook Form for form management
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver for Zod and React Hook Form integration
import { Input } from "@/components/ui/input"; // Importing Input component
import { Button } from "@/components/ui/button"; // Importing Button component
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Importing Radio Group components
import { Label } from "@/components/ui/label"; // Importing Label component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Importing Dialog components
import axios, { AxiosError } from "axios"; // Importing Axios for making HTTP requests
import { useRouter } from "next/navigation"; // Importing useRouter for navigation
import DeviceTableWithDelete from "@/app/deviceinout/DeviceTableWithDelete"; // Importing custom component for displaying and deleting devices
import {
  Device,
  InOutStatus,
  ModelCategory,
  DeviceStatus,
  DeviceSubstatus,
} from "@prisma/client"; // Importing enums from Prisma client

// Define a type for action field that includes null and undefined
type ActionType =
  | "CHECKIN"
  | "CHECKOUT"
  | "CHANGERACK"
  | "CHANGESHELF"
  | null
  | undefined;

// Define a Zod schema for form validation
const actionSchema = z.object({
  action: z
    .enum(["CHECKIN", "CHECKOUT", "CHANGERACK", "CHANGESHELF"])
    .nullable(),
  serialNumbers: z
    .array(z.string())
    .min(1, "At least one serial number is required."),
  rack: z.string().optional(),
  shelf: z.string().optional(),
});

// Infer TypeScript type from Zod schema
type ActionFormData = z.infer<typeof actionSchema>;

const CheckinCheckoutForm = () => {
  // State variables to manage various form data and dialogs
  const [serialNumbers, setSerialNumbers] = useState<
    { serial: string; rack?: string; shelf?: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [currentSerial, setCurrentSerial] = useState("");
  const [currentRack, setCurrentRack] = useState("");
  const [currentShelf, setCurrentShelf] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRackShelfDialog, setIsRackShelfDialog] = useState(false);
  const [notFoundDialog, setNotFoundDialog] = useState(false);
  const router = useRouter(); // For navigation

  // Initialize React Hook Form with Zod resolver and default values
  const form = useForm<ActionFormData & { action: ActionType }>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      action: null,
      serialNumbers: [],
    },
  });

  // Function to handle adding a serial number
  const handleAddSerialNumber = async () => {
    if (currentSerial) {
      // Check for duplicates
      if (serialNumbers.some((item) => item.serial === currentSerial)) {
        alert("This serial number is already added.");
        return;
      }

      try {
        // Check if the device has been already checked out. If it is then don't allow changing its shelf and rack.
        const response = await axios.get(`/api/deviceinout/${currentSerial}`);
        if (response.data.exists) {
          const device = response.data.device;

          // Prevent modifications or checkout if the device is already checked out
          if (device.inOutStatus === "CHECKEDOUT") {
            if (form.watch("action") === "CHECKOUT") {
              alert("This device is already checked out.");
              return;
            } else if (form.watch("action") !== "CHECKIN") {
              alert(
                "This device is currently checked out and cannot be modified."
              );
              return;
            }
          } else if (device.inOutStatus === "CHECKEDIN") {
            // Prevent check-in if the device is already checked in
            if (form.watch("action") === "CHECKIN") {
              alert("This device is already checked in.");
              return;
            }
          }
          if (form.watch("action") === "CHANGERACK") {
            setIsRackShelfDialog(true); // Open rack and shelf dialog
          } else if (form.watch("action") === "CHANGESHELF") {
            setIsRackShelfDialog(true); // Open shelf dialog
          } else {
            const newSerialNumbers = [
              ...serialNumbers,
              { serial: currentSerial, shelf: currentShelf },
            ];
            setSerialNumbers(newSerialNumbers);
            form.setValue(
              "serialNumbers",
              newSerialNumbers.map((item) => item.serial)
            );
            setCurrentSerial("");
            setCurrentShelf("");
            setIsDialogOpen(true); // Reopen the dialog for next serial number
          }
        } else {
          setNotFoundDialog(true); // Show not found dialog
        }
      } catch (error) {
        console.error("Error checking serial number:", error);
        alert("Error checking serial number.");
      }
    }
  };

  // Function to handle adding rack and shelf
  const handleAddRackShelf = async () => {
    if (currentRack) {
      const newSerialNumbers = [
        ...serialNumbers,
        { serial: currentSerial, rack: currentRack, shelf: "NULL_PLACEHOLDER" },
      ];
      setSerialNumbers(newSerialNumbers);
      form.setValue(
        "serialNumbers",
        newSerialNumbers.map((item) => item.serial)
      );
      setCurrentSerial("");
      setCurrentRack("");
      setCurrentShelf("");
      setIsRackShelfDialog(false);
      setIsDialogOpen(true); // Reopen the dialog for next serial number
    } else {
      alert("Rack value is required.");
    }
  };

  // Function to handle adding shelf
  const handleAddShelf = async () => {
    if (currentShelf) {
      try {
        const response = await axios.get(
          `/api/rackshelf?shelf=${currentShelf}`
        );
        const { rack } = response.data;

        if (rack) {
          const newSerialNumbers = [
            ...serialNumbers,
            { serial: currentSerial, rack, shelf: currentShelf },
          ];
          setSerialNumbers(newSerialNumbers);
          form.setValue(
            "serialNumbers",
            newSerialNumbers.map((item) => item.serial)
          );
          setCurrentSerial("");
          setCurrentShelf("");
          setIsRackShelfDialog(false); // Close the shelf dialog
          setIsDialogOpen(true); // Reopen the dialog for next serial number
        } else {
          alert("Invalid shelf value.");
        }
      } catch (error) {
        console.error("Error fetching rack for shelf:", error);
        alert("Error fetching rack for shelf.");
      }
    } else {
      alert("Shelf value is required.");
    }
  };

  // Function to handle removing a serial number
  const handleRemoveSerialNumber = (index: number) => {
    const newSerialNumbers = serialNumbers.filter((_, i) => i !== index);
    setSerialNumbers(newSerialNumbers);
    form.setValue(
      "serialNumbers",
      newSerialNumbers.map((item) => item.serial)
    );
  };

  // Function to handle action change and open dialog
  const handleActionChange = (
    action: "CHECKIN" | "CHECKOUT" | "CHANGERACK" | "CHANGESHELF"
  ) => {
    form.setValue("action", action);
    setSerialNumbers([]);
    setCurrentSerial("");
    setCurrentRack("");
    setCurrentShelf("");
    setIsDialogOpen(true);
  };

  // Function to handle form submission
  const onSubmit = async (values: ActionFormData) => {
    try {
      setIsSubmitting(true);
      setError("");

      await axios.post("/api/deviceinout", {
        ...values,
        serialNumbers: serialNumbers,
      });

      setIsSubmitting(false);
      router.push("/devices");
      router.refresh();
    } catch (error: unknown) {
      setIsSubmitting(false);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || "An error has occurred!");
      } else {
        setError("An error has occurred!");
      }
      console.log(error);
    }
  };

  // Mock device function to create device objects
  const mockDevice = (sn: {
    serial: string;
    rack?: string;
    shelf?: string;
  }): Partial<Device> => ({
    id: 0,
    serialnumber: sn.serial,
    title: "N/A",
    specifications: "N/A",
    leaseEndDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    inOutStatus: InOutStatus.CHECKEDIN, // Using valid enum
    modelCategory: ModelCategory.Other, // Using valid enum
    status: DeviceStatus.InStock, // Using valid enum
    substatus: DeviceSubstatus.Available, // Using valid enum
    rack: sn.rack || "N/A",
    shelf: sn.shelf || "N/A",
    assignedToUserId: null,
  });

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
                    value={field.value || undefined} // Convert null to undefined
                    onValueChange={(value) =>
                      handleActionChange(
                        value as
                          | "CHECKIN"
                          | "CHECKOUT"
                          | "CHANGERACK"
                          | "CHANGESHELF"
                      )
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CHECKIN" id="checkin" />
                      <Label htmlFor="checkin">Check-in</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CHECKOUT" id="checkout" />
                      <Label htmlFor="checkout">Check-out</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CHANGERACK" id="changerack" />
                      <Label htmlFor="changerack">Change Rack</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CHANGESHELF" id="changeshelf" />
                      <Label htmlFor="changeshelf">Change Shelf</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <DeviceTableWithDelete
            devices={serialNumbers.map(mockDevice)}
            onDelete={handleRemoveSerialNumber}
          />

          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
      </Form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Serial Number</DialogTitle>
            <DialogDescription>
              Scan or enter the serial number of the device.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serial" className="text-right">
                Serial Number
              </Label>
              <Input
                id="serial"
                value={currentSerial}
                onChange={(e) => setCurrentSerial(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSerialNumber();
                  }
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                handleAddSerialNumber();
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRackShelfDialog} onOpenChange={setIsRackShelfDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {form.watch("action") === "CHANGERACK"
                ? "Enter Rack"
                : "Enter Shelf"}
            </DialogTitle>
            <DialogDescription>
              {form.watch("action") === "CHANGERACK"
                ? "Enter the rack value for the device."
                : "Enter the shelf value for the device."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {form.watch("action") === "CHANGERACK" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rack" className="text-right">
                  Rack
                </Label>
                <Input
                  id="rack"
                  value={currentRack}
                  onChange={(e) => setCurrentRack(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
            {form.watch("action") === "CHANGESHELF" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shelf" className="text-right">
                    Shelf
                  </Label>
                  <Input
                    id="shelf"
                    value={currentShelf}
                    onChange={(e) => setCurrentShelf(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (form.watch("action") === "CHANGERACK") {
                  handleAddRackShelf();
                } else if (form.watch("action") === "CHANGESHELF") {
                  handleAddShelf();
                }
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={notFoundDialog} onOpenChange={setNotFoundDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Serial Number Not Found</DialogTitle>
            <DialogDescription>
              The serial number you entered was not found in the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setNotFoundDialog(false);
                setCurrentSerial("");
                setIsDialogOpen(true); // Reopen the dialog for next serial number
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckinCheckoutForm;
