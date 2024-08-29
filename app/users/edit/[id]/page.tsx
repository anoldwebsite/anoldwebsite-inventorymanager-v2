import dynamic from "next/dynamic";
import prisma from "@/prisma/db";

interface Props {
  params: { id: string };
}

//SSR means Server Side Rendering
const UserForm = dynamic(() => import("@/components/UserForm"), {
  ssr: false,
});

import React from "react";

const EditUser = async ({ params }: Props) => {
  const user = await prisma?.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!user) {
    return <p className="text-destructive">User not found!</p>;
  }
  return <UserForm user={user} />;
};

export default EditUser;
