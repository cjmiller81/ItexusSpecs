export interface TransactionHistoryResponse {
  walletAddress: string;
  totalCount: number;
  filteredCount: number;
  spamCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  transactions: Transaction[];
}

export interface Transaction {
  hash: string;
  chainId: number;
  chainName: string;
  blockNumber: number;
  timestamp: string;
  type: TransactionType;
  protocol: string | null;
  success: boolean;
  fromAddress: string;
  toAddress: string;
  gasUsed: number;
  gasUsd: number;
  transfers: TokenTransfer[];
  spam: SpamInfo;
  explorerUrl: string;
}

export type TransactionType = 
  | 'swap' | 'deposit' | 'withdraw' | 'claim' 
  | 'transfer' | 'native_transfer' | 'approval' | 'unknown';

export interface TokenTransfer {
  symbol: string;
  name: string | null;
  amount: number;
  direction: 'in' | 'out';
  logoUrl: string | null;
  usdValue: number | null;
  contractAddress: string;
}

export interface SpamInfo {
  isSpam: boolean;
  score: number;
  reasons: string[];
}