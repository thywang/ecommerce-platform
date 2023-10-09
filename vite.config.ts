/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
    },
  };
});
