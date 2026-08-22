export const APP_NAME = "Xuideck Fantasy";
export const APP_TAGLINE = "Draft any X account. Win the week.";
export const APP_DESCRIPTION =
  "Weekly fantasy league for X. Pull any public handle, start five, and play friends every week. Likes are runs. 100k posts are home runs.";
export const PRODUCTION_HOST = "fantasy.xuideck.com";
/** Bump when the card pixels change so X recrawls. */
export const OG_IMAGE_VERSION = "20260822j";

export const LAUNCH_POST = `Draft any public account on X. Start five.

Likes are runs.
A post over 100k impressions is a home run.

A 6k account is ranked above 20 million-follower accounts this week. That is the handicap.

https://fantasy.xuideck.com`;

export const LAUNCH_REPLY = `Scoring:

R   likes
H   impressions / 1k
HR  posts over 100k impressions
RBI replies + quotes
SB  bookmarks

Then a log handicap so follower count does not auto-win.

Draft five. Play friends with a 6-letter code. Week 33 is live.`;

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
