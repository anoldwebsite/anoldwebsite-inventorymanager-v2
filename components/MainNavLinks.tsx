"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainNavLinks = ({ role }: { role?: string }) => {
  // The role might be null therefore checking it with ? which means that if there is a reole then it is of type string.
  const links = [
    { label: "Dashboard", href: "/", adminOnly: false },
    { label: "Tickets", href: "/tickets", adminOnly: false },
    { label: "Devices", href: "/devices", adminOnly: false },
    { label: "Users", href: "/users", adminOnly: true },
    { label: "Manage Stock Location", href: "/deviceinout", adminOnly: true },
    { label: "Add Rack/Shelf", href: "/rackshelf", adminOnly: true },
  ];

  const currentPath = usePathname();

  return (
    <div className="flex items-center gap-2">
      {links
        .filter((a_link) => !a_link.adminOnly || role === "ADMIN")
        .map((some_link) => (
          <Link
            href={some_link.href}
            className={`navbar-link ${
              currentPath == some_link.href &&
              "cursor-default text-primary/70 hover:text-primary/60"
            }`}
            key={some_link.label}
          >
            {some_link.label}
          </Link>
        ))}
    </div>
  );
};

export default MainNavLinks;
