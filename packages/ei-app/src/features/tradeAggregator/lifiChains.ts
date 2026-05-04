// Utility for fetching and caching LI.FI chains for Bridge To dropdown
import { LifiChain } from "@/common/lifiChainContext";

// LifiChain type is now imported from context

const PREFERRED_CHAIN_IDS = [1, 56, 42161, 10, 137, 43114, 8453];

export const FALLBACK_CHAINS: LifiChain[] = [
  { id: 1,     name: 'Ethereum',   key: 'eth', coin: 'ETH', logoURI: '', mainnet: false },
  { id: 56,    name: 'BNB Chain',  key: 'bsc', coin: 'BNB', logoURI: '', mainnet: false },
  { id: 42161, name: 'Arbitrum',   key: 'arb', coin: 'ETH', logoURI: '', mainnet: false },
  { id: 10,    name: 'Optimism',   key: 'opt', coin: 'ETH', logoURI: '', mainnet: false },
  { id: 137,   name: 'Polygon',    key: 'pol', coin: 'POL', logoURI: '', mainnet: false },
  { id: 43114, name: 'Avalanche',  key: 'ava', coin: 'AVAX', logoURI: '', mainnet: false },
  { id: 8453,  name: 'Base',       key: 'bas', coin: 'ETH', logoURI: '', mainnet: false },
];

// Utility to convert Map<number, LifiChain> to LifiChain[]
export function lifiChainMapToArray(map: Map<number, LifiChain> | null): LifiChain[] {
  if (!map) return [];
  return Array.from(map.values());
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
