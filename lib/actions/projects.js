"use server";

import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "../schema/formSchema";
import { redirect } from "next/navigation";
import { getRepoUrl } from "./github";

export async function createProject(formData) {
  try {
    const { name, github, description } = projectSchema.parse(formData);
    const githubUrl = await getRepoUrl(github);

    const supabase = createClient();
    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        name,
        github_repo_id: github,
        github_repo_url: githubUrl,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      throw error;
    }
  } catch (error) {
    console.error(error);
    return { error: error.errors };
  } finally {
    redirect(`/projects`);
  }
}

export async function editProject(projectId, formData) {
  try {
    const { name, github, description } = projectSchema.parse(formData);
    const project = await getProject(projectId);

    if (github !== project.github_repo_id.toString())
      throw new Error(
        "Error while trying to edit project: github_repo_id is not the same"
      );

    const supabase = createClient();
    const { error: errorUpdate } = await supabase
      .from("projects")
      .update({ name, description })
      .eq("id", projectId);

    if (errorUpdate) throw errorUpdate;
  } catch (error) {
    console.error(error);
    return { error: error.errors };
  } finally {
    redirect(`/projects/${projectId}`);
  }
}

export async function getCurrentUserProjects() {
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

export async function getUserProjects(userId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error getting user projects by user id: ", error);
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
    .maybeSingle();

  if (error) {
    console.error("Error getting project: ", error);
    throw error;
  }

  return project;
}
