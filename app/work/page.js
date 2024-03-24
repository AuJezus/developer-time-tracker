import GithubActivity from "@/components/GithubActivity";
import LogTimer from "@/components/LogTimer";
import { getActiveLog, getLogPauseEvents } from "@/lib/actions/logs";
import CatImage from "@/public/cat-nails.gif";
import Image from "next/image";
import * as dayjs from "dayjs";
import calculateTimespan from "@/lib/helpers/calculateTimespan";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

async function WorkPage() {
  const queryClient = new QueryClient();

  const log = await queryClient.fetchQuery({
    queryKey: ["log", "active"],
    queryFn: getActiveLog,
  });

  const pauseEvents = await queryClient.fetchQuery({
    queryKey: ["log", "pauseEvents", log.id],
    queryFn: () => getLogPauseEvents(log.id),
  });

  const initialDuration = calculateTimespan(log, pauseEvents);
  console.log(log, pauseEvents);

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="max-w-[1000px] mx-auto pt-12 w-full">
        <div className="mb-6 border-b-2 pb-6">
          <p className="text-center mb-2">
            {dayjs(log.start).format("YYYY MMM D, ddd HH:mm")}
          </p>

          <LogTimer
            initialDuration={initialDuration.format("PD[D]TH[H]m[M]s[S]")}
          />
        </div>

        <GithubActivity log={log} />
      </main>
    </HydrationBoundary>
  );
}

export default WorkPage;
