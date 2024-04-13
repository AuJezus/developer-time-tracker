"use client";

import { createClient } from "./client";

export function signInWithGithub() {
  const supabase = createClient();
  const { error } = supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.hostname}/auth/confirm`,
    },
  });

  if (error) toast.error(error);
}
