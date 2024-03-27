"use client";

import { getRepoActivity } from "@/lib/actions/github";
import { useQuery } from "@tanstack/react-query";
import { BiLogoGithub } from "react-icons/bi";
import GithubEventList from "./GithubEventList";
import { getActiveLog } from "@/lib/actions/logs";

function GithubActivity() {
  const { data: log, errorLog } = useQuery({
    queryKey: ["log", "active"],
    queryFn: () => getActiveLog(),
  });

  const { data: project } = useQuery({
    queryKey: ["project", log?.project_id],
    queryFn: () => getProject(log.project_id),
    enabled: !!log,
  });

  const { data: activity } = useQuery({
    queryKey: ["log", "activity", log?.id],
    queryFn: () => getRepoActivity(project.github_repo_id, log.start, log.end),
    enabled: !!project?.github_repo_id,
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: true,
  });

  if (!activity) return <p>Loading...</p>;

  return (
    <div className="w-full">
      <p className="text-xl mb-6">Github activity</p>

      <div className="text-sm flex gap-6 mb-4">
        <div className="text-green-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
          ++ {activity.stats ? activity.stats.additions : 0}
        </div>
        <div className="text-red-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
          -- {activity.stats ? activity.stats.deletions : 0}
        </div>
        <div className="border-2 py-1 px-2 rounded-md flex items-center gap-2 hover:bg-secondary">
          <BiLogoGithub /> {activity.events.length}
        </div>
      </div>

      {!activity.events.length && <p>Nothing on github yet</p>}

      {activity.events && <GithubEventList events={activity.events} />}
    </div>
  );
}

export default GithubActivity;
