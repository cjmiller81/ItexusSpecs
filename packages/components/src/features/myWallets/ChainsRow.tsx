import { Box } from "@mui/system";
import { GridRow } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { BasicTable } from "../../components/DataDisplay";
import { getChainNamesColumns } from "./ChainTableColumnDefs";
import { krakenApi } from "../../services/krakenService";

export const ExpandableChainRow = (props: any) => {
    const [balanceData, setBalanceData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.isExpanded(props.rowId)) {
            fetchBalance();
        }
    }, [props.isExpanded(props.rowId)]);

    const fetchBalance = async () => {
        setLoading(true);
        try {
            const response = await krakenApi.getAccountBalance();
            setBalanceData(Object.entries(response).map(([chainName, balance]) => ({ chainName, balance })));
        } catch (error) {
            console.error("Failed to fetch Kraken balance:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ overflowX: "auto" }}>
            <GridRow {...props} />
            {props.isExpanded(props.rowId) && (
                <Box px={3} py={1}>
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
                            getRowId={(x) => x.chainName + x.balance}
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
