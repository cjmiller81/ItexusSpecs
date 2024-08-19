import { Typography } from "@mui/material";
import { Box, Theme } from "@mui/system";
import { ColumnDef } from "@tanstack/react-table";
import { HistoryDataParsed } from "api/rfq-api/models/HistoryDataParsed";
import moment from "moment";
import { OrderStatus } from "../shared/models/orderStatus";
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
      cell: props =>
        moment(props.getValue() as Date)
          .local()
          .format("YYYY-MM-DD HH:mm:ss"),
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
              maxWidth: 50,
            }
          }}
          noWrap
          {...props}>
          {props.getValue()}
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
      cell: props => {
        const value = Number(props.getValue() as string);
        return value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
      },
    },
    {
      accessorKey: "filledPrice",
      header: "Price",
      enableResizing: true,
      cell: props => {
        const value = Number(props.getValue() as string);
        return value.toFixed(5);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableResizing: true,
      cell: props => <StatusChip status={props.getValue() as OrderStatus} />,
    },
  ];
};
