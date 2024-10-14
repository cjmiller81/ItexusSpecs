import i18next from "@/libs/i18n/i18n";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { ICurrentDayFills } from "./currentDayFillsInterface";


export function getCurrentDayFillsColumns() {
  const columns: GridColDef<ICurrentDayFills>[] = [
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
      field: "transactionTime",
      headerName: i18next.t("TransactionTime", { ns: "ColumnsDefs" }),
      minWidth: 120,
      editable: true,
      flex: 1,
      type: "dateTime",
      valueGetter: params => moment(params.value, 'YYYY-MM-DD hh:mm').toDate(),
    },
    {
      field: "orderId",
      headerName: i18next.t("OrderId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
    {
      field: "entryId",
      headerName: i18next.t("EntryId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "string",
    },
  ];

  return columns;
}