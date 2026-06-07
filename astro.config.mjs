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
    // Sitemap is enabled in Phase 4 once the real route set lands.
    // It crashes when the static page list is too small.
    ...(process.env.ASTRO_ENABLE_SITEMAP === "1" ? [sitemap()] : []),
  ],
  vite: {
    ssr: {
      noExternal: ["@vercel/analytics", "@vercel/speed-insights"],
    },
  },
});
