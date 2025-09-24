import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "main.html",   
        login: "index.html", 
      },
    },
  },
});
