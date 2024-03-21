"use client";

import { BiLogoGithub } from "react-icons/bi";
import { Button } from "./ui/Button";
import { signInWithGithub } from "@/lib/supabase/auth";

function ButtonGithub() {
  return (
    <Button
      size="lg"
      onClick={signInWithGithub}
      className="flex items-center gap-2"
    >
      Continue with
      <div className="flex items-center gap-1">
        GitHub <BiLogoGithub className="text-xl" />
      </div>
    </Button>
  );
}

export default ButtonGithub;
