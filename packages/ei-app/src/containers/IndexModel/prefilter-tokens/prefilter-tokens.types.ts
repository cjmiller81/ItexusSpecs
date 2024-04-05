import { ICoin } from "@/services/backend-api.service"
import { SetAllocationsType } from "../IndexModel.types"

export interface IPrefilterTokens {
  tabType: SetAllocationsType
  onUpdate: (filteredTokenData: ICoin[]) => void
}
