"use client";

import { getRepoActivity } from "@/lib/actions/github";
import { useQuery } from "@tanstack/react-query";
import ActivityEventList from "./ActivityEventList";
import { getActiveLog } from "@/lib/actions/logs";
import ActivitySummarry from "./ActivitySummarry";

function WorkActivity() {
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
    <div>
      <p className="text-xl mb-6">Github activity</p>

      <div className="mb-4">
        <ActivitySummarry activity={activity} />
      </div>

      {!activity.events.length && <p>Nothing on github yet</p>}

      {activity.events && <ActivityEventList events={activity.events} />}
    </div>
  );
}

export default WorkActivity;
