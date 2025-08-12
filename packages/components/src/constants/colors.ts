export const WALLET_COLORS = {
  tokens: {
    light: "#106201ff",
    dark: "#72dd5f",
  },
  defi: "#e49a41",
  nft: "#c084fc",
  dustToggle: "#aaa",
} as const;

export const getTokensColor = (isDarkMode: boolean): string => {
  return isDarkMode ? WALLET_COLORS.tokens.dark : WALLET_COLORS.tokens.light;
};
