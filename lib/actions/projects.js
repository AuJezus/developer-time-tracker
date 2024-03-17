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
