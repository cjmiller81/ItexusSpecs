import { ICoin } from "@/services/backend-api.service"
import {
  IModelFormState,
  ISetAllocationsState,
  ITokenSetAllocation,
  SetAllocationsType
} from "../IndexModel.types"

export interface ISetModeling {
  prefilteredTokenData: ICoin[]
  onSetAllocationsStateUpdate: (setAllocationsState:ISetAllocationsState) =>void
  onModelSetModelingUpdate: (modelSetModelingTable:ITokenSetAllocation[]) =>void
  onUpdate: (tab: SetAllocationsType, data: IModelFormState) => void
  tabType: SetAllocationsType
  setAllocationsState: ISetAllocationsState
}
