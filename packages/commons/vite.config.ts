import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const root = process.cwd();
const packageName = process.env.npm_package_name ?? "";
const entry = resolve(root, "./src/index.ts");
const isWatch = process.argv.includes("--watch") || process.argv.includes("-w");

export default defineConfig({
  base: "",
  plugins: [tsconfigPaths({ root })],
  build: {
    emptyOutDir: !isWatch,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry,
      name: packageName,
      // the proper extensions will be added
      fileName: "index",
    },
  },
});
