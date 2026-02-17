export type VaultsData = {
  breakdowns?: {
    totalApy: number | string;
  };
  status: string;
  id: string;
  name: string;
  chain: string;
  platformId?: string;
  platform_id?: string;
  tvl?: number;
  tvls?: {
    value: number;
  };
  apy?: number;
  risks?: string[];
  assets?: string[];
  boost?: string;
  stablecoin?: boolean;
  rewardTokens?: string[];
  poolMeta?: string | null;
  volumeUsd1d?: number | null;
  volumeUsd7d?: number | null;
  apyBase?: number | null;
  apyReward?: number | null;
  ilRisk?: string;
  pool?: string;
  vaultApy?: number;
  beefyPerformanceFee?: number;
  lpFee?: number;
  tradingApr?: number;
  strategyTypeId?: string;
  earnedToken?: string;
};
