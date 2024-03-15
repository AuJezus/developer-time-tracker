import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import {
  BiBeenHere,
  BiBriefcase,
  BiCabinet,
  BiCalendar,
  BiCodeAlt,
  BiEnvelope,
  BiLogoGithub,
  BiTask,
  BiTaskX,
  BiTime,
} from "react-icons/bi";

const projects = [
  "developer-time-tracker",
  "personal-website",
  "skills-introduction-to-github",
  "skypark-redesign",
  "gym-tracker",
  "exrx-scraper",
  "car-events",
  "rate-my-link",
  "spotify-clone",
  "learn-next",
  "forkify",
  "todo-cli",
  "picvert",
  "page-text-extractor",
  "aujezus-play",
  "writingsdev",
  "pazusiu-bitynas",
  "exrx-scraper",
  "car-events",
  "rate-my-link",
  "spotify-clone",
  "learn-next",
  "forkify",
  "todo-cli",
  "picvert",
  "page-text-extractor",
  "aujezus-play",
  "writingsdev",
  "pazusiu-bitynas",
];

async function ProfilePage({ id }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="pt-8">
      <div className="flex border-b-2 p-6 justify-around mb-8">
        <div className="flex items-center gap-10">
          <div className="relative w-24 h-24">
            <Image
              className="border-2"
              src={user.user_metadata.avatar_url}
              alt={`${user.user_metadata.user_name}'s avatar picture`}
              fill
            />
          </div>
          <div className="flex flex-col gap-3">
            <a href="https://github.com/AuJezus" className="flex gap-2">
              <h2 className="text-4xl font-semibold underline decoration-primary">
                {user.user_metadata.user_name}
              </h2>
              <BiLogoGithub className="text-sm" />
            </a>
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <BiCodeAlt /> Fullstack web developer
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm">
            <BiEnvelope /> Email:
            <a
              href="mailto:augispay@gmail.com"
              className="hover:text-foreground text-muted-foreground hover:underline"
            >
              augispay@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <BiTime /> Time:
            <span className="hover:text-foreground text-muted-foreground">
              08:07 (UTC +02:00)
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <BiBriefcase /> Occupation:
            <span className="hover:text-foreground text-muted-foreground">
              High-School student
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <BiBeenHere /> Lives in:
            <span className="hover:text-foreground text-muted-foreground">
              Lithuania, Vilnius
            </span>
          </p>
        </div>

        {/* <div className="flex flex-col gap-2 text-sm w-1/4">
          <h3>Favourite tools:</h3>
          <div className="ml-3 flex justify-start flex-wrap gap-x-1 gap-y-2">
            <div className="bg-blue-800 gap-1 px-2 py-0.5 flex items-center justify-center rounded-sm">
              <BiLogoVisualStudio />
              VS Code
            </div>
            <div className="bg-yellow-600 gap-1 px-2 py-0.5 flex items-center justify-center rounded-sm">
              <BiLogoJavascript />
              Javascript
            </div>
            <div className="bg-blue-800 gap-2 px-2 py-0.5 flex items-center justify-center rounded-sm">
              <BiLogoReact />
              React
            </div>
            <div className="bg-neutral-800 gap-2 px-2 py-0.5 flex items-center justify-center rounded-sm">
              <TbBrandNextjs />
              Next
            </div>
          </div>
        </div> */}
      </div>

      <div className="flex justify-around mb-10">
        <div>
          <p className="mb-4 text-sm">Total time logged:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiTime className="text-green-500" /> 135 hours
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm">Total tasks completed:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiTask className="text-green-500" /> 35 tasks
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm">Github commits logged:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiLogoGithub className="text-green-500" /> 35 commits
          </p>
        </div>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects" className="flex gap-2 items-center">
            <BiCabinet /> Projects
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex gap-2 items-center">
            <BiTask />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex gap-2 items-center">
            <BiTime />
            Logs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects" asChild>
          <Link href="/project/:id" className="grid grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project}
                className="border-2 group hover:border-primary transition-all hover:scale-105 rounded-lg p-4 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <p className="text-lg">{project}</p>
                  <a
                    href="lol"
                    className="text-sm flex items-center gap-1 transition-colors text-muted-foreground hover:text-primary-foreground w-fit"
                  >
                    <BiLogoGithub /> Github
                  </a>
                </div>
                <div className="flex justify-around h-full items-end text-sm text-muted-foreground group-hover:text-primary-foreground">
                  <p className="flex items-center gap-1">
                    <BiTime /> 24 hr
                  </p>
                  <p className="flex items-center gap-1">
                    <BiTask /> 25
                  </p>
                  <p className="flex items-center gap-1">
                    <BiLogoGithub /> 104
                  </p>
                </div>
              </div>
            ))}
          </Link>
        </TabsContent>
        <TabsContent value="tasks"></TabsContent>
        <TabsContent value="logs"></TabsContent>
      </Tabs>
    </main>
  );
}

export default ProfilePage;
