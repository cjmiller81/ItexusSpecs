import BasicTable from "@/components/DataDisplay/BasicTable"
import { tokenNamesColumns } from "@/constants/ColumnsDefs/Tokens"
import { toTableTokensModels } from "@/utils/tokensTableHelpers"
import { styled } from "@mui/material/styles"
import { GridRow } from "@mui/x-data-grid"

export const ExpandableRow = (props: any) => {
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
          rowSelection={false}
          checkboxSelection={false}
          getRowId={x => x.tokenName}
          columnHeaderHeight={40}
          rowHeight={20}
          columns={tokenNamesColumns}
          rows={toTableTokensModels(props.row.chainAssets)}
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
