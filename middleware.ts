// middleware.ts
/*
The type keyword, in the line of code import { NextResponse, type NextRequest } from "next/server";,  is used in TypeScript to 
indicate that we are importing a type and not a value. This distinction helps with tree-shaking and ensures that type-only 
imports are not included in the JavaScript output.

NextResponse: is used at runtime, so it's imported as a regular import.
NextRequest: This is a type, which is only used at compile-time for type checking and does not need to be included in the runtime JavaScript output.
*/

import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  if (!token) {
    if (
      url.pathname.startsWith("/deviceinout") ||
      url.pathname.startsWith("/users")
    ) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  } else {
    const userRole = token.role;

    if (
      (url.pathname.startsWith("/deviceinout") ||
        url.pathname.startsWith("/users")) &&
      userRole !== "ADMIN"
    ) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/deviceinout/:path*", "/users/:path*"],
};
