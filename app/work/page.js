import ButtonStartCode from "@/components/ButtonStartCode";
import GithubActivity from "@/components/GithubActivity";
import LogTimer from "@/components/LogTimer";
import { Button } from "@/components/ui/Button";
import { getCurrentLog, getLogPauseEvents, pauseLog } from "@/lib/actions/logs";
import CatImage from "@/public/cat-nails.gif";
import Image from "next/image";
import { BiCircle } from "react-icons/bi";
import * as dayjs from "dayjs";
import { calculateTimespan } from "@/lib/utils";

async function WorkPage() {
  const currentLog = await getCurrentLog();
  const pauseEvents = await getLogPauseEvents(currentLog.id);
  const initialDuration = calculateTimespan(currentLog, pauseEvents);

  if (!currentLog)
    return (
      <main className="max-w-[1000px] mx-auto flex items-center flex-col gap-6 flex-auto justify-center">
        <h1 className="text-4xl">No log started!</h1>
        <p className="max-w-lg text-center">
          You haven't started any logs! Use the button inside navigation bar to
          start tracking your time.
        </p>
        <Image src={CatImage} alt="Cat filing his nails" />
      </main>
    );

  return (
    <main className="max-w-[1000px] mx-auto pt-12 w-full">
      <div className="mb-6 border-b-2 pb-6">
        <p className="text-center mb-2">
          {dayjs(currentLog.start).format("YYYY MMM D, ddd HH:mm")}
        </p>

        <LogTimer
          initialLog={currentLog}
          initialPauseEvents={pauseEvents}
          initialDuration={initialDuration.format("PD[D]TH[H]m[M]s[S]")}
        />
      </div>

      <GithubActivity log={currentLog} />
    </main>
  );
}

export default WorkPage;
