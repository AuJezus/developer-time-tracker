import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default function calculateTimespan(
  { end, start, is_paused },
  pauseList
) {
  let totalTime = is_paused
    ? dayjs.duration(dayjs(pauseList.at(-1).paused_at).diff(start))
    : dayjs.duration(dayjs(end || undefined).diff(start));

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
