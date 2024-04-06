"use server";

import { createClient } from "@/lib/supabase/server";

export async function getRandomQuote() {
  const supabase = createClient();
  const { data: quote, error } = await supabase
    .rpc("get_random_quote")
    .single();

  if (error) {
    console.error("Error getting random quote: ", quote);
    throw error;
  }

  return quote;
}
