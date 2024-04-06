"use server";

import { Octokit } from "@octokit/core";
import { createClient } from "../supabase/server";
import { refreshToken } from "@octokit/oauth-methods";

export async function createOctokit() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const { data: user, error } = await supabase
    .from("users")
    .select("provider_token, provider_refresh_token, provider_expires_at")
    .eq("id", data.user.id)
    .single();

  if (error) {
    console.error("Error creating octokit instance: ", error);
    throw error;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > user.provider_expires_at) {
    const newToken = await refreshProviderToken(user);
    user.provider_token = newToken;
  }

  return new Octokit({ auth: user.provider_token });
}

async function refreshProviderToken(user) {
  try {
    const supabase = createClient();
    const { data, authentication } = await refreshToken({
      clientType: "github-app",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      refreshToken: user.provider_refresh_token,
    });

    const currentTime = Math.floor(Date.now() / 1000);
    const { error } = await supabase.from("user").update({
      provider_token: data.access_token,
      refresh_token: data.refreshToken,
      expires_at: currentTime + data.expires_in,
    });

    if (error) throw error;

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing provider token: ", error);
    throw error;
  }
}
