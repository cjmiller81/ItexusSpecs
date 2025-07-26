 export const generateUniswapLink = ({
  inputCurrency,
  outputCurrency,
  exactAmount,
  exactField,
  version,
}:{inputCurrency: string;
    outputCurrency: string;
    exactAmount: number;
    exactField: "input" | "output";
    version: string;
  }) => {
  switch (version) {
    case "UNISWAP_V1": {
      const slippage = (exactAmount * 0.05).toFixed(6);
      return `https://app.uniswap.org/#/swap?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&${exactField}Amount=${exactAmount}&slippage=${slippage}`;
    }
    case "UNISWAP_V2": {
      return `https://app.uniswap.org/#/swap?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}&exactField=${exactField}`;
    }
    case "UNISWAP_V3": {
      return `https://app.uniswap.org/swap?use=v3&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`;
    }
    case "UNISWAP_V4": {
      return `https://app.uniswap.org/swap?use=v4&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`;
    }
    case "BSC_UNISWAP_V3": {
      return `https://app.uniswap.org/swap?chain=bnb&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "BSC_UNISWAP_V4": {
      return `https://app.uniswap.org/swap?chain=bnb&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "OPTIMISM_UNISWAP_V3": {
      return `https://app.uniswap.org/swap?chain=optimism&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "OPTIMISM_UNISWAP_V4": {
      return `https://app.uniswap.org/swap?chain=optimism&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "POLYGON_UNISWAP_V3": {
      return `https://app.uniswap.org/swap?chain=polygon&&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "POLYGON_UNISWAP_V4": {
      return `https://app.uniswap.org/swap?chain=polygon&&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "AVALANCHE_UNISWAP_V3": {
      return `https://app.uniswap.org/swap?chain=avalanche&&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "AVALANCHE_UNISWAP_V4": {
      return `https://app.uniswap.org/swap?chain=avalanche&&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "ARBITRUM_UNISWAP_V3": {
      return `https://app.uniswap.org/swap?chain=arbitrum&&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    case "ARBITRUM_UNISWAP_V4": {
      return `https://app.uniswap.org/swap?chain=arbitrum&&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${exactAmount}9&exactField=${exactField}`;
    }
    default:
      throw new Error(`Unsupported Uniswap version: ${version}`);
  }
};