import { ITokenSetAllocation, SetAllocationsType } from "../IndexModel.types"

export interface IPrefilterTokens {
  tabType: SetAllocationsType
  onUpdate: (filteredTokenData: ITokenSetAllocation[]) => void
}
