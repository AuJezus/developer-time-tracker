"use client";

import { getRandomQuote } from "@/lib/actions/quotes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function Quote() {
  const { data, error } = useQuery({
    queryKey: ["quote"],
    queryFn: () => getRandomQuote(),
    refetchInterval: 1000 * 20,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    staleTime: 1000 * 20,
  });

  const [quote, setQuote] = useState(data);
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    if (data === quote) return;

    setOpacity(true);

    setTimeout(() => {
      setQuote(data);
      setOpacity(false);
    }, 500);
  }, [data, quote]);

  return (
    <div
      className={`${
        opacity ? "opacity-0" : "opacity-100"
      } transition-opacity duration-500`}
    >
      <p className="text-2xl mb-6">&quot;{quote.quote}&quot;</p>
      <p className="text-right text-sm text-muted-foreground">
        - {quote.author}
      </p>
    </div>
  );
}

export default Quote;
