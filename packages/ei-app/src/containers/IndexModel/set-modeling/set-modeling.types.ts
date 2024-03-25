import {
  IModelFormState,
  ISetAllocationsState,
  ITokenSetAllocation,
  SetAllocationsType
} from "../IndexModel.types"

export interface ISetModeling {
  prefilteredTokenData: ITokenSetAllocation[]
  onSetAllocationsStateUpdate: (setAllocationsState:ISetAllocationsState) =>void
  onModelSetModelingUpdate: (modelSetModelingTable:ITokenSetAllocation[]) =>void
  onUpdate: (tab: SetAllocationsType, data: IModelFormState) => void
  tabType: SetAllocationsType
  setAllocationsState: ISetAllocationsState
}
