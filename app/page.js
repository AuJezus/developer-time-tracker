import ButtonGithub from "@/components/ButtonGithub";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex h-screen w-full justify-center items-center flex-col gap-8">
      <h1 className="capitalize text-5xl underline decoration-primary">
        time tracker for developers
      </h1>
      <p className="w-1/3 text-center text-muted-foreground">
        Efficiently manage your work hours and tasks with our intuitive time
        tracking tool tailored specifically for developers. Stay focused,
        organized, and maximize productivity effortlessly.
      </p>
      {!user && <ButtonGithub />}
      {user && (
        <Link href={`profile/${user.id}`}>
          <Button>Go to profile</Button>
        </Link>
      )}
    </main>
  );
}
