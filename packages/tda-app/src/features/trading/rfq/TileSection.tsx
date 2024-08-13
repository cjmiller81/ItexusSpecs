import { rfqApi } from "@/api/rfq-api/rfqApi";
import { openSnackbar } from "@/api/snackbar";
import { RfqStage } from "@/features/trading/rfq/components/RfqButton";
import Tile from "@/features/trading/rfq/components/Tile";
import { clearRfq, fetchRfq } from "@/features/trading/rfq/slices/rfqSlice";
import { usePrevious } from "@/hooks/usePrevious";
import { useSignalR } from "@/hooks/useSignalR";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { SnackbarProps } from "@/types/snackbar";
import { CardProps } from "@mui/material";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import useCountDown from "react-countdown-hook";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";
import { logoUrl } from "./constants";
import { OrderEvent, isOrderEvent } from "./models/OrderEvent";

type TileSectionProps = CardProps & {
  symbol1: string | null;
  symbol2: string | null;
  onUpdateHistory: () => void;
  accountNumber: string;
};

export const TileSection: FC<TileSectionProps> = ({ symbol1, symbol2, onUpdateHistory, accountNumber, ...props }) => {
  const { rfqModel, statusFetchingRfq } = useAppSelector(state => state.rfq);
  const dispatch = useAppDispatch();
  const rfqAbortableController = useRef<AbortController>(new AbortController());
  const [amount, setAmount] = useState(1000.0);
  const placeAbortableController = useRef<AbortController>(new AbortController());
  const [timeLeft, { start, reset }] = useCountDown(10000, 100);
  const secondsLeft = timeLeft / 1000;
  const [showBuyConfirmationPopup, setShowBuyConfirmationPopup] = useState<boolean>(false);
  const [showSellConfirmationPopup, setShowSellConfirmationPopup] = useState<boolean>(false);
  const prevSecondsLeft = usePrevious(secondsLeft);
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const [minSize] = useState(10);
  const [maxSize] = useState(1_000_000_000);
  const { t } = useTranslation("TileSection");

  const handleEvents = (message: any) => {
    if (isOrderEvent(message)) {
      switch (message.orderStatus) {
        case "Submitted": {
          break;
        }
        case "Filled": {
          handleOrderStatusSubmitted(message);
          break;
        }
        case "Working":
        case "Partial":
        case "PendingCancel":
        case "FilledPartiallyAndCancelled": {
          handleUpdateHistoryStatus();
          break;
        }
        case "Error":
        case "Canceled":
        case undefined: {
          handleTransactionError();
          break;
        }
      }
    }
  };

  useSignalR("ReceiveOrderUpdate", handleEvents);

  const buyConfirmationText = useMemo(
    () =>
      t("BuyConfirmationText", {
        symbol1: symbol1,
        symbol2: symbol2,
        buyAmount: amount.toLocaleString("en-US"),
        sellAmount: ((rfqModel?.OfferPx || 0) * amount).toLocaleString("en-US"),
        buyValue: (rfqModel?.OfferPx || 0).toFixed(4),
      }),
    [amount, rfqModel, symbol1],
  );

  const sellConfirmationText = useMemo(
    () =>
      t("SellConfirmationText", {
        symbol1: symbol1,
        symbol2: symbol2,
        sellAmount: amount.toLocaleString("en-US"),
        buyAmount: ((rfqModel?.OfferPx || 0) * amount).toLocaleString("en-US"),
        sellValue: (rfqModel?.OfferPx || 0).toFixed(4),
      }),
    [amount, rfqModel, symbol1],
  );

  const currentStage: RfqStage = isTransactionInProgress
    ? "inProgress"
    : !rfqModel?.BidPx || !rfqModel?.OfferPx
      ? "requiring"
      : secondsLeft <= 1 && prevSecondsLeft && prevSecondsLeft > 0
        ? "requote"
        : "cancelable";

  const handleOrderStatusSubmitted = (event: OrderEvent) => {
    onUpdateHistory();
    reset();
    if (!rfqModel || !isTransactionInProgress) return;
    setIsTransactionInProgress(false);

    let totalAmount = rfqModel.BidPx * amount;
    let totalAmountFormatted = totalAmount.toLocaleString("en-US");
    let formattedAmount = amount.toLocaleString("en-US");

    const [symbol1Parsed, symbol2Parsed] = event.marketSymbol.split("-");

    const snackBarMessage = t(
      event.instruction === "Buy" ? "BuySnackBarConfirmationText" : "SellSnackBarConfirmationText",
      {
        amount: formattedAmount,
        symbol1: symbol1Parsed,
        totalAmount: totalAmountFormatted,
        symbol2: symbol2Parsed,
        bidPx: rfqModel.BidPx,
      },
    );

    openSnackbar({
      open: true,
      message: snackBarMessage,
      variant: "alert",
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      alert: {
        variant: "outlined",
        color: "primary",
      },
    } as SnackbarProps);

    showNotification(event.instruction, symbol1Parsed, symbol2Parsed, formattedAmount, rfqModel.BidPx.toString(), v4());
  };

  const handleUpdateHistoryStatus = () => {
    setIsTransactionInProgress(false);
    reset();
    onUpdateHistory();
  };

  const handleTransactionError = () => {
    setIsTransactionInProgress(false);
    reset();
    const errorMessage = "Order Error! Please try again";
    openSnackbar({
      open: true,
      message: errorMessage,
      variant: "alert",
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      alert: {
        variant: "outlined",
        color: "error",
      },
    } as SnackbarProps);

    if (Notification?.permission === "granted") {
      new Notification(errorMessage, {
        icon: logoUrl,
        dir: "ltr",
      });
    }
  };

  const handleInitiateRFQ = async () => {
    if (amount <= 0 || !(symbol1 && symbol2)) return;
    dispatch(
      fetchRfq({
        currency: symbol1,
        firstSymbol: symbol1,
        qty: amount,
        secondSymbol: symbol2,
        signal: rfqAbortableController.current.signal,
      }),
    );
  };

  const showNotification = (
    side: "Buy" | "Sell",
    symbol1: string,
    symbol2: string,
    qty: string,
    priceString: string,
    id: string,
  ) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const options: NotificationOptions = {
      body: `${side} ${symbol1} ${qty} vs ${symbol2} @ ${priceString}`,
      icon: logoUrl,
      dir: "ltr",
    };
    new Notification(`Trade Accepted: ID ${id}`, options);
  };

  const addQuote = async (tradeSide: "Buy" | "Sell") => {
    if (!rfqModel || !symbol1 || !symbol2) return;

    if (placeAbortableController.current) {
      placeAbortableController.current.abort("Request canceled");
    }

    placeAbortableController.current = new AbortController();
    try {
      setIsTransactionInProgress(true);
      await rfqApi.placeOrder(
        {
          transactTime: new Date(),
          symbol: rfqModel.Symbol,
          side: tradeSide,
          filledQty: amount,
          accountNum: accountNumber,
          status: "Open",
          QuoteID: rfqModel.QuoteID,
          RFQID: rfqModel.RFQID,
        },
        placeAbortableController.current.signal,
      );
    } catch {
      setIsTransactionInProgress(false);
    }
  };

  const handleBuy = () => {
    addQuote("Buy");
    closeModals();
  };

  const handleSell = () => {
    addQuote("Sell");
    closeModals();
  };

  const closeModals = () => {
    setShowSellConfirmationPopup(false);
    setShowBuyConfirmationPopup(false);
  };

  const resetTile = () => {
    setShowSellConfirmationPopup(false);
    setShowBuyConfirmationPopup(false);
    reset();
    dispatch(clearRfq());
  };

  const onSellClick = () => {
    if (isTransactionInProgress) return;
    setShowSellConfirmationPopup(currentStage !== "requiring");
    setShowBuyConfirmationPopup(false);
  };

  const onBuyClick = () => {
    if (isTransactionInProgress) return;
    setShowSellConfirmationPopup(false);
    setShowBuyConfirmationPopup(currentStage !== "requiring");
  };

  useEffect(() => {
    if (statusFetchingRfq === "idle" && rfqModel?.BidPx && rfqModel?.OfferPx) {
      setShowSellConfirmationPopup(false);
      setShowBuyConfirmationPopup(false);
      start();
    }
  }, [statusFetchingRfq, rfqModel]);

  useEffect(() => {
    if (!rfqModel) return;

    if (rfqModel.QuoteStatus === "Rejected") {
      openSnackbar({
        open: true,
        message: t("QuoteRejected"),
        variant: "alert",
        alert: {
          variant: "outlined",
          color: "error",
        },
      } as SnackbarProps);
    }
  }, [rfqModel]);

  useEffect(() => {
    if (statusFetchingRfq === "failed") {
      resetTile();
    }
  }, [statusFetchingRfq]);

  useEffect(() => {
    if (rfqModel && timeLeft === 0 && prevSecondsLeft && prevSecondsLeft > 0) {
      resetTile();
    }
  }, [timeLeft, rfqModel]);

  return (
    <Tile
      isQuoteSubmitting={isTransactionInProgress}
      sellConfirmingText={sellConfirmationText}
      buyConfirmingText={buyConfirmationText}
      stage={currentStage}
      onReject={resetTile}
      symbol1={symbol1}
      symbol2={symbol2}
      amount={amount}
      minSize={minSize}
      maxSize={maxSize}
      onAmountChange={value => setAmount(value)}
      onInitiateRfq={handleInitiateRFQ}
      sellCellValue={rfqModel?.BidPx}
      buyCellValue={rfqModel?.OfferPx}
      statusFetchingRfq={statusFetchingRfq}
      onBuyClick={onBuyClick}
      onSellClick={onSellClick}
      progress={(100 * secondsLeft) / 10}
      secondsLeft={secondsLeft}
      onBuy={handleBuy}
      onSell={handleSell}
      onDiscardBuy={closeModals}
      onDiscardSell={closeModals}
      isBuyConfirming={showBuyConfirmationPopup}
      isSellConfirming={showSellConfirmationPopup}
      {...props}
    />
  );
};
