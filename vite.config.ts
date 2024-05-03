import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

const isExternal = (id: string) => !id.startsWith(".") && !path.isAbsolute(id)

export const getBaseConfig = ({ plugins = [], lib }) =>
  defineConfig({
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
      ...plugins,
    ],
    build: {
      lib,
      rollupOptions: {
        external: isExternal,
        output: {
          globals: {
            react: "React",
          },
        },
      },
    },
  })
