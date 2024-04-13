import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getUserLogs } from "@/lib/actions/logs";
import Image from "next/image";
import {
  BiBeenHere,
  BiBriefcase,
  BiCabinet,
  BiCodeAlt,
  BiEnvelope,
  BiLogoGithub,
  BiTime,
} from "react-icons/bi";
import { getUserProjects } from "@/lib/actions/projects";
import ProjectList from "@/components/ProjectList";
import LogList from "@/components/LogList";
import { getUser } from "@/lib/actions/user";
import Stats from "@/components/Stats";
import calculateLogStats from "@/lib/helpers/calculateLogStats";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { notFound } from "next/navigation";
dayjs.extend(utc);
dayjs.extend(timezone);

async function ProfilePage({ params: { id } }) {
  const user = await getUser(id);

  if (!user) notFound();

  const logs = await getUserLogs(id);
  const projects = await getUserProjects(id);

  const stats = calculateLogStats(logs);

  const time = user.timezone ? dayjs().tz(user.timezone) : undefined;
  const githubUrl = `https://github.com/${user.github_username}`;

  return (
    <main className="pt-8 mb-12 max-w-[1200px] mx-auto w-full">
      <div className="flex border-b-2 p-6 justify-around mb-8">
        <div className="flex items-center gap-10">
          <Image
            className="border-2 object-cover aspect-square"
            src={user.avatar_url}
            alt={`${user.username}'s avatar picture`}
            width={100}
            height={100}
          />
          <div className="flex flex-col gap-3">
            <a href={githubUrl} className="flex gap-2">
              <h2 className="text-4xl font-semibold underline decoration-primary">
                {user.username}
              </h2>
              <BiLogoGithub className="text-sm" />
            </a>
            {user.title && (
              <p className="flex items-center gap-2 text-muted-foreground text-sm">
                <BiCodeAlt /> {user.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-center">
          <p className="flex items-center gap-2 text-sm">
            <BiLogoGithub /> Github:
            <a
              href={githubUrl}
              className="hover:text-foreground text-muted-foreground hover:underline"
            >
              {user.github_username}
            </a>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <BiEnvelope /> Email:
            <a
              href={`mailto:${user.email}`}
              className="hover:text-foreground text-muted-foreground hover:underline"
            >
              {user.email}
            </a>
          </p>
          {user.timezone && (
            <p className="flex items-center gap-2 text-sm">
              <BiTime /> Time:
              <span className="hover:text-foreground text-muted-foreground">
                {time.format("HH:mm")} (UTC +
                {(time.utcOffset() / 60).toString().padStart(2, "0")}:
                {(time.utcOffset() % 60).toString().padStart(2, "0")})
              </span>
            </p>
          )}
          {user.occupation && (
            <p className="flex items-center gap-2 text-sm">
              <BiBriefcase /> Occupation:
              <span className="hover:text-foreground text-muted-foreground">
                {user.occupation}
              </span>
            </p>
          )}
          {user.place && (
            <p className="flex items-center gap-2 text-sm">
              <BiBeenHere /> Lives in:
              <span className="hover:text-foreground text-muted-foreground">
                {user.place}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mb-10">
        <Stats
          durationInSecs={stats.seconds}
          logCount={logs.length}
          commitCount={stats.commits}
        />
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects" className="flex gap-2 items-center">
            <BiCabinet /> Projects
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex gap-2 items-center">
            <BiTime />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" asChild>
          <ProjectList projects={projects} logs={logs} />
        </TabsContent>

        <TabsContent value="logs" asChild>
          <LogList logs={logs} projects={projects} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default ProfilePage;
