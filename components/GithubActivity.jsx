"use client";

import { getRepoActivity } from "@/lib/actions/github";
import { useQuery } from "@tanstack/react-query";
import { BiCategory, BiLogoGithub, BiTime } from "react-icons/bi";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import Link from "next/link";

dayjs.extend(duration);

const eventNames = {
  PushEvent: "Push",
};

function GithubActivity({ log }) {
  const { data: events, error } = useQuery({
    queryKey: ["log", "events", log.id],
    queryFn: () =>
      getRepoActivity("developer-time-tracker", new Date(log.start)),
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true,
  });

  if (!events) return;

  return (
    <div className="w-full">
      <p className="text-xl mb-6">Github activity</p>

      <div className="text-sm flex gap-6 mb-4">
        <div className="text-green-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
          ++ 459
        </div>
        <div className="text-red-500 border-2 py-1 px-2 rounded-md hover:bg-secondary">
          -- 100
        </div>
        <div className="border-2 py-1 px-2 rounded-md flex items-center gap-2 hover:bg-secondary">
          <BiLogoGithub /> {events.length}
        </div>
      </div>

      {!events.length && <p>Nothing on github yet</p>}

      {events && (
        <div className="grid grid-cols-3 gap-6 items-start">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-2 p-4 rounded-lg hover:border-primary transition-all hover:scale-105"
            >
              <p className="text-lg mb-3">
                {dayjs(event.created_at).format("HH:mm @MM-DD")}
              </p>

              <div className="flex gap-4 mb-2">
                <p className="text-sm mb-2 flex items-center gap-2">
                  <BiCategory /> {eventNames[event.type]}
                </p>
                <a
                  href={"https://github.com/" + event.repo.name}
                  target="_blank"
                  className="text-sm mb-2 flex items-center gap-2"
                >
                  <BiLogoGithub /> {event.repo.name.split("/")[1]}
                </a>
              </div>

              <div className="flex flex-wrap">
                {event.payload.commits.map((commit) => (
                  <div key={commit.sha} className="text-sm">
                    <a
                      href={[
                        "https://github.com",
                        event.repo.name,
                        "commit",
                        commit.sha,
                      ].join("/")}
                      target="_blank"
                      className="flex items-center gap-2 border-2 px-2 py-1 rounded-md hover:bg-secondary transition-colors"
                    >
                      <BiLogoGithub />
                      &quot;{commit.message}&quot;
                    </a>
                  </div>
                ))}
              </div>
              {console.log(event)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GithubActivity;
