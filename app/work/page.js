import ButtonStartCode from "@/components/ButtonStartCode";
import GithubActivity from "@/components/GithubActivity";
import LogTimer from "@/components/LogTimer";
import { Button } from "@/components/ui/Button";
import { getCurrentLog } from "@/lib/actions/logs";
import CatImage from "@/public/cat-nails.gif";
import Image from "next/image";
import { BiCircle } from "react-icons/bi";
import * as dayjs from "dayjs";

async function WorkPage() {
  const currentLog = await getCurrentLog();

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

        <div className="flex items-center gap-4 mb-6 justify-center">
          <BiCircle className="text-green-500 text-3xl" />
          <LogTimer startDate={currentLog.start} className="text-7xl" />
        </div>

        <div className="flex gap-6 justify-center">
          <Button variant="outline">Pause</Button>
          <Button variant="destructive">End</Button>
        </div>
      </div>

      <GithubActivity log={currentLog} />
    </main>
  );
}

export default WorkPage;
