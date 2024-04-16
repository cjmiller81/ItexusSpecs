import path from "path"
import { getBaseConfig } from "../../vite.config"

export default getBaseConfig({
  lib: {
    entry: path.resolve(__dirname, "src/index.tsx"),
    name: "components",
    fileName: "index",
  },
})
