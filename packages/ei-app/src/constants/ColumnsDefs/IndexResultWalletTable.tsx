import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next, { t } from "i18next";
import { Typography, Box } from "@mui/material";
import { WalletBalance } from "@/models/Wallet/WalletBalance";

i18next.setDefaultNamespace("ColumnsDefs");

export const getIndexResultWalletTableColumns = (): GridColDef<WalletBalance>[] => {
  return [
    {
      field: "symbol",
      headerName: t("Token"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<WalletBalance, any, any>) => (
        <div>
          <Typography
            variant="body1"
            sx={{ textTransform: "uppercase", fontSize: "0.80rem", fontWeight: 500 }}>
            {params.row.tokenName}
          </Typography>
          {params.row.name && (
            <Typography
              variant="body2"
              sx={{ fontSize: "0.70rem", color: "text.secondary" }}>
              {params.row.name}
            </Typography>
          )}
        </div>
      ),
    },

    {
      field: "chain",
      headerName: t("Chain"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<WalletBalance, any, any>) => (
        <Box
          px={1}
          py={0.5}
          border="1px solid"
          borderColor="rgba(148,163,184,0.3)"
          borderRadius={1}
          fontSize={12}
          sx={(theme) => ({
            color: theme.palette.mode === "dark" ? "rgba(203,213,225,1)" : "#000",
            bgcolor: "rgba(71,85,105,0.2)",
          })}
        >
          {params.row.chain}
        </Box>
      ),
    },

    {
      field: "qty",
      headerName: t("Balance"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        if (!params.row.balance) return "--";
        return params.row.balance.toLocaleString("en-US", {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        });
      },
      renderCell: (params: GridRenderCellParams<WalletBalance, any, any>) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.80rem" }}>
          {params.formattedValue}
        </Typography>
      ),
    },
  ];
};
