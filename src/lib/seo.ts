export const APP_NAME = "Xuideck Fantasy";
export const APP_TAGLINE = "Draft any X account. Win the week.";
export const APP_DESCRIPTION =
  "Weekly fantasy league for X. Pull any public handle, start five, and play friends every week. Likes are runs. 100k posts are home runs.";
export const PRODUCTION_HOST = "fantasy.xuideck.com";
/** Bump when the card pixels change so X recrawls. */
export const OG_IMAGE_VERSION = "20260822";

export const LAUNCH_POST = `Draft any account on X.

Likes are runs.
A 100k post is a home run.
You start five.

I drafted @elonmusk and I am already losing to @XOpenSource.

https://fantasy.xuideck.com`;

export const LAUNCH_REPLY = `Scoring is baseball:

R   likes
H   impressions / 1k
HR  posts over 100k
RBI replies + quotes
SB  bookmarks

Log handicap so a 1k account can take a week off a whale.

Draft five. Play your friends. Week 33 is live.`;

export function publicHost() {
  return (import.meta.env.VITE_PUBLIC_HOSTNAME as string | undefined) || PRODUCTION_HOST;
}

export function publicOrigin() {
  return `https://${publicHost()}`;
}

export function ogImageUrl(origin?: string) {
  const base = origin ?? publicOrigin();
  return `${base}/og.jpg?v=${OG_IMAGE_VERSION}`;
}

export function jsonLd(origin?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description: APP_DESCRIPTION,
    url: origin ?? publicOrigin(),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Person", name: "JoePro", url: "https://x.com/JoePro" },
  };
}
