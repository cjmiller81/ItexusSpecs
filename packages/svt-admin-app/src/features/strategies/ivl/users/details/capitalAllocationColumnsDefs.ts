import i18next from "@/libs/i18n/i18n"
import { GridColDef } from "@mui/x-data-grid"
import { CapitalAllocation } from "./capitalAllocation"
import moment from "moment"
import { apiDateFormatString } from "components"

export function getCapitalAllocationColumnsDefs() {
  const columns: GridColDef<CapitalAllocation>[] = [
    {
      field: "originalCapitalAllocation",
      headerName: i18next.t("OriginalCapitalAllocation", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "dailyPNL",
      headerName: i18next.t("DailyPNL", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "totalPNL",
      headerName: i18next.t("TotalPNL", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "updateType",
      headerName: i18next.t("UpdateType", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "transactionTime",
      headerName: i18next.t("TransactionTime", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      valueFormatter: params => moment(params?.value).format(apiDateFormatString),
      flex: 1,
    },
  ]

  return columns
}
