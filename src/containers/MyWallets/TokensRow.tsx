import BasicTable from "@/components/DataDisplay/BasicTable"
import { tokenNamesColumns } from "@/constants/ColumnsDefs/Tokens"
import { ChainAsset } from "@/models/Wallet/ChainAsset"
import { Box } from "@mui/material"
import { styled } from "@mui/material/styles"
import { GridRow } from "@mui/x-data-grid"

export const ExpandableRow = (props: any) => {
  return (
    <Box>
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
          checkboxSelection={false}
          getRowId={x => x.tokenName}
          columnHeaderHeight={40}
          rowHeight={30}
          style={{ height: 250 }}
          columns={tokenNamesColumns}
          rows={props.row.chainAssets.flatMap((c: ChainAsset) => c.walletAssets)}
        />
      )}
    </Box>
  )
}

const StyledTokensTable = styled(BasicTable)(() => ({
  width: "50%",
}))
