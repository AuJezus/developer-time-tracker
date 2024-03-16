import { createProject } from "@/actions/projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAuthUserRepos } from "@/lib/github/repositories";
import { createClient } from "@/lib/supabase/server";

async function NewProjectPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const repos = await getAuthUserRepos(session.provider_token);

  return (
    <main className="mt-12 max-w-[1000px] mx-auto">
      <form action={createProject} className="flex flex-col gap-8">
        <Input name="name" />
        <Textarea name="description" />
        <Select name="github">
          <SelectTrigger>
            <SelectValue placeholder="Select Github Repository" />
          </SelectTrigger>
          <SelectContent>
            {repos.map((repo) => (
              <SelectItem key={repo.id} value={repo.id.toString()}>
                <Select>{repo.name}</Select>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button type="submit">submit</button>
      </form>
    </main>
  );
}

export default NewProjectPage;
