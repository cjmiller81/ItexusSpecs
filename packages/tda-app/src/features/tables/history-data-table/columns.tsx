import { HistoryDataParsed } from "@/api/rfq-api/models/HistoryDataParsed";
import { OrderStatus } from "@/features/shared/models/orderStatus";
import { Typography } from "@mui/material";
import { Box, Theme } from "@mui/system";
import { ColumnDef } from "@tanstack/react-table";
import { formatFilledPrice, formatFilledQty, formatOrderId, formatTransactTime } from "../dataFormatters";
import { StatusChip } from "./StatusChip";

export const getHistoryDataTableColumns = (theme: Theme, isPad: boolean, t): ColumnDef<HistoryDataParsed, any>[] => {
  return [
    {
      accessorKey: "transactTime",
      header: () => <Typography fontSize={isPad ? "8px" : "15px"}>{t("TradeTime")}</Typography>,
      enableResizing: true,
      meta: {
        sx: { minWidth: 22 },
      } as any,
      cell: props => formatTransactTime(props.getValue()),
    },
    {
      accessorKey: "id",
      header: () => <Typography fontSize={isPad ? "8px" : "15px"}>{t("ORDERID")}</Typography>,
      enableResizing: true,
      cell: props => (
        <Typography
          fontSize="inherit"
          sx={{
            maxWidth: "80%",
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
      header: () => <Typography fontSize={isPad ? "8px" : "15px"}>{t("Pair")}</Typography>,
      enableResizing: true,
      minSize: 100,
      meta: {
        sx: {
          minWidth: 50,
        },
      } as any,
    },
    {
      accessorKey: "side",
      header: () => <Typography fontSize={isPad ? "8px" : "15px"}>{t("Action")}</Typography>,
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
              width: "50px !important",
              flex: 1,
            }}>
            {action}
          </Box>
        );
      },
    },
    {
      accessorKey: "filledQty",
      header: () => (
        <Typography
          sx={{ width: "55px" }}
          fontSize={isPad ? "8px" : "15px"}>
          {t("Quantity")}
        </Typography>
      ),
      enableResizing: true,
      cell: props => (
        <div style={{ maxWidth: "60px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {formatFilledQty(props.getValue() as string)}
        </div>
      ),
    },
    {
      accessorKey: "filledPrice",
      header: () => <Typography fontSize={isPad ? "8px" : "15px"}>{t("Price")}</Typography>,
      enableResizing: true,
      cell: props => formatFilledPrice(props.getValue() as string),
    },
    {
      accessorKey: "status",
      header: () => (
        <Typography
          fontSize={isPad ? "8px" : "15px"}
          style={{ marginLeft: !isPad ? "50px" : "10px" }}>
          {t("Status")}
        </Typography>
      ),
      enableResizing: true,
      cell: props => <StatusChip status={props.getValue() as OrderStatus} />,
    },
  ];
};
