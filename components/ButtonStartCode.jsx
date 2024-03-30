"use client";

import { BiTime } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/Button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserProjects } from "@/lib/actions/projects";
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
    queryFn: () => getUserProjects(),
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
          <form action={startLog} className="flex gap-2">
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
        )}
      </PopoverContent>
    </Popover>
  );
}

export default ButtonStartCode;
