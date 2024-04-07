import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getAllLogs } from "@/lib/actions/logs";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import {
  BiBeenHere,
  BiBriefcase,
  BiCabinet,
  BiCodeAlt,
  BiEnvelope,
  BiLogoGithub,
  BiTask,
  BiTime,
} from "react-icons/bi";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import { getUserProjects } from "@/lib/actions/projects";
import ProjectList from "@/components/ProjectList";
import LogList from "@/components/LogList";
import { getUser } from "@/lib/actions/user";
dayjs.extend(duration);

async function ProfilePage({ params: { id } }) {
  const user = await getUser();

  const logs = await getAllLogs();
  const projects = await getUserProjects();

  const stats = logs.reduce(
    (acc, log) => {
      acc.seconds += log.duration;
      acc.commits += log.commits;
      return acc;
    },
    {
      seconds: 0,
      commits: 0,
    }
  );

  const totalDuration = dayjs.duration(stats.seconds, "s");

  return (
    <main className="pt-8 mb-12 max-w-[1200px] mx-auto w-full">
      <div className="flex border-b-2 p-6 justify-around mb-8">
        <div className="flex items-center gap-10">
          <div className="relative w-24 h-24">
            <Image
              className="border-2"
              src={user.avatar_url}
              alt={`${user.username}'s avatar picture`}
              fill
            />
          </div>
          <div className="flex flex-col gap-3">
            <a href="https://github.com/AuJezus" className="flex gap-2">
              <h2 className="text-4xl font-semibold underline decoration-primary">
                {user.username}
              </h2>
              <BiLogoGithub className="text-sm" />
            </a>
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <BiCodeAlt /> Fullstack web developer
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm">
            <BiEnvelope /> Email:
            <a
              href="mailto:augispay@gmail.com"
              className="hover:text-foreground text-muted-foreground hover:underline"
            >
              augispay@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <BiTime /> Time:
            <span className="hover:text-foreground text-muted-foreground">
              08:07 (UTC +02:00)
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <BiBriefcase /> Occupation:
            <span className="hover:text-foreground text-muted-foreground">
              High-School student
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <BiBeenHere /> Lives in:
            <span className="hover:text-foreground text-muted-foreground">
              Lithuania, Vilnius
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-around mb-10">
        <div>
          <p className="mb-4 text-sm">Total time logged:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiTime className="text-green-500" />{" "}
            {`${Math.floor(totalDuration.asHours())}hr ${totalDuration.format(
              "mm"
            )}min`}
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm">Total logs:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiTask className="text-green-500" /> {logs.length} logs
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm">Github commits logged:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiLogoGithub className="text-green-500" /> {stats.commits} commits
          </p>
        </div>
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
          <LogList logs={logs} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default ProfilePage;
