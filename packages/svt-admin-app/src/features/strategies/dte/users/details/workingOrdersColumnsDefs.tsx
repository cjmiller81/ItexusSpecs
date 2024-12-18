import i18next from "@/libs/i18n/i18n";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { IWorkingOrder } from "../types";

export function getWorkingOrdersColumns() {
    const columns: GridColDef<IWorkingOrder>[] = [
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
        valueGetter: params => moment(params.value, 'YYYY-MM-DD HH:mm').toDate(),
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
        field: "orderQty",
        headerName: i18next.t("OrderQty", { ns: "ColumnsDefs" }),
        minWidth: 100,
        editable: true,
        flex: 1,
        type: "string",
      },
      {
        field: "fillQty",
        headerName: i18next.t("FillQty", { ns: "ColumnsDefs" }),
        minWidth: 100,
        editable: true,
        flex: 1,
        type: "string",
      },
    ];

    return columns;
}
