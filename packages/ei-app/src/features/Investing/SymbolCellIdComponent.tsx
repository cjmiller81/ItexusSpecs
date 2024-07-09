import { ColumnCellTemplateData } from "devextreme/ui/data_grid"
import { FC } from "react"
import { SymbolLookupField } from "../Common/DevExpressTable/SymbolLookupField"
import { ICoin } from "components/src/models/token/ICoin"

export const SymbolCellIdComponent: FC<{ data: ColumnCellTemplateData<ICoin> }> = ({ data }) => {
  return (
    <SymbolLookupField
      key={data.row.data.lURI}
      text={data.row.data.sym.toUpperCase()}
      iconUrl={data.row.data.lURI}></SymbolLookupField>
  )
}
