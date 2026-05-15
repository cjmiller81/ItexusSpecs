module.exports = {
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "tsc-files --noEmit", "prettier --write"],
  "*.{css,json,md,yml,yaml}": "prettier --write",
};
