import i18next from "@/libs/i18n/i18n";
import { GridColDef } from "@mui/x-data-grid";
import { OpenPosition } from "./openPosition";
import { formatCurrencyToString } from "@/utils/common";

export function getOpenPositionColumns() {
  const columns: GridColDef<OpenPosition>[] = [
    {
      field: "instrument",
      headerName: i18next.t("Instrument", { ns: "ColumnsDefs" }),
      minWidth: 110,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "qty",
      headerName: i18next.t("Qty", { ns: "ColumnsDefs" }),
      minWidth: 40,
      editable: true,
      flex: 1,
      type: "number",
    },
    {
      field: "avgPrice",
      headerName: i18next.t("AvgPrice", { ns: "ColumnsDefs" }),
      minWidth: 50,
      editable: true,
      flex: 1,
      type: "number",
    },
    {
      field: "PandL",
      headerName: i18next.t("PandL", { ns: "ColumnsDefs" }),
      minWidth: 60,
      editable: true,
      flex: 1,
      type: "string",
      valueGetter: (params) => formatCurrencyToString(params.row.pAndL, params.row.currencySymbol)
    }
  ];

  return columns;
}