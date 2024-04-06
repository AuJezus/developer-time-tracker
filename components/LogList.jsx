import { BiLogoGithub, BiTime } from "react-icons/bi";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);

function Log({ log }) {
  const duration = dayjs.duration(log.duration, "s");

  return (
    <div className="p-2 border-2 rounded-lg group cursor-pointer hover:scale-105 transition-all hover:border-primary">
      <p className="mb-2 text-center">
        {dayjs(log.start).format("YYYY-MM-DD HH:mm")}
      </p>
      <div className="flex justify-around text-sm text-muted-foreground group-hover:text-primary-foreground transition-colors">
        <p className="gap-1 flex items-center">
          <BiTime className="group-hover:text-yellow-500 transition-colors" />
          {`${Math.floor(duration.asHours())}hr ${duration.format("m")}min`}
        </p>
        <p className="gap-1 flex items-center">
          <BiLogoGithub className="group-hover:text-neutral-300 transition-colors" />
          {log.commits}
        </p>
      </div>
    </div>
  );
}

function LogList({ logs }) {
  return (
    <div className="grid-cols-4 w-full grid gap-8">
      {logs.map((log) => (
        <Log key={log.id} log={log} />
      ))}
    </div>
  );
}

export default LogList;
