import i18next from "@/libs/i18n/i18n"
import { GridColDef } from "@mui/x-data-grid"
import { dateTimeFormat } from "components"
import moment from "moment"
import { Order } from "./details/order"

export function getOrderColumnsColumns() {
  const columns: GridColDef<Order>[] = [
    {
      field: "exchangeOrderId",
      headerName: i18next.t("ExchangeOrderId", { ns: "ColumnsDefs" }),
      type: "string",
      flex: 1,
    },
    {
      field: "instruction",
      headerName: i18next.t("Instruction", { ns: "ColumnsDefs" }),
      type: "string",
      flex: 1,
    },
    {
      field: "isEntryOrder",
      headerName: i18next.t("IsEntryOrder", { ns: "ColumnsDefs" }),
      type: "boolean",
      flex: 1,
    },
    {
      field: "isExitOrder",
      headerName: i18next.t("IsExitOrder", { ns: "ColumnsDefs" }),
      type: "boolean",
      flex: 1,
    },
    {
      field: "status",
      headerName: i18next.t("Status", { ns: "ColumnsDefs" }),
      type: "string",
      flex: 1,
    },
    {
      field: "exchangeEntryOrderId",
      headerName: i18next.t("ExchangeEntryOrderId", { ns: "ColumnsDefs" }),
      type: "string",
      flex: 1,
    },
    {
      field: "transactionTime",
      headerName: i18next.t("TransactionTime", { ns: "ColumnsDefs" }),
      type: "string",
      flex: 1,
      valueFormatter: params => moment(params?.value).format(dateTimeFormat),
    },
  ]

  return columns
}
