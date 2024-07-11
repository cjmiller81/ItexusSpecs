import { styled } from "@mui/material/styles";
import { GridRow } from "@mui/x-data-grid";
import { BasicTable } from "../../components/DataDisplay";
import { toTableTokensModels } from "../../utils";
import { getTokenNamesColumns } from "./TokensTableColumnsDefs";
import SimpleBar from "simplebar-react";

export const ExpandableRow = (props: any) => {
  const rows = toTableTokensModels(props.row.chainAssets);
  return (
    <>
      <GridRow {...props}></GridRow>
      {props.isExpanded(props.rowId) && (
        <SimpleBarStyled style={{ maxHeight: "300px" }}>
          <StyledTokensTable
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
        </SimpleBarStyled>
      )}
    </>
  );
};

const SimpleBarStyled = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "200px",
  "& .simplebar-scrollbar": {
    width: "8px",
    backgroundColor: theme.palette.grey[500],
  },
  "& .simplebar-scrollbar::before": {
    backgroundColor: theme.palette.grey[800],
    borderRadius: "4px",
  },
  "& .simplebar-scrollbar:hover::before": {
    backgroundColor: theme.palette.grey[600],
  },
}));

const StyledTokensTable = styled(BasicTable)(({}) => ({
  width: "100%",
}));
