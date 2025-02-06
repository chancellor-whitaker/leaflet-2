import { globalConst } from "vite-plugin-global-const";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const outDir = "Y:/Reports/serviceregion";

const base = "";

const wrapperUrl = "https://irserver2.eku.edu/libraries/remote/wrapper.cjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    globalConst({
      wrapperUrl,
    }),
  ],
  build: { copyPublicDir: false, emptyOutDir: false, outDir },
  base,
});
