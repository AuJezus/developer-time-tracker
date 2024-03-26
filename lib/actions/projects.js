"use server";

import { createClient } from "@/lib/supabase/server";
const supabase = createClient();

export async function createProject(formData) {
  const rawFormData = {
    name: formData.get("name"),
    description: formData.get("description"),
    github_repo_id: formData.get("github"),
  };

  const { error } = await supabase.from("projects").insert(rawFormData);
  if (error) console.error(error);
}

export async function getUserProjects(id) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", id);

  if (error) console.error(error);
  return data;
}

export async function getProject(id) {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    console.error("Error getting project: ", error);
    throw error;
  }

  return project;
}
