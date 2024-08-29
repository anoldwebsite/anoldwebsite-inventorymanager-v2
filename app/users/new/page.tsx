import React from "react";
import dynamic from "next/dynamic";

//SSR means Server Side Rendering.
const UserForm = dynamic(() => import("@/components/UserForm"), {
  ssr: false,
});

const NewUser = () => {
  return <UserForm />;
};

export default NewUser;
