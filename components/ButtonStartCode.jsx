"use client";

import { BiTime } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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

function ButtonStartCode({ userId }) {
  const [open, setOpen] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["projects/user", userId],
    queryFn: () => getUserProjects(userId),
    enabled: userId && open,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "outline" }), "gap-2 text-sm")}
      >
        Start Coding <BiTime className="text-lg" />
      </PopoverTrigger>
      <PopoverContent>
        <form action={startLog} className="flex gap-2">
          {!projects && <p>Loading...</p>}
          {projects && (
            <>
              <Select name="id">
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

              <Button>Start!</Button>
            </>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default ButtonStartCode;
