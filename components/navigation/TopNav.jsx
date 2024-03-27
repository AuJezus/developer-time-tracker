"use client";

import useScrollUp from "@/lib/helpers/useScrollUp";
import ButtonGithub from "../ButtonGithub";
import { BiCircle } from "react-icons/bi";
import ButtonStartCode from "../ButtonStartCode";
import { useQuery } from "@tanstack/react-query";
import { getActiveLog } from "@/lib/actions/logs";
import TopNavUser from "./TopNavUser";
import Link from "next/link";

function TopNav({ user }) {
  const isScrollUp = useScrollUp();

  const { data: log, errorLog } = useQuery({
    queryKey: ["log", "active"],
    queryFn: () => getActiveLog(),
  });

  return (
    <div
      className={`${
        isScrollUp ? "" : "-translate-y-full"
      } flex justify-between border-b-2 sticky top-0 bg-background items-center px-12 py-2 transition-transform`}
    >
      <p className="text-2xl font-bold">dev-tracker</p>
      <div className="flex items-center text-sm gap-1">
        <p>coding: 23</p>
        <BiCircle className="text-green-500" />
      </div>
      {user && (
        <>
          {log && <Link href="/work">In progress</Link>}
          {!log && <ButtonStartCode userId={user.id} />}
          <TopNavUser user={user} />
        </>
      )}

      {!user && <ButtonGithub />}
    </div>
  );
}

export default TopNav;
