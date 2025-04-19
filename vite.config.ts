import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx() },
    dynamicImport(),
    react(),
    tailwindcss(),
  ],
});
