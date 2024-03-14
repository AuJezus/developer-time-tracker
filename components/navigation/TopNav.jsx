"use client";

import useScrollUp from "@/lib/useScrollUp";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ButtonGithub from "../ButtonGithub";

function TopNav({ user }) {
  const isScrollUp = useScrollUp();

  return (
    <div
      className={`${
        isScrollUp ? "" : "-translate-y-full"
      } flex justify-between border-b-2 sticky top-0 items-center px-12 py-2 transition-transform`}
    >
      <p>dev-tracker</p>
      <p>currently working: 23</p>
      {user && (
        <>
          <Button>Start</Button>
          <div className="flex items-center gap-2">
            <p>{user.user_metadata.user_name}</p>
            <Avatar>
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </>
      )}

      {!user && <ButtonGithub />}
    </div>
  );
}

export default TopNav;
