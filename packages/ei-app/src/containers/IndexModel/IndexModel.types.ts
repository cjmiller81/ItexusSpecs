import { ICoin } from '@/services/backend-api.service'
import { ModelCard } from './IndexModel.constants'
import { ISetModelingFormState } from './set-modeling/set-modeling-form/set-modeling-form.types'

export interface IModelFormState {
  [ModelCard.SetModeling]: ISetModelingFormState
}

export type ITabPanelData = IModelFormState

export interface ISetAllocationsState {
  [SetAllocationsType.EqualWeight]: IModelFormState
  [SetAllocationsType.Weighted]: IModelFormState
  [SetAllocationsType.Model]: IModelFormState
}

export enum SetAllocationsType {
  EqualWeight = 'equalWeight',
  Weighted = 'weighted',
  Model = 'model',
}

export interface ITabComponent {
  setAllocationsState: ISetAllocationsState
  tabType: SetAllocationsType
  onSetAllocationsStateUpdate: (setAllocationsState: ISetAllocationsState) => void
  onUpdate: (tab: SetAllocationsType, data: ITabPanelData) => void
}

export interface IModelCard {
  title: string
  name: ModelCard
}

export interface IModelDropdownState {
  [ModelCard.CurrentAllocations]: boolean
  [ModelCard.CurrentPosition]: boolean
  [ModelCard.HistoricalAnalysis]: boolean
  [ModelCard.SetModeling]: boolean
  [ModelCard.NewAllocations]: boolean
  [ModelCard.CurrentChanges]: boolean
  [ModelCard.NewTokens]: boolean
  [ModelCard.PrefilterTokens]: boolean
}

export interface ITokenSetAllocation extends ICoin {
  qty?: number
}
