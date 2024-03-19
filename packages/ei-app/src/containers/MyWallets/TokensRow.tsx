import BasicTable from "@/components/DataDisplay/BasicTable"
import { getTokenNamesColumns } from "@/constants/ColumnsDefs/Tokens"
import { toTableTokensModels } from "@/utils/tokensTableHelpers"
import { styled } from "@mui/material/styles"
import { GridRow } from "@mui/x-data-grid"

export const ExpandableRow = (props: any) => {
  const rows = toTableTokensModels(props.row.chainAssets)
  return (
    <>
      <GridRow {...props}></GridRow>
      {props.row.expanded && (
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

const StyledTokensTable = styled(BasicTable)(() => ({
  width: "100%",
  "& .MuiDataGrid-virtualScrollerContent": {
    overflow: "hidden",
  },
}))
