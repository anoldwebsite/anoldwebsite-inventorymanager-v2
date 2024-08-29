"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BadgeRussianRubleIcon, Moon, Sun } from "lucide-react";
import { useFormState } from "react-dom";
import { Button } from "./ui/button";

const ToggleMode = () => {
  //useTheme() function returns an objec that has two properties. We are destructuring the two properties.
  const { theme, setTheme } = useTheme();
  // Extracting the state variable mounted and the function setMounted from the array returned by the useState() function.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // if (!mounted) return null;
  if (!mounted) {
    //The button below is disabled becuase it is just a placeholder to prevent throwing errors.
    return <Button variant="outline" size="icon" disabled={true}></Button>;
  }

  // dark becomes a boolean variable that represents whether the current theme is "dark" or not
  const dark = theme === "dark";
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(`${dark ? "light" : "dark"}`)}
    >
      {dark ? (
        <Sun className="hover:cursor-pointer hover:text-primary" />
      ) : (
        <Moon className="hover:cursor-pointer hover:text-primary" />
      )}
    </Button>
  );
};

export default ToggleMode;
