import { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatFilledQty, formatTime } from "../dataFormatters";
import { SettlementTableRow } from "./types";

export const getSettlementDataTableColumns = (): ColumnDef<SettlementTableRow, any>[] => {
  return [
    {
      accessorKey: "type",
      header: "Type",
      enableResizing: true,
    },
    {
      accessorKey: "settlementId",
      header: "ID",
      meta: {
        sx: {
          maxWidth: "140px",
        },
      } as any,
      enableResizing: true,
      cell: value => value.getValue(),
    },
    {
      accessorKey: "time",
      header: "Time",
      meta: {
        sx: {
          minWidth: "60px",
        },
      } as any,
      enableResizing: true,
      cell: value => formatTime(value.getValue()),
    },
    {
      accessorKey: "date",
      header: "Date",
      meta: {
        sx: {
          minWidth: "60px",
        },
      } as any,
      enableResizing: true,
      cell: value => formatDate(value.getValue()),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      meta: {
        sx: {
          maxWidth: "90px",
        },
      } as any,
      enableResizing: true,
      cell: value => formatFilledQty(value.getValue()),
    },
    {
      accessorKey: "currency",
      header: "Curr",
      meta: {
        sx: {
          maxWidth: "40px",
        },
      } as any,
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
