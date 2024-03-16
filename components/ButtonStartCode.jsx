"use client";

import { BiTime } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";
// import { createClient } from "@/lib/supabase/server";

function ButtonStartCode() {
  // const supabase = createClient();
  // const { projects, error } = supabase.from("projects").select("id, name");
  // console.log(projects);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "outline" }), "gap-2 text-sm")}
      >
        Start Coding <BiTime className="text-lg" />
      </PopoverTrigger>
      <PopoverContent>{console.log("sudas")}</PopoverContent>
    </Popover>
  );
}

export default ButtonStartCode;
