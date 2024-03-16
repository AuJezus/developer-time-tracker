import { Octokit } from "@octokit/core";
import { redirect } from "next/dist/server/api-utils";

export async function getAuthUserRepos(token) {
  console.log(token);

  const octokit = new Octokit({ auth: token });

  const response = await octokit.request("GET /user/repos");

  if (response.status === 200) return response.data;

  return redirect("/error");
}
