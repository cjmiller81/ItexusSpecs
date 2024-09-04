import { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatFilledQty, formatOrderId } from "../dataFormatters";
import { SettlementTableRow } from "./SettlementTableRow";

export const getSettlementDataTableColumns = (): ColumnDef<SettlementTableRow, any>[] => {
  return [
    {
      accessorKey: "type",
      header: "Type",
      enableResizing: true,
    },
    {
      accessorKey: "settlementId",
      header: "Settlement ID",
      enableResizing: true,
      cell: value => formatOrderId(value.getValue()),
    },
    {
      accessorKey: "time",
      header: "Time",
      meta: {
        sx:{
          minWidth: "76px"
        }
      } as any,
      enableResizing: true,
      cell: value => formatDate(value.getValue()),
    },
    {
      accessorKey: "date",
      header: "Date",
      meta: {
        sx:{
          minWidth: "76px"
        }
      } as any,
      enableResizing: true,
      cell: value => formatDate(value.getValue()),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      enableResizing: true,
      cell: value => formatFilledQty(value.getValue()),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      enableResizing: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableResizing: true,
    },
    {
      accessorKey: "reference",
      header: "Reference",
      enableResizing: true,
    },
    {
      accessorKey: "destination",
      header: "Destination",
      enableResizing: true,
    },
  ];
};
