import { getRepoActivity } from "@/lib/actions/github";

async function GithubActivity({ log }) {
  const a = await getRepoActivity("developer-time-tracker", Date(log.start));
  return <div>a</div>;
}

export default GithubActivity;
