"use client";

import { useEffect, useState } from "react";
import * as duration from "dayjs/plugin/duration";
import * as dayjs from "dayjs";
dayjs.extend(duration);

function LogTimer({ startDate, ...props }) {
  const start = dayjs(startDate);

  const [timeSpan, setTimeSpan] = useState(dayjs.duration(dayjs().diff(start)));

  useEffect(() => {
    function setTime() {
      setTimeSpan(dayjs.duration(dayjs().diff(start)));
    }

    const interval = setInterval(() => {
      setTime();
    }, 1000);

    return () => clearInterval(interval);
  });

  return <div {...props}>{timeSpan.format("HH:mm:ss")}</div>;
}

export default LogTimer;
