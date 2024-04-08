import Timer from "@/components/Timer";
import { getLog } from "@/lib/actions/logs";
import { notFound } from "next/navigation";
import ActivitySummarry from "@/components/ActivitySummarry";
import ActivityEventList from "@/components/ActivityEventList";
import { getProject } from "@/lib/actions/projects";
import { getRepoActivity } from "@/lib/actions/github";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import BackLink from "@/components/ui/BackLink";
dayjs.extend(duration);

async function LogPage({ params: { id } }) {
  const log = await getLog(id);

  if (!log) notFound();

  const duration = dayjs.duration(log.duration, "s");

  const project = await getProject(log.project_id);

  const activity = await getRepoActivity(
    project.github_repo_id,
    log.start,
    log.end
  );

  return (
    <main className="max-w-[1000px] mx-auto w-full relative mt-6">
      <BackLink href="/logs">All logs</BackLink>

      <div className="mb-6 divide-y">
        <div className="py-6">
          <p className="text-center mb-2">
            {dayjs(log.start).format("YYYY MMM D, ddd HH:mm")}
          </p>

          <Timer log={log} duration={duration} />
        </div>

        <div className="py-6">
          <p className="text-xl mb-6">Github activity</p>

          <div className="mb-4">
            <ActivitySummarry activity={activity} />
          </div>

          {!activity.events.length && <p>Nothing on github.</p>}

          {activity.events && <ActivityEventList events={activity.events} />}
        </div>
      </div>
    </main>
  );
}

export default LogPage;
