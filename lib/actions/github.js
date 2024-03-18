"use server";

import { Octokit } from "@octokit/core";
import { createClient } from "../supabase/server";

export async function getRepoActivity(name, start) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const octokit = new Octokit({ auth: session.provider_token });

  const response = await octokit.request("GET /repos/{owner}/{repo}/events", {
    owner: session.user.user_metadata.user_name,
    repo: name,
  });

  const filteredEvents = response.data.filter(
    (event) => new Date(event.created_at) > start
  );

  if (response.status === 200) return filteredEvents;

  return redirect("/error");
}
