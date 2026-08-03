/** @format */

const quotes = [
  {
    text: "Imagination takes you to wonderful places, but this may not be one of them.",
    attribution: "Soma",
  },
  {
    text: "You found a page that took the scenic route and forgot to come back.",
    attribution: "Soma",
  },
  {
    text: "This path ends here, but the good ones rarely do.",
    attribution: "Soma",
  },
  {
    text: "Somewhere between a good idea and a wrong turn, this page disappeared.",
    attribution: "Soma",
  },
  { text: "The map is doing its best. This page is not.", attribution: "Soma" },
  {
    text: "A small wrong turn is still a perfectly good excuse to discover something else.",
    attribution: "Soma",
  },
  {
    text: "This page went looking for inspiration and has not returned yet.",
    attribution: "Soma",
  },
  {
    text: "Not every blank space needs filling. This one just needs a better link.",
    attribution: "Soma",
  },
  {
    text: "You followed a thread that came loose. Let’s find another.",
    attribution: "Soma",
  },
  {
    text: "The internet is large; this page appears to be elsewhere.",
    attribution: "Soma",
  },
  { text: "A door without a room behind it. It happens.", attribution: "Soma" },
  { text: "A little lost is still a kind of journey.", attribution: "Soma" },
] as const;

export function NotFoundQuote() {
  const quote = quotes[randomInt(quotes.length)];

  return (
    <>
      <h1 className="mt-4 text-balance font-heading text-4xl font-medium leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
        {quote.text}
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        — {quote.attribution}
      </p>
    </>
  );
}
import { randomInt } from "crypto";
