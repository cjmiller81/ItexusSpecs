export function toRawAmount(userInput: string, decimals: number): string {
  const [whole, frac = ""] = String(userInput).split(".");
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(fracPadded)).toString();
}

export function fromRawAmount(rawString: string, decimals: number): number {
  if (rawString === undefined || rawString === null || rawString === "") {
    return 0;
  }
  let raw: bigint;
  try {
    raw = BigInt(rawString);
  } catch (e) {
    return 0;
  }
  const factor = BigInt(10 ** decimals);
  const whole = raw / factor;
  const frac = raw % factor;
  return Number(`${whole}.${String(frac).padStart(decimals, "0")}`);
}

export function getChainById(chains: any[], chainId: number) {
  return chains.find((c) => c.id === chainId) ?? null;
}

export function getChainName(chains: any[], chainId: number) {
  return getChainById(chains, chainId)?.name ?? `Chain ${chainId}`;
}

export function getAdjustedToAmount(route: any) {
  if (!route?.toToken || typeof route.toToken.decimals !== 'number' || !route.steps?.[0]) return 0;
  const rawToAmount = fromRawAmount(route.toAmount, route.toToken.decimals);
  const lifiFeeCostUSD = route.steps[0]?.estimate?.feeCosts?.find((f: any) => f.name === "LIFI Fixed Fee")?.amountUSD ?? 0;
  const priceUSD = route.toToken.priceUSD || 1;
  const lifiFeeCostInToToken = lifiFeeCostUSD / priceUSD;
  return rawToAmount + lifiFeeCostInToToken;
}

export function getAdjustedToAmountMin(route: any) {
  if (!route?.toToken || typeof route.toToken.decimals !== 'number' || !route.steps?.[0]) return 0;
  const rawToAmountMin = fromRawAmount(route.toAmountMin, route.toToken.decimals);
  const lifiFeeCostUSD = route.steps[0]?.estimate?.feeCosts?.find((f: any) => f.name === "LIFI Fixed Fee")?.amountUSD ?? 0;
  const priceUSD = route.toToken.priceUSD || 1;
  const lifiFeeCostInToToken = lifiFeeCostUSD / priceUSD;
  return rawToAmountMin + lifiFeeCostInToToken;
}
