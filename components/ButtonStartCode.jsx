"use client";

import { BiTime } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
// import { createClient } from "@/lib/supabase/server";

function ButtonStartCode({ userId }) {
  // const supabase = createClient();
  // const { projects, error } = supabase.from("projects").select("id, name");
  // console.log(projects);

  const {
    data: projects,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["projects/user", userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId);
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) return <p>Loading..</p>;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "outline" }), "gap-2 text-sm")}
      >
        Start Coding <BiTime className="text-lg" />
      </PopoverTrigger>
      <PopoverContent>
        {projects.map((project) => (
          <p key={project.id}>{project.name}</p>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default ButtonStartCode;
