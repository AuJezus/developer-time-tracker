import { calculateCommits } from "@/lib/helpers/calculateCommits";
import { BiLogoGithub } from "react-icons/bi";

function ActivitySummarry({ activity }) {
  return (
    <div className="text-sm flex gap-6">
      <div className="text-green-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
        ++ {activity.stats ? activity.stats.additions : 0}
      </div>
      <div className="text-red-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
        -- {activity.stats ? activity.stats.deletions : 0}
      </div>
      <div className="border-2 py-1 px-2 rounded-md flex items-center gap-2 hover:bg-secondary">
        <BiLogoGithub /> {calculateCommits(activity)}
      </div>
    </div>
  );
}

export default ActivitySummarry;
