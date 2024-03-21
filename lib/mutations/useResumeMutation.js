import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeLog } from "../actions/logs";

export default function useResumeMutation() {
  const queryClient = useQueryClient();

  const resumeMutation = useMutation({
    mutationFn: resumeLog,
    onMutate: async ({ logId, time }) => {
      await queryClient.cancelQueries({ queryKey: ["log", logId] });
      await queryClient.cancelQueries({
        queryKey: ["log", "pauseEvents", logId],
      });

      const previousLog = queryClient.getQueryData(["log", logId]);
      const previousPauseEvents = queryClient.getQueryData([
        "log",
        "pauseEvents",
        logId,
      ]);

      queryClient.setQueryData(["log", logId], (old) => ({
        ...old,
        is_paused: false,
      }));

      queryClient.setQueryData(["log", "pauseEvents", logId], (old) => {
        old.at(-1).resumed_at = time;
        return old;
      });

      // Return a context object with the snapshotted value
      return { previousLog, previousPauseEvents };
    },
    onError: (err, logId, context) => {
      console.log(err);
      queryClient.setQueriesData(["log", logId], context.previousLog);
    },
    onSuccess: ({ log }, err, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["log", "pauseEvents", log.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["log", log.id],
      });
    },
  });

  return resumeMutation;
}
