export const APP_NAME = "Xuideck Fantasy";
export const APP_TAGLINE = "Draft any X account. Win the week.";
export const APP_DESCRIPTION =
  "Yahoo-simple fantasy league for X. Pull any public handle, start five, and play friends every week. Likes are runs. 100k posts are home runs.";
export const PRODUCTION_HOST = "fantasy.xuideck.com";

export function publicHost() {
  return (import.meta.env.VITE_PUBLIC_HOSTNAME as string | undefined) || PRODUCTION_HOST;
}

export function publicOrigin() {
  return `https://${publicHost()}`;
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
