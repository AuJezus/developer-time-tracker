import LogList from "@/components/LogList";
import { getAllLogs } from "@/lib/actions/logs";

async function LogsPage() {
  const logs = await getAllLogs();

  return (
    <main className="max-w-[1200px] mx-auto w-full mt-12">
      <h1 className="text-3xl font-semibold mb-2">Your logs</h1>
      <p className="text-muted-foreground mb-8">
        List of all your logs, click them to get more insights into each one.
      </p>
      <LogList logs={logs} />
    </main>
  );
}

export default LogsPage;
