"use client";

import { getAllEventStats, getRepoEvents } from "@/lib/actions/github";
import { useQuery } from "@tanstack/react-query";
import { BiLogoGithub } from "react-icons/bi";
import GithubEventList from "./GithubEventList";

function GithubActivity({ log }) {
  const { data: events } = useQuery({
    queryKey: ["log", "repoEvents", log.id],
    queryFn: () => getRepoEvents("developer-time-tracker", new Date(log.start)),
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: true,
  });

  const { data: repoStats } = useQuery({
    queryKey: ["log", "repoStats", log.id],
    queryFn: () => getAllEventStats(events),
    enabled: !!events,
  });

  return (
    <div className="w-full">
      <p className="text-xl mb-6">Github activity</p>

      <div className="text-sm flex gap-6 mb-4">
        <div className="text-green-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
          ++ {repoStats ? repoStats.totalStats.additions : 0}
        </div>
        <div className="text-red-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
          -- {repoStats ? repoStats.totalStats.deletions : 0}
        </div>
        <div className="border-2 py-1 px-2 rounded-md flex items-center gap-2 hover:bg-secondary">
          <BiLogoGithub /> {events.length}
        </div>
      </div>

      {!events.length && <p>Nothing on github yet</p>}

      {events && <GithubEventList events={events} repoStats={repoStats} />}
    </div>
  );
}

export default GithubActivity;
