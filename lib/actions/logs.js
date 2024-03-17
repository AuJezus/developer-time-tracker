"use server";

import { createClient } from "@/lib/supabase/server";
const supabase = createClient();

export async function createNewLog() {}

export async function startLog(formData) {
  const id = formData.get("id");
  console.log(id);
}
