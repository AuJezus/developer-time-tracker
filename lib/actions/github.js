"use server";

import { Octokit } from "@octokit/core";
import { refreshToken } from "@octokit/oauth-methods";
import { createClient } from "../supabase/server";
import { PROVIDER_REFRESH_INTERVAL } from "@/app/auth/confirm/route";

let octokit;
await init();

async function init() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: user, error } = await supabase
    .from("users")
    .select("provider_token, provider_refresh_token, provider_expires_at")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > user.provider_expires_at) await refreshProviderToken(user);
  else addRefreshTimeout(user.provider_expires_at - currentTime, user);
}

async function refreshProviderToken(user) {
  const { data, authentication } = await refreshToken({
    clientType: "github-app",
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    refreshToken: user.provider_refresh_token,
  });

  const currentTime = Math.floor(Date.now() / 1000);
  const { error } = await supabase.from("user").update({
    provider_token: data.access_token,
    refresh_token: data.refreshToken,
    expires_at: currentTime + data.expires_in,
  });

  addRefreshTimeout(data.expires_in, user);

  octokit = new Octokit({ auth: data.access_token });
}

async function addRefreshTimeout(time, user) {
  octokit = new Octokit({ auth: user.provider_token });
  return setTimeout(() => refreshProviderToken(user), time * 1000);
}

export async function getRepoEvents(id, start, end) {
  try {
    const response = await octokit.request("GET /repositories/{id}/events", {
      id,
    });

    start = new Date(start);
    end = end ? new Date(end) : new Date();

    const filteredEvents = response.data.filter((event) => {
      const createdAt = new Date(event.created_at);
      return createdAt > start && createdAt < end;
    });

    return filteredEvents;
  } catch (error) {
    console.error("Error getting repository events: ", error);
    throw error;
  }
}

export async function populateEventWithStats(event) {
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

    return { ...event, stats: totalStats };
  } catch (error) {
    console.error("Error populating github event with stats: ", error);
    throw error;
  }
}

export async function populateEventsWithStats(events) {
  try {
    const eventsWithStats = await Promise.all(
      events.map(async (event) => await populateEventWithStats(event))
    );

    const totalStats = eventsWithStats.reduce(
      (acc, event) => {
        acc.total += event.stats.total;
        acc.additions += event.stats.additions;
        acc.deletions += event.stats.deletions;
        return acc;
      },
      {
        total: 0,
        additions: 0,
        deletions: 0,
      }
    );

    return { stats: totalStats, events: eventsWithStats };
  } catch (error) {
    console.error("Error populating github events with stats: ", error);
    throw error;
  }
}

export async function getRepoActivity(repoId, start, end) {
  try {
    const events = await getRepoEvents(repoId, start, end);

    const eventsWithStats = populateEventsWithStats(events);

    return eventsWithStats;
  } catch (error) {
    console.error("Error getting repo activity: ", error);
    throw error;
  }
}
