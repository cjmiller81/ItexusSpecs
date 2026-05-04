import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next, { t } from "i18next";
import { Typography } from "@mui/material";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { LifiChainMap } from "@/common/lifiChainContext";
import { ChainChip } from "../../../../components/src/components/ChainChip";

i18next.setDefaultNamespace("ColumnsDefs");

export const getIndexResultWalletTableColumns = (lifiChainMap: LifiChainMap | null): GridColDef<WalletBalance>[] => {
  const getLifiChain = (chain: string | undefined, chainId?: number) => {
    if (!lifiChainMap) return null;
    if (chainId && lifiChainMap.has(chainId)) return lifiChainMap.get(chainId) ?? null;
    if (chain) {
      const found = Array.from(lifiChainMap.values()).find(
        c => c.name.toLowerCase() === chain.toLowerCase() || c.key.toLowerCase() === chain.toLowerCase()
      );
      return found ?? null;
    }
    return null;
  };
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
      renderCell: (params: GridRenderCellParams<WalletBalance, any, any>) => {
        const lifiChain = getLifiChain(params.row.chain, params.row.chainId);
        return (
          <ChainChip
            lifiChain={lifiChain}
            networkName={params.row.chain || ""}
          />
        );
      },
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
