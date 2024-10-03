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

export const isFulfilled = <T,>(p:PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';
export const isRejected = <T,>(p:PromiseSettledResult<T>): p is PromiseRejectedResult => p.status === 'rejected';