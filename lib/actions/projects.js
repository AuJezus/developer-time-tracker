"use server";

import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "../formSchema";
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

    return project;
  } catch (error) {
    console.error(error);
    return { error: error.errors };
  }
}

// Because redirect() doesn't work in try catch block
export async function createProjectAndRedirect(formData) {
  const res = await createProject(formData);

  if (res?.error) return res;

  redirect(`/projects/${res.id}`);
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

    return project;
  } catch (error) {
    console.error(error);
    return { error: error.errors };
  }
}

export async function editProjectAndRedirect(projectId, formData) {
  const res = await editProject(projectId, formData);

  if (res?.error) return res;

  redirect(`/projects/${projectId}`);
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
