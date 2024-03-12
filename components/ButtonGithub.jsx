"use client";

import { BiLogoGithub } from "react-icons/bi";
import { Button } from "./ui/Button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function ButtonGithub() {
  function signInWithGithub() {
    const supabase = createClient();
    const { error } = supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/confirm",
      },
    });

    if (error) toast.error(error);
  }

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
