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

export async function pauseLog({ logId, time }) {
  const { data: pauseEvent, error: errorPauseEvent } = await supabase
    .from("log_pause_events")
    .insert({ log_id: logId, paused_at: time })
    .select();

  if (errorPauseEvent) console.error(errorPauseEvent);

  const { data: log, error: errorLog } = await supabase
    .from("logs")
    .update({ is_paused: true })
    .eq("id", logId)
    .select()
    .single();

  if (errorLog) console.error(errorLog);

  return log;
}

export async function getLogPauseEvents(logId) {
  const { data: pauseEvents, error } = await supabase
    .from("log_pause_events")
    .select("*")
    .eq("log_id", logId)
    .order("paused_at");

  if (error) console.error(error);

  return pauseEvents;
}

export async function resumeLog({ logId, time }) {
  const { data: pauseEvent, error: errorPauseEvent } = await supabase
    .from("log_pause_events")
    .update({ resumed_at: time })
    .eq("log_id", logId)
    .is("resumed_at", null)
    .select()
    .single();

  if (errorPauseEvent) console.error(errorPauseEvent);

  const { data: log, error: errorLog } = await supabase
    .from("logs")
    .update({ is_paused: false })
    .eq("id", logId)
    .select()
    .single();

  if (errorLog) console.error(errorLog);

  return log;
}

export async function endLog({ logId, time }) {
  // How to end the log
  // If paused insert resumed_at value on pauseEvent
  // Insert the end value on log

  const { data: log, error: errorLog } = await supabase
    .from("logs")
    .update({ end: time })
    .eq("id", logId)
    .select()
    .single();

  if (errorLog) console.error(errorLog);

  if (log.is_paused) await resumeLog({ logId, time });

  return log;
}
