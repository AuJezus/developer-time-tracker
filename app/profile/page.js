import { createClient } from "@/lib/supabase/server";

async function ProfilePage() {
  const supabase = createClient();
  const { data: users } = await supabase.from("users").select("*");
  console.log(users);
  return <div>{users[0].id}</div>;
}

export default ProfilePage;
