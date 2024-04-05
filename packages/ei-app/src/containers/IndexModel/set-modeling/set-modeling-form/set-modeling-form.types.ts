import { ICoin } from "@/services/backend-api.service"
import { ISetAllocationsState, ITokenSetAllocation, SetAllocationsType } from "../../IndexModel.types"

export interface ISetModelingFormState {
  tokenCount: number
  startPrice: number
  equalWeight?: number
}

export interface ISetModelingForm {
  prefilteredTokenData: ICoin[]
  tabType: SetAllocationsType
  onSetAllocationsStateUpdate: (setAllocationsState: ISetAllocationsState) => void
  onModelSetModelingUpdate: (modelSetModelingTable: ITokenSetAllocation[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate(dataField: string, value: any): void
}
