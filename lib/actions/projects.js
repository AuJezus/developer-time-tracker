"use server";

import { createClient } from "@/lib/supabase/server";

export async function createProject(formData) {
  const supabase = createClient();

  const rawFormData = {
    name: formData.get("name"),
    description: formData.get("description"),
    github_repo_id: formData.get("github"),
  };

  const { error } = await supabase.from("projects").insert(rawFormData);
  if (error) console.error(error);
}

export async function getUserProjects() {
  const supabase = createClient();
  const {
    data: { user },
    errorAuth,
  } = await supabase.auth.getUser();

  if (errorAuth) {
    console.error("Error getting user projects: ", errorAuth);
    throw errorAuth;
  }

  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id);

  if (error) {
    console.error("Error getting user projects: ", error);
    throw error;
  }

  return data;
}

export async function getProject(id) {
  const supabase = createClient();
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
