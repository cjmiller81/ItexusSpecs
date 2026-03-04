// Utility for fetching and caching LI.FI chains for Bridge To dropdown
import appAxios from "@/libs/axios/axios";

export interface LifiChain {
  name: string;
  id: number;
  key: string;
  coin: string;
  logoURI: string;
}

const PREFERRED_CHAIN_IDS = [1, 56, 42161, 10, 137, 43114, 8453];

export const FALLBACK_CHAINS: LifiChain[] = [
  { id: 1,     name: 'Ethereum',   key: 'eth', coin: 'ETH', logoURI: '' },
  { id: 56,    name: 'BNB Chain',  key: 'bsc', coin: 'BNB', logoURI: '' },
  { id: 42161, name: 'Arbitrum',   key: 'arb', coin: 'ETH', logoURI: '' },
  { id: 10,    name: 'Optimism',   key: 'opt', coin: 'ETH', logoURI: '' },
  { id: 137,   name: 'Polygon',    key: 'pol', coin: 'POL', logoURI: '' },
  { id: 43114, name: 'Avalanche',  key: 'ava', coin: 'AVAX', logoURI: '' },
  { id: 8453,  name: 'Base',       key: 'bas', coin: 'ETH', logoURI: '' },
];

const CACHE_KEY = 'lifi_chains_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function fetchLifiChains(): Promise<LifiChain[]> {
  // Try sessionStorage first
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  try {
    const resp = await appAxios.get("/api/lifi/chains");
    const chains = (resp.data.chains || []).filter((c: any) => c.mainnet === true);
    const mapped: LifiChain[] = chains.map((c: any) => ({
      name: c.name,
      id: c.id,
      key: c.key,
      coin: c.coin,
      logoURI: c.logoURI,
    }));
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: mapped, timestamp: Date.now() }));
    return mapped;
  } catch (err) {
    // fallback
    return FALLBACK_CHAINS;
  }
}

export function sortChains(chains: LifiChain[]) {
  const preferred: LifiChain[] = [];
  const rest: LifiChain[] = [];
  for (const chain of chains) {
    if (PREFERRED_CHAIN_IDS.includes(chain.id)) preferred.push(chain);
    else rest.push(chain);
  }
  preferred.sort((a, b) => PREFERRED_CHAIN_IDS.indexOf(a.id) - PREFERRED_CHAIN_IDS.indexOf(b.id));
  rest.sort((a, b) => a.name.localeCompare(b.name));
  return { preferred, rest };
}
