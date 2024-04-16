import { ICoin } from "@/services/backend-api.service"
import { ColumnCellTemplateData } from "devextreme/ui/data_grid"
import { FC } from "react"
import { SymbolLookupField } from "./SymbolLookupField"

export const SymbolCellIdComponent: FC<{ data: ColumnCellTemplateData<ICoin> }> = ({ data }) => {
  return (
    <SymbolLookupField
      key={data.row.data.lURI}
      symbol={data.row.data.sym.toUpperCase()}
      iconUrl={data.row.data.lURI}></SymbolLookupField>
  )
}
