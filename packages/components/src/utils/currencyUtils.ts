export const CURRENCY_FORMAT_OPTIONS = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

export const formatCurrency = (value: number, locale = "en-US"): string => {
  return value.toLocaleString(locale, CURRENCY_FORMAT_OPTIONS);
};

export const formatCurrencyWithSymbol = (value: number, locale = "en-US"): string => {
  return `$${formatCurrency(value, locale)}`;
};

export const formatPercentage = (value: number, locale = "en-US"): string => {
  return `${value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
};
