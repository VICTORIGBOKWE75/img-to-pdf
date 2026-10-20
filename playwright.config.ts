import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "src/_tests_/e2e/**/*.spec.ts",

  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:3000",
    headless: true,
  },

  reporter: "list",
});