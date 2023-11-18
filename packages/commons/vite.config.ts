import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const root = process.cwd();
const packageName = process.env.npm_package_name ?? "";
const entry = resolve(root, "./src/index.ts");

export default defineConfig({
  plugins: [tsconfigPaths({ root })],
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
