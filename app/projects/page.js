import ProjectList from "@/components/ProjectList";
import { Button } from "@/components/ui/Button";
import { getCurrentUserLogs } from "@/lib/actions/logs";
import { getCurrentUserProjects } from "@/lib/actions/projects";
import Link from "next/link";

async function ProjectsPage() {
  const projects = await getCurrentUserProjects();
  const logs = await getCurrentUserLogs();

  return (
    <main className="max-w-[1200px] mx-auto w-full mt-12">
      <h1 className="text-3xl font-semibold mb-2">Your projects</h1>
      <p className="text-muted-foreground mb-4">
        List of all your projects, click them to get more insights into each
        one.
      </p>
      <Link href="/projects/new" className="mb-8 block">
        <Button>New project</Button>
      </Link>
      <ProjectList projects={projects} logs={logs} />
    </main>
  );
}

export default ProjectsPage;
