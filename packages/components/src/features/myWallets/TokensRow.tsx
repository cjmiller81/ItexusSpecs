import { styled } from "@mui/material/styles"
import { GridRow } from "@mui/x-data-grid"
import { toTableTokensModels } from "../../utils"
import { getTokenNamesColumns } from "../../constants/ColumnsDefs/Tokens"
import { BasicTable } from "../../components/DataDisplay"

export const ExpandableRow = (props: any) => {
  const rows = toTableTokensModels(props.row.chainAssets)
  return (
    <>
      <GridRow {...props}></GridRow>
      {props.isExpanded(props.rowId) && (
        <StyledTokensTable
          slots={{
            pagination: () => {
              return <></>
            },
            footer: () => {
              return <></>
            },
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: "chainName", sort: "desc" }],
            },
          }}
          rowSelection={false}
          checkboxSelection={false}
          getRowId={x => x.tokenName + x.chainName}
          columnHeaderHeight={40}
          rowHeight={20}
          columns={getTokenNamesColumns()}
          rows={rows}
        />
      )}
    </>
  )
}

const StyledTokensTable:any = styled(BasicTable)(() => ({
  width: "100%",
  "& .MuiDataGrid-virtualScrollerContent": {
    overflow: "hidden",
  },
}))
