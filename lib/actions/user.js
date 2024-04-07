import { createClient } from "../supabase/server";

export async function getUser() {
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .single();
  console.log(user);

  if (error) {
    console.error("Error getting user: ", error);
  }

  return user;
}
