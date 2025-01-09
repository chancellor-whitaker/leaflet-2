import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// const outDir = "Y:/Reports/DataPage2";

// const base = "";

const base = "/static";

const outDir = base.substring(1);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { outDir },
  base,
});
