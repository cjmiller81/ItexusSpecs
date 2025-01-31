import { Box } from "@mui/system";
import { GridRow } from "@mui/x-data-grid";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { BasicTable } from "../../components/DataDisplay";
import { toTableTokensModels } from "../../utils";
import { getChainNamesColumns } from "./ChainTableColumnDefs";

export const ExpandableChainRow = (props: any) => {
    console.log("Props.row:", props.row);

    const rows = toTableTokensModels(props.row.chainAssets ?? []);

    return (
        <Box sx={{ overflowX: "auto" }}>
            <GridRow {...props} />
            {props.isExpanded(props.rowId) && (
                <Box px={3} py={1}>
                    <BasicTable
                        scrollbarSize={6}
                        sx={{
                            display: "grid",
                            "& .MuiDataGrid-main": {
                                minHeight:"100px",
                                height: "auto",
                                maxHeight: "10000px",
                            },
                            ...tableScrollSx
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
                        getRowId={x => x.chainName + x.balance}
                        columnHeaderHeight={40}
                        rowHeight={20}
                        columns={getChainNamesColumns()}
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
