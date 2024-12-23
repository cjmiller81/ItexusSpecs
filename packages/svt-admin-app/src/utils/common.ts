export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function formatCurrencyToString(value: number | undefined, currencySymbol: string) {
  if(!value && value !== 0) {
    return "";
  }

  if (value >= 0) {
    return `${currencySymbol}${value.toFixed(2)}`;
  } 
  else {
    return `(${currencySymbol}${Math.abs(value).toFixed(2)})`;
  }
}

export function formatCurrencyForQuantity(units: number | undefined, nanos: number | undefined, currencySymbol: string) {
  if(!units && !nanos) {
    return "";
  }

  const value = Number(`${units}.${nanos}`).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currencySymbol}${value}`;
}

export const isFulfilled = <T,>(p:PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';
export const isRejected = <T,>(p:PromiseSettledResult<T>): p is PromiseRejectedResult => p.status === 'rejected';