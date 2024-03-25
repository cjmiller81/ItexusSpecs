import {
  ISetAllocationsState,
  ITokenSetAllocation,
  SetAllocationsType
} from "../../IndexModel.types"

export function calculateWeightValue (
  tabType: SetAllocationsType,
  marketCap: number,
  prefilteredTokenData: ITokenSetAllocation[]
): number {
  let marketCapSum:number = 0
  let weightedValue:number = 0
  const setAllocationsState = localStorage.getItem('dx-data-localStore-setAllocationsState')
  if (setAllocationsState != null) {
    const parsedData = JSON.parse(setAllocationsState) as ISetAllocationsState[]

    if (parsedData && parsedData.length > 0) {
      if (tabType === 'weighted' && parsedData[0][tabType].setModeling.tokenCount) {
        if (prefilteredTokenData) {
          prefilteredTokenData
            .sort((a, b) => {
              if (a.marketCap < b.marketCap) {
                return 1
              }
              if (a.marketCap > b.marketCap) {
                return -1
              }
              // a must be equal to b
              return 0
            })
            .slice(0, parsedData[0][tabType].setModeling.tokenCount)
            .forEach((token) => marketCapSum += token.marketCap)
        }
        weightedValue = marketCap / marketCapSum
      } else if (tabType === 'equalWeight' && parsedData[0][tabType].setModeling.tokenCount) {
        weightedValue = 1 / parsedData[0][tabType].setModeling.tokenCount
      }
    }
  }
  return weightedValue
}
