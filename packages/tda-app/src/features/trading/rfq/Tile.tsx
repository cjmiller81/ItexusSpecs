import { Box, Card, CardProps, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { Status } from "components";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { BuySellCell } from "./BuySellCell";
import ContrastDecimalField from "./ContrastDecimalField";
import { ProgressFooter } from "./ProgressBar";
import { RfqButton, RfqStage } from "./RfqButton";

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
  onInitiateRfq: () => void;
  onReject: () => void;
  onAmountChange: (amount: number) => void;
  onSellClick: () => void;
  onBuyClick: () => void;
  minSize: number;
  maxSize: number;
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
  sx,
  ...props
}) => {
  const theme = useTheme();
  const { t } = useTranslation("Tile");
  const isLessThanMinSize = amount < minSize;
  const isGreaterThanMaxSize = amount > maxSize;
  return (
    <Card
      {...props}
      sx={{ p: 2, ...sx }}>
      <Stack
        justifyContent="space-between"
        height="100%"
        alignItems="center">
        <Stack alignItems="center">
          <Typography>{`${symbol1 ?? ""}/${symbol2 ?? ""}`}</Typography>
          <Stack
            direction="row"
            width="100%">
            <Stack
              mt={1}
              width="100%"
              direction="row"
              alignItems="center"
              gap={1}
              justifyContent="space-between">
              <BuySellCell
                cellType="sell"
                onCellClick={onSellClick}
                isExpired={rfqButtonState === "requote"}
                title="SELL"
                isRequesting={statusFetchingRfq === "loading"}
                value={sellCellValue}
              />
              <Stack
                alignItems="center"
                spacing={3}>
                <Box
                  width="100%"
                  paddingLeft={2}
                  paddingRight={2}>
                  <RfqButton
                    disabled={!symbol1 || !symbol2 || !amount || isLessThanMinSize || isGreaterThanMaxSize}
                    sx={{
                      height: "45px",
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
                </Box>
                <Box>
                  <ContrastDecimalField
                    size="small"
                    sx={{
                      input: { padding: "4px" },
                      width: "100%",
                      "& .MuiFormHelperText-root": {
                        fontSize: "11px",
                        textAlign: "center",
                        width: "100%",
                        position: "absolute",
                        textWrap: "nowrap",
                        bottom: "-20px",
                        ml: "-7px",
                      },
                    }}
                    autoComplete="on"
                    label={symbol1 || ""}
                    placeholder="1,000.000"
                    disabled={rfqButtonState !== "requiring"}
                    value={amount}
                    maxDecimals={5}
                    error={isLessThanMinSize || isGreaterThanMaxSize}
                    helperText={
                      isLessThanMinSize ? t("MinSizeError") : isGreaterThanMaxSize ? t("MaxSizeError") : ""
                    }
                    onChange={onAmountChange}
                  />
                </Box>
              </Stack>
              <BuySellCell
                cellType="buy"
                contentAlignment="end"
                onCellClick={onBuyClick}
                isExpired={rfqButtonState === "requote"}
                title="BUY"
                isRequesting={statusFetchingRfq === "loading"}
                value={buyCellValue}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack
          mt={5}
          alignItems="center"
          direction="row"
          height="40px"
          justifyContent="space-between"
          width="100%">
          <ContrastDecimalField
            label="Min Size"
            size="small"
            disabled
            value={minSize}
            maxDecimals={2}
            sx={{ input: { padding: "4px" }, width: "115px" }}
          />

          {progress > 0 && (
            <Stack>
              <ProgressFooter
                alignSelf="center"
                width="300px"
                secondsLeft={secondsLeft}
                progress={progress}
                handleReject={onReject}
              />
            </Stack>
          )}

          <ContrastDecimalField
            label="Max Size"
            size="small"
            maxDecimals={2}
            disabled
            value={maxSize}
            sx={{ input: { padding: "4px" }, width: "115px" }}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default Tile;
