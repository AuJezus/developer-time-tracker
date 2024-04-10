"use client";

import { z } from "zod";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectAndRedirect } from "@/lib/actions/projects";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { projectSchema } from "@/lib/schema/formSchema";
import { useRouter } from "next/navigation";

function ProjectForm({ repos }) {
  const router = useRouter();

  const form = useForm({
    mode: "all",
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      github: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form
        action={form.handleSubmit(createProjectAndRedirect)}
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Github Repository" />
                  </SelectTrigger>
                  <SelectContent>
                    {repos.map((repo) => (
                      <SelectItem key={repo.id} value={repo.id.toString()}>
                        {repo.name}
                      </SelectItem>
                    ))}
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
          {form.formState.isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export default ProjectForm;
