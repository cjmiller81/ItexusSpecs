export type FilterType = string | null;

export interface IPrefilterTokensFilterValues {
  id: string;
  name: string;
  description?: string | null;
  filterType?: string | null;
  icon?: string | null;
  isPublic?: boolean;
  OwnerUserId?: string | null;
  isPublished?: boolean;
  accessPlanName?: string | null;
  filter: object[] | string[];
}
