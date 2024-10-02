import { HistoryDataParsed } from "@/api/rfq-api/models/HistoryDataParsed";
import { OrderStatus } from "@/features/shared/models/orderStatus";
import { Typography } from "@mui/material";
import { Box, Theme } from "@mui/system";
import { ColumnDef } from "@tanstack/react-table";
import { formatFilledPrice, formatFilledQty, formatOrderId, formatTransactTime } from "../dataFormatters";
import { StatusChip } from "./StatusChip";

export const getHistoryDataTableColumns = (theme: Theme): ColumnDef<HistoryDataParsed, any>[] => {
  return [
    {
      accessorKey: "transactTime",
      header: "Trade Time",
      enableResizing: true,
      meta: {
        sx: { minWidth: 22 },
      } as any,
      cell: props => formatTransactTime(props.getValue()),
    },
    {
      accessorKey: "id",
      header: "Order ID",
      enableResizing: true,
      cell: props => (
        <Typography
          fontSize="inherit"
          sx={{
            maxWidth: "100%",
            [theme.breakpoints.down("sm")]: {
              maxWidth: 90,
              paddingLeft: 1,
            },
          }}
          noWrap
          {...props}>
          {formatOrderId(props.getValue())}
        </Typography>
      ),
    },
    {
      accessorKey: "symbol",
      enableResizing: true,
      header: "Pair",
      minSize: 100,
      meta: {
        sx: {
          minWidth: 50,
        },
      } as any,
    },
    {
      accessorKey: "side",
      header: "Action",
      enableResizing: true,
      cell: props => {
        const action = props.getValue() as string;
        let bgColor = "transparent";
        let textColor = "inherit";

        if (action === "Buy") {
          bgColor = "rgba(149, 222, 100, 0.2)";
          textColor = "success.dark";
        } else if (action === "Sell") {
          bgColor = "rgba(222, 100, 100, 0.2)";
          textColor = "error.dark";
        }

        return (
          <Box
            sx={{
              borderRadius: 10,
              px: 2,
              py: 0.4,
              color: textColor,
              bgcolor: bgColor,
              width: "max-content",
              flex: 1,
            }}>
            {action}
          </Box>
        );
      },
    },
    {
      accessorKey: "filledQty",
      header: "Quantity",
      enableResizing: true,
      cell: props => formatFilledQty(props.getValue() as string),
    },
    {
      accessorKey: "filledPrice",
      header: "Price",
      enableResizing: true,
      cell: props => formatFilledPrice(props.getValue() as string),
    },
    {
      accessorKey: "status",
      header: () => <div style={{ marginLeft: "20px" }}>Status</div>,
      enableResizing: true,
      cell: props => <StatusChip status={props.getValue() as OrderStatus} />,
    },
  ];
};
