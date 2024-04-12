import LogList from "@/components/LogList";
import { getCurrentUserLogs } from "@/lib/actions/logs";
import { getCurrentUserProjects } from "@/lib/actions/projects";

async function LogsPage() {
  const logs = await getCurrentUserLogs();
  const projects = await getCurrentUserProjects();

  return (
    <main className="max-w-[1200px] mx-auto w-full mt-12">
      <h1 className="text-3xl font-semibold mb-2">Your logs</h1>
      <p className="text-muted-foreground mb-8">
        List of all your logs, click them to get more insights into each one.
      </p>
      <LogList logs={logs} projects={projects} />
    </main>
  );
}

export default LogsPage;
