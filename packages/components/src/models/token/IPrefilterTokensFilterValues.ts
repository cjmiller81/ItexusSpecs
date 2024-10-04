export type FilterType = null | "market-cap" | "liquidity-pool" | "vaults";

export interface IPrefilterTokensFilterValues {
  id: string;
  name: string;
  description?: string | null;
  filterType?: FilterType;
  icon: string | null;
  isPublic: boolean;
  OwnerUserId?: string | null;
  isPublished: boolean;
  accessPlanName?: string | null;
  filter: object[];
}
