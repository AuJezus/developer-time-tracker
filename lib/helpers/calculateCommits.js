export function calculateCommits(activity) {
  const commits = activity?.events?.reduce(
    (acc, e) => acc + (e.payload.size || 0),
    0
  );
  return commits || 0;
}
