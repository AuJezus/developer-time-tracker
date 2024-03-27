"use client";

import { useEffect, useState } from "react";
import * as duration from "dayjs/plugin/duration";
import * as dayjs from "dayjs";
import { BiCircle } from "react-icons/bi";
import { Button } from "./ui/Button";
import { getActiveLog, getLogPauseEvents } from "@/lib/actions/logs";
import { useQuery } from "@tanstack/react-query";
import usePauseMutation from "@/lib/mutations/usePauseMutation";
import useResumeMutation from "@/lib/mutations/useResumeMutation";
import useEndMutation from "@/lib/mutations/useEndMutation";
import calculateTimespan from "@/lib/helpers/calculateTimespan";
dayjs.extend(duration);

function LogTimer({ initialDuration }) {
  const { data: log, errorLog } = useQuery({
    queryKey: ["log", "active"],
    queryFn: () => getActiveLog(),
  });

  const { data: pauseEvents, errorPauseEvents } = useQuery({
    queryKey: ["log", "pauseEvents", log?.id],
    queryFn: () => getLogPauseEvents(log.id),
    enabled: !!log?.id,
  });

  const pauseMutation = usePauseMutation();
  const resumeMutation = useResumeMutation();
  const endMutation = useEndMutation();

  const [timeSpan, setTimeSpan] = useState(dayjs.duration(initialDuration));

  useEffect(() => {
    if (log?.is_paused || log?.end) return;

    const interval = setInterval(
      () => setTimeSpan(calculateTimespan(log, pauseEvents)),
      1000
    );

    return () => clearInterval(interval);
  }, [log, pauseEvents]);

  if (!log) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 justify-center">
        <BiCircle
          className={`${log.end ? "!text-red-500" : ""} ${
            log.is_paused ? "text-yellow-500" : "text-green-500"
          } text-3xl`}
        />
        <div className="text-7xl">{`${Math.floor(
          timeSpan.asHours()
        )}:${timeSpan.format("mm:ss")}`}</div>
      </div>

      <div className="flex gap-6 justify-center">
        {!log.is_paused && (
          <Button
            onClick={() =>
              pauseMutation.mutate({
                logId: log.id,
                time: dayjs().toISOString(),
              })
            }
            variant="outline"
          >
            Pause
          </Button>
        )}
        {log.is_paused && (
          <Button
            onClick={() =>
              resumeMutation.mutate({
                logId: log.id,
                time: dayjs().toISOString(),
              })
            }
            variant="outline"
          >
            Resume
          </Button>
        )}
        <Button
          onClick={() =>
            endMutation.mutate({
              logId: log.id,
              time: dayjs().toISOString(),
            })
          }
          variant="destructive"
        >
          End
        </Button>
      </div>
    </div>
  );
}

export default LogTimer;
