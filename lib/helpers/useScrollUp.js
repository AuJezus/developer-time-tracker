import { useEffect, useState } from "react";

export default function useScrollUp() {
  const [isUp, setIsUp] = useState(true);

  useEffect(() => {
    const thresholdUp = 0;
    const thresholdDown = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (
        Math.abs(scrollY - lastScrollY) < (isUp ? thresholdDown : thresholdUp)
      ) {
        ticking = false;
        return;
      }
      setIsUp(scrollY > lastScrollY ? false : true);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [isUp]);

  return isUp;
}
