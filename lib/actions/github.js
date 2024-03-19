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

export async function getEventStats(event) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const octokit = new Octokit({ auth: session.provider_token });

  // console.log(event);
  const commitsStats = await Promise.all(
    event.payload.commits.map(async (commit) => {
      const { data } = await octokit.request(commit.url);
      return { sha: data.sha, stats: data.stats };
    })
  );

  // console.log(commitsStats);
  const totalStats = commitsStats.reduce(
    (acc, commit) => {
      acc.total += commit.stats.total;
      acc.additions += commit.stats.additions;
      acc.deletions += commit.stats.deletions;
      return acc;
    },
    {
      total: 0,
      additions: 0,
      deletions: 0,
    }
  );

  return { id: event.id, totalStats, commitsStats };
}

export async function getAllEventStats(events) {
  const eventsStats = await Promise.all(
    events.map(async (event) => await getEventStats(event))
  );

  const totalStats = eventsStats.reduce(
    (acc, event) => {
      acc.total += event.totalStats.total;
      acc.additions += event.totalStats.additions;
      acc.deletions += event.totalStats.deletions;
      return acc;
    },
    {
      total: 0,
      additions: 0,
      deletions: 0,
    }
  );

  return { totalStats, eventsStats };
}
