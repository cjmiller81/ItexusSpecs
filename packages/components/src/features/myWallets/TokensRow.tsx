import { Box } from "@mui/system";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { BasicTable } from "../../components/DataDisplay";
import { useAppSelector } from "../../slices";
import { useMemo } from "react";
import { getTokenNamesColumns } from "./TokensTableColumnsDefs";
import { toTableTokensModelFromWallet } from "../../utils/tokensTableHelpers";

interface ExpandableRowProps extends GridRowProps {
  row: { address: string };
  isExpanded: (rowId: string | number) => boolean;
  rowId: string | number;
}

export const ExpandableRow = (props: ExpandableRowProps) => {
  const { isExpanded, rowId, row, ...gridRowProps } = props;
  const { portfolioWalletData } = useAppSelector(state => state.wallets);

  const rows = useMemo(() => {
    const wallet = portfolioWalletData.find(w => w.walletAddress === row.address);
    if (!wallet) return [];

    return toTableTokensModelFromWallet(wallet);
  }, [portfolioWalletData, row.address]);

  return (
    <Box sx={{ overflowX: "auto" }}>
      <GridRow
        {...gridRowProps}
        row={row}
      />
      {isExpanded(rowId) && (
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
              ...tableScrollSx,
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
};
