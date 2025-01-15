import type { Config } from "jest";
import nextJest from "next/jest.js";
import configBase from "../../jest.config.base";

const createJestConfig = nextJest({ dir: "./" });

const customConfig: Config = {
  ...configBase,
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(customConfig);
