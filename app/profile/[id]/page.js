import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getAllLogs } from "@/lib/actions/logs";
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

async function ProfilePage({ params: { id } }) {
  const user = await getUser();

  const logs = await getAllLogs();
  const projects = await getUserProjects();

  const stats = calculateLogStats(logs);

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
          <LogList logs={logs} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default ProfilePage;
