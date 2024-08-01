import { Box } from "@mui/system";
import {
    ColumnDef
} from "@tanstack/react-table";
import { HistoryDataParsed } from "api/rfq-api/models/HistoryDataParsed";
import moment from "moment";
import { StatusChip } from "./StatusChip";

export const columns: ColumnDef<HistoryDataParsed>[] = [
    {
      accessorKey: "transactTime",
      header: "Trade Time",
      minSize: 100,
      cell: props =>
        moment(props.getValue() as Date)
          .local()
          .format("YYYY-MM-DD HH:mm:ss"),
    },
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "symbol", header: "Pair", minSize: 100 },
    {
      accessorKey: "side",
      header: "Action",
      minSize: 100,
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
              maxWidth: "max-content",
            }}>
            {action}
          </Box>
        );
      },
    },
    {
      accessorKey: "filledQty",
      header: "Quantity",
      cell: props => {
        const value = Number(props.getValue() as string);
        return value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
      },
    },
    {
      accessorKey: "filledPrice",
      header: "Price",
      cell: props => {
        const value = Number(props.getValue() as string);
        return value.toFixed(5);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: props => <StatusChip status={props.getValue() as string}/>,
    }
  ];