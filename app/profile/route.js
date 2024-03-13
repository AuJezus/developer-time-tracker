import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return NextResponse.redirect("/error");

  return NextResponse.redirect(new URL(`profile/${user.id}`, request.url));
}
