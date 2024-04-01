import WorkActivity from "@/components/WorkActivity";
import WorkTimer from "@/components/WorkTimer";
import { getActiveLog, getLogPauseEvents } from "@/lib/actions/logs";
import CatImage from "@/public/cat-nails.gif";
import Image from "next/image";
import * as dayjs from "dayjs";
import calculateDuration from "@/lib/helpers/calculateDuration";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getRepoActivity } from "@/lib/actions/github";
import { getProject } from "@/lib/actions/projects";
import Quote from "@/components/Quote";
import { getRandomQuote } from "@/lib/actions/quotes";

async function WorkPage() {
  const queryClient = new QueryClient();

  const log = await queryClient.fetchQuery({
    queryKey: ["log", "active"],
    queryFn: () => getActiveLog(),
  });

  if (!log)
    return (
      <main className="max-w-[1000px] mx-auto flex items-center flex-col gap-6 flex-auto justify-center">
        <h1 className="text-4xl">No log started!</h1>
        <p className="max-w-lg text-center">
          You haven&apos;t started any logs! Use the button inside navigation
          bar to start tracking your time.
        </p>
        <Image src={CatImage} alt="Cat filing his nails" />
      </main>
    );

  const pauseEvents = await queryClient.fetchQuery({
    queryKey: ["log", "pauseEvents", log.id],
    queryFn: () => getLogPauseEvents(log.id),
  });

  const initialDuration = calculateDuration(log, pauseEvents);

  const project = await queryClient.fetchQuery({
    queryKey: ["project", log.project_id],
    queryFn: () => getProject(log.project_id),
  });

  const activity = await queryClient.fetchQuery({
    queryKey: ["log", "activity", log.id],
    queryFn: () => getRepoActivity(project.github_repo_id, log.start, log.end),
  });

  const quote = await queryClient.fetchQuery({
    queryKey: ["quote"],
    queryFn: () => getRandomQuote(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="max-w-[1000px] mx-auto w-full">
        <div className="mb-6 divide-y">
          <div className="pb-6 pt-12">
            <p className="text-center mb-2">
              {dayjs(log.start).format("YYYY MMM D, ddd HH:mm")}
            </p>

            <WorkTimer
              initialDuration={initialDuration.format("PD[D]TH[H]m[M]s[S]")}
            />
          </div>

          <div className="py-6">
            <Quote />
          </div>

          <div className="py-6">
            <WorkActivity log={log} />
          </div>
        </div>
      </main>
    </HydrationBoundary>
  );
}

export default WorkPage;
