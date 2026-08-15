import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { CloudSync } from "@/components/cloud-sync";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { AuthProvider } from "@/lib/auth/provider";
import { AppErrorComponent } from "@/lib/error-component";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  jsonLd,
  ogImageUrl,
  publicOrigin,
} from "@/lib/seo";
import appCss from "@/styles.css?url";

const origin = publicOrigin();
const ogImage = origin ? ogImageUrl(origin) : undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} | ${APP_TAGLINE}` },
      { name: "description", content: APP_DESCRIPTION },
      {
        name: "keywords",
        content:
          "X fantasy sports, Twitter fantasy league, draft X accounts, Xuideck, weekly fantasy, social fantasy sports",
      },
      { name: "theme-color", content: "#0c0d0a" },
      { name: "color-scheme", content: "dark" },
      { name: "robots", content: "index,follow" },
      { name: "author", content: "JoePro" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${APP_NAME} | ${APP_TAGLINE}` },
      { name: "twitter:description", content: APP_DESCRIPTION },
      { name: "twitter:creator", content: "@JoePro" },
      { name: "twitter:site", content: "@JoePro" },
      { property: "og:type", content: "x:game" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: `${APP_NAME} | ${APP_TAGLINE}` },
      { property: "og:description", content: APP_DESCRIPTION },
      { property: "og:locale", content: "en_US" },
      ...(origin ? [{ property: "og:url", content: origin }] : []),
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:image:alt", content: "Draft any X account. Likes are runs. 100k posts are home runs." },
            { property: "og:image:type", content: "image/jpeg" },
            { name: "twitter:image", content: ogImage },
            { name: "twitter:image:alt", content: "Draft any X account. Likes are runs. 100k posts are home runs." },
          ]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      ...(origin ? [{ rel: "canonical", href: origin }] : []),
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Literata:opsz,wght@7..72,400;7..72,600&family=Teko:wght@500;600&display=swap",
      },
    ],
  }),
  component: RootComponent,
  errorComponent: AppErrorComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AuthProvider>
        <SiteNav />
        <CloudSync />
        <div className="pb-20 md:pb-0">
          <Outlet />
          <SiteFooter />
        </div>
        <Toaster theme="dark" position="top-center" />
      </AuthProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-fg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(origin)) }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
