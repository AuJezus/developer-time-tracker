import { clsx } from "clsx";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

dayjs.extend(duration);
export function calculateTimespan({ start, is_paused }, pauseList) {
  let totalTime = is_paused
    ? dayjs.duration(dayjs(pauseList.at(-1).paused_at).diff(start))
    : dayjs.duration(dayjs().diff(start));

  pauseList.forEach((pauseEvent) => {
    if (pauseEvent.resumed_at) {
      const pauseDuration = dayjs(pauseEvent.resumed_at).diff(
        pauseEvent.paused_at
      );
      totalTime = totalTime.subtract(pauseDuration);
    }
  });

  return totalTime;
}
