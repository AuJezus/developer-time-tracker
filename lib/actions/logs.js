"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
const supabase = createClient();

export async function getCurrentLog() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const { data: log, error } = await supabase
    .from("logs")
    .select("*")
    .eq("user_id", user.id)
    .is("end", null)
    .limit(1)
    .single();

  if (error) console.error(error);

  return log;
}

export async function createNewLog(formData) {
  const currentLog = await getCurrentLog();

  if (currentLog) console.error("User has unfinished log"); // TODO: handle when user already started a task

  const rawFormData = {
    start: formData.get("start"),
    end: formData.get("end"),
    duration_seconds: formData.get("duration_seconds"),
    project_id: formData.get("project_id"),
    user_id: formData.get("user_id"),
  };

  // Remove undefined properties from rawFormData
  Object.keys(rawFormData).forEach(
    (key) => rawFormData[key] === null && delete rawFormData[key]
  );

  const { data: log, error } = await supabase
    .from("logs")
    .insert(rawFormData)
    .select();

  if (error) console.log(error);

  return log;
}

export async function startLog(formData) {
  const log = createNewLog(formData);

  // add github webhook

  redirect("/work");
}
