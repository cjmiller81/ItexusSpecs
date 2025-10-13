import { ArbitrageMatrixPrice } from '../features/tradeAggregator/TradeTableApi';

export interface ArbitrageResult {
  priceDiff: number;
  percentage: string;
  isProfit: boolean;
}

export interface ColorScheme {
  bg: string;
  text: string;
  border: string;
}

export const calculateArbitrage = (
  buyExchangeId: string,
  sellExchangeId: string,
  arbitragePrices: ArbitrageMatrixPrice[]
): ArbitrageResult => {
  const buyPrice = arbitragePrices.find(price => price.exchangeId === buyExchangeId)?.price;
  const sellPrice = arbitragePrices.find(price => price.exchangeId === sellExchangeId)?.price;
  
  if (!buyPrice || !sellPrice) {
    return { 
      priceDiff: 0, 
      percentage: '0.000%', 
      isProfit: false 
    };
  }
  
  const priceDiff = sellPrice - buyPrice;
  const percentageDiff = (priceDiff / buyPrice) * 100;
  const isProfit = priceDiff > 0;
  
  return {
    priceDiff: priceDiff,
    percentage: `${isProfit ? '+' : ''}${percentageDiff.toFixed(3)}%`,
    isProfit: isProfit
  };
};


export const getColorForPercentage = (percentage: string): ColorScheme => {
  const value = parseFloat(percentage.replace('%', ''));
  
  if (value > 0.05) return { 
    bg: '#22c55e20', 
    text: '#22c55e', 
    border: '#22c55e' 
  };
  
  if (value > 0.02) return { 
    bg: '#16a34a20', 
    text: '#16a34a', 
    border: '#16a34a' 
  }; 

  if (value > 0) return { 
    bg: '#15803d20', 
    text: '#15803d', 
    border: '#15803d' 
  }; 
  
  if (value < -0.05) return { 
    bg: '#ef444420', 
    text: '#ef4444', 
    border: '#ef4444' 
  }; 
  
  if (value < -0.02) return { 
    bg: '#dc262620', 
    text: '#dc2626', 
    border: '#dc2626' 
  };
  
  if (value < 0) return { 
    bg: '#b9131320', 
    text: '#b91313', 
    border: '#b91313' 
  };
  
  return { 
    bg: '#6b728020', 
    text: '#6b7280', 
    border: '#6b7280' 
  };
};

export const formatPrice = (price: number): string => {
  return price >= 1 
    ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
};

export const formatPriceDiff = (priceDiff: number, isProfit: boolean): string => {
  const sign = isProfit ? '+' : '-';
  const absValue = Math.abs(priceDiff);
  return `${sign}$${absValue.toFixed(2)}`;
};
