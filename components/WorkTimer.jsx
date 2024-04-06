"use client";

import { useEffect, useState } from "react";
import * as duration from "dayjs/plugin/duration";
import * as dayjs from "dayjs";
import { Button } from "./ui/Button";
import { getActiveLog, getLogPauseEvents } from "@/lib/actions/logs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePauseMutation from "@/lib/mutations/usePauseMutation";
import useResumeMutation from "@/lib/mutations/useResumeMutation";
import useEndMutation from "@/lib/mutations/useEndMutation";
import calculateDuration from "@/lib/helpers/calculateDuration";
import Timer from "./Timer";
dayjs.extend(duration);

function WorkTimer({ initialDuration }) {
  const queryClient = useQueryClient();

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

  const isPending =
    pauseMutation.isPending ||
    resumeMutation.isPending ||
    endMutation.isPending ||
    !!log?.end;

  const [duration, setDuration] = useState(dayjs.duration(initialDuration));

  function calculateCommits() {
    const activity = queryClient.getQueryData([["log", "activity", log?.id]]);
    return activity?.events?.length || 0;
  }

  useEffect(() => {
    if (log?.is_paused || log?.end) return;

    const interval = setInterval(
      () => setDuration(calculateDuration(log, pauseEvents)),
      1000
    );

    return () => clearInterval(interval);
  }, [log, pauseEvents]);

  if (!log) return <p>Loading...</p>;

  return (
    <div>
      <Timer log={log} duration={duration} />

      <div className="flex gap-6 justify-center">
        {!log.is_paused && (
          <Button
            onClick={() =>
              pauseMutation.mutate({
                logId: log.id,
                time: dayjs().toISOString(),
              })
            }
            disabled={isPending}
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
            disabled={isPending}
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
              duration: Math.floor(duration.asSeconds()),
              commits: calculateCommits(),
            })
          }
          disabled={isPending}
          variant="destructive"
        >
          End
        </Button>
      </div>
    </div>
  );
}

export default WorkTimer;
