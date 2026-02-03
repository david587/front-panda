// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://david587.github.io',
  base: '/front-panda',
  vite: {
    plugins: [tailwindcss()],
  },
});
