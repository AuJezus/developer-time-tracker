import { BiCircle } from "react-icons/bi";

function Timer({ log, duration }) {
  return (
    <div className="flex items-center gap-4 justify-center">
      <BiCircle
        className={`${log.end ? "!text-red-500" : ""} ${
          log.is_paused ? "text-yellow-500" : "text-green-500"
        } text-3xl`}
      />
      <div className="text-7xl">{`${String(
        Math.floor(duration.asHours())
      ).padStart(2, "0")}:${duration.format("mm:ss")}`}</div>
    </div>
  );
}

export default Timer;
