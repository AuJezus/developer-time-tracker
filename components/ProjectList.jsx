import { BiLogoGithub, BiTime } from "react-icons/bi";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);

function Project({ project, logs }) {
  const stats = logs.reduce(
    (acc, log) => {
      acc.seconds += log.duration;
      acc.commits += log.commits;
      return acc;
    },
    { seconds: 0, commits: 0 }
  );

  const duration = dayjs.duration(stats.seconds, "s");

  return (
    <div className="border-2 group hover:border-primary transition-all hover:scale-105 rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <p className="text-lg">{project.name}</p>
        <a
          href="lol"
          className="text-sm flex items-center gap-1 transition-colors text-muted-foreground hover:text-primary-foreground w-fit"
        >
          <BiLogoGithub /> Github
        </a>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {project.description.slice(0, 120) + "..."}
      </p>
      <div className="flex justify-around h-full items-end text-sm text-muted-foreground group-hover:text-primary-foreground">
        <p className="flex items-center gap-1">
          <BiTime />
          {`${Math.floor(duration.asHours())}hr ${duration.format("m")}min`}
        </p>
        <p className="flex items-center gap-1">
          <BiLogoGithub /> {stats.commits}
        </p>
      </div>
    </div>
  );
}

function ProjectList({ projects, logs }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {projects.map((project) => (
        <Project
          key={project.id}
          project={project}
          logs={logs.filter((log) => log.project_id === project.id)}
        />
      ))}
    </div>
  );
}

export default ProjectList;
