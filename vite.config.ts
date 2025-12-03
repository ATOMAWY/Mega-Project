import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    proxy: {
      "/backend": {
        target: "http://cairogo.runasp.net",
        changeOrigin: true,
        // optional: log proxy issues
        // configure: (proxy, options) => { /* add listeners here */ },
      },
    },
  },
});