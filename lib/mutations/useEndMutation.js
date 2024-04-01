import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endLog } from "../actions/logs";

export default function useEndMutation() {
  const queryClient = useQueryClient();

  const endMutation = useMutation({
    mutationFn: (props) => endLog(props),
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
        is_paused: false,
        end: time,
      }));

      queryClient.setQueryData(["log", "pauseEvents", logId], (old) => {
        const lastPauseEvent = old.at(-1);

        if (lastPauseEvent?.resumed_at || !lastPauseEvent) return old;

        old.at(-1).resumed_at = time;
        return old;
      });

      // Return a context object with the snapshotted value
      return { previousLog, previousPauseEvents };
    },
    onError: (err, logId, context) => {
      console.log(err);
      queryClient.setQueriesData(["log", "active"], context.previousLog);
    },
    onSuccess: () => (endedLog, err, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["log", "pauseEvents", variables.logId],
      });
      queryClient.invalidateQueries({
        queryKey: ["log", "active"],
      });
    },
  });
  return endMutation;
}
