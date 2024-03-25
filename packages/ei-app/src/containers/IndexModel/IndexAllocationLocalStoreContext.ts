import { createContext } from 'react'
import { ISetAllocationsState } from './IndexModel.types'

export const IndexAllocationsStateStoreContext = createContext({} as ISetAllocationsState | undefined)
