"use client";

import { BiTime } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/Button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCurrentUserProjects } from "@/lib/actions/projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { startLog } from "@/lib/actions/logs";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function FormButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Creating" : children}
    </Button>
  );
}

function ButtonStartCode() {
  const [open, setOpen] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getCurrentUserProjects(),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "outline" }), "gap-2 text-sm")}
      >
        Start Coding <BiTime className="text-lg" />
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        {!projects && (
          <p className="text-nowrap text-sm">
            <span>Start by creating a </span>
            <Link
              className="underline decoration-primary text-primary text-base"
              href="/projects/new"
            >
              project!
            </Link>
          </p>
        )}
        {projects && (
          <>
            <form action={startLog} className="flex gap-2 mb-3">
              <Select name="project_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormButton>Start!</FormButton>
            </form>

            <Link href="/projects/new" className="flex justify-center gap-4">
              <p className="text-sm text-muted-foreground my-3 text-center">
                or
              </p>
              <Button onClick={() => setOpen(false)} variant="outline">
                New project
              </Button>
            </Link>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default ButtonStartCode;
