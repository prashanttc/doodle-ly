import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*", // Protect dashboard pages
    "/api/protected/:path*", // Protect API routes
  ],
};
