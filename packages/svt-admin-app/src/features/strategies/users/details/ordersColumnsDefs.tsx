import i18next from "@/libs/i18n/i18n";
import { GridColDef } from "@mui/x-data-grid";
import { apiDateFormatString } from "components";
import moment from "moment";
import { Order } from "./order";

export function getOrderColumnsColumns() {
  const columns: GridColDef<Order>[] = [
    {
      field: "id",
      headerName: i18next.t("Id", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "userId",
      headerName: i18next.t("UserId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "accountNumber",
      headerName: i18next.t("AccountNumber", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "tradeSymbol",
      headerName: i18next.t("TradeSymbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "exchangeOrderId",
      headerName: i18next.t("ExchangeOrderId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "instruction",
      headerName: i18next.t("Instruction", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "isEntryOrder",
      headerName: i18next.t("IsEntryOrder", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "boolean",
    },
    {
      field: "isExitOrder",
      headerName: i18next.t("IsExitOrder", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "boolean",
    },
    {
      field: "status",
      headerName: i18next.t("Status", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "exchangeEntryOrderId",
      headerName: i18next.t("ExchangeEntryOrderId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "transactionTime",
      headerName: i18next.t("TransactionTime", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "dateTime",
      valueGetter: (params) => moment(params.value, apiDateFormatString).toDate(),
    },
  ];

  return columns;
}
