import i18next from "@/libs/i18n/i18n";
import { GridColDef } from "@mui/x-data-grid";
import { formatCurrencyToString } from "@/utils/common";
import { OpenPosition } from "../types";

export function getOpenPositionColumns() {
  const columns: GridColDef<OpenPosition>[] = [
    {
      field: "underlyingSymbol",
      headerName: i18next.t("Underlying", { ns: "ColumnsDefs" }),
      minWidth: 110,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "marketSymbol",
      headerName: i18next.t("Symbol", { ns: "ColumnsDefs" }),
      minWidth: 110,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "amount",
      headerName: i18next.t("Qty", { ns: "ColumnsDefs" }),
      minWidth: 40,
      editable: true,
      flex: 1,
      type: "number",
    },
    {
      field: "averagePrice",
      headerName: i18next.t("AvgPrice", { ns: "ColumnsDefs" }),
      minWidth: 50,
      editable: true,
      flex: 1,
      type: "number",
      valueGetter: (params) => formatCurrencyToString(params.row.averagePrice, "$"),
    },
    {
      field: "direction",
      headerName: i18next.t("Direction", { ns: "ColumnsDefs" }),
      minWidth: 60,
      editable: true,
      flex: 1,
      type: "string",
    }
  ];

  return columns;
}
