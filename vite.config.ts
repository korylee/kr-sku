import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isBuildLib = mode === "lib";
  if (isBuildLib) {
    return {
      build: {
        watch: {
          include: ["./src"],
        },
        outDir: "lib",
        lib: {
          entry: "./src/index.ts",
          name: "@korylee/sku",
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          external: ["vue-demi"],
          output: {
            globals: {
              "vue-demi": "vue-demi",
            },
          },
        },
      },
    };
  }
  return {
    resolve: {
      alias: {
        "@korylee/sku": resolve(__dirname, "src/index.ts"),
      },
    },
    plugins: [vue()],
  };
});
