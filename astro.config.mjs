// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://frontpanda.com/',
  base: '/front-panda',
  vite: {
    plugins: [tailwindcss()],
  },
});
