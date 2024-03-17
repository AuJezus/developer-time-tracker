"use server";

import { Octokit } from "@octokit/core";
import { createClient } from "../supabase/server";

const supabase = createClient();
const {
  data: { session },
} = await supabase.auth.getSession();
const octokit = new Octokit({ auth: session.provider_token });

export async function getRepoActivity(name, start) {
  const response = await octokit.request("GET /repos/{owner}/{repo}/events", {
    owner: session.user.user_metadata.user_name,
    repo: name,
  });

  // console.log(response);
  console.log(start);
  const filteredEvents = response.data.filter(
    (event) => Date(event.created_at) > start
  );

  console.log(filteredEvents);

  if (response.status === 200) return response.data;

  return redirect("/error");
}
