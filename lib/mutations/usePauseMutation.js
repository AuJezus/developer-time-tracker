import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pauseLog } from "../actions/logs";

function updatePausedEvents(old) {}

export default function usePauseMutation() {
  const queryClient = useQueryClient();

  const pauseMutation = useMutation({
    mutationFn: pauseLog,
    onMutate: async ({ logId, time }) => {
      await queryClient.cancelQueries({ queryKey: ["log", "active"] });
      await queryClient.cancelQueries({
        queryKey: ["log", "pauseEvents", logId],
      });

      const previousLog = queryClient.getQueryData(["log", "active"]);
      const previousPauseEvents = queryClient.getQueryData([
        "log",
        "pauseEvents",
        logId,
      ]);

      queryClient.setQueryData(["log", "active"], (old) => ({
        ...old,
        is_paused: true,
      }));

      queryClient.setQueryData(["log", "pauseEvents", logId], (old) => [
        ...old,
        { log_id: logId, paused_at: time },
      ]);

      // Return a context object with the snapshotted value
      return { previousLog, previousPauseEvents };
    },
    onError: (err, logId, context) => {
      console.log(err);
      queryClient.setQueriesData(["log", "active"], context.previousLog);
    },
    onSettled: (pausedLog, err, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["log", "pauseEvents", pausedLog.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["log", "active"],
      });
    },
  });

  return pauseMutation;
}
