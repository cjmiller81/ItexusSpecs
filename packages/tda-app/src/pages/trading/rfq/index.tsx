import { HistoryDataParsed } from "@/api/rfq-api/models/HistoryDataParsed";
import { RfqResponse } from "@/api/rfq-api/models/RfqResponse";
import BalanceWidgetSection from "@/features/balance-widget/BalanceWidgetSection";
import HistoryDataTable from "@/features/tables/history-data-table/HistoryDataTable";
import { TileSection } from "@/features/trading/rfq/TileSection";
import CurrencyDropdown from "@/features/trading/rfq/components/CurrencyDropdown";
import { OrderEvent } from "@/features/trading/rfq/models/OrderEvent";
import { fetchPairs } from "@/features/trading/rfq/slices/currenciesSlice";
import { fetchExecutionHistoryData } from "@/features/trading/rfq/slices/rfqSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import * as React from "react";

export const accountNumber = "EC_TEST";
export const defaultAmount = 1000.0;

export default function SpotRFQPage() {
  const [symbol1, setSymbol1] = useState<string | null>(null);
  const [symbol2, setSymbol2] = useState<string | null>(null);
  const [toDate, setToDate] = useState<Date | null>(moment().add(1, "d").toDate());
  const [fromDate, setFromDate] = useState<Date | null>(moment().add(-1, "M").toDate());
  const [amount, setAmount] = useState(defaultAmount);
  const historyData = useAppSelector(state => state.rfq.executionHistoryData);
  const { pairs } = useAppSelector(state => state.currencies);
  const dispatch = useAppDispatch();
  const isRelativeBalances = useMediaQuery("(max-width: 1070px)");
  const isScreenSmall = useMediaQuery("(max-width: 1370px)");
  const { t } = useTranslation("SpotRFQPage");
  const [currentOrder, setCurrentOrder] = useState<{
    rfqModel: RfqResponse;
    order: OrderEvent;
  } | null>(null);
  const theme = useTheme();
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    getHistoryData();
    dispatch(fetchPairs({}));
  }, []);

  useEffect(() => {
    if (fromDate && toDate)
      dispatch(
        fetchExecutionHistoryData({
          accountNumber: accountNumber,
          fromDate,
          toDate,
        }),
      );
  }, [fromDate, toDate]);

  useEffect(() => {
    if (symbol1 && symbol2) {
      const [minSize, maxSize] = getMinMax(symbol1, symbol2);
      if (minSize && amount < minSize) {
        setAmount(minSize);
      } else if (maxSize && amount > maxSize) {
        setAmount(maxSize);
      }
    }
  }, [symbol1, symbol2]);

  const getHistoryData = async () => {
    if (fromDate && toDate) handleHistoryRequest(fromDate, toDate);
  };

  const onUpdateHistory = async () => {
    const newToDate = moment().add(1, "d").toDate();
    const newFromDate = moment().add(-1, "M").toDate();
    setToDate(newToDate);
    setFromDate(newFromDate);
    handleHistoryRequest(newFromDate, newToDate);
  };

  const handleHistoryRequest = (fromDate: Date, toDate: Date) => {
    dispatch(fetchExecutionHistoryData({ accountNumber: accountNumber, fromDate, toDate }));
  };

  const onOrderChanged = (order: OrderEvent, rfqModel: RfqResponse) => {
    setCurrentOrder({
      order,
      rfqModel,
    });
  };

  useEffect(() => {
    setCurrentOrder(null);
  }, [historyData]);

  const currentOrderHistoryItem: HistoryDataParsed | null = currentOrder
    ? {
        transactTime: new Date(currentOrder.order.timeLastUpdated),
        filledQty: currentOrder.order.qtyPlaced.toString(),
        filledPrice: (currentOrder.order.instruction === "Buy"
          ? currentOrder?.rfqModel?.OfferPx
          : currentOrder?.rfqModel?.BidPx
        )?.toString(),
        id: currentOrder.order.orderId,
        symbol: currentOrder.order.marketSymbol,
        side: currentOrder.order.instruction,
        status: currentOrder.order.orderStatus,
      }
    : null;

  const allHistoryItems = currentOrderHistoryItem ? [currentOrderHistoryItem, ...historyData] : historyData;

  const getMinMax = (symbol1: string | null, symbol2?: string | null): [number?, number?] => {
    let [minSize, maxSize]: [number?, number?] = [undefined, undefined];
    const pair = pairs.find(pair => pair.symbol1 === symbol1 && pair.symbol2 === symbol2);
    minSize = pair?.minSize;
    maxSize = pair?.maxSize;

    return [minSize, maxSize];
  };

  const [minSize, maxSize] = getMinMax(symbol1, symbol2);

  return (
    <Stack
      spacing={3}
      alignItems="center"
      sx={{
        width: isScreenSmall ? "95%" : "100%",
      }}>
      <BalanceWidgetSection
        width={theme => (isRelativeBalances ? "auto" : theme.spacing(24))}
        direction={isRelativeBalances ? "row" : "column"}
        sx={{
          top: 0,
          position: "absolute",
          right: 25,
          ...(isRelativeBalances && {
            position: "relative",
          }),
        }}
      />

      <Typography
        variant="h3"
        noWrap
        align="center">
        Spot RFQ
      </Typography>
      <Stack
        direction="row"
        gap={2}>
        <Box
          sx={{
            padding: "8px 20px 20px 20px",
            borderRadius: "3px",
            backgroundColor: theme.palette.grey[100],
            margin: "auto",
          }}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontSize: "19px", mb: 0.2 }}>{t("ChooseTradingPairs")}</Typography>
            <Tooltip
              title="Select currencies from the two dropdowns to trade the crypto pair"
              placement="right">
              <IconButton
                size="small"
                sx={{ position: "relative", top: "-5px", left: "-4px" }}>
                <InfoOutlinedIcon
                  sx={{ fontSize: "15px" }}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          </Box>

          <Stack>
            <CurrencyDropdown
              mt={1}
              symbol1={symbol1}
              symbol2={symbol2}
              pairs={pairs}
              onSymbol1Change={symbol => setSymbol1(symbol)}
              onSymbol2Change={symbol => setSymbol2(symbol)}
            />
            <TileSection
              symbol1={symbol1}
              symbol2={symbol2}
              minSize={minSize}
              maxSize={maxSize}
              onAmoutChanged={setAmount}
              amount={amount}
              onOrderChanged={onOrderChanged}
              accountNumber={accountNumber}
              onUpdateHistory={onUpdateHistory}
              sx={{
                mt: 5,
                height: "300px",
                p: 2,
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                },
              }}
            />
          </Stack>
        </Box>
      </Stack>

      <HistoryDataTable
        sx={{ width: "100%" }}
        title={t("RecentTransactions")}
        fileName={t("RecentTransactionsCsvFileName")}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        mt={5}
        rows={allHistoryItems}
        handleHistoryRequest={handleHistoryRequest}
      />
    </Stack>
  );
}
