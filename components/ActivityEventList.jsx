import { BiCategory, BiLogoGithub } from "react-icons/bi";
import * as dayjs from "dayjs";

const eventNames = { PushEvent: "Push" };

function ActivityEvent({ event }) {
  return (
    <div className="border-2 text-sm text-muted-foreground hover:text-primary-foreground group p-4 rounded-lg hover:border-primary transition-all hover:scale-105">
      <p className="text-lg mb-3 text-primary-foreground">
        {dayjs(event.created_at).format("HH:mm @MM-DD")}
      </p>

      <div className="flex gap-x-4 mb-4 flex-wrap transition-colors">
        <p className="mb-2 flex items-center gap-2">
          <BiCategory /> {eventNames[event.type]}
        </p>
        <a
          href={"https://github.com/" + event.repo.name}
          target="_blank"
          className="mb-2 flex items-center gap-2"
        >
          <BiLogoGithub /> {event.repo.name.split("/")[1]}
        </a>
        <p className="text-green-800 group-hover:text-green-500 transition-colors">
          ++ {event.stats.additions}
        </p>
        <p className="text-red-800 group-hover:text-red-500 transition-colors">
          -- {event.stats.deletions}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
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
              className="flex gap-2 border-2 px-2 py-1 rounded-md hover:bg-secondary transition-colors items-baseline"
            >
              <BiLogoGithub className="flex-shrink-0" />
              &quot;{commit.message}&quot;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityEventList({ events }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {events.map((event) => (
        <ActivityEvent key={event.id} event={event} />
      ))}
    </div>
  );
}

export default ActivityEventList;
