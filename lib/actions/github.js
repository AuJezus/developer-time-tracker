"use server";

import { createOctokit } from "../github/utils";

export async function getRepoEvents(id, start, end) {
  try {
    const octokit = await createOctokit();
    const response = await octokit.request("GET /repositories/{id}/events", {
      id,
      per_page: 100,
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
    const octokit = await createOctokit();
    // Get every commit statistics
    const commitStats = event.payload.commits
      ? await Promise.all(
          event.payload.commits.map(async (commit) => {
            const { data } = await octokit.request(commit.url);
            return { sha: data.sha, stats: data.stats };
          })
        )
      : [];

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

export async function getUserRepos() {
  try {
    const octokit = await createOctokit();

    const response = await octokit.request("GET /user/repos");

    return response.data;
  } catch (error) {
    console.error("Error getting user repos: ", error);
    throw error;
  }
}

export async function getRepoUrl(id) {
  try {
    const octokit = await createOctokit();

    const response = await octokit.request(
      "GET /repositories/{repository_id}",
      { repository_id: id }
    );

    return response.data.html_url;
  } catch (error) {
    console.error("Error getting user repos: ", error);
    throw error;
  }
}
