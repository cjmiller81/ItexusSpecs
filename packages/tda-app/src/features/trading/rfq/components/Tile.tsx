import { Box, Card, CardProps, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { Status } from "components";
import * as React from "react";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import BuySellCell from "./BuySellCell";
import FooterSection from "./footer-section/FooterSection";
import { RfqButton, RfqStage } from "./RfqButton";
import { RfqState } from "features/trading/rfq/slices/rfqSlice";
import { useAppSelector } from "libs/redux/Store";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

type TileProps = Omit<CardProps, "children"> & {
  symbol1: string | null;
  symbol2: string | null;
  sellCellValue?: number;
  buyCellValue?: number;
  stage: RfqStage;
  statusFetchingRfq: Status;
  amount: number;
  progress: number;
  secondsLeft: number;
  onSell: () => void;
  onBuy: () => void;
  onDiscardSell: () => void;
  onDiscardBuy: () => void;
  isSellConfirming?: boolean;
  sellConfirmingText: string;
  buyConfirmingText: string;
  isBuyConfirming?: boolean;
  isQuoteSubmitting: boolean;
  onInitiateRfq: MouseEventHandler<HTMLButtonElement>;
  onReject: () => void;
  onAmountChange: (amount: number) => void;
  onSellClick: () => void;
  onBuyClick: () => void;
  minSize?: number;
  maxSize?: number;
  popoverMessage?: string | null;
};

const Tile: React.FC<TileProps> = ({
  symbol1,
  symbol2,
  sellCellValue,
  buyCellValue,
  amount,
  progress,
  secondsLeft,
  stage: rfqButtonState,
  onReject,
  onAmountChange,
  onSellClick,
  onBuyClick,
  statusFetchingRfq,
  onInitiateRfq,
  minSize,
  maxSize,
  sellConfirmingText,
  buyConfirmingText,
  isSellConfirming,
  isBuyConfirming,
  isQuoteSubmitting,
  onSell,
  onBuy,
  onDiscardSell,
  onDiscardBuy,
  sx,
  popoverMessage,
  ...props
}) => {
  const theme = useTheme();
  const { t } = useTranslation("Tile");

  const isTradingEnabled = useAppSelector((state: { rfq: RfqState }) => state.rfq.isTradingEnabled);
  const isLessThanMinSize = minSize === undefined ? false : amount < minSize;
  const isGreaterThanMaxSize = maxSize === undefined ? false : amount > maxSize;
  const boxShadow =
    theme.palette.mode === "dark" ? "0px 4px 12px rgba(255, 255, 255, 0.3)" : "0px 8px 16px rgba(0, 0, 0, 0.4)";
  const borderColor = theme.palette.mode === "dark" ? "#3e3e3e" : theme.palette.grey[300];

  return (
    <Card
      {...props}
      sx={{
        ...sx,
        boxShadow,
        mt: 0.5,
        height: "215px",
        border: `2px solid ${borderColor}`,
        [theme.breakpoints.down("sm")]: {
          borderBlock: "0px",
          width: "100%",
          paddingLeft: "6px",
          paddingRight: "6px",
        },
      }}>
      <Stack
        justifyContent="space-between"
        height="100%"
        alignItems="center">
        <Stack alignItems="center">
          <Stack
            direction="row"
            width="100%">
            <Stack
              sx={{
                gap: "8px",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                [theme.breakpoints.down("sm")]: {
                  gap: "4px",
                },
              }}>
              <BuySellCell
                isQuoteSubmitting={isQuoteSubmitting}
                confirmationText={sellConfirmingText}
                isConfirming={isSellConfirming}
                onCellClick={onSellClick}
                cellType="sell"
                onDiscard={onDiscardSell}
                onConfirm={onSell}
                isExpired={rfqButtonState === "requote"}
                title="SELL"
                isRequesting={statusFetchingRfq === "loading"}
                value={buyCellValue && sellCellValue ? sellCellValue : null}
                label={symbol1}
                secondsLeft={secondsLeft}
              />
              <Stack
                alignItems="center"
                sx={{ marginTop: "10px !important" }}
                spacing={3}>
                <Typography>{`${symbol1 ?? ""}/${symbol2 ?? ""}`}</Typography>
                <RfqButton
                  popoverMessage={popoverMessage}
                  sellSymbol={symbol1}
                  disabled={
                    (!symbol1 ||
                      !symbol2 ||
                      !amount ||
                      isLessThanMinSize ||
                      isGreaterThanMaxSize ||
                      !isTradingEnabled) &&
                    !popoverMessage
                  }
                  sx={{
                    height: "45px",
                    width: "100%",
                    [theme.breakpoints.down("sm")]: {
                      height: "38px",
                    },
                    ":disabled": {
                      bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[200] : theme.palette.grey[400],
                    },
                  }}
                  loading={
                    statusFetchingRfq === "loading" || rfqButtonState === "inProgress" || rfqButtonState === "requote"
                  }
                  stage={rfqButtonState}
                  onInitiateRFQ={onInitiateRfq}
                  onCancel={onReject}
                  onRequote={onReject}
                />
                <Tooltip
                  title={t("ClickInitiateRFQ")}
                  placement="bottom">
                  <IconButton
                    sx={{ marginTop: "1px !important" }}
                    size="small">
                    <InfoOutlinedIcon
                      sx={{ fontSize: "15px" }}
                      fontSize="small"
                    />
                  </IconButton>
                </Tooltip>
              </Stack>

              <BuySellCell
                isQuoteSubmitting={isQuoteSubmitting}
                confirmationText={buyConfirmingText}
                isConfirming={isBuyConfirming}
                onCellClick={onBuyClick}
                cellType="buy"
                contentAlignment="end"
                onConfirm={onBuy}
                onDiscard={onDiscardBuy}
                isExpired={rfqButtonState === "requote"}
                title="BUY"
                isRequesting={statusFetchingRfq === "loading"}
                value={buyCellValue && sellCellValue ? buyCellValue : null}
                label={symbol1}
                secondsLeft={secondsLeft}
              />
            </Stack>
          </Stack>
        </Stack>
        <FooterSection
          labelsPostfix={symbol1}
          mt={5}
          {...{
            maxSize,
            minSize,
            progress,
            secondsLeft,
            onReject,
          }}></FooterSection>
      </Stack>
    </Card>
  );
};

export default Tile;
