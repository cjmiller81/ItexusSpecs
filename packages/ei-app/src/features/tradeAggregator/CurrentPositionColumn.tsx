import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import i18next from "i18next";

export const getCurentPositionColumns = (): GridColDef[] => {
  return [
    {
      field: "asset",
      headerName: i18next.t("Symbol", { ns: "TradeTable" }),
      disableExport: true,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "balance",
      headerName: i18next.t("Qty", { ns: "TradeTable" }),
      valueFormatter: params => {
        return params.value.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        });
      },
      flex: 1,
    },
  ];
};
