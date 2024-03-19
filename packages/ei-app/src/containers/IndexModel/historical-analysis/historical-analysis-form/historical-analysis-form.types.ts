export enum HistoricalAnalysisDateRanges {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export interface IHistoricalAnalysisFormState {
  dateRange: IDateRange,
  period: HistoricalAnalysisDateRanges,
  compareSymbolId: string,
}

export interface IDateRange {
  value: [startDate: Date, endDate: Date],
}

export interface IHistoricalAnalysisForm {
  isLoading: boolean,
  onSubmit(formState: IHistoricalAnalysisFormState): void,
}
