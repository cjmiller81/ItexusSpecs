import i18next from "@/libs/i18n/i18n";
import { GridColDef } from "@mui/x-data-grid";
import { apiDateFormatString } from "components";
import moment from "moment";
import { WorkingOrder } from "@/features/strategies/users/details/workingOrder";

export function getWorkingOrdersColumns() {
  const columns: GridColDef<WorkingOrder>[] = [
    {
      field: "tradeSymbol",
      headerName: i18next.t("TradeSymbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "instruction",
      headerName: i18next.t("Instruction", { ns: "ColumnsDefs" }),
      minWidth: 70,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "isEntryOrder",
      headerName: i18next.t("IsEntryOrder", { ns: "ColumnsDefs" }),
      minWidth: 80,
      editable: true,
      flex: 1,
      type: "boolean",
    },
    {
      field: "isExitOrder",
      headerName: i18next.t("IsExitOrder", { ns: "ColumnsDefs" }),
      minWidth: 80,
      editable: true,
      flex: 1,
      type: "boolean",
    },
    {
      field: "status",
      headerName: i18next.t("Status", { ns: "ColumnsDefs" }),
      minWidth: 60,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "transactionTime",
      headerName: i18next.t("TransactionTime", { ns: "ColumnsDefs" }),
      minWidth: 140,
      editable: true,
      flex: 1,
      type: "dateTime",
      valueGetter: params => moment(params.value, apiDateFormatString).toDate(),
    },
    {
      field: "orderId",
      headerName: i18next.t("OrderID", { ns: "ColumnsDefs" }),
      minWidth: 80,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "entryId",
      headerName: i18next.t("EntryID", { ns: "ColumnsDefs" }),
      minWidth: 60,
      editable: true,
      flex: 1,
      type: "string",
    },
  ];

  return columns;
}
