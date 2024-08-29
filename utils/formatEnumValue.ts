export const formatEnumValue = (value: string) => {
  if (typeof value !== "string") {
    console.error("Invalid input to formatEnumValue:", value); // Log an error message
    return "Invalid Input"; // Return a fallback value
  }
  // Handle 'None' specifically if needed. We have the possibility to have a substatus of "None".
  if (value === "None") {
    return "None";
  }
  return value
    .split(/(?=[A-Z])/) // Split camelCase words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word and convert to lowercase
    .join(" "); // Join words with spaces
};
