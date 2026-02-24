export function coinGeckoChainId(chain: string): number | undefined {
  switch (chain.toLowerCase()) {
    case "ethereum": return 1;
    case "optimism": return 10;
    case "arbitrum": return 42161;
    case "bnb chain": return 56;
    case "polygon": return 137;
    case "avalanche": return 43114;
    case "base": return 8453;
    case "zksync": return 324;
    case "gnosis": return 100;
    case "linea": return 59144;
    case "sonic": return 146;
    case "unichain": return 130;
    default: return undefined;
  }
}

export function getGasTokenSymbol(chain: string): string {
  const chainMap: Record<string, string> = {
    "ETHEREUM": "ETH",
    "OPTIMISM": "ETH",
    "ARBITRUM": "ETH",
    "BASE": "ETH",
    "ZKSYNC": "ETH",
    "GNOSIS": "ETH",
    "LINEA": "ETH",
    "SONIC": "ETH",
    "UNICHAIN": "ETH",
    "BNB CHAIN": "BNB",
    "POLYGON": "MATIC",
    "AVALANCHE": "AVAX",
  };
  return chainMap[chain.toUpperCase()] || "";
}

export function formatNumberWithCommas(value: string): string {
  const [intPart, decimalPart] = value.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
}

export function extractSymbol(label: string): string {
  return label.split(" ")[0].toUpperCase();
}

export function generateErrorMessage({
  symbolOptionSwap,
  filteredRows,
  selectedChain,
  symbolOptionSwapFor,
  newBalance,
  t
}: {
  symbolOptionSwap: any;
  filteredRows: any[];
  selectedChain: string;
  symbolOptionSwapFor: any;
  newBalance: string;
  t: (key: string) => string;
}): string | null {
  const errors: string[] = [];
  const selectedSymbol = symbolOptionSwap?.sym?.toUpperCase();
  const tokenExistsInFilteredRows = filteredRows.some(
    token => token.tokenName?.toUpperCase() === selectedSymbol
  );
  if (!symbolOptionSwap) {
    errors.push(t("TokenPosition"));
  } else if (!tokenExistsInFilteredRows) {
    return t("SelectedError");
  }
  if (!selectedChain) errors.push(t("Chain"));
  if (!symbolOptionSwapFor) errors.push(t("SwapFor"));
  if (!newBalance || isNaN(Number(newBalance)) || Number(newBalance) <= 0) errors.push(t("Qty"));
  return errors.length > 0 ? `${t("MissingInputs")}: ${errors.join(", ")}` : null;
}
