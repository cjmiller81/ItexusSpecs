import React from 'react'
import CustomStore from 'devextreme/data/custom_store'
import DataSource from 'devextreme/data/data_source'
import { ValueChangedEvent } from 'devextreme/ui/lookup'

export interface ISymbolLookup {
  DataSource: DataSource | CustomStore,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataSourceKey: string | ((item: any) => string | number | boolean),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FieldRender?: (...params: any) => React.ReactNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ItemRender?: (...params: any) => React.ReactNode,
  defaultValue?: string,
  onValueChanged?: ((e: ValueChangedEvent) => void),
}

export interface ISymbolCellIdComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
}

export interface ISymbolLookupField {
  Description?: string,
  IconUrl?: string,
  Symbol: string,
}

export interface ISymbolLookupListItem {
  Category?: string,
  Description?: string,
  IconUrl?: string,
  Symbol: string,
}
