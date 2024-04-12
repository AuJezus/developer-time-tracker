"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getLog(id) {
  const supabase = createClient();
  const { data: log, error } = await supabase
    .from("logs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting log: ", error);
    throw error;
  }

  return log;
}

export async function getProjectLogs(projectId) {
  const supabase = createClient();
  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    console.error("Error getting log: ", error);
    throw error;
  }

  return logs;
}

export async function getUserLogs(userId) {
  const supabase = createClient();

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("user_id", userId)
    .order("start", { ascending: false });

  if (error) {
    console.error("Error getting current user logs: ", error);
    throw error;
  }

  return logs;
}

export async function getCurrentUserLogs() {
  const supabase = createClient();

  const {
    data: { user },
    error: errorAuth,
  } = await supabase.auth.getUser();

  if (errorAuth) {
    console.error("Error getting current user logs: ", errorAuth);
    throw errorAuth;
  }

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("user_id", user.id)
    .order("start", { ascending: false });

  if (error) {
    console.error("Error getting current user logs: ", error);
    throw error;
  }

  return logs;
}

export async function getActiveLog() {
  const supabase = createClient();
  const {
    data: { user },
    errorAuth,
  } = await supabase.auth.getUser();

  if (errorAuth) {
    console.error("Error getting active log: ", errorAuth);
    throw errorAuth;
  }

  if (!user) return null;

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("user_id", user.id)
    .is("end", null)
    .limit(1);

  if (error) {
    console.error("Error getting active log: ", error);
    throw error;
  }
  if (!logs.length) return null;

  return logs[0];
}

export async function getActiveLogCount() {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("logs")
    .select("*", { count: "exact", head: true })
    .is("end", null);

  if (error) {
    console.error("Error getting all active logs");
  }

  return count;
}

export async function createNewLog(formData) {
  const supabase = createClient();
  const activeLog = await getActiveLog();

  if (activeLog) {
    console.error("Error creating new log: ", {
      message: "User has unfinished log",
    });
    throw new Error("User has unfinished log");
  }

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

  if (error) {
    console.error("Error creating new log: ", error);
    throw error;
  }

  return log;
}

export async function startLog(formData) {
  try {
    await createNewLog(formData);
    redirect("/work");
  } catch (err) {
    throw err;
  }
}

export async function pauseLog({ logId, time }) {
  const supabase = createClient();
  const { data: pauseEvent, error: errorPauseEvent } = await supabase
    .from("log_pause_events")
    .insert({ log_id: logId, paused_at: time })
    .select();

  if (errorPauseEvent) {
    console.error("Error inserting pause event: ", errorPauseEvent);
    throw errorPauseEvent;
  }

  const { data: log, error: errorLog } = await supabase
    .from("logs")
    .update({ is_paused: true })
    .eq("id", logId)
    .select()
    .single();

  if (errorLog) {
    console.error("Error pausing log: ", errorLog);
    throw errorLog;
  }

  return log;
}

export async function getLogPauseEvents(logId) {
  const supabase = createClient();
  const { data: pauseEvents, error } = await supabase
    .from("log_pause_events")
    .select("*")
    .eq("log_id", logId)
    .order("paused_at");

  if (error) {
    console.error("Error getting log pause events: ", error);
    throw error;
  }

  return pauseEvents;
}

export async function resumeLog({ logId, time }) {
  const supabase = createClient();
  const { data: pauseEvent, error: errorPauseEvent } = await supabase
    .from("log_pause_events")
    .update({ resumed_at: time })
    .eq("log_id", logId)
    .is("resumed_at", null)
    .select()
    .single();

  if (errorPauseEvent) {
    console.error("Error resuming log pause event: ", errorPauseEvent);
    throw errorPauseEvent;
  }

  const { data: log, error: errorLog } = await supabase
    .from("logs")
    .update({ is_paused: false })
    .eq("id", logId)
    .select()
    .single();

  if (errorLog) {
    console.error("Error resuming log: ", errorLog);
    throw errorLog;
  }

  return { log, pauseEvent };
}

export async function endLog({ logId, time, duration, commits }) {
  const supabase = createClient();
  const { data: log, error: error } = await supabase
    .from("logs")
    .update({ end: time, duration, commits })
    .eq("id", logId)
    .select()
    .single();

  if (error) {
    console.error("Error ending log: ", error);
    throw error;
  }

  try {
    if (log.is_paused) await resumeLog({ logId, time });

    redirect(`/logs/${logId}`);
  } catch (errorPause) {
    throw errorPause;
  }
}
