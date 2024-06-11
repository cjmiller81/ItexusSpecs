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
      headerName: i18next.t("User Id", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "accountNumber",
      headerName: i18next.t("Account Number", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "tradeSymbol",
      headerName: i18next.t("Trade Symbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "exchangeOrderId",
      headerName: i18next.t("Exchange Order Id", { ns: "ColumnsDefs" }),
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
      headerName: i18next.t("Is Entry Order", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "boolean",
    },
    {
      field: "isExitOrder",
      headerName: i18next.t("Is Exit Order", { ns: "ColumnsDefs" }),
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
      headerName: i18next.t("Exchange Entry Order Id", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "transactionTime",
      headerName: i18next.t("Transaction Time", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "dateTime",
      valueGetter: (params) => moment(params.value, apiDateFormatString).toDate(),
    },
  ];

  return columns;
}
