import { RfqResponse } from "@/api/rfq-api/models/RfqResponse";
import { rfqApi } from "@/api/rfq-api/rfqApi";
import { openSnackbar } from "@/api/snackbar";
import { RfqStage } from "@/features/trading/rfq/components/RfqButton";
import Tile from "@/features/trading/rfq/components/Tile";
import { clearRfq, fetchRfq } from "@/features/trading/rfq/slices/rfqSlice";
import { usePrevious } from "@/hooks/usePrevious";
import { useSignalR } from "@/hooks/useSignalR";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { SnackbarProps } from "@/types/snackbar";
import { CardProps, useTheme } from "@mui/material";
import React, { FC, MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import useCountDown from "react-countdown-hook";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";
import { logoUrl } from "./constants";
import { OrderEvent, isOrderEvent } from "./models/OrderEvent";
import { toast } from "react-toastify";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import SuccessToast from "../../../../../components/src/layouts/helpers/succsessToast";
import ErrorToast from "../../../../../components/src/layouts/helpers/errorToast";

type TileSectionProps = CardProps & {
  symbol1: string | null;
  symbol2: string | null;
  minSize?: number;
  maxSize?: number;
  amount: number;
  onAmoutChanged: (value: number) => void;
  onUpdateHistory: () => void;
  accountNumber: string;
  onOrderChanged: (order: OrderEvent, rfqModel: RfqResponse) => void;
};

export const TileSection: FC<TileSectionProps> = ({
  symbol1,
  symbol2,
  minSize,
  maxSize,
  amount,
  onAmoutChanged,
  onUpdateHistory,
  accountNumber,
  onOrderChanged,
  ...props
}) => {
  const { rfqModel, statusFetchingRfq } = useAppSelector(state => state.rfq);
  const dispatch = useAppDispatch();
  const rfqAbortableController = useRef<AbortController>(new AbortController());
  const placeAbortableController = useRef<AbortController>(new AbortController());
  const [timeLeft, { start, reset }] = useCountDown(10000, 100);
  const secondsLeft = timeLeft / 1000;
  const [showBuyConfirmationPopup, setShowBuyConfirmationPopup] = useState<boolean>(false);
  const [showSellConfirmationPopup, setShowSellConfirmationPopup] = useState<boolean>(false);
  const { cryptoCurrencies, fiatCurrencies } = useAppSelector(state => state.balancesWidget);
  const prevSecondsLeft = usePrevious(secondsLeft);
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const { t } = useTranslation("TileSection");
  const [popoverMessage, setPopoverMessage] = useState<string | null>();
  const theme = useTheme();
  const toastIdRef = useRef<string | number | null>(null);

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

    onOrderChanged(message, rfqModel!);
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

    const totalAmount = rfqModel.BidPx * amount;
    const totalAmountFormatted = totalAmount.toLocaleString("en-US");
    const formattedAmount = amount.toLocaleString("en-US");

    const [symbol1Parsed = "", symbol2Parsed = ""] = event.marketSymbol?.split("-") || [];

    const snackBarMessage = t(
      event.instruction === "Buy" ? "BuySnackBarConfirmationText" : "SellSnackBarConfirmationText",
      {
        amount: formattedAmount,
        symbol1: symbol1Parsed || symbol1,
        totalAmount: totalAmountFormatted,
        symbol2: symbol2Parsed || symbol2,
        bidPx: rfqModel.BidPx,
      },
    );

    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    toastIdRef.current = toast.success(<SuccessToast message={snackBarMessage} />);

    showNotification(event.instruction, symbol1Parsed, symbol2Parsed, formattedAmount, rfqModel.BidPx.toString(), v4());
  };

  const handleUpdateHistoryStatus = () => {
    setIsTransactionInProgress(false);
    reset();
    onUpdateHistory();
  };

  const handleTransactionError = () => {
    onUpdateHistory();
    setIsTransactionInProgress(false);
    reset();

    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    const errorMessage = t("ErrorText");

    toastIdRef.current = toast.error(<ErrorToast message={errorMessage} />);

    if (Notification?.permission === "granted") {
      new Notification(errorMessage, {
        icon: logoUrl,
        dir: "ltr",
      });
    }
  };

  const handleInitiateRFQ: MouseEventHandler<HTMLButtonElement> = () => {
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
    setPopoverMessage(null);
  };

  const onSellClick = () => {
    if (isTransactionInProgress) return;
    const balanceModel = cryptoCurrencies.find(c => c.name.toLowerCase() === symbol1?.toLowerCase());
    if (!balanceModel) {
      setPopoverMessage(t("InsufficientFundsToSell", { currency: symbol1 }));
      return;
    }

    if (balanceModel.qty < amount) {
      setPopoverMessage(t("InsufficientFundsToSell", { currency: symbol1 }));
      return;
    }
    setShowSellConfirmationPopup(currentStage !== "requiring");
    setShowBuyConfirmationPopup(false);
  };

  const onBuyClick = () => {
    if (isTransactionInProgress) return;
    let balanceModel = cryptoCurrencies.find(c => c.name.toLowerCase() === symbol2?.toLowerCase());
    balanceModel = balanceModel ?? fiatCurrencies.find(c => c.name.toLowerCase() === symbol2?.toLowerCase());
    if (!balanceModel) {
      setPopoverMessage(t("InsufficientFundsToBuy", { currency1: symbol1, currency2: symbol2 }));
      return;
    }

    if (balanceModel.qty < amount * rfqModel!.OfferPx) {
      setPopoverMessage(t("InsufficientFundsToBuy", { currency1: symbol1, currency2: symbol2 }));
      return;
    }

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
      toastIdRef.current = toast.error(<ErrorToast message={t("QuoteRejected")} />);
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
      onAmountChange={onAmoutChanged}
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
      popoverMessage={popoverMessage}
      {...props}
    />
  );
};
