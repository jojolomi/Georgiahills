import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/admin-v3/",
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return null;
          if (id.includes("firebase")) return "vendor-firebase";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("react")) return "vendor-react";
          if (id.includes("zod")) return "vendor-zod";
          return "vendor";
        }
      }
    }
  }
});
