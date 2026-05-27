import { Box } from "@mui/system";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { BasicTable } from "../../components/DataDisplay";
import { getChainNamesColumns } from "./ChainTableColumnDefs";
import { krakenApi } from "../../services/krakenService";

interface ExpandableChainRowProps extends GridRowProps {
  isExpanded: (rowId: string | number) => boolean;
  rowId: string | number;
}

export const ExpandableChainRow = (props: ExpandableChainRowProps) => {
  const { isExpanded, rowId, ...gridRowProps } = props;
  const [balanceData, setBalanceData] = useState<{ asset: string; balance: unknown }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isExpanded(rowId)) {
      fetchBalance();
    }
  }, [isExpanded(rowId)]);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const response = await krakenApi.getAccountBalance();

      if (response && typeof response === "object" && !Array.isArray(response)) {
        const formattedData = Object.entries(response).map(([chainName, balance]) => ({
          asset: chainName,
          balance,
        }));

        setBalanceData(formattedData);
      } else {
        console.error("Unexpected response format:", response);
        setBalanceData([]);
      }
    } catch (error) {
      console.error("Failed to fetch Kraken balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ overflowX: "auto" }}>
      <GridRow {...gridRowProps} />
      {isExpanded(rowId) && (
        <Box
          px={3}
          py={1}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <BasicTable
              scrollbarSize={6}
              sx={{
                display: "grid",
                "& .MuiDataGrid-main": {
                  minHeight: "100px",
                  height: "auto",
                  maxHeight: "10000px",
                },
                ...tableScrollSx,
              }}
              slots={{
                pagination: () => <></>,
                footer: () => <></>,
              }}
              initialState={{
                sorting: {
                  sortModel: [{ field: "chainName", sort: "desc" }],
                },
              }}
              rowSelection={false}
              checkboxSelection={false}
              getRowId={x => x.asset}
              columnHeaderHeight={40}
              rowHeight={20}
              columns={getChainNamesColumns()}
              rows={balanceData}
            />
          )}
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
