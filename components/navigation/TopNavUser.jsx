import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

import { BiTerminal, BiUser, BiUserX, BiWrench } from "react-icons/bi";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "../ui/NavigationMenu";
import { signOut } from "@/lib/actions/auth";

function TopNavUser({ user }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Link href="/profile" className="flex items-center gap-2 group">
              <BiUser />
              <p>{user.user_metadata.user_name}</p>
              <Avatar className="border-2 group-hover:border-transparent transition-colors">
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent asChild>
            <ul className="flex xl:w-[200px] flex-col p-2 divide-y-2 text-sm">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href={"/profile"}
                    className="flex gap-2 items-center py-2 hover:bg-secondary px-4 transition-colors"
                  >
                    <BiUser /> Profile
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href={"/settings"}
                    className="flex gap-2 items-center py-2 hover:bg-secondary px-4 transition-colors"
                  >
                    <BiWrench /> Settings
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href={"/projects"}
                    className="flex gap-2 items-center py-2 hover:bg-secondary px-4 transition-colors"
                  >
                    <BiTerminal /> My Projects
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <form
                    action={signOut}
                    className="py-2 hover:bg-secondary px-4 transition-colors"
                  >
                    <button className="flex gap-2 items-center" type="submit">
                      <BiUserX /> Sign out
                    </button>
                  </form>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default TopNavUser;
