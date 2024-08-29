import React from "react";
import prisma from "@/prisma/db";
import DataTableUsers from "./DataTableUsers";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import RoleFilter from "@/components/RoleFilter";
import { Role, User } from "@prisma/client";

export interface SearchParams {
  role: Role;
  page: string;
  orderBy: keyof User;
}

const Users = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10; // In the next version, give the user a chance to determine the number of Users shown on a page.
  const page = parseInt(searchParams.page) || 1;

  // Order/sort the Users by the choice passed by the user of the webapp in searchParams.orderBy
  // If no choice has been passed, then as a default, order the Users by name of the users.
  const orderBy = searchParams.orderBy ? searchParams.orderBy : "name"; // You can also sort by "username".

  // If in the searchParams, the role of tickets passed is nt one of the following then set it to undefined.
  // Allowed values for Role are: USER, TECH, ADMIN.¨
  const roles = Object.values(Role);
  const role = roles.includes(searchParams.role)
    ? searchParams.role
    : undefined;

  let where = {};

  //Remember that the Role could be undefined. Therefore, we check it below.
  if (role) {
    where = { role }; // This is a shortcut for role: role i.e., set the key to role and value to role.
  } else {
    // Then show me the users whom have roles of USER and TECH. Do not show the users whose role is ADMIN.
    where = {
      NOT: [{ role: "ADMIN" }],
    };
  }

  const userCount = await prisma.user.count({ where }); // where: where
  const users = await prisma.user.findMany({
    where, // shortcut for where: where
    orderBy: {
      [orderBy]: "asc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  // console.log(users)
  return (
    <div>
      <div className="flex gap-2">
        <Link
          href="/users/new"
          className={buttonVariants({ variant: "default" })}
        >
          Create a User
        </Link>
        <RoleFilter />
      </div>
      <DataTableUsers users={users} searchParams={searchParams} />
      <Pagination
        itemCount={userCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Users;
