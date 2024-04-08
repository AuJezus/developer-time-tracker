import ProjectList from "@/components/ProjectList";
import { getAllLogs } from "@/lib/actions/logs";
import { getUserProjects } from "@/lib/actions/projects";

async function ProjectsPage() {
  const projects = await getUserProjects();
  const logs = await getAllLogs();

  return (
    <main className="max-w-[1200px] mx-auto w-full mt-12">
      <h1 className="text-3xl font-semibold mb-2">Your projects</h1>
      <p className="text-muted-foreground mb-8">
        List of all your projects, click them to get more insights into each
        one.
      </p>
      <ProjectList projects={projects} logs={logs} />
    </main>
  );
}

export default ProjectsPage;
