import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import i18next from "i18next";

export const getChainNamesColumns = (): GridColDef[] => {
  return [
    {
      field: "asset",
      headerName: i18next.t("Asset", { ns: "ColumnsDefs" }),
      disableExport: true,
      disableColumnMenu: true,
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
  ];
};
