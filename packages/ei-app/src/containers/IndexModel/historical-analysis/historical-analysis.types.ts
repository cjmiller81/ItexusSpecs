import { ISetAllocationsState, ITokenSetAllocation, SetAllocationsType } from "../IndexModel.types"

export interface IHistoricalAnalysis {
  prefilteredTokenData: ITokenSetAllocation[]
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
