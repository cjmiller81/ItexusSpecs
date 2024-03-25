import { ISetModelingFormState } from './set-modeling-form.types'

export enum SetModelingFormField {
  EqualWeight = 'equalWeight',
  TokenCount = 'tokenCount',
  StartPrice = 'startPrice',
}

export enum SetModelingFormLabel {
  EqualWeight = 'Equal Weight',
  TokenCount = 'Tokens',
  StartPrice = 'Total Capital',
}

export const defaultSetModelingFormState:ISetModelingFormState = {
  equalWeight: 0.3333,
  tokenCount: 3,
  startPrice: 100,
}
