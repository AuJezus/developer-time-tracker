import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getAllLogs } from "@/lib/actions/logs";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
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
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);

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
];

const tasks = {
  todo: [
    "Create a homepage layout",
    "Implement responsive design",
    "Set up user authentication",
    "Create a contact form",
    "Optimize images for web",
    "Design product/service pages",
    "Create a FAQ page",
    "Add testimonials",
    "Create a '404 Not Found' page",
    "Set up automatic backups",
  ],
  inProgress: [
    "Add a navbar to the website",
    "Design a logo",
    "Integrate social media links",
    "Set up Google Analytics",
    "Implement a carousel/slider",
    "Integrate payment gateway",
    "Set up email subscription",
    "Implement breadcrumbs for navigation",
  ],
  done: [
    "Create a blog page",
    "Add a footer section",
    "Implement a search bar",
    "Add a 'About Us' section",
    "Add a pricing table",
    "Implement a chat feature",
    "Create a sitemap",
    "Add a 'Terms of Service' page",
    "Create a 'Privacy Policy' page",
    "Implement a language switcher",
    "Optimize website speed",
    "Set up SSL certificate",
  ],
};

const logs = [
  { date: "2024-03-25 07:30", time: 180, tasksDone: 2, commits: 1 },
  { date: "2024-03-26 08:15", time: 150, tasksDone: 4, commits: 0 },
  { date: "2024-03-27 09:20", time: 210, tasksDone: 3, commits: 2 },
  { date: "2024-03-28 10:00", time: 120, tasksDone: 1, commits: 1 },
  { date: "2024-03-29 07:45", time: 240, tasksDone: 5, commits: 2 },
  { date: "2024-03-30 08:30", time: 180, tasksDone: 2, commits: 0 },
  { date: "2024-03-31 09:10", time: 210, tasksDone: 3, commits: 1 },
  { date: "2024-04-01 07:55", time: 240, tasksDone: 4, commits: 2 },
  { date: "2024-04-02 08:40", time: 180, tasksDone: 2, commits: 0 },
  { date: "2024-04-03 09:30", time: 210, tasksDone: 3, commits: 1 },
  { date: "2024-04-04 10:05", time: 120, tasksDone: 1, commits: 0 },
  { date: "2024-04-05 07:20", time: 180, tasksDone: 2, commits: 1 },
  { date: "2024-04-06 08:50", time: 240, tasksDone: 4, commits: 0 },
  { date: "2024-04-07 09:15", time: 210, tasksDone: 3, commits: 2 },
  { date: "2024-04-08 10:20", time: 120, tasksDone: 1, commits: 1 },
  { date: "2024-04-09 07:35", time: 300, tasksDone: 5, commits: 2 },
  { date: "2024-04-10 08:00", time: 180, tasksDone: 2, commits: 0 },
  { date: "2024-04-11 09:05", time: 210, tasksDone: 3, commits: 1 },
  { date: "2024-04-12 07:25", time: 240, tasksDone: 4, commits: 2 },
  { date: "2024-04-13 08:45", time: 180, tasksDone: 2, commits: 0 },
  { date: "2024-04-14 09:40", time: 210, tasksDone: 3, commits: 1 },
  { date: "2024-04-15 10:15", time: 120, tasksDone: 1, commits: 0 },
  { date: "2024-04-16 07:15", time: 180, tasksDone: 2, commits: 1 },
  { date: "2024-04-17 08:35", time: 240, tasksDone: 4, commits: 0 },
];

async function ProfilePage({ params: { id } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const logss = await getAllLogs();

  const stats = logss.reduce(
    (acc, log) => {
      acc.seconds += log.duration;
      acc.commits += log.commits;
      return acc;
    },
    {
      seconds: 0,
      commits: 0,
    }
  );

  const totalDuration = dayjs.duration(stats.seconds, "s");

  return (
    <main className="pt-8 mb-12 max-w-[1200px] mx-auto">
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
      </div>

      <div className="flex justify-around mb-10">
        <div>
          <p className="mb-4 text-sm">Total time logged:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiTime className="text-green-500" />{" "}
            {`${Math.floor(totalDuration.asHours())}hr ${totalDuration.format(
              "mm"
            )}min`}
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm">Total logs:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiTask className="text-green-500" /> {logss.length} logs
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm">Github commits logged:</p>
          <p className="flex items-center gap-3 ml-4 text-xl">
            <BiLogoGithub className="text-green-500" /> {stats.commits} commits
          </p>
        </div>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects" className="flex gap-2 items-center">
            <BiCabinet /> Projects
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex gap-2 items-center">
            <BiTime />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" asChild>
          <div className="grid grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project}
                className="border-2 group hover:border-primary transition-all hover:scale-105 rounded-lg p-4 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-lg">{project}</p>
                  <a
                    href="lol"
                    className="text-sm flex items-center gap-1 transition-colors text-muted-foreground hover:text-primary-foreground w-fit"
                  >
                    <BiLogoGithub /> Github
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {`Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Distinctio reprehenderit aperiam atque obcaecati perferendis
                  consequuntur ab cupiditate dolorum nemo veniam eos nostrum
                  voluptatum voluptates, ad tenetur alias. Voluptate, nihil?`.slice(
                    0,
                    120
                  ) + "..."}
                </p>
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
          </div>
        </TabsContent>

        <TabsContent value="logs" className="grid-cols-4 grid gap-8">
          {logs.map((log) => (
            <div
              key={log.date}
              className="p-2 border-2 rounded-lg group cursor-pointer hover:scale-105 transition-all hover:border-primary"
            >
              <p>{log.date}</p>
              <div className="flex justify-around text-sm text-muted-foreground group-hover:text-primary-foreground transition-colors">
                <p className="gap-1 flex items-center">
                  <BiTime className="group-hover:text-yellow-500 transition-colors" />
                  {Math.floor(log.time / 60)}hr {log.time % 60}min
                </p>
                <p className="gap-1 flex items-center">
                  <BiTask className="group-hover:text-green-500 transition-colors" />
                  {log.tasksDone}
                </p>
                <p className="gap-1 flex items-center">
                  <BiLogoGithub className="group-hover:text-neutral-300 transition-colors" />
                  {log.commits}
                </p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default ProfilePage;
