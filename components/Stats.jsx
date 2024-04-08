import { BiLogoGithub, BiTask, BiTime } from "react-icons/bi";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);

function Stats({ durationInSecs, logCount, commitCount }) {
  const totalDuration = dayjs.duration(durationInSecs, "s");

  return (
    <div className="flex justify-around">
      <div>
        <p className="mb-4 text-sm">Total time logged:</p>
        <p className="flex items-center gap-3 ml-4 text-xl">
          <BiTime className="text-green-500" />
          {`${Math.floor(totalDuration.asHours())}hr ${totalDuration.format(
            "mm"
          )}min`}
        </p>
      </div>

      <div>
        <p className="mb-4 text-sm">Total logs:</p>
        <p className="flex items-center gap-3 ml-4 text-xl">
          <BiTask className="text-green-500" /> {logCount} logs
        </p>
      </div>

      <div>
        <p className="mb-4 text-sm">Github commits logged:</p>
        <p className="flex items-center gap-3 ml-4 text-xl">
          <BiLogoGithub className="text-green-500" /> {commitCount} commits
        </p>
      </div>
    </div>
  );
}

export default Stats;
