import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import i18next from "i18next";
import { ChainChip } from "../../components/ChainChip";
import "../../components/ChainChip.css";

export const getTokenNamesColumns = (): GridColDef[] => {
  return [
    {
      field: "chainName",
      headerName: i18next.t("Chain", { ns: "ColumnsDefs" }),
      width: 100,
      disableExport: true,
      disableColumnMenu: true,
      renderCell: (params) => {
        const token = params.row;
        return (
          <ChainChip
            lifiChain={token.lifiChain ?? null}
            networkName={typeof token.network === 'object' && token.network?.name ? token.network.name : String(token.network ?? token.chainName)}
          />
        );
      },
    },
    {
      field: "tokenName",
      headerName: i18next.t("TokenName", { ns: "ColumnsDefs" }),
      flex: 1,
    },
    {
      field: "balance",
      headerName: i18next.t("Amount", { ns: "ColumnsDefs" }),
      valueFormatter: params => {
        return params.value.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        });
      },
      flex: 1,
    },
    {
      field: "price",
      headerName: i18next.t("Price", { ns: "ColumnsDefs" }),
      valueFormatter: params => {
        if (!params.value) return "--";
        return params.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
      flex: 1,
    },
    {
      field: "usdAmount",
      headerName: i18next.t("USDValue", { ns: "ColumnsDefs" }),
      valueFormatter: params => {
        if (!params.value) return "--";
        return params.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
      flex: 1,
    },
  ];
};
