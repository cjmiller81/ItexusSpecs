import { PoolData } from "./PoolData";
export type PoolApiResponse = {
  status?: string;
  data: PoolData[];
  totalCount?: number;
};
