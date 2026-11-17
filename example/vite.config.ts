import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "mui-apple/register-fonts", replacement: path.resolve(__dirname, "../register-fonts.ts") },
      { find: "mui-apple", replacement: path.resolve(__dirname, "../index.ts") },
    ],
  },
});
