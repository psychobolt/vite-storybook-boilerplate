import { resolve } from "path";
import { defineConfig } from "vite";

const packageName = process.env.npm_package_name ?? "";
const entry = resolve(process.cwd(), "./src/index.ts");

export default defineConfig({
  resolve: {
    alias: {
      [packageName]: entry,
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry,
      name: packageName,
      // the proper extensions will be added
      fileName: "index",
    },
  },
});
