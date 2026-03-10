// Utility to convert a decimal string to raw amount (BigInt) based on token decimals
export function toRawAmount(amount: string, decimals: number): string {
  if (!amount || isNaN(Number(amount))) return '0';
  const [whole, fraction = ''] = amount.split('.');
  const fractionPadded = (fraction + '0'.repeat(decimals)).slice(0, decimals);
  return BigInt(whole + fractionPadded).toString();
}
