import { signInGithub } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { BiLogoGithub } from "react-icons/bi";

export default function Home() {
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
      <form action={signInGithub} className="flex gap-16">
        <Button size="lg" className="flex items-center gap-2">
          Continue with
          <div className="flex items-center">
            GitHub <BiLogoGithub className="text-xl" />
          </div>
        </Button>
      </form>
    </main>
  );
}
