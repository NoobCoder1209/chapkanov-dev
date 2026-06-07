import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://chapkanov-dev.vercel.app",
  output: "static",
  trailingSlash: "ignore",
  build: { format: "directory" },
  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    icon({
      include: {
        lucide: [
          "sun",
          "moon",
          "monitor",
          "github",
          "linkedin",
          "mail",
          "external-link",
          "arrow-right",
          "arrow-up-right",
          "menu",
          "x",
          "briefcase",
          "graduation-cap",
        ],
      },
    }),
    sitemap({
      // Filter receives the full URL string. Match only the literal
      // /404 and /500 routes, not deeper paths like /blog/404-tips.
      filter: (page) => !/\/(?:404|500)\/?$/.test(page),
    }),
  ],
  vite: {
    ssr: {
      noExternal: ["@vercel/analytics", "@vercel/speed-insights"],
    },
  },
});
