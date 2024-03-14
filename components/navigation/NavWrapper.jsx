import { createClient } from "@/lib/supabase/server";
import SideNav from "./SideNav";
import TopNav from "./TopNav";

async function NavWrapper({ children }) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) console.error(error);

  return (
    <div className="grid nav grid-rows-[auto_1fr] transition-all relative">
      <SideNav />
      <TopNav user={user} />
      <div className="h-[10000px]">{children}</div>
    </div>
  );
}

export default NavWrapper;
