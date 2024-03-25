"use server";

import { Octokit } from "@octokit/core";
import { createClient } from "../supabase/server";

const supabase = createClient();
const {
  data: { session },
} = await supabase.auth.getSession();
const octokit = new Octokit({ auth: session.provider_token });

export async function getRepoEvents(name, start) {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/events", {
      owner: session.user.user_metadata.user_name,
      repo: name,
    });

    const filteredEvents = response.data.filter(
      (event) => new Date(event.created_at) > start
    );

    return filteredEvents;
  } catch (error) {
    console.error("Error getting repository events: ", error);
    throw error;
  }
}

export async function getEventStats(event) {
  try {
    // Get every commit statistics
    const commitStats = await Promise.all(
      event.payload.commits.map(async (commit) => {
        const { data } = await octokit.request(commit.url);
        return { sha: data.sha, stats: data.stats };
      })
    );

    // Calculate total stats for this event
    const totalStats = commitStats.reduce(
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

    return { id: event.id, totalStats, commits: commitStats };
  } catch (error) {
    console.error("Error getting github event statistics: ", error);
    throw error;
  }
}

export async function getAllEventStats(events) {
  try {
    // Get statistics for every event
    const eventStats = await Promise.all(
      events.map(async (event) => await getEventStats(event))
    );

    const totalStats = eventStats.reduce(
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

    return { totalStats, events: eventStats };
  } catch (error) {
    console.error("Error getting github event statistics: ", error);
    throw error;
  }
}
