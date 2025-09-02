import { Box } from "@mui/system";
import { GridRow } from "@mui/x-data-grid";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { BasicTable } from "../../components/DataDisplay";
import { useAppSelector } from "../../slices";
import { useMemo } from "react";
import { getTokenNamesColumns } from "./TokensTableColumnsDefs";
import { toTableTokensModelFromWallet } from "../../utils/tokensTableHelpers";

export const ExpandableRow = (props: any) => {
  const { portfolioWalletData } = useAppSelector(state => state.wallets);
  
  const rows = useMemo(() => {
    const wallet = portfolioWalletData.find(w => w.walletAddress === props.row.address);
    if (!wallet) return [];
    
    return toTableTokensModelFromWallet(wallet);
  }, [portfolioWalletData, props.row.address]);

  return (
    <Box sx={{ overflowX: "auto" }}>
      <GridRow {...props} />
      {props.isExpanded(props.rowId) && (
        <Box
          px={3}
          py={1}>
          <BasicTable
            scrollbarSize={6}
            sx={{
              display: "grid",
              "& .MuiDataGrid-main": {
                height: "auto",
                maxHeight: "10000px",
              },
              ...tableScrollSx
            }}
            slots={{
              pagination: () => {
                return <></>;
              },
              footer: () => {
                return <></>;
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
        </Box>
      )}
    </Box>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
}
