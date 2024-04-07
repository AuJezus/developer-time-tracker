import { getUserRepos } from "@/lib/actions/github";
import ProjectForm from "@/components/ProjectForm";

async function NewProjectPage() {
  const repos = await getUserRepos();

  return (
    <main className="mt-12 max-w-[1000px] mx-auto w-full">
      <h1 className="text-3xl capitalize text-center mb-8 font-semibold">
        Create a new project
      </h1>
      <ProjectForm repos={repos} />
    </main>
  );
}

export default NewProjectPage;
