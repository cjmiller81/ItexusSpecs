// Chain badge color map for Bridge To
export const CHAIN_COLORS = {
  ETH:   { bg: 'rgba(98,126,234,0.12)',  border: '1px solid rgba(98,126,234,0.35)',  color: '#627EEA' },
  BSC:   { bg: 'rgba(240,185,11,0.12)',  border: '1px solid rgba(240,185,11,0.35)',  color: '#F0B90B' },
  OPT:   { bg: 'rgba(255,4,32,0.12)',    border: '1px solid rgba(255,4,32,0.35)',    color: '#FF0420' },
  POLY:  { bg: 'rgba(130,71,229,0.12)',  border: '1px solid rgba(130,71,229,0.35)',  color: '#8247E5' },
  AVAX:  { bg: 'rgba(232,65,66,0.12)',   border: '1px solid rgba(232,65,66,0.35)',   color: '#E84142' },
  ARB:   { bg: 'rgba(40,160,240,0.12)',  border: '1px solid rgba(40,160,240,0.35)',  color: '#28A0F0' },
  BASE:  { bg: 'rgba(0,82,255,0.12)',    border: '1px solid rgba(0,82,255,0.35)',    color: '#0052FF' },
  ZK:    { bg: 'rgba(28,82,239,0.12)',   border: '1px solid rgba(28,82,239,0.35)',   color: '#1C52EF' },
  GNO:   { bg: 'rgba(4,121,91,0.12)',    border: '1px solid rgba(4,121,91,0.35)',    color: '#04795B' },
  LINEA: { bg: 'rgba(97,223,255,0.12)',  border: '1px solid rgba(97,223,255,0.35)',  color: '#61DFFF' },
  SONIC: { bg: 'rgba(255,107,53,0.12)',  border: '1px solid rgba(255,107,53,0.35)',  color: '#FF6B35' },
  UNI:   { bg: 'rgba(255,0,122,0.12)',   border: '1px solid rgba(255,0,122,0.35)',   color: '#FF007A' },
};

// Supported chains and their metadata
export const CHAIN_MAP = {
  1:     { key: "ETH",   name: "Ethereum"  },
  56:    { key: "BSC",   name: "BNB Chain" },
  10:    { key: "OPT",   name: "Optimism"  },
  137:   { key: "POLY",  name: "Polygon"   },
  43114: { key: "AVAX",  name: "Avalanche" },
  42161: { key: "ARB",   name: "Arbitrum"  },
  8453:  { key: "BASE",  name: "Base"      },
  324:   { key: "ZK",    name: "zkSync Era"},
  100:   { key: "GNO",   name: "Gnosis"    },
  59144: { key: "LINEA", name: "Linea"     },
  146:   { key: "SONIC", name: "Sonic"     },
  130:   { key: "UNI",   name: "Unichain"  },
  1151111081099710: { key: "SOL", name: "Solana" },
};

export const SUPPORTED_CHAINS = [
  { chainId: 1,     key: "ETH",   name: "Ethereum"  },
  { chainId: 56,    key: "BSC",   name: "BNB Chain" },
  { chainId: 10,    key: "OPT",   name: "Optimism"  },
  { chainId: 137,   key: "POLY",  name: "Polygon"   },
  { chainId: 43114, key: "AVAX",  name: "Avalanche" },
  { chainId: 42161, key: "ARB",   name: "Arbitrum"  },
  { chainId: 8453,  key: "BASE",  name: "Base"      },
  { chainId: 324,   key: "ZK",    name: "zkSync Era"},
  { chainId: 100,   key: "GNO",   name: "Gnosis"    },
  { chainId: 59144, key: "LINEA", name: "Linea"     },
  { chainId: 146,   key: "SONIC", name: "Sonic"     },
  { chainId: 130,   key: "UNI",   name: "Unichain"  },
  { chainId: 1151111081099710, key: "SOL", name: "Solana" },
];
