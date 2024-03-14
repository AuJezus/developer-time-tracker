import { BiLogoVenmo } from "react-icons/bi";

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

function SideNav() {
  return (
    // There is .nav, .side-nav classes for handling on hover slide out in globals.css
    <div className="row-span-2 border-r-2 side-nav sticky top-0 h-screen flex flex-col gap-6 px-2 py-6 justify-center">
      {projects.map((project) => (
        <div key={project} className="flex gap-2 items-center">
          <BiLogoVenmo className="flex-shrink-0" />
          <p className="text-nowrap overflow-hidden w-full overflow-ellipsis">
            {project}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SideNav;
