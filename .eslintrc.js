module.exports = {
  extends: ["@remix-run/eslint-config", "prettier"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
    sourceType: "module",
  },
  ignorePatterns: ["**/node_modules", "**/build", "**/public/build"],
}
