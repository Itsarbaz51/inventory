import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  console.log("middleware pathname:", pathname);
  console.log("Access token exists:", !!token);

  // If logged in, redirect away from login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not logged in, protect dashboard routes
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
