import ButtonStartCode from "@/components/ButtonStartCode";
import GithubActivity from "@/components/GithubActivity";
import { getCurrentLog } from "@/lib/actions/logs";
import CatImage from "@/public/cat-nails.gif";
import Image from "next/image";

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
    <div>
      <p>00:32</p>
      <GithubActivity log={currentLog} />
    </div>
  );
}

export default WorkPage;
