// components\BulkDeviceAdd.tsx
"use client";

import React, { useState } from "react";

interface ErrorDetail {
  serialnumber: string;
  errors: { [key: string]: string[] };
}

interface FailedDevice {
  serialnumber: string;
  error: string;
}

const BulkDeviceAdd: React.FC = () => {
  const [successfullyAdded, setSuccessfullyAdded] = useState<string[]>([]);
  const [failedToAdd, setFailedToAdd] = useState<FailedDevice[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = event.currentTarget.elements.namedItem(
      "file"
    ) as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append("file", fileInput.files[0]);

      try {
        const response = await fetch("/api/devices/bulk", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessfullyAdded(result.successfullyAdded || []);
          setFailedToAdd([]);
          setGeneralError(null);
          alert("Devices uploaded successfully!"); // Replace this with a more suitable notification.
        } else {
          setSuccessfullyAdded(result.successfullyAdded || []);
          setFailedToAdd(result.failedToAdd || []);
          setGeneralError(
            result.message ||
              "Some devices could not be added. See details below."
          );
        }
      } catch (error) {
        console.error("File upload failed", error);
        setFailedToAdd([
          {
            serialnumber: "Unknown",
            error: "File upload failed. Please try again.",
          },
        ]);
        setGeneralError("Failed to upload the file. Please try again.");
      }
    } else {
      setGeneralError("Please select a file to upload.");
    }
  };

  return (
    <div className="rounded-md border w-1/2 p-4 mt-8 mb-8 ml-auto mr-auto">
      <form onSubmit={handleFileUpload}>
        <input type="file" name="file" required />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-2 rounded"
        >
          Upload Devices
        </button>
      </form>

      {generalError && <div className="text-red-700 mt-4">{generalError}</div>}

      {successfullyAdded.length > 0 && (
        <div className="success-details mt-4 p-4 border border-green-500 rounded bg-green-50">
          <h3 className="text-green-700 font-semibold mb-2">
            Successfully Added Devices:
          </h3>
          <ul className="ml-4 list-disc">
            {successfullyAdded.map((serialnumber, index) => (
              <li key={index} className="mb-2">
                <strong>{serialnumber}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {failedToAdd.length > 0 && (
        <div className="error-details mt-4 p-4 border border-red-500 rounded bg-red-50">
          <h3 className="text-red-700 font-semibold mb-2">
            Failed to Add Devices:
          </h3>
          <ul className="ml-4 list-disc">
            {failedToAdd.map((device, index) => (
              <li key={index} className="mb-2">
                <strong>Serial Number:</strong> {device.serialnumber}
                <br />
                <strong>Error:</strong> {device.error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BulkDeviceAdd;
