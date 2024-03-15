"use client";

import useScrollUp from "@/lib/useScrollUp";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ButtonGithub from "../ButtonGithub";
import { BiCircle, BiTerminal, BiTime, BiUser, BiWrench } from "react-icons/bi";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "../ui/NavigationMenu";

export function TopNavUser({ user }) {
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
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function TopNav({ user }) {
  const isScrollUp = useScrollUp();

  return (
    <div
      className={`${
        isScrollUp ? "" : "-translate-y-full"
      } flex justify-between border-b-2 sticky top-0 items-center px-12 py-2 transition-transform`}
    >
      <p className="text-2xl font-bold">dev-tracker</p>
      <div className="flex items-center text-sm gap-1">
        <p>coding: 23</p>
        <BiCircle className="text-green-500" />
      </div>
      {user && (
        <>
          <Button variant="outline" className="gap-2" size="sm">
            Start Coding <BiTime className="text-lg" />
          </Button>
          <TopNavUser user={user} />
        </>
      )}

      {!user && <ButtonGithub />}
    </div>
  );
}

export default TopNav;
