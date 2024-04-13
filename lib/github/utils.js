"use server";

import { Octokit } from "@octokit/core";
import { createClient } from "../supabase/server";
import { refreshToken } from "@octokit/oauth-methods";

export async function createOctokit() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const { data: token, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("user_id", data.user.id)
    .single();

  if (error) {
    console.error("Error creating octokit instance: ", error);
    throw error;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > token.provider_expires_at) {
    const newToken = await refreshProviderToken(token, token.user_id);
    token.provider_token = newToken.access_token;
  }

  return new Octokit({ auth: token.provider_token });
}

export async function refreshProviderToken(token, userId) {
  try {
    const supabase = createClient();
    const { data, authentication } = await refreshToken({
      clientType: "github-app",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      refreshToken: token.provider_refresh_token,
    });

    const currentTime = Math.floor(Date.now() / 1000);
    const { error } = await supabase.from("tokens").upsert({
      user_id: userId,
      provider_token: data.access_token,
      provider_refresh_token: data.refresh_token,
      provider_expires_at: currentTime + data.expires_in,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error refreshing provider token: ", error);
    throw error;
  }
}
