import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Update user's auth session
  const { response, supabase, user } = await updateSession(req);

  // Protect routes from unauthenticated users
  if (!user?.id) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",

    "/profile/:path*",
  ],
};
