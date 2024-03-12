import ButtonGithub from "@/components/ButtonGithub";

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
      <ButtonGithub />
    </main>
  );
}
