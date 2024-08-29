// app/unauthorized/page.tsx
import React from "react";

const Unauthorized = () => {
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>
        You do not have permission to view this page. If you believe this is an
        error, please contact the administrator.
      </p>
      <a href="/">Go back to Home</a>
    </div>
  );
};

export default Unauthorized;
