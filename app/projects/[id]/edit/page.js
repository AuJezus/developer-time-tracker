import ProjectEditForm from "@/components/ProjectEditForm";
import { getProject } from "@/lib/actions/projects";

async function ProjectEditPage({ params: { id } }) {
  const project = await getProject(id);

  return (
    <main className="mt-12 max-w-[1000px] mx-auto w-full">
      <h1 className="text-3xl capitalize text-center mb-8 font-semibold">
        Edit Project
      </h1>
      <ProjectEditForm project={project} />
    </main>
  );
}

export default ProjectEditPage;
