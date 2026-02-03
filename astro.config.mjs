// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://astronaut.github.io/font-panda',
  vite: {
    plugins: [tailwindcss()],
  },
});
