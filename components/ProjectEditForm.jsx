"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/schema/formSchema";
import { editProject } from "@/lib/actions/projects";

function ProjectEditForm({ project }) {
  const editProjectWithId = editProject.bind(null, project.id);

  const form = useForm({
    mode: "all",
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      github: project.github_repo_id.toString(),
      description: project.description || "",
    },
  });

  return (
    <Form {...form}>
      <form
        action={form.handleSubmit(editProjectWithId)}
        className="grid grid-cols-2 items-start gap-x-12 gap-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="The coolest project ever" {...field} />
              </FormControl>
              <FormDescription>
                This is your project&apos;s name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Repository</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={true}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Github Repository" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={project.github_repo_id.toString()}>
                      {project.github_repo_url.split("/").pop()}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select a github repository to track.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2 max-w-[600px] justify-self-center w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Give your project a small description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="self-center col-span-2 max-w-[600px] justify-self-center"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

export default ProjectEditForm;
