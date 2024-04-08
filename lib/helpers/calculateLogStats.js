export default function calculateLogStats(logs) {
  return logs.reduce(
    (acc, log) => {
      acc.seconds += log.duration;
      acc.commits += log.commits;
      return acc;
    },
    {
      seconds: 0,
      commits: 0,
    }
  );
}
