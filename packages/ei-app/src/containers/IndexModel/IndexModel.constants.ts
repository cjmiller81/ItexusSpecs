import { IModelFormState, ISetAllocationsState, SetAllocationsType } from './IndexModel.types'
import { defaultSetModelingFormState } from './set-modeling/set-modeling-form/set-modeling-form.constants'

export const ModelNames:Record<string, string> = {
  [SetAllocationsType.EqualWeight]: 'Market Cap Equal Weighted',
  [SetAllocationsType.Weighted]: 'Market Cap Weighted',
  [SetAllocationsType.Model]: 'Model',
}

/*
export const setAllocationsTabs = [
  {
    name: ModelNames[SetAllocationsType.Weighted],
    component: ModelTab,
    tabType: SetAllocationsType.Weighted,
  },
]

export const equalWeightedTabs = [
  {
    name: ModelNames[SetAllocationsType.EqualWeight],
    component: ModelTab,
    tabType: SetAllocationsType.EqualWeight,
  },
]
*/

export enum ModelCard {
  CurrentAllocations = 'currentAllocations',
  CurrentPosition = 'currentPosition',
  HistoricalAnalysis = 'historicalAnalysis',
  SetModeling = 'setModeling',
  NewAllocations = 'newAllocations',
  CurrentChanges = 'currentChanges',
  NewTokens = 'newTokens',
  PrefilterTokens = 'prefilterTokens',
}

export const defaultModelDropdownState = {
  [ModelCard.CurrentAllocations]: true,
  [ModelCard.CurrentPosition]: true,
  [ModelCard.HistoricalAnalysis]: true,
  [ModelCard.SetModeling]: true,
  [ModelCard.NewAllocations]: true,
  [ModelCard.CurrentChanges]: true,
  [ModelCard.NewTokens]: true,
  [ModelCard.PrefilterTokens]: true,
}

export const defaultModelTabState:IModelFormState = {
  [ModelCard.SetModeling]: defaultSetModelingFormState
}

export const defaultAllocationsPanelState:ISetAllocationsState[] = [{
  [SetAllocationsType.EqualWeight]: defaultModelTabState,
  [SetAllocationsType.Weighted]: defaultModelTabState,
  [SetAllocationsType.Model]: defaultModelTabState,
}]
