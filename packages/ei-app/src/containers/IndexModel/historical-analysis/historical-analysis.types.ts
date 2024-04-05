import { ICoin } from "@/services/backend-api.service"
import { ISetAllocationsState, ITokenSetAllocation, SetAllocationsType } from "../IndexModel.types"

export interface IHistoricalAnalysis {
  prefilteredTokenData: ICoin[]
  setAllocationsState: ISetAllocationsState
  tabType: SetAllocationsType
}

export interface IDateRange {
  value: [startDate: Date, endDate: Date]
}

export interface IChartData {
  date: string,
  close: number,
  compareClose: number,
}
