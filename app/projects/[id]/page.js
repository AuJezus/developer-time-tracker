import LogList from "@/components/LogList";
import Stats from "@/components/Stats";
import BackLink from "@/components/ui/BackLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getProjectLogs } from "@/lib/actions/logs";
import { getProject } from "@/lib/actions/projects";
import calculateLogStats from "@/lib/helpers/calculateLogStats";
import Link from "next/link";
import { BiEdit, BiEditAlt, BiLogoGithub, BiTime } from "react-icons/bi";

async function ProjectsPage({ params: { id } }) {
  const project = await getProject(id);
  const logs = await getProjectLogs(id);

  const stats = calculateLogStats(logs);

  return (
    <main className="max-w-[1200px] mx-auto w-full mt-12 relative">
      <BackLink href="/projects">All projects</BackLink>

      <div className="text-center max-w-[800px] mx-auto mb-8">
        <h1 className="text-3xl font-semibold mb-2 flex justify-center gap-6 items-center">
          {project.name}
          <a href={project.github_repo_url}>
            <BiLogoGithub className="text-muted-foreground hover:text-primary-foreground transition-colors" />
          </a>
          <Link href={`/projects/${id}/edit`}>
            <BiEdit className="text-muted-foreground hover:text-yellow-500 transition-colors" />
          </Link>
        </h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <div className="border-t-2 pt-6 mb-8">
        <Stats
          durationInSecs={stats.seconds}
          logCount={logs.length}
          commitCount={stats.commits}
        />
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs" className="flex gap-2 items-center">
            <BiTime />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" asChild>
          <LogList logs={logs} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default ProjectsPage;
