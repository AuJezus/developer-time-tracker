import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Creating a handler to a GET request to route /auth/confirm
// We will use PKCE (Proof Key for Code Exchange)
// This will work by getting a special key when user is verified and
// then we will exchange that special key we got from supabase into a user session
// then, because we are using server client we will save that session to cookies.
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Get query params for email verification
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  // Get query params for OAuth verification
  const code = searchParams.get("code");

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/profile"; // redirect link after exchange
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("code");

  // Handle email
  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // Handle OAuth
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
