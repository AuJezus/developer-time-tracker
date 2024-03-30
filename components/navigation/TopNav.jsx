"use client";

import useScrollUp from "@/lib/helpers/useScrollUp";
import ButtonGithub from "../ButtonGithub";
import { BiCircle, BiUser } from "react-icons/bi";
import ButtonStartCode from "../ButtonStartCode";
import { useQuery } from "@tanstack/react-query";
import { getActiveLog, getActiveLogCount } from "@/lib/actions/logs";
import TopNavUser from "./TopNavUser";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";

function TopNav({ user }) {
  const isScrollUp = useScrollUp();

  const { data: count, error: errorCount } = useQuery({
    queryKey: ["logs", "active", "count"],
    queryFn: () => getActiveLogCount(),
  });

  const { data: log, error: errorLog } = useQuery({
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
        <p>coding: {count}</p>
        <BiUser />
      </div>
      {user && (
        <>
          {log && (
            <Link
              href="/work"
              className={`${buttonVariants({ variant: "secondary" })} gap-2`}
            >
              <BiCircle className="text-green-500" />
              In progress
            </Link>
          )}
          {!log && <ButtonStartCode userId={user.id} />}
          <TopNavUser user={user} />
        </>
      )}

      {!user && <ButtonGithub />}
    </div>
  );
}

export default TopNav;
